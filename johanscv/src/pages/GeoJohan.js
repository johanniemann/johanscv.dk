import { getGeoJohanConfig, GEOJOHAN_MAPS_API_KEY } from '../data/geojohanRounds.js'

const DEFAULT_CENTER = { lat: 55.6761, lng: 12.5683 }
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

let mapsPromise = null
let mountCounter = 0

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
      <h2 class="section-title">${t.geojohan.title}</h2>
      <p class="section-body">${t.geojohan.intro}</p>

      <div class="geojohan-shell" id="geojohan-shell">
        <header class="geojohan-header">
          <p class="geojohan-progress" id="geojohan-progress"></p>
          <h3 class="section-title geojohan-round-title" id="geojohan-round-title"></h3>
          <p class="geojohan-running-score" id="geojohan-running-score"></p>
          <p class="geojohan-config-note" id="geojohan-config-note"></p>
        </header>

        <div class="geojohan-stage">
          <div class="geojohan-panorama" id="geojohan-panorama" aria-label="${t.geojohan.panoramaAria}"></div>
          <div class="geojohan-map-panel">
            <p class="geojohan-map-hint" id="geojohan-map-hint">${t.geojohan.mapHint}</p>
            <div class="geojohan-map" id="geojohan-map" aria-label="${t.geojohan.mapAria}"></div>
          </div>
        </div>

        <p class="geojohan-feedback" id="geojohan-feedback">${t.geojohan.loading}</p>

        <div class="geojohan-actions">
          <button class="projects-cta" id="geojohan-submit" type="button" disabled>${t.geojohan.submitGuess}</button>
          <button class="projects-cta" id="geojohan-reset" type="button" disabled>${t.geojohan.resetGuess}</button>
          <button class="projects-cta" id="geojohan-next" type="button" disabled>${t.geojohan.nextRound}</button>
        </div>

        <section class="geojohan-summary" id="geojohan-summary" aria-live="polite">
          <h3 class="section-title">${t.geojohan.summaryTitle}</h3>
          <p class="section-body geojohan-total" id="geojohan-total"></p>
          <div class="geojohan-summary-list" id="geojohan-summary-list"></div>
          <div class="geojohan-actions">
            <button class="projects-cta" id="geojohan-replay" type="button">${t.geojohan.playAgain}</button>
            <a class="projects-cta" href="/quiz" data-link>${t.geojohan.backToQuiz}</a>
          </div>
        </section>
      </div>
    </section>
  `
}

export function mount({ t }) {
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
    mapClickListener: null
  }

  const isMounted = () => currentMountId === mountCounter && root.isConnected

  refs.submitBtn.addEventListener('click', () => {
    if (!isMounted()) return
    submitGuess(state, refs, t)
  })

  refs.resetBtn.addEventListener('click', () => {
    if (!isMounted()) return
    resetGuess(state, refs, t)
  })

  refs.nextBtn.addEventListener('click', () => {
    if (!isMounted()) return
    advanceRound(state, refs, t)
  })

  refs.replayBtn.addEventListener('click', () => {
    if (!isMounted()) return
    restartGame(state, refs, t)
  })

  if (config.usingFallbackCoordinates) {
    refs.configNote.textContent = t.geojohan.demoCoordinatesNote
  }

  if (!GEOJOHAN_MAPS_API_KEY) {
    refs.feedback.textContent = t.geojohan.missingKey
    refs.mapHint.textContent = t.geojohan.missingKeyHint
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
      refs.mapHint.textContent = t.geojohan.loadErrorHint
    })
}

function getRefs() {
  const shell = document.querySelector('#geojohan-shell')
  const progress = document.querySelector('#geojohan-progress')
  const roundTitle = document.querySelector('#geojohan-round-title')
  const runningScore = document.querySelector('#geojohan-running-score')
  const configNote = document.querySelector('#geojohan-config-note')
  const panoramaEl = document.querySelector('#geojohan-panorama')
  const mapEl = document.querySelector('#geojohan-map')
  const mapHint = document.querySelector('#geojohan-map-hint')
  const feedback = document.querySelector('#geojohan-feedback')
  const submitBtn = document.querySelector('#geojohan-submit')
  const resetBtn = document.querySelector('#geojohan-reset')
  const nextBtn = document.querySelector('#geojohan-next')
  const summary = document.querySelector('#geojohan-summary')
  const total = document.querySelector('#geojohan-total')
  const summaryList = document.querySelector('#geojohan-summary-list')
  const replayBtn = document.querySelector('#geojohan-replay')

  if (
    !shell ||
    !progress ||
    !roundTitle ||
    !runningScore ||
    !configNote ||
    !panoramaEl ||
    !mapEl ||
    !mapHint ||
    !feedback ||
    !submitBtn ||
    !resetBtn ||
    !nextBtn ||
    !summary ||
    !total ||
    !summaryList ||
    !replayBtn
  ) {
    return null
  }

  return {
    shell,
    progress,
    roundTitle,
    runningScore,
    configNote,
    panoramaEl,
    mapEl,
    mapHint,
    feedback,
    submitBtn,
    resetBtn,
    nextBtn,
    summary,
    total,
    summaryList,
    replayBtn
  }
}

async function beginRound(state, refs, t) {
  const round = state.rounds[state.roundIndex]

  state.phase = 'loading'
  state.guessLatLng = null
  refs.shell.classList.remove('is-finished')
  refs.summary.classList.remove('is-visible')
  refs.progress.textContent = `${t.geojohan.progressLabel} ${state.roundIndex + 1}/${state.rounds.length}`
  refs.roundTitle.textContent = round.title
  refs.runningScore.textContent = `${t.geojohan.currentTotalLabel}: ${state.totalScore}`
  refs.feedback.textContent = t.geojohan.loadingRound
  refs.mapHint.textContent = t.geojohan.mapHint
  refs.submitBtn.disabled = true
  refs.resetBtn.disabled = true
  refs.nextBtn.disabled = true
  refs.nextBtn.textContent = t.geojohan.nextRound

  const panoramaReady = await setupScene(state, refs, round, t)

  state.phase = 'guessing'
  refs.feedback.textContent = panoramaReady ? t.geojohan.roundReady : t.geojohan.streetViewFallback
}

async function setupScene(state, refs, round, t) {
  const maps = state.maps
  const answerCenter = round.answerLocation || DEFAULT_CENTER

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

    refs.submitBtn.disabled = false
    refs.resetBtn.disabled = false
    refs.mapHint.textContent = t.geojohan.guessPlacedHint
  })

  const panoramaPosition = await resolveStreetViewPosition(state, round.streetViewLocation)
  const initialPanoramaPosition = panoramaPosition || round.streetViewLocation

  if (!state.panorama) {
    state.panorama = new maps.StreetViewPanorama(refs.panoramaEl, {
      position: initialPanoramaPosition,
      pov: {
        heading: 34,
        pitch: 5
      },
      zoom: 1,
      addressControl: false,
      fullscreenControl: false,
      linksControl: true
    })
  } else {
    state.panorama.setPosition(initialPanoramaPosition)
  }

  clearRoundOverlays(state)
  return Boolean(panoramaPosition)
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
    title: round.title,
    distanceKm,
    points
  }

  refs.feedback.textContent = `${t.geojohan.distanceLabel}: ${formatDistanceKm(distanceKm)} · ${t.geojohan.pointsLabel}: ${points}`
  refs.runningScore.textContent = `${t.geojohan.currentTotalLabel}: ${state.totalScore}`
  refs.submitBtn.disabled = true
  refs.resetBtn.disabled = true
  refs.nextBtn.disabled = false
  refs.nextBtn.textContent = state.roundIndex === state.rounds.length - 1 ? t.geojohan.finishRound : t.geojohan.nextRound

  const maps = state.maps
  state.answerMarker = new maps.Marker({
    map: state.map,
    position: round.answerLocation
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
}

function resetGuess(state, refs, t) {
  if (state.phase !== 'guessing') return
  if (state.guessMarker) state.guessMarker.setMap(null)
  state.guessMarker = null
  state.guessLatLng = null
  refs.submitBtn.disabled = true
  refs.resetBtn.disabled = true
  refs.mapHint.textContent = t.geojohan.mapHint
}

function advanceRound(state, refs, t) {
  if (state.phase !== 'submitted') return

  if (state.roundIndex >= state.rounds.length - 1) {
    showSummary(state, refs, t)
    return
  }

  state.roundIndex += 1
  beginRound(state, refs, t)
}

function showSummary(state, refs, t) {
  state.phase = 'finished'
  refs.shell.classList.add('is-finished')
  refs.summary.classList.add('is-visible')
  refs.total.textContent = `${t.geojohan.totalScoreLabel}: ${state.totalScore}`
  refs.summaryList.innerHTML = state.roundResults
    .map(
      (result) => `
        <article class="project-card geojohan-summary-item">
          <h4 class="project-title">${result.title}</h4>
          <p class="project-summary">${t.geojohan.distanceLabel}: ${formatDistanceKm(result.distanceKm)}</p>
          <p class="project-summary">${t.geojohan.pointsLabel}: ${result.points}</p>
        </article>
      `
    )
    .join('')
}

function restartGame(state, refs, t) {
  state.roundIndex = 0
  state.phase = 'loading'
  state.guessLatLng = null
  state.totalScore = 0
  state.roundResults = []
  beginRound(state, refs, t)
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

async function resolveStreetViewPosition(state, targetPosition) {
  if (!state.streetViewService || !state.maps) return targetPosition

  const maps = state.maps
  let result = null
  try {
    result = await state.streetViewService.getPanorama({
      location: targetPosition,
      radius: STREET_VIEW_RADIUS_METERS,
      preference: maps.StreetViewPreference.NEAREST
    })
  } catch {
    return null
  }

  const latLng = result?.data?.location?.latLng
  if (!latLng) return null

  return {
    lat: latLng.lat(),
    lng: latLng.lng()
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
