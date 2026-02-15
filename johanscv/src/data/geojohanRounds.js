const DEFAULT_ROUNDS = [
  {
    roundId: 'address',
    title: 'Round 1: Address',
    streetViewLocation: { lat: 55.6915, lng: 12.5611 },
    answerLocation: { lat: 55.6915, lng: 12.5611 }
  },
  {
    roundId: 'work',
    title: 'Round 2: Work',
    streetViewLocation: { lat: 55.6764, lng: 12.5681 },
    answerLocation: { lat: 55.6764, lng: 12.5681 }
  },
  {
    roundId: 'school',
    title: 'Round 3: School',
    streetViewLocation: { lat: 55.7059, lng: 12.5345 },
    answerLocation: { lat: 55.7059, lng: 12.5345 }
  }
]

export const GEOJOHAN_MAPS_API_KEY = String(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim()

export function getGeoJohanConfig() {
  let usingFallbackCoordinates = false

  const rounds = DEFAULT_ROUNDS.map((round, index) => {
    const roundNumber = index + 1
    const envPrefix = `VITE_GEOJOHAN_ROUND${roundNumber}`

    const title = readText(`${envPrefix}_TITLE`, round.title)
    const streetViewLocation = readLatLng(`${envPrefix}_PANO`, round.streetViewLocation)
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
      streetViewLocation,
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
