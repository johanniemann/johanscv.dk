const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const SNAPSHOT_PATH = '/api/music-dashboard/snapshot'
const REQUEST_TIMEOUT_MS = 20000
const DEFAULT_AUTO_REFRESH_INTERVAL_MS = 10 * 60 * 1000
const AUTO_REFRESH_INTERVAL_MS = resolveAutoRefreshIntervalMs(import.meta.env.VITE_SPOTIFY_DASHBOARD_REFRESH_MS)
const PREVIEW_DURATION_MS = 10 * 1000
const VIEWS = ['tracks', 'albums', 'artists']
const CARD_COUNT = 6
const MARQUEE_MIN_OVERFLOW_PX = 6
const MARQUEE_MIN_DURATION_MS = 3600
const MARQUEE_MAX_DURATION_MS = 12000
const MARQUEE_PIXELS_PER_SECOND = 38
const MARQUEE_SPEED_MULTIPLIER = 2
const MARQUEE_EDGE_PAUSE_MS = 3000
const MARQUEE_RESIZE_SETTLE_MS = 140
let autoRefreshIntervalId = 0
let previewAudio = null
let previewStopTimeoutId = 0
let previewActiveButton = null
let previewActiveCardId = ''
const marqueeAnimations = new WeakMap()
const activeMarqueeAnimations = new Set()
let activeSpotifyDashboardCleanup = null

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

  activeSpotifyDashboardCleanup?.()
  stopAutoRefresh()
  stopPreviewPlayback()

  let isCleanedUp = false
  let marqueeResizeTimerId = 0
  let marqueeResizeObserver = null

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

  const cleanupMount = () => {
    if (isCleanedUp) return
    isCleanedUp = true

    if (marqueeResizeTimerId) {
      window.clearTimeout(marqueeResizeTimerId)
      marqueeResizeTimerId = 0
    }

    window.removeEventListener('resize', scheduleMarqueeResync)

    if (marqueeResizeObserver) {
      marqueeResizeObserver.disconnect()
      marqueeResizeObserver = null
    }

    if (activeSpotifyDashboardCleanup === cleanupMount) {
      activeSpotifyDashboardCleanup = null
    }
  }

  const scheduleMarqueeResync = () => {
    if (isCleanedUp) return
    if (!root.isConnected || !shell.isConnected) {
      cleanupMount()
      return
    }

    if (marqueeResizeTimerId) {
      window.clearTimeout(marqueeResizeTimerId)
    }

    marqueeResizeTimerId = window.setTimeout(() => {
      marqueeResizeTimerId = 0
      if (isCleanedUp || state.status !== 'ready') return
      if (!root.isConnected || !shell.isConnected) {
        cleanupMount()
        return
      }
      syncSpotifyCardMarquee(shell)
    }, MARQUEE_RESIZE_SETTLE_MS)
  }

  activeSpotifyDashboardCleanup = cleanupMount

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

  window.addEventListener('resize', scheduleMarqueeResync, { passive: true })

  if (typeof ResizeObserver !== 'undefined') {
    marqueeResizeObserver = new ResizeObserver(() => {
      scheduleMarqueeResync()
    })
    marqueeResizeObserver.observe(root)
    marqueeResizeObserver.observe(shell)
  }

  void loadSnapshot(state, shell, { refresh: false })
  startAutoRefresh(state, shell, root, cleanupMount)
}

function startAutoRefresh(state, shell, root, onDisconnect = () => {}) {
  autoRefreshIntervalId = window.setInterval(() => {
    if (!root.isConnected || !shell.isConnected) {
      stopAutoRefresh()
      stopPreviewPlayback()
      onDisconnect()
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
  stopAllSpotifyCardMarquees()
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
  syncSpotifyCardMarquee(shell)
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
      <div class="spotify-dashboard-controls">
        <div class="spotify-dashboard-tabs" role="tablist" aria-label="${state.t.spotifyDashboard.switchLabel}">
          ${renderViewToggle(state.activeView, state.t)}
        </div>
      </div>

      <div class="spotify-dashboard-grid">
        ${cards.join('')}
      </div>

      <div class="spotify-dashboard-footer">
        <div class="spotify-dashboard-meta">
          <p class="spotify-dashboard-updated">${updatedLine}</p>
          ${fallbackMessage}
        </div>
      </div>
    </div>
  `
}

function renderViewToggle(activeView, t) {
  const labels = {
    tracks: t.spotifyDashboard.tabs.tracks,
    albums: t.spotifyDashboard.tabs.albums,
    artists: t.spotifyDashboard.tabs.artists
  }

  return `
    <div class="spotify-dashboard-view-toggle is-${activeView}">
      <span class="spotify-dashboard-view-indicator" aria-hidden="true"></span>
      ${VIEWS.map((view) => renderViewOption(view, activeView, labels)).join('')}
    </div>
  `
}

function renderViewOption(view, activeView, labels) {
  const isActive = view === activeView
  return `
    <button
      class="spotify-dashboard-view-option${isActive ? ' is-active' : ''}"
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
      ? `
          <a class="spotify-dashboard-link spotify-dashboard-marquee" href="${escapeHtml(item.spotifyUrl)}" target="_blank" rel="noopener noreferrer">
            <span class="spotify-dashboard-marquee-track">${safeTitle}</span>
          </a>
        `
      : `
          <span class="spotify-dashboard-marquee">
            <span class="spotify-dashboard-marquee-track">${safeTitle}</span>
          </span>
        `

    cards.push(`
      <article class="project-card spotify-dashboard-card">
        ${imageMarkup}
        <div class="spotify-dashboard-card-body">
          <h4 class="project-title spotify-dashboard-card-title">${titleMarkup}</h4>
          <div class="spotify-dashboard-card-meta">
            <p class="project-summary spotify-dashboard-card-subtitle">
              <span class="spotify-dashboard-marquee">
                <span class="spotify-dashboard-marquee-track">${safeSubtitle}</span>
              </span>
            </p>
            <p class="spotify-dashboard-rank-line">${escapeHtml(rankAndPlaysLabel)}</p>
          </div>
        </div>
      </article>
    `)
  }

  return cards
}

function syncSpotifyCardMarquee(shell) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const marqueeElements = shell.querySelectorAll('.spotify-dashboard-marquee')
  marqueeElements.forEach((marqueeEl) => {
    const trackEl = marqueeEl.querySelector('.spotify-dashboard-marquee-track')
    if (!trackEl) return

    stopSpotifyCardMarquee(trackEl)
    marqueeEl.classList.remove('is-overflowing')
    marqueeEl.classList.remove('is-moving')

    const overflowDistance = Math.ceil(trackEl.scrollWidth - marqueeEl.clientWidth)
    if (overflowDistance <= MARQUEE_MIN_OVERFLOW_PX) return
    if (prefersReducedMotion) return

    const baseDurationMs = Math.min(
      MARQUEE_MAX_DURATION_MS,
      Math.max(MARQUEE_MIN_DURATION_MS, Math.round((overflowDistance / MARQUEE_PIXELS_PER_SECOND) * 1000))
    )
    const travelDurationMs = baseDurationMs * MARQUEE_SPEED_MULTIPLIER

    if (!startSpotifyCardMarquee(marqueeEl, trackEl, overflowDistance, travelDurationMs)) return
    marqueeEl.classList.add('is-overflowing')
  })
}

function startSpotifyCardMarquee(marqueeEl, trackEl, overflowDistance, travelDurationMs) {
  if (typeof trackEl.animate !== 'function') return false

  const totalDurationMs = travelDurationMs * 2 + MARQUEE_EDGE_PAUSE_MS * 2
  const pauseStartOffset = MARQUEE_EDGE_PAUSE_MS / totalDurationMs
  const forwardEndOffset = (MARQUEE_EDGE_PAUSE_MS + travelDurationMs) / totalDurationMs
  const backPauseEndOffset = (MARQUEE_EDGE_PAUSE_MS + travelDurationMs + MARQUEE_EDGE_PAUSE_MS) / totalDurationMs

  const animation = trackEl.animate(
    [
      { transform: 'translateX(0)', offset: 0 },
      { transform: 'translateX(0)', offset: pauseStartOffset },
      { transform: `translateX(-${overflowDistance}px)`, offset: forwardEndOffset },
      { transform: `translateX(-${overflowDistance}px)`, offset: backPauseEndOffset },
      { transform: 'translateX(0)', offset: 1 }
    ],
    {
      duration: totalDurationMs,
      easing: 'linear',
      iterations: Number.POSITIVE_INFINITY,
      fill: 'both'
    }
  )

  const firstMoveStartMs = MARQUEE_EDGE_PAUSE_MS
  const firstMoveEndMs = firstMoveStartMs + travelDurationMs
  const secondMoveStartMs = firstMoveEndMs + MARQUEE_EDGE_PAUSE_MS
  const secondMoveEndMs = totalDurationMs

  const metadata = {
    marqueeEl,
    trackEl,
    animation,
    rafId: 0
  }

  const updateMovingState = () => {
    if (!trackEl.isConnected || !marqueeEl.isConnected) {
      stopSpotifyCardMarquee(trackEl)
      return
    }

    const rawCurrentTime = Number(animation.currentTime || 0)
    const cycleTime = ((rawCurrentTime % totalDurationMs) + totalDurationMs) % totalDurationMs
    const isMoving =
      (cycleTime > firstMoveStartMs && cycleTime < firstMoveEndMs) ||
      (cycleTime > secondMoveStartMs && cycleTime < secondMoveEndMs)

    marqueeEl.classList.toggle('is-moving', isMoving)
    metadata.rafId = window.requestAnimationFrame(updateMovingState)
  }

  marqueeAnimations.set(trackEl, metadata)
  activeMarqueeAnimations.add(metadata)
  updateMovingState()
  return true
}

function stopSpotifyCardMarquee(trackEl) {
  const metadata = marqueeAnimations.get(trackEl)
  if (!metadata) return
  stopSpotifyCardMarqueeByMetadata(metadata)
}

function stopAllSpotifyCardMarquees() {
  if (!activeMarqueeAnimations.size) return
  const items = [...activeMarqueeAnimations]
  items.forEach((metadata) => {
    stopSpotifyCardMarqueeByMetadata(metadata)
  })
}

function stopSpotifyCardMarqueeByMetadata(metadata) {
  if (!metadata) return

  if (metadata.rafId) {
    window.cancelAnimationFrame(metadata.rafId)
    metadata.rafId = 0
  }

  metadata.animation?.cancel()
  metadata.marqueeEl?.classList.remove('is-moving')
  metadata.trackEl.style.transform = ''

  marqueeAnimations.delete(metadata.trackEl)
  activeMarqueeAnimations.delete(metadata)
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
