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
  fetchImpl = fetch
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
      const contactPayload = {
        unsubscribed: false,
        audienceId: undefined,
        firstName: undefined,
        lastName: undefined,
        tags: undefined,
        properties: {
          locale,
          signup_source: source
        }
      }

      const updateContactResponse = await resendRequest({
        fetchImpl,
        apiKey: normalizedApiKey,
        path: contactPath,
        method: 'PATCH',
        body: contactPayload
      })

      if (updateContactResponse.status === 404) {
        const createContactResponse = await resendRequest({
          fetchImpl,
          apiKey: normalizedApiKey,
          path: '/contacts',
          method: 'POST',
          body: {
            email,
            unsubscribed: false,
            topics: topicSubscriptions,
            segments: normalizedSegmentId ? [{ id: normalizedSegmentId }] : undefined,
            properties: {
              locale,
              signup_source: source
            }
          }
        })

        if (createContactResponse.status === 409) {
          await updateExistingContact({
            fetchImpl,
            apiKey: normalizedApiKey,
            contactPath,
            topicSubscriptions,
            segmentId: normalizedSegmentId
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
        segmentId: normalizedSegmentId
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
        }
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
        }
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
        }
      })

      await assertOk(response)
      return {
        id: await readResponseId(response)
      }
    }
  }
}

async function updateExistingContact({ fetchImpl, apiKey, contactPath, topicSubscriptions, segmentId }) {
  await updateExistingContactTopics({
    fetchImpl,
    apiKey,
    contactPath,
    topicSubscriptions
  })

  if (segmentId) {
    await ensureContactSegment({
      fetchImpl,
      apiKey,
      contactPath,
      segmentId
    })
  }
}

async function updateExistingContactTopics({ fetchImpl, apiKey, contactPath, topicSubscriptions }) {
  const response = await resendRequest({
    fetchImpl,
    apiKey,
    path: `${contactPath}/topics`,
    method: 'PATCH',
    body: topicSubscriptions
  })

  await assertOk(response)
}

async function ensureContactSegment({ fetchImpl, apiKey, contactPath, segmentId }) {
  const response = await resendRequest({
    fetchImpl,
    apiKey,
    path: `${contactPath}/segments/${encodeURIComponent(segmentId)}`,
    method: 'POST',
    body: {}
  })

  if (response.status === 409) {
    return
  }

  await assertOk(response)
}

async function resendRequest({ fetchImpl, apiKey, path, method, body }) {
  return fetchImpl(`${RESEND_API_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: method === 'GET' ? undefined : JSON.stringify(stripUndefined(body))
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

function buildBroadcastName(topic, subject) {
  const datePrefix = new Date().toISOString().slice(0, 10)
  const safeSubject = String(subject || '').trim().replace(/\s+/g, ' ').slice(0, 80)
  return `${datePrefix} ${topic} ${safeSubject}`.trim()
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
