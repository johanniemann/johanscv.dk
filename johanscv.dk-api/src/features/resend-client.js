import {
  UPDATE_TOPIC_KEYS,
  buildWelcomeEmail,
  buildUpdateBroadcastEmail,
  isValidUpdateTopic
} from './updates-email-content.js'

const RESEND_API_BASE_URL = 'https://api.resend.com'

export class UpdatesSignupServiceError extends Error {
  constructor(message, { status = 503 } = {}) {
    super(message)
    this.name = 'UpdatesSignupServiceError'
    this.status = status
  }
}

export function createResendUpdatesSignupService({
  apiKey = '',
  fromEmail = '',
  replyToEmail = '',
  segmentId = '',
  siteBaseUrl = '',
  topicIds = {},
  fetchImpl = fetch,
  sleepImpl = defaultSleep
} = {}) {
  const normalizedApiKey = String(apiKey || '').trim()
  const normalizedFromEmail = String(fromEmail || '').trim()
  const normalizedReplyToEmail = String(replyToEmail || '').trim()
  const normalizedSegmentId = String(segmentId || '').trim()
  const normalizedSiteBaseUrl = String(siteBaseUrl || '').trim()
  const normalizedTopicIds = normalizeTopicIds(topicIds)
  const isConfigured = Boolean(normalizedApiKey && UPDATE_TOPIC_KEYS.every((key) => normalizedTopicIds[key]))
  const welcomeEmailEnabled = Boolean(isConfigured && normalizedFromEmail)
  const broadcastEnabled = Boolean(welcomeEmailEnabled && normalizedSegmentId)

  return {
    isConfigured,
    welcomeEmailEnabled,
    broadcastEnabled,
    async upsertSubscription({ email, topics, locale = 'en', source = 'contact-page' }) {
      if (!isConfigured) {
        throw new UpdatesSignupServiceError('Updates signup is temporarily unavailable. Please try again later.', {
          status: 503
        })
      }

      const topicSubscriptions = buildTopicSubscriptions(normalizedTopicIds, topics)
      const contactPath = `/contacts/${encodeURIComponent(email)}`
      const contactProperties = buildContactProperties({ locale, source })
      const contactPayload = {
        unsubscribed: false,
        audienceId: undefined,
        firstName: undefined,
        lastName: undefined,
        tags: undefined,
        properties: contactProperties
      }

      const updateContactResponse = await resendContactMutation({
        fetchImpl,
        apiKey: normalizedApiKey,
        path: contactPath,
        method: 'PATCH',
        body: contactPayload,
        sleepImpl
      })

      if (updateContactResponse.status === 404) {
        const createContactResponse = await resendContactMutation({
          fetchImpl,
          apiKey: normalizedApiKey,
          path: '/contacts',
          method: 'POST',
          body: {
            email,
            unsubscribed: false,
            topics: topicSubscriptions,
            segments: normalizedSegmentId ? [{ id: normalizedSegmentId }] : undefined,
            properties: contactProperties
          },
          sleepImpl
        })

        if (createContactResponse.status === 409) {
          await updateExistingContact({
            fetchImpl,
            apiKey: normalizedApiKey,
            contactPath,
            topicSubscriptions,
            segmentId: normalizedSegmentId,
            sleepImpl
          })

          return {
            created: false,
            subscribedTopics: topics
          }
        }

        await assertOk(createContactResponse)
        return {
          created: true,
          subscribedTopics: topics
        }
      }

      await assertOk(updateContactResponse)
      await updateExistingContact({
        fetchImpl,
        apiKey: normalizedApiKey,
        contactPath,
        topicSubscriptions,
        segmentId: normalizedSegmentId,
        sleepImpl
      })

      return {
        created: false,
        subscribedTopics: topics
      }
    },
    async sendWelcomeEmail({ email, topics, locale = 'en', unsubscribeUrl }) {
      if (!welcomeEmailEnabled) {
        throw new UpdatesSignupServiceError('Updates welcome email is not configured.', {
          status: 503
        })
      }

      const content = buildWelcomeEmail({
        locale,
        topics,
        siteBaseUrl: normalizedSiteBaseUrl,
        unsubscribeUrl
      })

      const response = await resendRequest({
        fetchImpl,
        apiKey: normalizedApiKey,
        path: '/emails',
        method: 'POST',
        body: {
          from: normalizedFromEmail,
          to: [email],
          subject: content.subject,
          html: content.html,
          text: content.text,
          replyTo: normalizedReplyToEmail || undefined,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
          }
        },
        sleepImpl
      })

      await assertOk(response)
      return {
        id: await readResponseId(response)
      }
    },
    async unsubscribeContact({ email }) {
      if (!isConfigured) {
        throw new UpdatesSignupServiceError('Updates signup is temporarily unavailable. Please try again later.', {
          status: 503
        })
      }

      const response = await resendRequest({
        fetchImpl,
        apiKey: normalizedApiKey,
        path: `/contacts/${encodeURIComponent(email)}`,
        method: 'PATCH',
        body: {
          unsubscribed: true
        },
        sleepImpl
      })

      if (response.status === 404) {
        return {
          unsubscribed: false,
          notFound: true
        }
      }

      await assertOk(response)
      return {
        unsubscribed: true,
        notFound: false
      }
    },
    async sendUpdateBroadcast({ topic, locale = 'dk', subject, whatChanged, whyRelevant, link, linkLabel = '' }) {
      if (!broadcastEnabled) {
        throw new UpdatesSignupServiceError('Updates broadcast sending is not configured.', {
          status: 503
        })
      }

      const normalizedTopic = String(topic || '').trim()
      if (!isValidUpdateTopic(normalizedTopic)) {
        throw new UpdatesSignupServiceError('Invalid update topic.', {
          status: 400
        })
      }

      const content = buildUpdateBroadcastEmail({
        locale,
        topic: normalizedTopic,
        subject,
        whatChanged,
        whyRelevant,
        link,
        linkLabel
      })

      const response = await resendRequest({
        fetchImpl,
        apiKey: normalizedApiKey,
        path: '/broadcasts',
        method: 'POST',
        body: {
          audienceId: undefined,
          from: normalizedFromEmail,
          subject: content.subject,
          html: content.html,
          text: content.text,
          name: buildBroadcastName(normalizedTopic, content.subject),
          segmentId: normalizedSegmentId,
          topicId: normalizedTopicIds[normalizedTopic],
          send: true
        },
        sleepImpl
      })

      await assertOk(response)
      return {
        id: await readResponseId(response)
      }
    }
  }
}

async function updateExistingContact({ fetchImpl, apiKey, contactPath, topicSubscriptions, segmentId, sleepImpl }) {
  await updateExistingContactTopics({
    fetchImpl,
    apiKey,
    contactPath,
    topicSubscriptions,
    sleepImpl
  })

  if (segmentId) {
    await ensureContactSegment({
      fetchImpl,
      apiKey,
      contactPath,
      segmentId,
      sleepImpl
    })
  }
}

async function updateExistingContactTopics({ fetchImpl, apiKey, contactPath, topicSubscriptions, sleepImpl }) {
  const response = await resendRequest({
    fetchImpl,
    apiKey,
    path: `${contactPath}/topics`,
    method: 'PATCH',
    body: topicSubscriptions,
    sleepImpl
  })

  await assertOk(response)
}

async function ensureContactSegment({ fetchImpl, apiKey, contactPath, segmentId, sleepImpl }) {
  const response = await resendRequest({
    fetchImpl,
    apiKey,
    path: `${contactPath}/segments/${encodeURIComponent(segmentId)}`,
    method: 'POST',
    body: {},
    sleepImpl
  })

  if (response.status === 409) {
    return
  }

  await assertOk(response)
}

async function resendContactMutation({ fetchImpl, apiKey, path, method, body, sleepImpl }) {
  const normalizedBody = stripUndefined(body)
  let response = await resendRequest({
    fetchImpl,
    apiKey,
    path,
    method,
    body: normalizedBody,
    sleepImpl
  })

  if (!(await shouldRetryWithoutContactProperties(response, normalizedBody))) {
    return response
  }

  const fallbackBody = {
    ...normalizedBody
  }
  delete fallbackBody.properties

  return resendRequest({
    fetchImpl,
    apiKey,
    path,
    method,
    body: fallbackBody,
    sleepImpl
  })
}

async function resendRequest({ fetchImpl, apiKey, path, method, body, sleepImpl = defaultSleep }) {
  const maxAttempts = 3

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const response = await fetchImpl(`${RESEND_API_BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: method === 'GET' ? undefined : JSON.stringify(stripUndefined(body))
    })

    if (!shouldRetryProviderResponse(response, attempt, maxAttempts)) {
      return response
    }

    await sleepImpl(resolveRetryDelayMs(response, attempt))
  }

  throw new UpdatesSignupServiceError('Updates signup is temporarily unavailable. Please try again later.', {
    status: 503
  })
}

async function assertOk(response) {
  if (response.ok) return

  const providerMessage = await readProviderMessage(response)

  if (response.status === 404) {
    throw new UpdatesSignupServiceError(providerMessage || 'Updates contact was not found.', {
      status: 404
    })
  }

  if (response.status === 409) {
    throw new UpdatesSignupServiceError(providerMessage || 'Updates contact already exists.', {
      status: 409
    })
  }

  if (response.status === 429) {
    throw new UpdatesSignupServiceError('Too many signup attempts. Please try again shortly.', {
      status: 429
    })
  }

  if (response.status === 400 || response.status === 422) {
    throw new UpdatesSignupServiceError(
      providerMessage || 'Invalid signup request. Please check the submitted details and try again.',
      {
        status: 400
      }
    )
  }

  throw new UpdatesSignupServiceError(providerMessage || 'Updates signup is temporarily unavailable. Please try again later.', {
    status: 503
  })
}

function shouldRetryProviderResponse(response, attempt, maxAttempts) {
  if (attempt >= maxAttempts - 1) {
    return false
  }

  return response.status === 429 || response.status === 500 || response.status === 502 || response.status === 503 || response.status === 504
}

function resolveRetryDelayMs(response, attempt) {
  const retryAfterHeader = response.headers?.get?.('retry-after')
  const retryAfterSeconds = Number.parseInt(String(retryAfterHeader || '').trim(), 10)
  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
    return retryAfterSeconds * 1000
  }

  return Math.min(1000 * 2 ** attempt, 4000)
}

function defaultSleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function shouldRetryWithoutContactProperties(response, body) {
  if (!hasDefinedProperties(body?.properties)) {
    return false
  }

  if (response.ok || (response.status !== 400 && response.status !== 422)) {
    return false
  }

  const providerMessage = await readProviderMessage(response)
  return isMissingContactPropertyMessage(providerMessage)
}

async function readProviderMessage(response) {
  try {
    const payload = await response.clone().json()
    if (typeof payload?.message === 'string' && payload.message.trim()) {
      return payload.message.trim()
    }
    if (typeof payload?.error === 'string' && payload.error.trim()) {
      return payload.error.trim()
    }
    if (typeof payload?.name === 'string' && payload.name.trim()) {
      return payload.name.trim()
    }
  } catch {}

  return ''
}

async function readResponseId(response) {
  try {
    const payload = await response.clone().json()
    if (typeof payload?.id === 'string' && payload.id.trim()) {
      return payload.id.trim()
    }
  } catch {}

  return ''
}

function normalizeTopicIds(rawTopicIds) {
  const source = rawTopicIds && typeof rawTopicIds === 'object' ? rawTopicIds : {}
  return {
    projects: String(source.projects || '').trim(),
    resume: String(source.resume || '').trim(),
    interactive_services: String(source.interactive_services || '').trim()
  }
}

function buildTopicSubscriptions(topicIds, selectedTopics) {
  const selectedTopicSet = new Set(selectedTopics)

  return UPDATE_TOPIC_KEYS.map((topicKey) => ({
    id: topicIds[topicKey],
    subscription: selectedTopicSet.has(topicKey) ? 'opt_in' : 'opt_out'
  }))
}

function buildContactProperties({ locale, source }) {
  return stripUndefined({
    locale,
    signup_source: source
  })
}

function buildBroadcastName(topic, subject) {
  const datePrefix = new Date().toISOString().slice(0, 10)
  const safeSubject = String(subject || '').trim().replace(/\s+/g, ' ').slice(0, 80)
  return `${datePrefix} ${topic} ${safeSubject}`.trim()
}

function hasDefinedProperties(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length)
}

function isMissingContactPropertyMessage(message) {
  const normalizedMessage = String(message || '').trim().toLowerCase()
  if (!normalizedMessage) return false

  return /propert(?:y|ies).*(?:do(?:es)? not exist|not exist)/i.test(normalizedMessage)
}

function stripUndefined(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => stripUndefined(entry))
  }

  if (!value || typeof value !== 'object') {
    return value
  }

  const result = {}
  Object.entries(value).forEach(([key, entry]) => {
    if (entry === undefined) return
    result[key] = stripUndefined(entry)
  })
  return result
}
