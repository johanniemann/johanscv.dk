const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const SNAPSHOT_PATH = '/api/music-dashboard/snapshot'
const REQUEST_TIMEOUT_MS = 20000
const DEFAULT_AUTO_REFRESH_INTERVAL_MS = 10 * 60 * 1000
const AUTO_REFRESH_INTERVAL_MS = resolveAutoRefreshIntervalMs(import.meta.env.VITE_SPOTIFY_DASHBOARD_REFRESH_MS)
const PREVIEW_DURATION_MS = 10 * 1000
const VIEWS = ['tracks', 'albums', 'artists']
const CARD_COUNT = 6
let autoRefreshIntervalId = 0
let previewAudio = null
let previewStopTimeoutId = 0
let previewActiveButton = null
let previewActiveCardId = ''

export function renderSpotifyDashboardSection({ t }) {
  return `
    <section class="content-section section-reveal spotify-dashboard" id="spotify-dashboard-root" aria-live="polite">
      <header class="spotify-dashboard-header">
        <h3 class="section-title">${t.spotifyDashboard.title}</h3>
        <p class="section-body spotify-dashboard-intro">${t.spotifyDashboard.intro}</p>
      </header>
      <div class="spotify-dashboard-shell" id="spotify-dashboard-shell"></div>
    </section>
  `
}

export function mountSpotifyDashboardSection({ t }) {
  const root = document.querySelector('#spotify-dashboard-root')
  const shell = document.querySelector('#spotify-dashboard-shell')
  if (!root || !shell) return

  stopAutoRefresh()
  stopPreviewPlayback()

  const state = {
    t,
    status: 'loading',
    activeView: 'tracks',
    snapshot: null,
    lists: {
      tracks: [],
      albums: [],
      artists: []
    },
    message: '',
    retryAfterSeconds: 0
  }

  shell.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]')
    if (!button) return

    const action = button.dataset.action
    if (action === 'retry-snapshot') {
      void loadSnapshot(state, shell, { refresh: false })
      return
    }

    if (action === 'set-view') {
      const view = String(button.dataset.view || '')
      if (VIEWS.includes(view)) {
        stopPreviewPlayback()
        state.activeView = view
        renderCurrentState(state, shell)
      }
      return
    }

    if (action === 'toggle-preview') {
      void toggleTrackPreview(button)
    }
  })

  void loadSnapshot(state, shell, { refresh: false })
  startAutoRefresh(state, shell, root)
}

function startAutoRefresh(state, shell, root) {
  autoRefreshIntervalId = window.setInterval(() => {
    if (!root.isConnected || !shell.isConnected) {
      stopAutoRefresh()
      stopPreviewPlayback()
      return
    }
    void loadSnapshot(state, shell, { refresh: true, suppressLoading: true })
  }, AUTO_REFRESH_INTERVAL_MS)
}

function stopAutoRefresh() {
  if (!autoRefreshIntervalId) return
  window.clearInterval(autoRefreshIntervalId)
  autoRefreshIntervalId = 0
}

async function loadSnapshot(state, shell, { refresh = false, suppressLoading = false }) {
  const hasExistingSnapshot = Boolean(state.snapshot) && state.status === 'ready'
  const keepCurrentView = suppressLoading && hasExistingSnapshot
  if (!keepCurrentView) {
    state.status = 'loading'
    state.message = ''
    state.retryAfterSeconds = 0
    renderCurrentState(state, shell)
  }

  if (!API_BASE) {
    if (keepCurrentView) return
    state.status = 'error'
    state.message = state.t.spotifyDashboard.apiBaseMissing
    renderCurrentState(state, shell)
    return
  }

  const refreshQuery = refresh ? '?refresh=true' : ''
  const requestUrl = `${API_BASE}${SNAPSHOT_PATH}${refreshQuery}`
  let response

  try {
    response = await fetchWithTimeout(requestUrl, {
      method: 'GET'
    })
  } catch {
    if (keepCurrentView) return
    state.status = 'error'
    state.message = state.t.spotifyDashboard.networkError
    renderCurrentState(state, shell)
    return
  }

  const payload = await parseJsonSafe(response)

  if (response.status === 429) {
    if (keepCurrentView) return
    state.status = 'error'
    state.retryAfterSeconds = Number(payload?.retryAfterSeconds || 0)
    state.message = normalizeMessage(payload?.message, state.t.spotifyDashboard.rateLimited)
    renderCurrentState(state, shell)
    return
  }

  if (!response.ok) {
    if (keepCurrentView) return
    state.status = 'error'
    state.message = normalizeMessage(payload?.message, state.t.spotifyDashboard.loadError)
    renderCurrentState(state, shell)
    return
  }

  try {
    const snapshot = ensureSnapshotShape(payload)
    state.snapshot = snapshot
    state.lists = snapshot.lists
    if (!VIEWS.includes(state.activeView)) {
      state.activeView = 'tracks'
    }
    state.status = 'ready'
  } catch {
    if (keepCurrentView) return
    state.status = 'error'
    state.message = state.t.spotifyDashboard.invalidPayload
  }

  renderCurrentState(state, shell)
}

function renderCurrentState(state, shell) {
  stopPreviewPlayback()

  if (state.status === 'loading') {
    shell.innerHTML = `
      <article class="spotify-dashboard-state-card">
        <p class="spotify-dashboard-status">${state.t.spotifyDashboard.loading}</p>
      </article>
    `
    return
  }

  if (state.status === 'error') {
    const retryAfterLabel =
      state.retryAfterSeconds > 0
        ? `<p class="spotify-dashboard-status">${state.t.spotifyDashboard.retryAfter}: ${state.retryAfterSeconds}s</p>`
        : ''

    shell.innerHTML = `
      <article class="spotify-dashboard-state-card">
        <h4 class="section-title spotify-dashboard-state-title">${state.t.spotifyDashboard.errorTitle}</h4>
        <p class="section-body spotify-dashboard-state-body">${escapeHtml(state.message || state.t.spotifyDashboard.loadError)}</p>
        ${retryAfterLabel}
        <div class="spotify-dashboard-actions">
          <button class="projects-cta" type="button" data-action="retry-snapshot">${state.t.spotifyDashboard.retryCta}</button>
        </div>
      </article>
    `
    return
  }

  shell.innerHTML = renderDashboardReadyState(state)
}

function renderDashboardReadyState(state) {
  const entries = Array.isArray(state.lists[state.activeView]) ? state.lists[state.activeView] : []
  const cards = buildCards(entries, state.t)

  const updatedAt = formatTimestamp(state.snapshot?.snapshotTimestamp)
  const updatedLine = `${state.t.spotifyDashboard.lastUpdated}: ${updatedAt} - ${state.t.spotifyDashboard.autoRefreshNote}`
  const fallbackMessage = state.snapshot?.periodFallbackUsed
    ? `<p class="spotify-dashboard-status">${state.t.spotifyDashboard.weekFallback}</p>`
    : ''

  return `
    <div class="spotify-dashboard-ready">
      <div class="spotify-dashboard-grid">
        ${cards.join('')}
      </div>

      <div class="spotify-dashboard-footer">
        <div class="spotify-dashboard-meta">
          <p class="spotify-dashboard-updated">${updatedLine}</p>
          ${fallbackMessage}
        </div>
        <div class="spotify-dashboard-tabs" role="tablist" aria-label="${state.t.spotifyDashboard.switchLabel}">
          ${VIEWS.map((view) => renderTabButton(view, state.activeView, state.t)).join('')}
        </div>
      </div>
    </div>
  `
}

function renderTabButton(view, activeView, t) {
  const isActive = view === activeView
  const labels = {
    tracks: t.spotifyDashboard.tabs.tracks,
    albums: t.spotifyDashboard.tabs.albums,
    artists: t.spotifyDashboard.tabs.artists
  }

  return `
    <button
      class="spotify-dashboard-tab${isActive ? ' is-active' : ''}"
      type="button"
      role="tab"
      aria-selected="${isActive}"
      data-action="set-view"
      data-view="${view}"
    >
      ${labels[view]}
    </button>
  `
}

function buildCards(entries, t) {
  const cards = []
  for (let index = 0; index < CARD_COUNT; index += 1) {
    const item = entries[index]
    if (!item) {
      cards.push(`
        <article class="project-card spotify-dashboard-card is-placeholder">
          <div class="spotify-dashboard-image spotify-dashboard-image-placeholder" aria-hidden="true"></div>
          <h4 class="project-title">${t.spotifyDashboard.emptyTitle}</h4>
          <p class="project-summary">${t.spotifyDashboard.emptySlot}</p>
        </article>
      `)
      continue
    }

    const safeTitle = escapeHtml(item.title)
    const safeSubtitle = escapeHtml(item.subtitle)
    const playCount = Number(item.playCount || 0)
    const previewUrl = String(item.previewUrl || '').trim()
    const hasPreview = Boolean(previewUrl)
    const playsLabel = `${playCount} ${playCount === 1 ? t.spotifyDashboard.playSingle : t.spotifyDashboard.playPlural}`
    const rankAndPlaysLabel = `#${index + 1} ${t.spotifyDashboard.rankWith} ${playsLabel}`

    const imageContent = item.imageUrl
      ? `<img class="spotify-dashboard-image" src="${escapeHtml(item.imageUrl)}" alt="${safeTitle}" loading="lazy" />`
      : '<div class="spotify-dashboard-image spotify-dashboard-image-placeholder" aria-hidden="true"></div>'

    const previewButton = hasPreview
      ? `
          <button
            class="spotify-dashboard-preview-button"
            type="button"
            data-action="toggle-preview"
            data-preview-url="${escapeHtml(previewUrl)}"
            data-preview-card-id="${escapeHtml(String(item.id || `${index}`))}"
            data-label-play="${escapeHtml(t.spotifyDashboard.previewPlayLabel)}"
            data-label-stop="${escapeHtml(t.spotifyDashboard.previewStopLabel)}"
            aria-label="${escapeHtml(t.spotifyDashboard.previewPlayLabel)}"
            aria-pressed="false"
          >
            <span class="spotify-dashboard-preview-icon" aria-hidden="true"></span>
          </button>
        `
      : ''

    const imageMarkup = `
      <div class="spotify-dashboard-media">
        ${imageContent}
        ${previewButton}
      </div>
    `

    const titleMarkup = item.spotifyUrl
      ? `<a class="spotify-dashboard-link" href="${escapeHtml(item.spotifyUrl)}" target="_blank" rel="noopener noreferrer">${safeTitle}</a>`
      : safeTitle

    cards.push(`
      <article class="project-card spotify-dashboard-card">
        ${imageMarkup}
        <div class="spotify-dashboard-card-body">
          <h4 class="project-title spotify-dashboard-card-title">${titleMarkup}</h4>
          <div class="spotify-dashboard-card-meta">
            <p class="project-summary spotify-dashboard-card-subtitle">${safeSubtitle}</p>
            <p class="spotify-dashboard-rank-line">${escapeHtml(rankAndPlaysLabel)}</p>
          </div>
        </div>
      </article>
    `)
  }

  return cards
}

async function toggleTrackPreview(button) {
  const previewUrl = String(button.dataset.previewUrl || '').trim()
  const previewCardId = String(button.dataset.previewCardId || '').trim()
  if (!previewUrl || !previewCardId) return

  if (previewAudio && previewActiveCardId === previewCardId) {
    stopPreviewPlayback()
    return
  }

  stopPreviewPlayback()

  const audio = new Audio(previewUrl)
  previewAudio = audio
  previewActiveCardId = previewCardId
  previewActiveButton = button
  setPreviewButtonState(button, true)

  audio.addEventListener(
    'ended',
    () => {
      stopPreviewPlayback()
    },
    { once: true }
  )

  try {
    await audio.play()
  } catch {
    stopPreviewPlayback()
    return
  }

  previewStopTimeoutId = window.setTimeout(() => {
    stopPreviewPlayback()
  }, PREVIEW_DURATION_MS)
}

function stopPreviewPlayback() {
  if (previewStopTimeoutId) {
    window.clearTimeout(previewStopTimeoutId)
    previewStopTimeoutId = 0
  }

  if (previewAudio) {
    previewAudio.pause()
    previewAudio.currentTime = 0
    previewAudio = null
  }

  if (previewActiveButton && previewActiveButton.isConnected) {
    setPreviewButtonState(previewActiveButton, false)
  }

  previewActiveButton = null
  previewActiveCardId = ''
}

function setPreviewButtonState(button, isPlaying) {
  const playLabel = String(button.dataset.labelPlay || 'Play preview')
  const stopLabel = String(button.dataset.labelStop || 'Stop preview')
  button.classList.toggle('is-playing', isPlaying)
  button.setAttribute('aria-pressed', String(isPlaying))
  button.setAttribute('aria-label', isPlaying ? stopLabel : playLabel)
}

function ensureSnapshotShape(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Snapshot payload is invalid.')
  }
  const lists = payload.lists
  if (!lists || typeof lists !== 'object') {
    throw new Error('Snapshot payload is missing lists.')
  }

  for (const view of VIEWS) {
    if (!Array.isArray(lists[view])) {
      throw new Error(`Snapshot payload is missing ${view} list.`)
    }
  }

  return {
    snapshotTimestamp: payload.snapshotTimestamp,
    periodFallbackUsed: Boolean(payload.periodFallbackUsed),
    lists: {
      tracks: lists.tracks,
      albums: lists.albums,
      artists: lists.artists
    }
  }
}

function normalizeMessage(message, fallback) {
  const value = String(message || '').trim()
  return value || fallback
}

function formatTimestamp(isoString) {
  const value = String(isoString || '').trim()
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    })
  } finally {
    window.clearTimeout(timeoutId)
  }
}

async function parseJsonSafe(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function resolveAutoRefreshIntervalMs(rawValue) {
  const parsed = Number(rawValue)
  if (!Number.isFinite(parsed) || parsed < 10_000) {
    return DEFAULT_AUTO_REFRESH_INTERVAL_MS
  }
  return Math.floor(parsed)
}
