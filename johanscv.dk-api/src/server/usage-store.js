import crypto from 'node:crypto'
import { createClient } from 'redis'

export function createUsageStore({
  mode = 'memory',
  redisUrl = '',
  redisKeyPrefix = 'ask-johan',
  logger = console
} = {}) {
  const normalizedMode = String(mode || 'memory').trim().toLowerCase()
  if (normalizedMode === 'redis') {
    return createRedisUsageStore({
      redisUrl: String(redisUrl || '').trim(),
      redisKeyPrefix: String(redisKeyPrefix || 'ask-johan').trim() || 'ask-johan',
      logger
    })
  }

  return createMemoryUsageStore()
}

function createMemoryUsageStore() {
  const authFailureStore = new Map()
  const dailyUsageStore = new Map()
  const MAX_IN_MEMORY_KEYS = 2000

  return {
    mode: 'memory',
    async isAuthFailureLimited(key, windowMs, maxFailures) {
      if (!maxFailures || maxFailures <= 0) return false

      const now = Date.now()
      const entry = authFailureStore.get(key)
      if (!entry) return false
      if (now - entry.windowStart > windowMs) {
        authFailureStore.delete(key)
        return false
      }

      return entry.count >= maxFailures
    },
    async recordAuthFailure(key, windowMs) {
      const now = Date.now()
      const entry = authFailureStore.get(key)
      if (!entry || now - entry.windowStart > windowMs) {
        authFailureStore.set(key, { windowStart: now, count: 1 })
      } else {
        entry.count += 1
        authFailureStore.set(key, entry)
      }

      if (authFailureStore.size > MAX_IN_MEMORY_KEYS) {
        for (const [storedKey, storedEntry] of authFailureStore.entries()) {
          if (now - storedEntry.windowStart > windowMs) {
            authFailureStore.delete(storedKey)
          }
        }
      }
    },
    async clearAuthFailures(key) {
      authFailureStore.delete(key)
    },
    async takeDailyQuota(key, dailyLimit) {
      if (!dailyLimit || dailyLimit <= 0) {
        return { allowed: true, remaining: -1 }
      }

      const today = new Date().toISOString().slice(0, 10)
      let entry = dailyUsageStore.get(key)
      if (!entry || entry.day !== today) {
        entry = { day: today, count: 0 }
      }

      if (entry.count >= dailyLimit) {
        return { allowed: false, remaining: 0 }
      }

      entry.count += 1
      dailyUsageStore.set(key, entry)
      if (dailyUsageStore.size > MAX_IN_MEMORY_KEYS) {
        for (const [storedKey, storedEntry] of dailyUsageStore.entries()) {
          if (storedEntry.day !== today) {
            dailyUsageStore.delete(storedKey)
          }
        }
      }

      return { allowed: true, remaining: dailyLimit - entry.count }
    }
  }
}

function createRedisUsageStore({ redisUrl, redisKeyPrefix, logger }) {
  if (!redisUrl) {
    throw new Error('ASK_JOHAN_USAGE_STORE=redis requires REDIS_URL.')
  }

  const client = createClient({ url: redisUrl })
  let connectPromise = null

  client.on('error', (error) => {
    logger.error?.('Redis usage store error:', error)
  })

  async function ensureConnected() {
    if (client.isOpen) return
    if (!connectPromise) {
      connectPromise = client.connect().finally(() => {
        connectPromise = null
      })
    }
    await connectPromise
  }

  function authFailureKey(ip) {
    return `${redisKeyPrefix}:auth-fail:${hashKey(ip)}`
  }

  function dailyKey(ip) {
    const today = new Date().toISOString().slice(0, 10)
    return `${redisKeyPrefix}:daily:${today}:${hashKey(ip)}`
  }

  return {
    mode: 'redis',
    async isAuthFailureLimited(key, _windowMs, maxFailures) {
      if (!maxFailures || maxFailures <= 0) return false
      await ensureConnected()
      const value = await client.get(authFailureKey(key))
      const count = Number(value || 0)
      return Number.isFinite(count) && count >= maxFailures
    },
    async recordAuthFailure(key, windowMs) {
      await ensureConnected()
      const redisKey = authFailureKey(key)
      const count = await client.incr(redisKey)
      if (count === 1) {
        await client.pExpire(redisKey, windowMs)
      }
    },
    async clearAuthFailures(key) {
      await ensureConnected()
      await client.del(authFailureKey(key))
    },
    async takeDailyQuota(key, dailyLimit) {
      if (!dailyLimit || dailyLimit <= 0) {
        return { allowed: true, remaining: -1 }
      }

      await ensureConnected()
      const redisKey = dailyKey(key)
      const count = await client.incr(redisKey)
      if (count === 1) {
        await client.expire(redisKey, secondsUntilTomorrowUtc() + 86_400)
      }

      if (count > dailyLimit) {
        return { allowed: false, remaining: 0 }
      }

      return { allowed: true, remaining: dailyLimit - count }
    }
  }
}

function hashKey(value) {
  return crypto.createHash('sha256').update(String(value || 'unknown')).digest('hex').slice(0, 24)
}

function secondsUntilTomorrowUtc() {
  const now = new Date()
  const tomorrowUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0)
  const seconds = Math.ceil((tomorrowUtc - now.getTime()) / 1000)
  return Math.max(seconds, 60)
}
