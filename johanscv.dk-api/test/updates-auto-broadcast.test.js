import assert from 'node:assert/strict'
import test from 'node:test'
import {
  detectTopicsFromFiles,
  selectTopicFiles,
  buildFallbackBroadcastDraft,
  generateBroadcastDraft
} from '../src/features/updates-auto-broadcast.js'

test('detectTopicsFromFiles maps frontend and API files to broadcast topics', () => {
  const topics = detectTopicsFromFiles([
    'johanscv/src/pages/Resume.js',
    'johanscv/src/data/projects.json',
    'johanscv.dk-api/src/features/music-dashboard.js',
    'README.md'
  ])

  assert.deepEqual(topics, ['projects', 'resume', 'interactive_services'])
})

test('selectTopicFiles filters only files relevant to a topic', () => {
  const files = selectTopicFiles(
    ['johanscv/src/pages/Projects.js', 'johanscv/src/pages/Resume.js', 'johanscv/src/features/geojohan/GeoJohanPage.js'],
    'interactive_services'
  )

  assert.deepEqual(files, ['johanscv/src/features/geojohan/GeoJohanPage.js'])
})

test('buildFallbackBroadcastDraft creates a deterministic Danish draft', () => {
  const draft = buildFallbackBroadcastDraft({
    locale: 'dk',
    topic: 'projects',
    commitSubjects: ['Add new project card for architecture case study'],
    files: ['johanscv/src/pages/Projects.js'],
    siteBaseUrl: 'https://johanscv.dk'
  })

  assert.match(draft.subject, /Projekter:/)
  assert.match(draft.whatChanged, /Seneste ændring:/)
  assert.match(draft.whyRelevant, /Projects\.js/)
  assert.equal(draft.link, 'https://johanscv.dk/projects')
  assert.equal(draft.generationMode, 'fallback')
})

test('generateBroadcastDraft falls back cleanly when no OpenAI client is configured', async () => {
  const draft = await generateBroadcastDraft({
    client: null,
    locale: 'en',
    topic: 'resume',
    siteBaseUrl: 'https://johanscv.dk',
    commitSubjects: ['Update resume with new certification'],
    files: ['johanscv/src/pages/Resume.js'],
    diffText: ''
  })

  assert.match(draft.subject, /Resume:/)
  assert.match(draft.whatChanged, /Latest change:/)
  assert.equal(draft.link, 'https://johanscv.dk/resume')
  assert.equal(draft.generationMode, 'fallback')
})
