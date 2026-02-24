function safeDecode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function parseCookieHeader(rawCookieHeader = '') {
  const header = String(rawCookieHeader || '').trim()
  if (!header) return {}

  return header.split(';').reduce((acc, chunk) => {
    const index = chunk.indexOf('=')
    if (index <= 0) return acc

    const name = chunk.slice(0, index).trim()
    const value = chunk.slice(index + 1).trim()
    if (!name) return acc

    acc[name] = safeDecode(value)
    return acc
  }, {})
}

export function serializeCookie(name, value, options = {}) {
  const normalizedName = String(name || '').trim()
  if (!normalizedName) {
    throw new Error('Cookie name is required.')
  }

  const encodedValue = encodeURIComponent(String(value ?? ''))
  const parts = [`${normalizedName}=${encodedValue}`]

  if (options.maxAge !== undefined) {
    const maxAge = Number(options.maxAge)
    if (Number.isFinite(maxAge)) {
      parts.push(`Max-Age=${Math.floor(maxAge)}`)
    }
  }

  if (options.expires instanceof Date) {
    parts.push(`Expires=${options.expires.toUTCString()}`)
  }

  const path = options.path ? String(options.path) : '/'
  parts.push(`Path=${path}`)

  if (options.domain) {
    parts.push(`Domain=${String(options.domain)}`)
  }

  if (options.httpOnly !== false) {
    parts.push('HttpOnly')
  }

  if (options.secure) {
    parts.push('Secure')
  }

  const sameSite = String(options.sameSite || '').trim().toLowerCase()
  if (sameSite === 'lax') {
    parts.push('SameSite=Lax')
  } else if (sameSite === 'strict') {
    parts.push('SameSite=Strict')
  } else if (sameSite === 'none') {
    parts.push('SameSite=None')
  }

  return parts.join('; ')
}

export function appendSetCookie(res, cookieValue) {
  const existing = res.getHeader('Set-Cookie')
  if (!existing) {
    res.setHeader('Set-Cookie', cookieValue)
    return
  }

  if (Array.isArray(existing)) {
    res.setHeader('Set-Cookie', [...existing, cookieValue])
    return
  }

  res.setHeader('Set-Cookie', [existing, cookieValue])
}
