import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from 'redis'

const DEFAULT_LOG_LIMIT = 100
const DEFAULT_COMMIT_TTL_SECONDS = 365 * 24 * 60 * 60

export function createUpdatesBroadcastStore({
  mode = 'memory',
  redisUrl = '',
  redisKeyPrefix = 'ask-johan',
  filePath = '',
  logLimit = DEFAULT_LOG_LIMIT,
  logger = console
} = {}) {
  const normalizedMode = String(mode || 'memory').trim().toLowerCase()
  const normalizedLogLimit = parsePositiveInt(logLimit, DEFAULT_LOG_LIMIT)

  if (normalizedMode === 'redis') {
    return createRedisUpdatesBroadcastStore({
      redisUrl: String(redisUrl || '').trim(),
      redisKeyPrefix: String(redisKeyPrefix || 'ask-johan').trim() || 'ask-johan',
      logLimit: normalizedLogLimit,
      logger
    })
  }

  if (normalizedMode === 'file') {
    return createFileUpdatesBroadcastStore({
      filePath,
      logLimit: normalizedLogLimit
    })
  }

  return createMemoryUpdatesBroadcastStore({
    logLimit: normalizedLogLimit
  })
}

function createMemoryUpdatesBroadcastStore({ logLimit }) {
  const sentByCommit = new Map()
  const entries = []

  return {
    mode: 'memory',
    async hasSentTopic(headCommit, topic) {
      return getSentTopicsFromMap(sentByCommit, headCommit).has(normalizeTopic(topic))
    },
    async getSentTopics(headCommit) {
      return [...getSentTopicsFromMap(sentByCommit, headCommit)]
    },
    async markTopicSent(entry) {
      const normalizedEntry = buildSentEntry(entry)
      const topics = getSentTopicsFromMap(sentByCommit, normalizedEntry.headCommit)
      topics.add(normalizedEntry.topic)
      sentByCommit.set(normalizedEntry.headCommit, topics)
      entries.unshift(normalizedEntry)
      trimEntries(entries, logLimit)
      return normalizedEntry
    },
    async appendEntry(entry) {
      const normalizedEntry = buildLogEntry(entry)
      entries.unshift(normalizedEntry)
      trimEntries(entries, logLimit)
      return normalizedEntry
    },
    async listRecentEntries(limit = 20) {
      return entries.slice(0, parsePositiveInt(limit, 20))
    },
    async clear() {
      sentByCommit.clear()
      entries.length = 0
    }
  }
}

function createFileUpdatesBroadcastStore({ filePath, logLimit }) {
  const resolvedPath = String(filePath || '').trim()
  if (!resolvedPath) {
    throw new Error('UPDATES_BROADCAST_STORE=file requires a file path.')
  }

  function readState() {
    try {
      const raw = fs.readFileSync(resolvedPath, 'utf8')
      const parsed = JSON.parse(raw)
      return {
        sentByCommit: parsed?.sentByCommit && typeof parsed.sentByCommit === 'object' ? parsed.sentByCommit : {},
        entries: Array.isArray(parsed?.entries) ? parsed.entries : []
      }
    } catch {
      return {
        sentByCommit: {},
        entries: []
      }
    }
  }

  function writeState(state) {
    fs.mkdirSync(path.dirname(resolvedPath), { recursive: true })
    fs.writeFileSync(
      resolvedPath,
      `${JSON.stringify(
        {
          sentByCommit: state.sentByCommit,
          entries: state.entries
        },
        null,
        2
      )}\n`,
      'utf8'
    )
  }

  return {
    mode: 'file',
    async hasSentTopic(headCommit, topic) {
      const state = readState()
      const topics = new Set(normalizeTopicList(state.sentByCommit[normalizeCommit(headCommit)]))
      return topics.has(normalizeTopic(topic))
    },
    async getSentTopics(headCommit) {
      const state = readState()
      return normalizeTopicList(state.sentByCommit[normalizeCommit(headCommit)])
    },
    async markTopicSent(entry) {
      const state = readState()
      const normalizedEntry = buildSentEntry(entry)
      const normalizedCommit = normalizedEntry.headCommit
      const topics = new Set(normalizeTopicList(state.sentByCommit[normalizedCommit]))
      topics.add(normalizedEntry.topic)
      state.sentByCommit[normalizedCommit] = [...topics]
      state.entries.unshift(normalizedEntry)
      trimEntries(state.entries, logLimit)
      writeState(state)
      return normalizedEntry
    },
    async appendEntry(entry) {
      const state = readState()
      const normalizedEntry = buildLogEntry(entry)
      state.entries.unshift(normalizedEntry)
      trimEntries(state.entries, logLimit)
      writeState(state)
      return normalizedEntry
    },
    async listRecentEntries(limit = 20) {
      const state = readState()
      return state.entries.slice(0, parsePositiveInt(limit, 20))
    },
    async clear() {
      writeState({
        sentByCommit: {},
        entries: []
      })
    }
  }
}

function createRedisUpdatesBroadcastStore({ redisUrl, redisKeyPrefix, logLimit, logger }) {
  if (!redisUrl) {
    throw new Error('UPDATES_BROADCAST_STORE=redis requires REDIS_URL.')
  }

  const client = createClient({ url: redisUrl })
  let connectPromise = null
  const keyPrefix = `${redisKeyPrefix}:updates-broadcast`

  client.on('error', (error) => {
    logger.error?.('Redis updates broadcast store error:', error)
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

  function commitTopicsKey(headCommit) {
    return `${keyPrefix}:commit:${normalizeCommit(headCommit)}:topics`
  }

  function logKey() {
    return `${keyPrefix}:log`
  }

  return {
    mode: 'redis',
    async hasSentTopic(headCommit, topic) {
      await ensureConnected()
      return Boolean(await client.sIsMember(commitTopicsKey(headCommit), normalizeTopic(topic)))
    },
    async getSentTopics(headCommit) {
      await ensureConnected()
      return normalizeTopicList(await client.sMembers(commitTopicsKey(headCommit)))
    },
    async markTopicSent(entry) {
      await ensureConnected()
      const normalizedEntry = buildSentEntry(entry)
      const redisCommitKey = commitTopicsKey(normalizedEntry.headCommit)
      const redisLogKey = logKey()

      await client
        .multi()
        .sAdd(redisCommitKey, normalizedEntry.topic)
        .expire(redisCommitKey, DEFAULT_COMMIT_TTL_SECONDS)
        .lPush(redisLogKey, JSON.stringify(normalizedEntry))
        .lTrim(redisLogKey, 0, logLimit - 1)
        .exec()

      return normalizedEntry
    },
    async appendEntry(entry) {
      await ensureConnected()
      const normalizedEntry = buildLogEntry(entry)
      const redisLogKey = logKey()

      await client
        .multi()
        .lPush(redisLogKey, JSON.stringify(normalizedEntry))
        .lTrim(redisLogKey, 0, logLimit - 1)
        .exec()

      return normalizedEntry
    },
    async listRecentEntries(limit = 20) {
      await ensureConnected()
      const values = await client.lRange(logKey(), 0, parsePositiveInt(limit, 20) - 1)
      return values
        .map((value) => {
          try {
            return JSON.parse(value)
          } catch {
            return null
          }
        })
        .filter(Boolean)
    }
  }
}

function getSentTopicsFromMap(store, headCommit) {
  const normalizedCommit = normalizeCommit(headCommit)
  const entry = store.get(normalizedCommit)
  if (entry instanceof Set) return entry
  const topics = new Set()
  store.set(normalizedCommit, topics)
  return topics
}

function buildSentEntry(entry) {
  return buildLogEntry({
    ...entry,
    type: 'sent'
  })
}

function buildLogEntry(entry) {
  const normalized = {
    id: crypto.randomUUID(),
    type: normalizeEntryType(entry?.type),
    timestamp: new Date().toISOString(),
    headCommit: normalizeCommit(entry?.headCommit),
    topic: normalizeTopic(entry?.topic),
    source: normalizeSource(entry?.source),
    subject: normalizeText(entry?.subject, 160),
    broadcastId: normalizeText(entry?.broadcastId, 120),
    link: normalizeText(entry?.link, 240),
    locale: normalizeLocale(entry?.locale),
    generationMode: normalizeGenerationMode(entry?.generationMode),
    reason: normalizeText(entry?.reason, 160),
    detectedTopics: normalizeTopicList(entry?.detectedTopics),
    changedFiles: normalizeStringList(entry?.changedFiles, 30, 160),
    commitSubjects: normalizeStringList(entry?.commitSubjects, 8, 160)
  }

  return normalized
}

function normalizeCommit(value) {
  return String(value || '')
    .trim()
    .slice(0, 64)
}

function normalizeTopic(value) {
  return String(value || '')
    .trim()
    .slice(0, 64)
}

function normalizeSource(value) {
  return String(value || 'deploy')
    .trim()
    .toLowerCase()
    .slice(0, 64)
}

function normalizeLocale(value) {
  return value === 'en' ? 'en' : 'dk'
}

function normalizeGenerationMode(value) {
  return value === 'openai' ? 'openai' : 'fallback'
}

function normalizeEntryType(value) {
  const normalized = String(value || 'info').trim().toLowerCase()
  if (normalized === 'sent' || normalized === 'skipped' || normalized === 'noop' || normalized === 'preview') {
    return normalized
  }
  return 'info'
}

function normalizeTopicList(value) {
  return normalizeStringList(value, 12, 64)
}

function normalizeStringList(value, maxItems, maxLength) {
  if (!Array.isArray(value)) return []
  const normalized = []
  value.forEach((entry) => {
    const item = normalizeText(entry, maxLength)
    if (!item || normalized.includes(item)) return
    if (normalized.length >= maxItems) return
    normalized.push(item)
  })
  return normalized
}

function normalizeText(value, maxLength) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

function trimEntries(entries, limit) {
  if (!Array.isArray(entries)) return
  entries.splice(Math.max(limit, 0))
}

function parsePositiveInt(value, fallback) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.floor(parsed)
}
