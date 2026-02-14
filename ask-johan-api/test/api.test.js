import assert from 'node:assert/strict'
import test from 'node:test'
import request from 'supertest'
import { createApp } from '../app.js'

test('GET /health returns ok', async () => {
  const app = createApp()
  const response = await request(app).get('/health')

  assert.equal(response.status, 200)
  assert.deepEqual(response.body, { ok: true })
})

test('GET / returns service metadata', async () => {
  const app = createApp()
  const response = await request(app).get('/')

  assert.equal(response.status, 200)
  assert.equal(response.body.ok, true)
  assert.equal(response.body.service, 'ask-johan-api')
  assert.deepEqual(response.body.endpoints, ['/health', '/api/ask-johan'])
})

test('POST /api/ask-johan rejects missing access code when required', async () => {
  const app = createApp({ accessCode: 'secret', client: fakeClient('Hello') })
  const response = await request(app).post('/api/ask-johan').send({ question: 'hello' })

  assert.equal(response.status, 401)
  assert.equal(response.body.answer, 'Access denied. Invalid access code.')
})

test('POST /api/ask-johan validates content type', async () => {
  const app = createApp({ client: fakeClient('Hello') })
  const response = await request(app).post('/api/ask-johan').type('form').send({ question: 'hello' })

  assert.equal(response.status, 415)
  assert.equal(response.body.answer, 'Unsupported content type.')
})

test('POST /api/ask-johan validates question type', async () => {
  const app = createApp({ client: fakeClient('Hello') })
  const response = await request(app).post('/api/ask-johan').send({ question: 123 })

  assert.equal(response.status, 400)
  assert.equal(response.body.answer, 'Question must be a string.')
})

test('POST /api/ask-johan validates max question length', async () => {
  const app = createApp({ client: fakeClient('Hello'), maxQuestionChars: 5 })
  const response = await request(app).post('/api/ask-johan').send({ question: 'this is too long' })

  assert.equal(response.status, 400)
  assert.equal(response.body.answer, 'Question is too long. Max 5 characters.')
})

test('POST /api/ask-johan returns answer on success', async () => {
  const app = createApp({ client: fakeClient('  Valid answer  ') })
  const response = await request(app).post('/api/ask-johan').send({ question: 'hello' })

  assert.equal(response.status, 200)
  assert.deepEqual(response.body, { answer: 'Valid answer' })
})

test('POST /api/ask-johan returns 500 when OPENAI key/client missing', async () => {
  const app = createApp({ client: null })
  const response = await request(app).post('/api/ask-johan').send({ question: 'hello' })

  assert.equal(response.status, 500)
  assert.equal(response.body.answer, 'Server is missing OPENAI_API_KEY.')
})

test('POST /api/ask-johan enforces rate limit', async () => {
  const app = createApp({
    client: fakeClient('ok'),
    rateLimitMax: 1,
    rateLimitWindowMs: 60_000
  })

  const first = await request(app).post('/api/ask-johan').send({ question: 'hello' })
  const second = await request(app).post('/api/ask-johan').send({ question: 'hello again' })

  assert.equal(first.status, 200)
  assert.equal(second.status, 429)
  assert.equal(second.body.answer, 'Too many requests. Please try again shortly.')
})

function fakeClient(answer) {
  return {
    responses: {
      create: async () => ({ output_text: answer })
    }
  }
}
