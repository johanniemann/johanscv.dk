const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const SNAPSHOT_PATH = '/api/music-dashboard/snapshot'
const REQUEST_TIMEOUT_MS = 20000
const AUTO_REFRESH_INTERVAL_MS = 10 * 60 * 1000
const VIEWS = ['tracks', 'albums', 'artists']
const CARD_COUNT = 4
let autoRefreshIntervalId = 0

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
        state.activeView = view
        renderCurrentState(state, shell)
      }
    }
  })

  void loadSnapshot(state, shell, { refresh: false })
  startAutoRefresh(state, shell, root)
}

function startAutoRefresh(state, shell, root) {
  autoRefreshIntervalId = window.setInterval(() => {
    if (!root.isConnected || !shell.isConnected) {
      stopAutoRefresh()
      return
    }
    void loadSnapshot(state, shell, { refresh: false, suppressLoading: true })
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
    <article class="spotify-dashboard-state-card">
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
    </article>
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
    const playsLabel = `${playCount} ${playCount === 1 ? t.spotifyDashboard.playSingle : t.spotifyDashboard.playPlural}`

    const imageMarkup = item.imageUrl
      ? `<img class="spotify-dashboard-image" src="${escapeHtml(item.imageUrl)}" alt="${safeTitle}" loading="lazy" />`
      : '<div class="spotify-dashboard-image spotify-dashboard-image-placeholder" aria-hidden="true"></div>'

    const titleMarkup = item.spotifyUrl
      ? `<a class="spotify-dashboard-link" href="${escapeHtml(item.spotifyUrl)}" target="_blank" rel="noopener noreferrer">${safeTitle}</a>`
      : safeTitle

    cards.push(`
      <article class="project-card spotify-dashboard-card">
        ${imageMarkup}
        <p class="spotify-dashboard-rank">#${index + 1}</p>
        <h4 class="project-title spotify-dashboard-card-title">${titleMarkup}</h4>
        <p class="project-summary spotify-dashboard-card-subtitle">${safeSubtitle}</p>
        <p class="spotify-dashboard-playcount">${escapeHtml(playsLabel)}</p>
      </article>
    `)
  }

  return cards
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
