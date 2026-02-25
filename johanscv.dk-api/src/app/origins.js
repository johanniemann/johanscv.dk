export const LOCAL_ORIGIN_RE = /^https?:\/\/(127\.0\.0\.1|localhost):\d+$/
export const DEFAULT_ALLOWED_ORIGINS = ['https://johanniemann.github.io', 'https://johanscv.dk', 'https://www.johanscv.dk']

export function parseAllowedOrigins(rawOrigins) {
  if (!rawOrigins || !rawOrigins.trim()) {
    return [...DEFAULT_ALLOWED_ORIGINS]
  }

  const uniqueOrigins = [
    ...new Set(
      rawOrigins
        .split(',')
        .map((origin) => normalizeOrigin(origin))
        .filter(Boolean)
    )
  ]

  return uniqueOrigins.length ? uniqueOrigins : [...DEFAULT_ALLOWED_ORIGINS]
}

function normalizeOrigin(input) {
  const value = String(input || '').trim()
  if (!value) return ''

  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return ''
    return parsed.origin
  } catch {
    return ''
  }
}
