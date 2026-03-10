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

function createResendFetchRecorder() {
  const calls = []

  async function fetchRecorder(url, options = {}) {
    calls.push({
      url: typeof url === 'string' ? url : url.toString(),
      body: JSON.parse(String(options.body || '{}'))
    })

    const isBroadcast = String(url).endsWith('/broadcasts')
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
