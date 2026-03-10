import assert from 'node:assert/strict'
import test from 'node:test'
import { createResendUpdatesSignupService } from '../src/features/resend-client.js'

test('sendWelcomeEmail sends a localized welcome email with unsubscribe headers', async () => {
  const fetchMock = createResendFetchRecorder()
  const service = createResendUpdatesSignupService({
    apiKey: 'resend-api-key',
    fromEmail: 'Johan <updates@johanscv.dk>',
    siteBaseUrl: 'https://johanscv.dk',
    topicIds: {
      projects: 'topic-projects',
      resume: 'topic-resume',
      interactive_services: 'topic-interactive'
    },
    fetchImpl: fetchMock
  })

  const result = await service.sendWelcomeEmail({
    email: 'user@example.com',
    topics: ['resume'],
    locale: 'dk',
    unsubscribeUrl: 'https://api.example.com/api/updates-signup/unsubscribe?token=abc'
  })

  assert.equal(result.id, 'email_123')
  assert.equal(fetchMock.calls.length, 1)
  assert.equal(fetchMock.calls[0].url, 'https://api.resend.com/emails')
  assert.equal(fetchMock.calls[0].body.subject, 'Velkommen til opdateringer fra johanscv.dk')
  assert.match(fetchMock.calls[0].body.html, /Tak for din tilmelding/)
  assert.equal(fetchMock.calls[0].body.headers['List-Unsubscribe'], '<https://api.example.com/api/updates-signup/unsubscribe?token=abc>')
  assert.equal(fetchMock.calls[0].body.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click')
})

test('sendWelcomeEmail retries transient Resend throttling before succeeding', async () => {
  const delays = []
  let attempts = 0
  const service = createResendUpdatesSignupService({
    apiKey: 'resend-api-key',
    fromEmail: 'Johan <updates@johanscv.dk>',
    siteBaseUrl: 'https://johanscv.dk',
    topicIds: {
      projects: 'topic-projects',
      resume: 'topic-resume',
      interactive_services: 'topic-interactive'
    },
    sleepImpl: async (ms) => {
      delays.push(ms)
    },
    fetchImpl: async () => {
      attempts += 1
      if (attempts === 1) {
        return new Response(JSON.stringify({ message: 'Rate limit' }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '2'
          }
        })
      }

      return new Response(JSON.stringify({ id: 'email_retry_ok' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  })

  const result = await service.sendWelcomeEmail({
    email: 'user@example.com',
    topics: ['resume'],
    locale: 'dk',
    unsubscribeUrl: 'https://api.example.com/api/updates-signup/unsubscribe?token=abc'
  })

  assert.equal(result.id, 'email_retry_ok')
  assert.equal(attempts, 2)
  assert.deepEqual(delays, [2000])
})

test('sendUpdateBroadcast creates a topic-scoped broadcast with send=true', async () => {
  const fetchMock = createResendFetchRecorder()
  const service = createResendUpdatesSignupService({
    apiKey: 'resend-api-key',
    fromEmail: 'Johan <updates@johanscv.dk>',
    segmentId: 'segment-updates',
    siteBaseUrl: 'https://johanscv.dk',
    topicIds: {
      projects: 'topic-projects',
      resume: 'topic-resume',
      interactive_services: 'topic-interactive'
    },
    fetchImpl: fetchMock
  })

  const result = await service.sendUpdateBroadcast({
    topic: 'projects',
    locale: 'en',
    subject: 'New project shipped',
    whatChanged: 'A new case study was published on the projects page.',
    whyRelevant: 'It shows the latest direction of my architecture and frontend work.',
    link: 'https://johanscv.dk/projects'
  })

  assert.equal(result.id, 'broadcast_123')
  assert.equal(fetchMock.calls.length, 1)
  assert.equal(fetchMock.calls[0].url, 'https://api.resend.com/broadcasts')
  assert.equal(fetchMock.calls[0].body.segmentId, 'segment-updates')
  assert.equal(fetchMock.calls[0].body.topicId, 'topic-projects')
  assert.equal(fetchMock.calls[0].body.send, true)
  assert.match(fetchMock.calls[0].body.text, /What changed:/)
  assert.match(fetchMock.calls[0].body.text, /Why it matters:/)
  assert.match(fetchMock.calls[0].body.text, /RESEND_UNSUBSCRIBE_URL/)
})

test('upsertSubscription retries without contact properties when Resend rejects them on create', async () => {
  const fetchMock = createResendFetchRecorder({
    existingContact: false,
    rejectPropertiesOnCreate: true
  })
  const service = createResendUpdatesSignupService({
    apiKey: 'resend-api-key',
    fromEmail: 'Johan <updates@johanscv.dk>',
    segmentId: 'segment-updates',
    siteBaseUrl: 'https://johanscv.dk',
    topicIds: {
      projects: 'topic-projects',
      resume: 'topic-resume',
      interactive_services: 'topic-interactive'
    },
    fetchImpl: fetchMock
  })

  const result = await service.upsertSubscription({
    email: 'user@example.com',
    topics: ['resume'],
    locale: 'dk',
    source: 'contact-page'
  })

  assert.equal(result.created, true)
  const createCalls = fetchMock.calls.filter((entry) => entry.url === 'https://api.resend.com/contacts')
  assert.equal(createCalls.length, 2)
  assert.deepEqual(createCalls[0].body.properties, {
    locale: 'dk',
    signup_source: 'contact-page'
  })
  assert.equal(Object.hasOwn(createCalls[1].body, 'properties'), false)
})

test('upsertSubscription retries transient Resend throttling before creating the contact', async () => {
  const delays = []
  let createAttempts = 0
  const service = createResendUpdatesSignupService({
    apiKey: 'resend-api-key',
    fromEmail: 'Johan <updates@johanscv.dk>',
    segmentId: 'segment-updates',
    siteBaseUrl: 'https://johanscv.dk',
    topicIds: {
      projects: 'topic-projects',
      resume: 'topic-resume',
      interactive_services: 'topic-interactive'
    },
    sleepImpl: async (ms) => {
      delays.push(ms)
    },
    fetchImpl: async (url, options = {}) => {
      const requestUrl = typeof url === 'string' ? url : url.toString()

      if (requestUrl === 'https://api.resend.com/contacts/user%40example.com') {
        return new Response(JSON.stringify({ message: 'Contact not found' }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }

      if (requestUrl === 'https://api.resend.com/contacts') {
        createAttempts += 1
        if (createAttempts === 1) {
          return new Response(JSON.stringify({ message: 'Rate limit' }), {
            status: 429,
            headers: {
              'Content-Type': 'application/json'
            }
          })
        }

        return new Response(JSON.stringify({ id: 'contact_retry_ok' }), {
          status: 201,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }

      throw new Error(`Unexpected fetch URL in retry test: ${requestUrl} with body ${String(options.body || '')}`)
    }
  })

  const result = await service.upsertSubscription({
    email: 'user@example.com',
    topics: ['resume'],
    locale: 'dk',
    source: 'contact-page'
  })

  assert.equal(result.created, true)
  assert.equal(createAttempts, 2)
  assert.deepEqual(delays, [1000])
})

test('upsertSubscription retries without contact properties when Resend rejects them on update', async () => {
  const fetchMock = createResendFetchRecorder({
    existingContact: true,
    rejectPropertiesOnUpdate: true
  })
  const service = createResendUpdatesSignupService({
    apiKey: 'resend-api-key',
    fromEmail: 'Johan <updates@johanscv.dk>',
    segmentId: 'segment-updates',
    siteBaseUrl: 'https://johanscv.dk',
    topicIds: {
      projects: 'topic-projects',
      resume: 'topic-resume',
      interactive_services: 'topic-interactive'
    },
    fetchImpl: fetchMock
  })

  const result = await service.upsertSubscription({
    email: 'user@example.com',
    topics: ['projects'],
    locale: 'en',
    source: 'contact-page'
  })

  assert.equal(result.created, false)
  const updateCalls = fetchMock.calls.filter((entry) => entry.url === 'https://api.resend.com/contacts/user%40example.com')
  assert.equal(updateCalls.length, 2)
  assert.deepEqual(updateCalls[0].body.properties, {
    locale: 'en',
    signup_source: 'contact-page'
  })
  assert.equal(Object.hasOwn(updateCalls[1].body, 'properties'), false)
})

function createResendFetchRecorder({
  existingContact = true,
  rejectPropertiesOnCreate = false,
  rejectPropertiesOnUpdate = false
} = {}) {
  const calls = []
  let hasContact = existingContact

  async function fetchRecorder(url, options = {}) {
    const request = {
      url: typeof url === 'string' ? url : url.toString(),
      body: JSON.parse(String(options.body || '{}'))
    }
    calls.push(request)

    if (request.url === 'https://api.resend.com/contacts') {
      if (rejectPropertiesOnCreate && request.body.properties) {
        return new Response(JSON.stringify({ message: 'One or more properties do not exist' }), {
          status: 422,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }

      hasContact = true
      return new Response(JSON.stringify({ id: 'contact_123' }), {
        status: 201,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    if (request.url.startsWith('https://api.resend.com/contacts/')) {
      if (!hasContact) {
        return new Response(JSON.stringify({ message: 'Contact not found' }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }

      if (rejectPropertiesOnUpdate && request.body.properties) {
        return new Response(JSON.stringify({ message: 'One or more properties do not exist' }), {
          status: 422,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }

      return new Response(JSON.stringify({ id: 'contact_123' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    const isBroadcast = request.url.endsWith('/broadcasts')
    return new Response(JSON.stringify({ id: isBroadcast ? 'broadcast_123' : 'email_123' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  fetchRecorder.calls = calls
  return fetchRecorder
}
