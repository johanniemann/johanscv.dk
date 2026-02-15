import { getGeoJohanConfig, GEOJOHAN_MAPS_API_KEY } from '../data/geojohanRounds.js'

const DEFAULT_CENTER = { lat: 55.6761, lng: 12.5683 }
const STREET_VIEW_FALLBACK_LOCATION = { lat: 55.6761, lng: 12.5683 }
const SCORE_CURVE = [
  { km: 0, points: 5000 },
  { km: 1, points: 4700 },
  { km: 5, points: 3900 },
  { km: 25, points: 2500 },
  { km: 100, points: 1200 },
  { km: 500, points: 450 },
  { km: 20000, points: 250 }
]
const STREET_VIEW_RADIUS_METERS = 1500
const VIEWPORT_SYNC_DELAYS_MS = [120, 420, 780]
const DEFAULT_POV = { heading: 34, pitch: 5 }
const SUMMARY_TRANSITION_MS = 320
const ANSWER_PIN_STYLE_BY_ROUND = {
  address: { glyph: '🏠' },
  work: { glyph: '💼' },
  school: { glyph: '🎓' }
}

let mapsPromise = null
let mountCounter = 0
const STAGE_TRANSITION_MS = 560

export function render({ t }) {
  return `
    <main class="page-stack">
      ${renderGeoJohanSection({ t })}
    </main>
  `
}

export function renderGeoJohanSection({ t }) {
  return `
    <section class="content-section section-reveal geojohan-page" id="geojohan-root">
      <div class="geojohan-page-header">
        <h2 class="section-title geojohan-page-title">${t.geojohan.title}</h2>
        <p class="section-body geojohan-page-intro">${t.geojohan.intro}</p>
      </div>

      <div class="geojohan-shell" id="geojohan-shell">
        <header class="geojohan-header">
          <h3 class="section-title geojohan-round-title" id="geojohan-round-title"></h3>
          <p class="geojohan-progress" id="geojohan-progress"></p>
          <p class="geojohan-config-note" id="geojohan-config-note"></p>
        </header>

        <div class="geojohan-stage">
          <div class="geojohan-panorama" id="geojohan-panorama" aria-label="${t.geojohan.panoramaAria}"></div>
          <div class="geojohan-map-panel">
            <div class="geojohan-map" id="geojohan-map" aria-label="${t.geojohan.mapAria}"></div>
            <div class="geojohan-map-actions">
              <button class="projects-cta geojohan-primary-action is-hidden" id="geojohan-guess" type="button" disabled>
                ${t.geojohan.guessAction}
              </button>
              <button class="projects-cta geojohan-primary-action is-hidden" id="geojohan-continue" type="button" disabled>
                ${t.geojohan.continueAction}
              </button>
            </div>
          </div>
        </div>

        <div class="geojohan-status-row">
          <p class="geojohan-feedback" id="geojohan-feedback">${t.geojohan.loading}</p>
          <p class="geojohan-running-score" id="geojohan-running-score"></p>
        </div>

        <section class="geojohan-summary" id="geojohan-summary" aria-live="polite">
          <h3 class="section-title">${t.geojohan.summaryTitle}</h3>
          <div class="geojohan-summary-list" id="geojohan-summary-list"></div>
          <p class="section-body geojohan-total" id="geojohan-total"></p>
          <div class="geojohan-actions">
            <button class="projects-cta" id="geojohan-replay" type="button">${t.geojohan.playAgain}</button>
          </div>
        </section>
      </div>
    </section>
  `
}

export function mount({ t, language = 'en' }) {
  const root = document.querySelector('#geojohan-root')
  if (!root) return

  const currentMountId = ++mountCounter
  const config = getGeoJohanConfig()
  const refs = getRefs()
  if (!refs) return

  const state = {
    roundIndex: 0,
    phase: 'loading',
    guessLatLng: null,
    totalScore: 0,
    roundResults: [],
    rounds: config.rounds,
    maps: null,
    map: null,
    panorama: null,
    streetViewService: null,
    guessMarker: null,
    answerMarker: null,
    guessLine: null,
    mapClickListener: null,
    viewportTimers: [],
    summaryTransitionTimer: null
  }

  const isMounted = () => currentMountId === mountCounter && root.isConnected

  refs.guessBtn.addEventListener('click', () => {
    if (!isMounted()) return
    submitGuess(state, refs, t)
  })

  refs.continueBtn.addEventListener('click', () => {
    if (!isMounted()) return
    advanceRound(state, refs, t, language)
  })

  refs.replayBtn.addEventListener('click', () => {
    if (!isMounted()) return
    restartGame(state, refs, t, language)
  })

  if (config.usingFallbackCoordinates) {
    refs.configNote.textContent = t.geojohan.demoCoordinatesNote
  }

  if (!GEOJOHAN_MAPS_API_KEY) {
    refs.feedback.textContent = t.geojohan.missingKey
    setActionMode(refs, 'hidden')
    return
  }

  loadGoogleMapsApi(GEOJOHAN_MAPS_API_KEY)
    .then(async (maps) => {
      if (!isMounted()) return
      state.maps = maps
      state.streetViewService = new maps.StreetViewService()
      await beginRound(state, refs, t)
    })
    .catch(() => {
      if (!isMounted()) return
      refs.feedback.textContent = t.geojohan.loadError
      setActionMode(refs, 'hidden')
    })
}

function getRefs() {
  const root = document.querySelector('#geojohan-root')
  const shell = document.querySelector('#geojohan-shell')
  const progress = document.querySelector('#geojohan-progress')
  const roundTitle = document.querySelector('#geojohan-round-title')
  const runningScore = document.querySelector('#geojohan-running-score')
  const configNote = document.querySelector('#geojohan-config-note')
  const panoramaEl = document.querySelector('#geojohan-panorama')
  const stageEl = document.querySelector('.geojohan-stage')
  const mapEl = document.querySelector('#geojohan-map')
  const feedback = document.querySelector('#geojohan-feedback')
  const guessBtn = document.querySelector('#geojohan-guess')
  const continueBtn = document.querySelector('#geojohan-continue')
  const summary = document.querySelector('#geojohan-summary')
  const total = document.querySelector('#geojohan-total')
  const summaryList = document.querySelector('#geojohan-summary-list')
  const replayBtn = document.querySelector('#geojohan-replay')

  if (
    !root ||
    !shell ||
    !progress ||
    !roundTitle ||
    !runningScore ||
    !configNote ||
    !panoramaEl ||
    !stageEl ||
    !mapEl ||
    !feedback ||
    !guessBtn ||
    !continueBtn ||
    !summary ||
    !total ||
    !summaryList ||
    !replayBtn
  ) {
    return null
  }

  return {
    root,
    shell,
    progress,
    roundTitle,
    runningScore,
    configNote,
    panoramaEl,
    stageEl,
    mapEl,
    feedback,
    guessBtn,
    continueBtn,
    summary,
    total,
    summaryList,
    replayBtn
  }
}

async function beginRound(state, refs, t) {
  const round = state.rounds[state.roundIndex]
  const wasReviewingResult = refs.shell.classList.contains('is-reviewing-result')

  clearSummaryTransition(state)
  clearViewportTimers(state)
  state.phase = 'loading'
  state.guessLatLng = null
  refs.root.classList.remove('is-finishing-results', 'is-results-view')
  refs.shell.classList.remove('is-finishing-summary')
  refs.shell.classList.remove('is-finished')
  setReviewingState(refs, false)
  refs.summary.classList.remove('is-visible')
  refs.progress.textContent = `${t.geojohan.progressLabel} ${state.roundIndex + 1}/${state.rounds.length}`
  refs.roundTitle.textContent = resolveRoundTitle(round, t)
  refs.runningScore.textContent = `${t.geojohan.currentTotalLabel}: ${state.totalScore}`
  refs.feedback.textContent = t.geojohan.loadingRound
  setActionMode(refs, 'hidden')

  await waitForStageReady(refs, wasReviewingResult)
  const panoramaReady = await setupScene(state, refs, round)

  state.phase = 'guessing'
  refs.feedback.textContent = panoramaReady ? t.geojohan.roundReady : t.geojohan.streetViewFallback
  scheduleViewportResize(state, round)
}

async function setupScene(state, refs, round) {
  const maps = state.maps
  const answerCenter = round.answerLocation || DEFAULT_CENTER
  const preferredPanoId = String(round.streetViewPanoId || '').trim()
  const pov = normalizePov(round.streetViewPov)

  if (!state.map) {
    state.map = new maps.Map(refs.mapEl, {
      center: answerCenter,
      zoom: 11,
      disableDefaultUI: true,
      gestureHandling: 'greedy'
    })
  } else {
    state.map.setCenter(answerCenter)
    state.map.setZoom(11)
  }

  if (state.mapClickListener) {
    state.mapClickListener.remove()
    state.mapClickListener = null
  }

  state.mapClickListener = state.map.addListener('click', (event) => {
    if (state.phase !== 'guessing') return
    state.guessLatLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }

    if (!state.guessMarker) {
      state.guessMarker = new maps.Marker({
        map: state.map,
        position: state.guessLatLng
      })
    } else {
      state.guessMarker.setPosition(state.guessLatLng)
      state.guessMarker.setMap(state.map)
    }

    setActionMode(refs, 'guess')
  })

  const panoramaTarget = preferredPanoId ? null : await resolveStreetViewTarget(state, round.streetViewLocation)
  const initialPanoramaPosition = panoramaTarget?.position || round.streetViewLocation || STREET_VIEW_FALLBACK_LOCATION

  if (state.panorama) {
    state.panorama.setVisible(false)
  }
  refs.panoramaEl.innerHTML = ''
  state.panorama = new maps.StreetViewPanorama(refs.panoramaEl, {
    ...(preferredPanoId ? { pano: preferredPanoId } : {}),
    position: initialPanoramaPosition,
    pov,
    zoom: 1,
    addressControl: false,
    fullscreenControl: false,
    linksControl: true
  })

  state.panorama.setPov(pov)
  state.panorama.setVisible(true)

  let fallbackApplied = false
  state.panorama.addListener('status_changed', () => {
    if (fallbackApplied || !state.panorama) return
    const status = state.panorama.getStatus?.()
    if (status === maps.StreetViewStatus.ZERO_RESULTS || status === maps.StreetViewStatus.UNKNOWN_ERROR) {
      fallbackApplied = true
      state.panorama.setPosition(STREET_VIEW_FALLBACK_LOCATION)
    }
  })

  queuePanoramaRefresh(state, initialPanoramaPosition, preferredPanoId)
  clearRoundOverlays(state)
  return Boolean(preferredPanoId || panoramaTarget)
}

function clearRoundOverlays(state) {
  if (state.guessMarker) state.guessMarker.setMap(null)
  if (state.answerMarker) state.answerMarker.setMap(null)
  if (state.guessLine) state.guessLine.setMap(null)

  state.guessMarker = null
  state.answerMarker = null
  state.guessLine = null
}

function submitGuess(state, refs, t) {
  if (state.phase !== 'guessing' || !state.guessLatLng) return

  const round = state.rounds[state.roundIndex]
  const distanceKm = haversineDistanceKm(state.guessLatLng, round.answerLocation)
  const points = scoreDistance(distanceKm)

  state.phase = 'submitted'
  state.totalScore += points
  state.roundResults[state.roundIndex] = {
    roundId: round.roundId,
    title: resolveRoundTitle(round, t),
    distanceKm,
    points
  }

  refs.feedback.textContent = `${t.geojohan.distanceLabel}: ${formatDistanceKm(distanceKm)} · ${t.geojohan.pointsLabel}: ${points}`
  refs.runningScore.textContent = `${t.geojohan.currentTotalLabel}: ${state.totalScore}`
  setActionMode(refs, 'continue')
  setReviewingState(refs, true)

  const maps = state.maps
  const answerAppearance = createAnswerMarkerAppearance(maps, round.roundId)
  state.answerMarker = new maps.Marker({
    map: state.map,
    position: round.answerLocation,
    title: resolveRoundTitle(round, t),
    icon: answerAppearance.icon
  })
  state.guessLine = new maps.Polyline({
    map: state.map,
    path: [state.guessLatLng, round.answerLocation],
    strokeOpacity: 0.9,
    strokeWeight: 3
  })

  const bounds = new maps.LatLngBounds()
  bounds.extend(state.guessLatLng)
  bounds.extend(round.answerLocation)
  state.map.fitBounds(bounds, 60)
  clearViewportTimers(state)
  scheduleViewportResize(state, round)
}

function advanceRound(state, refs, t, language) {
  if (state.phase !== 'submitted') return

  if (state.roundIndex >= state.rounds.length - 1) {
    showSummary(state, refs, t, language)
    return
  }

  state.roundIndex += 1
  beginRound(state, refs, t)
}

function showSummary(state, refs, t, language) {
  clearSummaryTransition(state)
  clearViewportTimers(state)
  state.phase = 'finished'
  setActionMode(refs, 'hidden')
  setReviewingState(refs, false)
  const maxScore = state.rounds.length * SCORE_CURVE[0].points
  refs.total.textContent = `${t.geojohan.totalScoreLabel}: ${state.totalScore}/${maxScore}`
  refs.summaryList.innerHTML = state.roundResults
    .map((result) => {
      const locationInfo = resolveSummaryLocation(result.roundId, language, t)
      const roundEmoji = resolveRoundEmoji(result.roundId)
      return `
        <article class="project-card geojohan-summary-item">
          <h4 class="project-title">${roundEmoji ? `${roundEmoji} ` : ''}${result.title}</h4>
          ${locationInfo?.address ? `<p class="project-summary geojohan-summary-address">${locationInfo.address}</p>` : ''}
          ${locationInfo?.context ? `<p class="project-summary geojohan-summary-context">${locationInfo.context}</p>` : ''}
          <p class="project-summary">${t.geojohan.distanceLabel}: ${formatDistanceKm(result.distanceKm)}</p>
          <p class="project-summary">${t.geojohan.pointsLabel}: ${result.points}</p>
        </article>
      `
    })
    .join('')

  refs.root.classList.add('is-finishing-results')
  refs.shell.classList.add('is-finishing-summary')
  state.summaryTransitionTimer = window.setTimeout(() => {
    refs.root.classList.remove('is-finishing-results')
    refs.root.classList.add('is-results-view')
    refs.shell.classList.remove('is-finishing-summary')
    refs.shell.classList.add('is-finished')
    refs.summary.classList.add('is-visible')
    state.summaryTransitionTimer = null
  }, SUMMARY_TRANSITION_MS)
}

function restartGame(state, refs, t) {
  clearSummaryTransition(state)
  state.roundIndex = 0
  state.phase = 'loading'
  state.guessLatLng = null
  state.totalScore = 0
  state.roundResults = []
  beginRound(state, refs, t)
}

function setActionMode(refs, mode) {
  const showGuess = mode === 'guess'
  const showContinue = mode === 'continue'

  refs.guessBtn.classList.toggle('is-visible', showGuess)
  refs.guessBtn.classList.toggle('is-hidden', !showGuess)
  refs.guessBtn.disabled = !showGuess
  refs.continueBtn.classList.toggle('is-visible', showContinue)
  refs.continueBtn.classList.toggle('is-hidden', !showContinue)
  refs.continueBtn.disabled = !showContinue
}

function setReviewingState(refs, isReviewing) {
  refs.shell.classList.toggle('is-reviewing-result', isReviewing)
}

function resolveRoundTitle(round, t) {
  const localizedTitle = t?.geojohan?.roundTitles?.[round.roundId]
  return localizedTitle || round.title
}

function resolveSummaryLocation(roundId, language, t) {
  const roundNumber = summaryRoundNumber(roundId)
  if (!roundNumber) return t?.geojohan?.summaryLocations?.[roundId] || null

  const prefix = `VITE_GEOJOHAN_ROUND${roundNumber}_SUMMARY`
  const address = readEnvText(`${prefix}_ADDRESS`)
  const contextKey = language === 'dk' ? `${prefix}_CONTEXT_DK` : `${prefix}_CONTEXT_EN`
  const context = readEnvText(contextKey)
  const fallback = t?.geojohan?.summaryLocations?.[roundId] || null

  if (!address && !context) return fallback

  return {
    address: address || fallback?.address || '',
    context: context || fallback?.context || ''
  }
}

function summaryRoundNumber(roundId) {
  if (roundId === 'address') return 1
  if (roundId === 'work') return 2
  if (roundId === 'school') return 3
  return null
}

function resolveRoundEmoji(roundId) {
  return ANSWER_PIN_STYLE_BY_ROUND[roundId]?.glyph || ''
}

function readEnvText(key) {
  return String(import.meta.env[key] || '').trim()
}

function createAnswerMarkerAppearance(maps, roundId) {
  const style = ANSWER_PIN_STYLE_BY_ROUND[roundId] || ANSWER_PIN_STYLE_BY_ROUND.address
  const iconSize = 64
  const center = iconSize / 2
  const emojiSize = 42
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${iconSize} ${iconSize}">
      <defs>
        <filter id="emoji-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="rgba(8,12,24,0.45)"/>
        </filter>
      </defs>
      <text
        x="${center}"
        y="${center}"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="${emojiSize}"
        filter="url(#emoji-shadow)"
      >${style.glyph}</text>
    </svg>
  `
  const url = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`

  return {
    icon: {
      url,
      scaledSize: new maps.Size(iconSize, iconSize),
      anchor: new maps.Point(center, center)
    }
  }
}

function clearSummaryTransition(state) {
  if (!state.summaryTransitionTimer) return
  window.clearTimeout(state.summaryTransitionTimer)
  state.summaryTransitionTimer = null
}

function scheduleViewportResize(state, round) {
  if (!state.maps) return
  VIEWPORT_SYNC_DELAYS_MS.forEach((delayMs) => {
    const timer = window.setTimeout(() => {
      if (state.map) {
        state.maps.event.trigger(state.map, 'resize')
        if (state.phase === 'submitted' && state.guessLatLng && round?.answerLocation) {
          const bounds = new state.maps.LatLngBounds()
          bounds.extend(state.guessLatLng)
          bounds.extend(round.answerLocation)
          state.map.fitBounds(bounds, 60)
        } else if (round?.answerLocation) {
          state.map.setCenter(round.answerLocation)
        }
      }

      if (state.panorama) {
        state.maps.event.trigger(state.panorama, 'resize')
      }
    }, delayMs)
    state.viewportTimers.push(timer)
  })
}

function scoreDistance(distanceKm) {
  if (distanceKm <= SCORE_CURVE[0].km) return SCORE_CURVE[0].points

  for (let i = 1; i < SCORE_CURVE.length; i += 1) {
    const prev = SCORE_CURVE[i - 1]
    const next = SCORE_CURVE[i]
    if (distanceKm <= next.km) {
      const ratio = (distanceKm - prev.km) / (next.km - prev.km)
      const interpolated = prev.points + (next.points - prev.points) * ratio
      return Math.round(interpolated)
    }
  }

  return SCORE_CURVE[SCORE_CURVE.length - 1].points
}

function haversineDistanceKm(a, b) {
  const earthRadiusKm = 6371
  const latDelta = toRadians(b.lat - a.lat)
  const lngDelta = toRadians(b.lng - a.lng)
  const lat1 = toRadians(a.lat)
  const lat2 = toRadians(b.lat)

  const d = Math.sin(latDelta / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngDelta / 2) ** 2
  const arc = 2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d))
  return earthRadiusKm * arc
}

function toRadians(value) {
  return (value * Math.PI) / 180
}

function formatDistanceKm(distanceKm) {
  if (distanceKm < 1) return `${(distanceKm * 1000).toFixed(0)} m`
  return `${distanceKm.toFixed(1)} km`
}

async function resolveStreetViewTarget(state, targetPosition) {
  if (!state.streetViewService || !state.maps) {
    return {
      position: targetPosition,
      fromService: false
    }
  }

  const maps = state.maps
  const outdoor = await getPanoramaNear(state, targetPosition, maps.StreetViewSource.OUTDOOR)
  if (outdoor) return outdoor

  const nearest = await getPanoramaNear(state, targetPosition, maps.StreetViewSource.DEFAULT)
  if (nearest) return nearest

  return null
}

async function getPanoramaNear(state, targetPosition, source) {
  let result = null
  try {
    result = await state.streetViewService.getPanorama({
      location: targetPosition,
      radius: STREET_VIEW_RADIUS_METERS,
      preference: state.maps.StreetViewPreference.NEAREST,
      source
    })
  } catch {
    return null
  }

  const latLng = result?.data?.location?.latLng
  if (!latLng) return null

  return {
    position: {
      lat: latLng.lat(),
      lng: latLng.lng()
    },
    fromService: true
  }
}

function queuePanoramaRefresh(state, position, panoId = '') {
  if (!state.maps || !state.panorama) return

  VIEWPORT_SYNC_DELAYS_MS.forEach((delayMs) => {
    const timer = window.setTimeout(() => {
      if (!state.panorama || !state.maps) return
      state.panorama.setVisible(true)
      if (panoId) {
        state.panorama.setPano(panoId)
      } else if (position) {
        state.panorama.setPosition(position)
      }
      state.maps.event.trigger(state.panorama, 'resize')
    }, delayMs)
    state.viewportTimers.push(timer)
  })
}

function clearViewportTimers(state) {
  if (!state.viewportTimers.length) return
  state.viewportTimers.forEach((timer) => {
    window.clearTimeout(timer)
  })
  state.viewportTimers = []
}

function waitForStageReady(refs, shouldWaitForTransition) {
  if (!shouldWaitForTransition) return Promise.resolve()

  return new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      refs.stageEl.removeEventListener('transitionend', onTransitionEnd)
      resolve()
    }

    const onTransitionEnd = (event) => {
      if (event.target !== refs.stageEl) return
      finish()
    }

    refs.stageEl.addEventListener('transitionend', onTransitionEnd)
    window.setTimeout(finish, STAGE_TRANSITION_MS)
  })
}

function normalizePov(rawPov) {
  const heading = Number(rawPov?.heading)
  const pitch = Number(rawPov?.pitch)
  return {
    heading: Number.isFinite(heading) ? heading : DEFAULT_POV.heading,
    pitch: Number.isFinite(pitch) ? pitch : DEFAULT_POV.pitch
  }
}

function loadGoogleMapsApi(apiKey) {
  if (window.google?.maps) return Promise.resolve(window.google.maps)
  if (mapsPromise) return mapsPromise

  mapsPromise = new Promise((resolve, reject) => {
    const callbackName = `__geojohanMapsReady${Date.now()}`
    window[callbackName] = () => {
      delete window[callbackName]
      resolve(window.google.maps)
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=${callbackName}&v=weekly`
    script.async = true
    script.defer = true
    script.onerror = () => {
      delete window[callbackName]
      mapsPromise = null
      reject(new Error('Google Maps failed to load'))
    }
    document.head.appendChild(script)
  })

  return mapsPromise
}
