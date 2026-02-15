const DEFAULT_ROUNDS = [
  {
    roundId: 'address',
    title: 'Where in Copenhagen do I live?',
    streetViewPanoId: '',
    streetViewPov: { heading: 34, pitch: 5 },
    streetViewLocation: { lat: 55.6761, lng: 12.5683 },
    answerLocation: { lat: 55.6761, lng: 12.5683 }
  },
  {
    roundId: 'work',
    title: 'Where in Copenhagen do I work?',
    streetViewPanoId: '',
    streetViewPov: { heading: 34, pitch: 5 },
    streetViewLocation: { lat: 55.6908, lng: 12.5443 },
    answerLocation: { lat: 55.6908, lng: 12.5443 }
  },
  {
    roundId: 'school',
    title: 'Where in Copenhagen do I study?',
    streetViewPanoId: '',
    streetViewPov: { heading: 34, pitch: 5 },
    streetViewLocation: { lat: 55.7024, lng: 12.5628 },
    answerLocation: { lat: 55.7024, lng: 12.5628 }
  }
]

export const GEOJOHAN_MAPS_API_KEY = String(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim()

export function getGeoJohanConfig() {
  let usingFallbackCoordinates = false

  const rounds = DEFAULT_ROUNDS.map((round, index) => {
    const roundNumber = index + 1
    const envPrefix = `VITE_GEOJOHAN_ROUND${roundNumber}`

    const title = readText(`${envPrefix}_TITLE`, round.title)
    const streetViewPanoId = readText(`${envPrefix}_PANO_ID`, round.streetViewPanoId || '')
    const streetViewLocation = readLatLng(`${envPrefix}_PANO`, round.streetViewLocation)
    const streetViewPov = {
      heading: readNumber(`${envPrefix}_POV_HEADING`, round.streetViewPov?.heading ?? 34),
      pitch: readNumber(`${envPrefix}_POV_PITCH`, round.streetViewPov?.pitch ?? 5)
    }
    const answerLocation = readLatLng(`${envPrefix}_ANSWER`, round.answerLocation)
    const hasCustomCoordinates =
      hasNumber(`${envPrefix}_PANO_LAT`) &&
      hasNumber(`${envPrefix}_PANO_LNG`) &&
      hasNumber(`${envPrefix}_ANSWER_LAT`) &&
      hasNumber(`${envPrefix}_ANSWER_LNG`)

    if (!hasCustomCoordinates) {
      usingFallbackCoordinates = true
    }

    return {
      ...round,
      title,
      streetViewPanoId,
      streetViewLocation,
      streetViewPov,
      answerLocation,
      hasCustomCoordinates
    }
  })

  return {
    rounds,
    usingFallbackCoordinates
  }
}

function readLatLng(prefix, fallback) {
  return {
    lat: readNumber(`${prefix}_LAT`, fallback.lat),
    lng: readNumber(`${prefix}_LNG`, fallback.lng)
  }
}

function hasNumber(key) {
  const parsed = Number(import.meta.env[key])
  return Number.isFinite(parsed)
}

function readNumber(key, fallback) {
  const parsed = Number(import.meta.env[key])
  return Number.isFinite(parsed) ? parsed : fallback
}

function readText(key, fallback) {
  const value = String(import.meta.env[key] || '').trim()
  return value || fallback
}
