import { resolveTopicLink } from './updates-email-content.js'

export const AUTO_BROADCAST_TOPICS = ['projects', 'resume', 'interactive_services']

const TOPIC_PATH_RULES = {
  projects: [
    'johanscv/src/pages/Projects.js',
    'johanscv/src/data/projects.json',
    'johanscv/src/pages/Home.js'
  ],
  resume: [
    'johanscv/src/pages/Resume.js',
    'johanscv/src/data/resume.json',
    'johanscv/public/files/johan-cv.txt',
    'johanscv/public/files/johan-niemann-husbjerg-cv.pdf'
  ],
  interactive_services: [
    'johanscv/src/pages/Playground.js',
    'johanscv/src/features/ask-johan/',
    'johanscv/src/features/geojohan/',
    'johanscv/src/features/spotify-dashboard/',
    'johanscv.dk-api/src/features/ask-johan.js',
    'johanscv.dk-api/src/features/geojohan.js',
    'johanscv.dk-api/src/features/music-dashboard.js',
    'johanscv.dk-api/src/features/spotify-auth.js',
    'johanscv.dk-api/src/features/spotify-session.js',
    'johanscv.dk-api/src/server/spotify-session-store.js'
  ]
}

export function detectTopicsFromFiles(files) {
  const normalizedFiles = Array.isArray(files) ? files.map((file) => String(file || '').trim()).filter(Boolean) : []
  const matchedTopics = new Set()

  normalizedFiles.forEach((filePath) => {
    AUTO_BROADCAST_TOPICS.forEach((topic) => {
      if (matchesTopicRule(topic, filePath)) {
        matchedTopics.add(topic)
      }
    })
  })

  return AUTO_BROADCAST_TOPICS.filter((topic) => matchedTopics.has(topic))
}

export function selectTopicFiles(files, topic) {
  return (Array.isArray(files) ? files : []).filter((filePath) => matchesTopicRule(topic, filePath))
}

export function buildFallbackBroadcastDraft({
  locale = 'dk',
  topic,
  commitSubjects = [],
  files = [],
  siteBaseUrl = ''
} = {}) {
  const normalizedLocale = locale === 'en' ? 'en' : 'dk'
  const normalizedTopic = AUTO_BROADCAST_TOPICS.includes(topic) ? topic : 'projects'
  const latestCommit = String(commitSubjects[0] || '').trim()
  const relevantFiles = files.slice(0, 4)
  const fileSummary = relevantFiles.length ? relevantFiles.map((file) => shortFileName(file)).join(', ') : ''
  const link = resolveTopicLink(siteBaseUrl, normalizedTopic)

  if (normalizedLocale === 'en') {
    return {
      subject: fallbackSubject(normalizedTopic, latestCommit, 'en'),
      whatChanged: latestCommit
        ? `Latest change: ${latestCommit}.`
        : `I published a new update in ${topicLabel(normalizedTopic, 'en').toLowerCase()}.`,
      whyRelevant: fileSummary
        ? `It affects ${topicLabel(normalizedTopic, 'en').toLowerCase()} on johanscv.dk, including ${fileSummary}.`
        : `It keeps ${topicLabel(normalizedTopic, 'en').toLowerCase()} on johanscv.dk current and easier to review.`,
      link,
      linkLabel: `Open ${topicLabel(normalizedTopic, 'en')}`,
      generationMode: 'fallback'
    }
  }

  return {
    subject: fallbackSubject(normalizedTopic, latestCommit, 'dk'),
    whatChanged: latestCommit
      ? `Seneste ændring: ${latestCommit}.`
      : `Jeg har publiceret en ny opdatering i ${topicLabel(normalizedTopic, 'dk').toLowerCase()}.`,
    whyRelevant: fileSummary
      ? `Det påvirker ${topicLabel(normalizedTopic, 'dk').toLowerCase()} på johanscv.dk, herunder ${fileSummary}.`
      : `Det holder ${topicLabel(normalizedTopic, 'dk').toLowerCase()} på johanscv.dk opdateret og lettere at gennemgå.`,
    link,
    linkLabel: `Åbn ${topicLabel(normalizedTopic, 'dk')}`,
    generationMode: 'fallback'
  }
}

export async function generateBroadcastDraft({
  client = null,
  model = 'gpt-4.1-mini',
  locale = 'dk',
  topic,
  siteBaseUrl = '',
  commitSubjects = [],
  files = [],
  diffText = '',
  requestTimeoutMs = 12_000,
  withTimeout
} = {}) {
  const fallbackDraft = buildFallbackBroadcastDraft({
    locale,
    topic,
    commitSubjects,
    files,
    siteBaseUrl
  })

  if (!client || typeof withTimeout !== 'function') {
    return fallbackDraft
  }

  const normalizedTopic = AUTO_BROADCAST_TOPICS.includes(topic) ? topic : 'projects'
  const normalizedLocale = locale === 'en' ? 'en' : 'dk'
  const prompt = [
    'Write one concise website-update email draft as strict JSON.',
    'The JSON keys must be: subject, whatChanged, whyRelevant, linkLabel.',
    'Use only facts that can be supported by the provided commit summaries, changed files, and diff excerpt.',
    'Do not invent features, outcomes, or deployment details.',
    'Write naturally for email subscribers, slightly clearer and longer than a git commit subject.',
    normalizedLocale === 'dk'
      ? 'Write in Danish. Keep subject under 90 characters. Keep both body fields to 1-2 short sentences each.'
      : 'Write in English. Keep subject under 90 characters. Keep both body fields to 1-2 short sentences each.',
    `Topic: ${topicLabel(normalizedTopic, normalizedLocale)}`,
    `Direct link: ${resolveTopicLink(siteBaseUrl, normalizedTopic)}`,
    `Commit subjects:\n${commitSubjects.map((subject) => `- ${subject}`).join('\n') || '- none provided'}`,
    `Changed files:\n${files.map((file) => `- ${file}`).join('\n') || '- none provided'}`,
    `Diff excerpt:\n${diffText || '(no diff excerpt provided)'}`,
    `Fallback draft:\n${JSON.stringify(fallbackDraft, null, 2)}`
  ].join('\n\n')

  try {
    const response = await withTimeout(
      client.responses.create({
        model,
        instructions:
          'You write truthful update emails for Johan Niemann Husbjerg. Return only strict JSON and keep it compact.',
        input: prompt
      }),
      requestTimeoutMs
    )

    const parsed = parseDraftJson(response.output_text || '')
    if (!parsed) {
      return fallbackDraft
    }

    return {
      subject: coerceField(parsed.subject, fallbackDraft.subject, 90),
      whatChanged: coerceField(parsed.whatChanged, fallbackDraft.whatChanged, 280),
      whyRelevant: coerceField(parsed.whyRelevant, fallbackDraft.whyRelevant, 280),
      link: fallbackDraft.link,
      linkLabel: coerceField(parsed.linkLabel, fallbackDraft.linkLabel, 60),
      generationMode: 'openai'
    }
  } catch {
    return fallbackDraft
  }
}

function matchesTopicRule(topic, filePath) {
  const rules = TOPIC_PATH_RULES[topic] || []
  const normalizedPath = String(filePath || '').trim()
  return rules.some((rule) => normalizedPath === rule || normalizedPath.startsWith(rule))
}

function fallbackSubject(topic, latestCommit, locale) {
  const topicName = topicLabel(topic, locale)
  if (latestCommit) {
    const trimmedCommit = latestCommit.replace(/\.+$/, '').trim()
    const maxLength = locale === 'en' ? 78 : 72
    const candidate =
      locale === 'en' ? `${topicName}: ${trimmedCommit}` : `${topicName}: ${trimmedCommit}`
    return candidate.slice(0, maxLength)
  }
  return locale === 'en' ? `${topicName} update on johanscv.dk` : `${topicName} opdatering pa johanscv.dk`
}

function topicLabel(topic, locale) {
  const normalizedLocale = locale === 'en' ? 'en' : 'dk'
  if (topic === 'resume') {
    return normalizedLocale === 'en' ? 'Resume' : 'CV'
  }
  if (topic === 'interactive_services') {
    return normalizedLocale === 'en' ? 'Interactive services' : 'Interaktive services'
  }
  return normalizedLocale === 'en' ? 'Projects' : 'Projekter'
}

function shortFileName(filePath) {
  const parts = String(filePath || '').split('/')
  return parts[parts.length - 1] || filePath
}

function parseDraftJson(rawValue) {
  const text = String(rawValue || '').trim()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {}

  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return null

  try {
    return JSON.parse(match[0])
  } catch {
    return null
  }
}

function coerceField(value, fallback, maxLength) {
  const normalized = String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!normalized) return fallback
  return normalized.slice(0, maxLength)
}
