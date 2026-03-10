import crypto from 'node:crypto'
import {
  AUTO_BROADCAST_TOPICS,
  detectTopicsFromFiles,
  generateBroadcastDraft,
  selectTopicFiles
} from './updates-auto-broadcast.js'
import { UpdatesSignupServiceError } from './resend-client.js'
import { sendAnswer, setNoStore } from '../shared/http.js'

const AUTOMATION_AUTH_MESSAGE = 'Updates automation token is invalid.'
const AUTOMATION_UNAVAILABLE_MESSAGE = 'Updates automation is temporarily unavailable.'

export class UpdatesBroadcastError extends Error {
  constructor(message, { status = 400 } = {}) {
    super(message)
    this.name = 'UpdatesBroadcastError'
    this.status = status
  }
}

export function createUpdatesBroadcastService({
  broadcastStore,
  locale = 'dk',
  logger = console,
  model = 'gpt-4.1-mini',
  openAiClient = null,
  requestTimeoutMs = 12_000,
  siteBaseUrl = 'https://johanscv.dk',
  updatesSignupService,
  withTimeout
} = {}) {
  if (!broadcastStore) {
    throw new Error('Updates broadcast store is required.')
  }
  if (!updatesSignupService) {
    throw new Error('Updates signup service is required.')
  }

  const defaultLocale = locale === 'en' ? 'en' : 'dk'
  const normalizedSiteBaseUrl = normalizeSiteBaseUrl(siteBaseUrl)

  return {
    async processAutoBroadcast(payload = {}) {
      const normalizedPayload = normalizeAutoBroadcastPayload(payload, {
        defaultLocale,
        siteBaseUrl: normalizedSiteBaseUrl
      })

      if (!normalizedPayload.headCommit) {
        throw new UpdatesBroadcastError('headCommit is required.', { status: 400 })
      }

      if (!normalizedPayload.changedFiles.length && !normalizedPayload.topicDetails.length) {
        throw new UpdatesBroadcastError('Provide changedFiles or topicDetails for auto-broadcast.', { status: 400 })
      }

      if (!normalizedPayload.dryRun && !updatesSignupService.broadcastEnabled) {
        throw new UpdatesBroadcastError('Updates broadcast sending is not configured.', { status: 503 })
      }

      const detectedTopics = detectTopics(normalizedPayload)
      if (!detectedTopics.length) {
        await broadcastStore.appendEntry({
          type: 'noop',
          headCommit: normalizedPayload.headCommit,
          source: normalizedPayload.source,
          locale: normalizedPayload.locale,
          reason: 'No matching update topics detected.',
          detectedTopics: [],
          changedFiles: normalizedPayload.changedFiles,
          commitSubjects: normalizedPayload.commitSubjects
        })

        return {
          ok: true,
          dryRun: normalizedPayload.dryRun,
          headCommit: normalizedPayload.headCommit,
          source: normalizedPayload.source,
          detectedTopics: [],
          sent: [],
          skipped: [],
          reason: 'no-matching-topics'
        }
      }

      const sent = []
      const skipped = []

      for (const topic of detectedTopics) {
        if (!normalizedPayload.force && (await broadcastStore.hasSentTopic(normalizedPayload.headCommit, topic))) {
          const skippedEntry = {
            topic,
            reason: 'already-broadcasted'
          }
          skipped.push(skippedEntry)
          await broadcastStore.appendEntry({
            type: 'skipped',
            headCommit: normalizedPayload.headCommit,
            source: normalizedPayload.source,
            locale: normalizedPayload.locale,
            topic,
            reason: skippedEntry.reason,
            changedFiles: topicFilesForPayload(normalizedPayload, topic),
            commitSubjects: topicCommitSubjectsForPayload(normalizedPayload, topic),
            detectedTopics
          })
          continue
        }

        const topicFiles = topicFilesForPayload(normalizedPayload, topic)
        const topicCommitSubjects = topicCommitSubjectsForPayload(normalizedPayload, topic)
        const topicDiffText = topicDiffForPayload(normalizedPayload, topic)
        const draft = await generateBroadcastDraft({
          client: openAiClient,
          model,
          locale: normalizedPayload.locale,
          topic,
          siteBaseUrl: normalizedPayload.siteBaseUrl,
          commitSubjects: topicCommitSubjects,
          files: topicFiles,
          diffText: topicDiffText,
          requestTimeoutMs,
          withTimeout
        })

        if (normalizedPayload.dryRun) {
          const previewEntry = {
            topic,
            subject: draft.subject,
            link: draft.link,
            generationMode: draft.generationMode || 'fallback',
            whatChanged: draft.whatChanged,
            whyRelevant: draft.whyRelevant
          }
          sent.push(previewEntry)
          await broadcastStore.appendEntry({
            type: 'preview',
            headCommit: normalizedPayload.headCommit,
            source: normalizedPayload.source,
            locale: normalizedPayload.locale,
            topic,
            subject: draft.subject,
            link: draft.link,
            generationMode: draft.generationMode || 'fallback',
            changedFiles: topicFiles,
            commitSubjects: topicCommitSubjects,
            detectedTopics
          })
          continue
        }

        const result = await updatesSignupService.sendUpdateBroadcast({
          topic,
          locale: normalizedPayload.locale,
          subject: draft.subject,
          whatChanged: draft.whatChanged,
          whyRelevant: draft.whyRelevant,
          link: draft.link,
          linkLabel: draft.linkLabel
        })

        await broadcastStore.markTopicSent({
          headCommit: normalizedPayload.headCommit,
          source: normalizedPayload.source,
          locale: normalizedPayload.locale,
          topic,
          subject: draft.subject,
          broadcastId: result.id,
          link: draft.link,
          generationMode: draft.generationMode || 'fallback',
          changedFiles: topicFiles,
          commitSubjects: topicCommitSubjects,
          detectedTopics
        })

        sent.push({
          topic,
          subject: draft.subject,
          link: draft.link,
          broadcastId: result.id,
          generationMode: draft.generationMode || 'fallback'
        })
      }

      return {
        ok: true,
        dryRun: normalizedPayload.dryRun,
        headCommit: normalizedPayload.headCommit,
        source: normalizedPayload.source,
        detectedTopics,
        sent,
        skipped
      }
    }
  }
}

export function createUpdatesAutoBroadcastHandler({
  automationToken = '',
  updatesBroadcastService,
  logger = console
}) {
  const normalizedToken = String(automationToken || '').trim()

  return async function updatesAutoBroadcastHandler(req, res) {
    setNoStore(res)

    if (!normalizedToken) {
      return sendAnswer(res, 503, AUTOMATION_UNAVAILABLE_MESSAGE)
    }

    if (!hasValidAutomationToken(req, normalizedToken)) {
      return sendAnswer(res, 401, AUTOMATION_AUTH_MESSAGE)
    }

    if (!req.is('application/json')) {
      return sendAnswer(res, 415, 'Unsupported content type.')
    }

    try {
      const result = await updatesBroadcastService.processAutoBroadcast(req.body)
      return res.status(200).json(result)
    } catch (error) {
      if (error instanceof UpdatesBroadcastError || error instanceof UpdatesSignupServiceError) {
        return sendAnswer(res, error.status, error.message || AUTOMATION_UNAVAILABLE_MESSAGE)
      }

      logger.error?.('Updates auto-broadcast error:', error)
      return sendAnswer(res, 503, AUTOMATION_UNAVAILABLE_MESSAGE)
    }
  }
}

export function createUpdatesBroadcastLogHandler({
  automationToken = '',
  broadcastStore,
  logger = console
}) {
  const normalizedToken = String(automationToken || '').trim()

  return async function updatesBroadcastLogHandler(req, res) {
    setNoStore(res)

    if (!normalizedToken) {
      return sendAnswer(res, 503, AUTOMATION_UNAVAILABLE_MESSAGE)
    }

    if (!hasValidAutomationToken(req, normalizedToken)) {
      return sendAnswer(res, 401, AUTOMATION_AUTH_MESSAGE)
    }

    try {
      const limit = Math.min(parsePositiveInt(req.query?.limit, 20), 50)
      const entries = await broadcastStore.listRecentEntries(limit)
      return res.json({
        ok: true,
        entries
      })
    } catch (error) {
      logger.error?.('Updates broadcast log error:', error)
      return sendAnswer(res, 503, AUTOMATION_UNAVAILABLE_MESSAGE)
    }
  }
}

function normalizeAutoBroadcastPayload(payload, { defaultLocale, siteBaseUrl }) {
  const changedFiles = normalizeStringList(payload?.changedFiles, 80, 180)
  const commitSubjects = normalizeStringList(payload?.commitSubjects, 10, 180)
  const topicDetails = normalizeTopicDetails(payload?.topicDetails)

  return {
    dryRun: Boolean(payload?.dryRun),
    force: Boolean(payload?.force),
    headCommit: normalizeCommit(payload?.headCommit),
    source: normalizeSource(payload?.source),
    locale: payload?.locale === 'en' ? 'en' : defaultLocale,
    siteBaseUrl: normalizeSiteBaseUrl(payload?.siteBaseUrl || siteBaseUrl),
    changedFiles,
    commitSubjects,
    topicDetails
  }
}

function normalizeTopicDetails(value) {
  if (!Array.isArray(value)) return []

  const normalized = []
  value.forEach((entry) => {
    const topic = normalizeTopic(entry?.topic)
    if (!AUTO_BROADCAST_TOPICS.includes(topic)) return

    normalized.push({
      topic,
      files: normalizeStringList(entry?.files, 30, 180),
      commitSubjects: normalizeStringList(entry?.commitSubjects, 8, 180),
      diffText: normalizeText(entry?.diffText, 2_000)
    })
  })
  return normalized
}

function detectTopics(payload) {
  const topicsFromFiles = detectTopicsFromFiles(payload.changedFiles)
  const topicsFromDetails = payload.topicDetails.map((entry) => entry.topic)
  const matchedTopics = new Set([...topicsFromFiles, ...topicsFromDetails])
  return AUTO_BROADCAST_TOPICS.filter((topic) => matchedTopics.has(topic))
}

function topicFilesForPayload(payload, topic) {
  const topicDetails = payload.topicDetails.find((entry) => entry.topic === topic)
  if (topicDetails?.files?.length) {
    return topicDetails.files
  }
  return selectTopicFiles(payload.changedFiles, topic)
}

function topicCommitSubjectsForPayload(payload, topic) {
  const topicDetails = payload.topicDetails.find((entry) => entry.topic === topic)
  if (topicDetails?.commitSubjects?.length) {
    return topicDetails.commitSubjects
  }
  return payload.commitSubjects
}

function topicDiffForPayload(payload, topic) {
  const topicDetails = payload.topicDetails.find((entry) => entry.topic === topic)
  return topicDetails?.diffText || ''
}

function hasValidAutomationToken(req, automationToken) {
  const tokenFromHeader = String(req.get('x-updates-automation-token') || '').trim()
  const authorizationHeader = String(req.get('authorization') || '').trim()
  const tokenFromBearer = authorizationHeader.toLowerCase().startsWith('bearer ')
    ? authorizationHeader.slice('bearer '.length).trim()
    : ''
  const providedToken = tokenFromHeader || tokenFromBearer
  if (!providedToken) return false

  const providedBuffer = Buffer.from(providedToken)
  const expectedBuffer = Buffer.from(automationToken)
  if (providedBuffer.length !== expectedBuffer.length) return false
  return crypto.timingSafeEqual(providedBuffer, expectedBuffer)
}

function normalizeCommit(value) {
  return String(value || '')
    .trim()
    .slice(0, 64)
}

function normalizeSource(value) {
  const normalized = String(value || 'deploy').trim().toLowerCase()
  return normalized.slice(0, 64) || 'deploy'
}

function normalizeTopic(value) {
  return String(value || '')
    .trim()
    .slice(0, 64)
}

function normalizeText(value, maxLength) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
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

function normalizeSiteBaseUrl(value) {
  const normalized = String(value || '').trim()
  if (!normalized) return 'https://johanscv.dk'
  try {
    return new URL(normalized).toString().replace(/\/$/, '')
  } catch {
    return 'https://johanscv.dk'
  }
}

function parsePositiveInt(value, fallback) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.floor(parsed)
}
