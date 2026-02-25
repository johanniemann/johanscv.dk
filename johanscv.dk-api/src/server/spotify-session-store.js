import crypto from 'node:crypto'

const DEFAULT_MAX_SESSIONS = 2000

export function createSpotifySessionStore({ sessionTtlMs = 7 * 24 * 60 * 60 * 1000, maxSessions = DEFAULT_MAX_SESSIONS } = {}) {
  const ttlMs = Number.isFinite(Number(sessionTtlMs)) && Number(sessionTtlMs) > 0 ? Math.floor(Number(sessionTtlMs)) : 600000
  const sessionLimit =
    Number.isFinite(Number(maxSessions)) && Number(maxSessions) > 100 ? Math.floor(Number(maxSessions)) : DEFAULT_MAX_SESSIONS
  const sessions = new Map()

  const removeExpired = (now = Date.now()) => {
    for (const [sessionId, entry] of sessions.entries()) {
      if (entry.expiresAt <= now) {
        sessions.delete(sessionId)
      }
    }
  }

  const enforceLimit = () => {
    if (sessions.size <= sessionLimit) return

    const overflow = sessions.size - sessionLimit
    const oldestEntries = [...sessions.entries()].sort((a, b) => a[1].updatedAt - b[1].updatedAt).slice(0, overflow)
    for (const [sessionId] of oldestEntries) {
      sessions.delete(sessionId)
    }
  }

  const nextExpiry = (now = Date.now()) => now + ttlMs

  return {
    mode: 'memory',
    createSession(initialData = {}) {
      const now = Date.now()
      removeExpired(now)

      const sessionId = crypto.randomBytes(32).toString('base64url')
      sessions.set(sessionId, {
        data: initialData,
        createdAt: now,
        updatedAt: now,
        expiresAt: nextExpiry(now)
      })
      enforceLimit()
      return { sessionId, data: initialData }
    },
    getSession(sessionId) {
      const normalizedId = String(sessionId || '').trim()
      if (!normalizedId) return null

      const now = Date.now()
      const entry = sessions.get(normalizedId)
      if (!entry) return null
      if (entry.expiresAt <= now) {
        sessions.delete(normalizedId)
        return null
      }

      entry.updatedAt = now
      entry.expiresAt = nextExpiry(now)
      sessions.set(normalizedId, entry)
      return entry.data
    },
    setSession(sessionId, data) {
      const normalizedId = String(sessionId || '').trim()
      if (!normalizedId) return null

      const now = Date.now()
      removeExpired(now)
      sessions.set(normalizedId, {
        data,
        createdAt: now,
        updatedAt: now,
        expiresAt: nextExpiry(now)
      })
      enforceLimit()
      return data
    },
    deleteSession(sessionId) {
      const normalizedId = String(sessionId || '').trim()
      if (!normalizedId) return
      sessions.delete(normalizedId)
    },
    clear() {
      sessions.clear()
    }
  }
}
