import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import OpenAI from 'openai'
import { fileURLToPath } from 'node:url'
import { readRuntimeConfig } from '../src/config/runtime-config.js'
import { createResendUpdatesSignupService } from '../src/features/resend-client.js'
import {
  detectTopicsFromFiles,
  selectTopicFiles,
  generateBroadcastDraft
} from '../src/features/updates-auto-broadcast.js'
import { withTimeout } from '../src/shared/with-timeout.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const API_ROOT_DIR = path.resolve(__dirname, '..')
const REPO_ROOT_DIR = path.resolve(API_ROOT_DIR, '..')
const DEFAULT_STATE_FILE = path.join(API_ROOT_DIR, '.updates-broadcast-state.json')
const DEFAULT_REQUEST_TIMEOUT_MS = 12_000
const DEFAULT_DIFF_TEXT_LIMIT = 1_500

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const dryRun = Boolean(args['dry-run'])
  const allowDirty = Boolean(args['allow-dirty'])
  const stateFile = path.resolve(API_ROOT_DIR, String(args['state-file'] || DEFAULT_STATE_FILE))
  const config = readRuntimeConfig(process.env)
  const locale = args.locale === 'en' ? 'en' : config.updatesBroadcast.locale
  const source = normalizeSource(args.source || process.env.UPDATES_AUTOMATION_SOURCE || 'deploy')
  const explicitToCommit = String(args.to || process.env.GITHUB_SHA || '').trim()
  const endpoint = String(args['automation-endpoint'] || process.env.UPDATES_AUTOMATION_ENDPOINT || '').trim()
  const automationToken = String(args['automation-token'] || process.env.UPDATES_AUTOMATION_TOKEN || '').trim()

  const branch = git(['branch', '--show-current']).trim()
  if (branch !== 'main' && !dryRun) {
    console.log(`[updates:auto-broadcast] Skipped: current branch is ${branch || 'detached'}, expected main.`)
    return
  }

  if (!allowDirty && isWorktreeDirty()) {
    console.log('[updates:auto-broadcast] Skipped: worktree is dirty. Commit your changes before auto-generating deploy emails.')
    return
  }

  const headCommit = explicitToCommit || git(['rev-parse', 'HEAD']).trim()
  const previousState = readStateFile(stateFile)
  if (!dryRun && previousState.lastBroadcastedCommit && previousState.lastBroadcastedCommit === headCommit) {
    console.log('[updates:auto-broadcast] Skipped: this commit has already been processed locally.')
    return
  }

  const fromCommit = resolveFromCommit({
    explicitFromCommit: String(args.from || '').trim(),
    headCommit,
    previousState,
    githubPushBeforeCommit: readGitHubPushBeforeCommit()
  })

  const changedFiles = listChangedFiles({ fromCommit, toCommit: headCommit })
  const affectedTopics = detectTopicsFromFiles(changedFiles)

  if (!affectedTopics.length) {
    console.log('[updates:auto-broadcast] No matching Projects/Resume/Interactive services changes detected. No email sent.')
    if (!dryRun) {
      writeStateFile(stateFile, {
        lastBroadcastedCommit: headCommit,
        updatedAt: new Date().toISOString(),
        mode: endpoint && automationToken ? 'endpoint' : 'direct'
      })
    }
    return
  }

  const siteBaseUrl = String(
    args['site-base-url'] || config.updatesBroadcast.siteBaseUrl || config.updatesSignup.siteBaseUrl || 'https://johanscv.dk'
  ).trim()
  const topicDetails = buildTopicDetails({
    affectedTopics,
    changedFiles,
    fromCommit,
    toCommit: headCommit
  })
  const payload = {
    dryRun,
    headCommit,
    locale,
    source,
    siteBaseUrl,
    changedFiles: changedFiles.slice(0, 30),
    commitSubjects: listCommitSubjects({ fromCommit, toCommit: headCommit }).slice(0, 6),
    topicDetails
  }

  if (endpoint && automationToken) {
    const result = await postToAutomationEndpoint({
      endpoint,
      automationToken,
      payload
    })

    printEndpointResult(result)
    if (!dryRun) {
      writeStateFile(stateFile, {
        lastBroadcastedCommit: headCommit,
        updatedAt: new Date().toISOString(),
        mode: 'endpoint',
        source,
        sentTopics: Array.isArray(result.sent) ? result.sent.map((entry) => entry.topic).filter(Boolean) : []
      })
    }
    return
  }

  await runLocalDirectBroadcast({
    config,
    dryRun,
    headCommit,
    locale,
    siteBaseUrl,
    stateFile,
    source,
    topicDetails
  })
}

function parseArgs(argv) {
  const parsed = {}
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (!value.startsWith('--')) continue
    const key = value.slice(2)
    const next = argv[index + 1]
    if (!next || next.startsWith('--')) {
      parsed[key] = true
      continue
    }
    parsed[key] = next
    index += 1
  }
  return parsed
}

function git(args) {
  return execFileSync('git', args, {
    cwd: REPO_ROOT_DIR,
    encoding: 'utf8'
  })
}

function isWorktreeDirty() {
  return Boolean(git(['status', '--porcelain']).trim())
}

function readStateFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return {
      lastBroadcastedCommit: ''
    }
  }
}

function writeStateFile(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

function resolveFromCommit({ explicitFromCommit, headCommit, previousState, githubPushBeforeCommit }) {
  if (explicitFromCommit) {
    return explicitFromCommit
  }

  if (githubPushBeforeCommit && githubPushBeforeCommit !== headCommit) {
    return githubPushBeforeCommit
  }

  const normalizedLastCommit = String(previousState?.lastBroadcastedCommit || '').trim()
  if (normalizedLastCommit && normalizedLastCommit !== headCommit) {
    try {
      git(['merge-base', '--is-ancestor', normalizedLastCommit, headCommit])
      return normalizedLastCommit
    } catch {}
  }

  try {
    return git(['rev-parse', `${headCommit}^`]).trim()
  } catch {
    return ''
  }
}

function readGitHubPushBeforeCommit() {
  const eventName = String(process.env.GITHUB_EVENT_NAME || '').trim()
  const eventPath = String(process.env.GITHUB_EVENT_PATH || '').trim()
  if (eventName !== 'push' || !eventPath) return ''

  try {
    const parsed = JSON.parse(fs.readFileSync(eventPath, 'utf8'))
    const before = String(parsed?.before || '').trim()
    if (!before || /^0+$/.test(before)) return ''
    return before
  } catch {
    return ''
  }
}

function listChangedFiles({ fromCommit, toCommit }) {
  const output = fromCommit
    ? git(['diff', '--name-only', `${fromCommit}..${toCommit}`])
    : git(['show', '--pretty=format:', '--name-only', toCommit])

  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function listCommitSubjects({ fromCommit, toCommit, files = [] }) {
  const rangeArgs = fromCommit ? [`${fromCommit}..${toCommit}`] : [toCommit]
  const fileArgs = files.length ? ['--', ...files] : []
  const output = git(['log', '--format=%s', ...rangeArgs, ...fileArgs])

  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 6)
}

function readDiffText({ fromCommit, toCommit, files = [] }) {
  if (!files.length) return ''

  const diffArgs = fromCommit
    ? ['diff', '--unified=0', '--no-color', `${fromCommit}..${toCommit}`, '--', ...files]
    : ['show', '--unified=0', '--no-color', toCommit, '--', ...files]

  const output = git(diffArgs)
  return output.slice(0, DEFAULT_DIFF_TEXT_LIMIT)
}

function buildTopicDetails({ affectedTopics, changedFiles, fromCommit, toCommit }) {
  return affectedTopics.map((topic) => {
    const files = selectTopicFiles(changedFiles, topic).slice(0, 20)
    return {
      topic,
      files,
      commitSubjects: listCommitSubjects({ fromCommit, toCommit, files }).slice(0, 6),
      diffText: readDiffText({ fromCommit, toCommit, files })
    }
  })
}

async function postToAutomationEndpoint({ endpoint, automationToken, payload }) {
  const targetUrl = new URL('/api/updates-signup/auto-broadcast', normalizeAutomationEndpoint(endpoint)).toString()
  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-updates-automation-token': automationToken
    },
    body: JSON.stringify(payload)
  })

  const data = await readJsonResponse(response)
  if (!response.ok) {
    throw new Error(data.answer || data.message || `Updates automation endpoint failed with ${response.status}.`)
  }
  return data
}

function normalizeAutomationEndpoint(value) {
  const normalized = String(value || '').trim()
  if (!normalized) {
    throw new Error('UPDATES_AUTOMATION_ENDPOINT is required for endpoint mode.')
  }

  const parsed = new URL(normalized)
  if (parsed.pathname && parsed.pathname !== '/') {
    parsed.pathname = '/'
    parsed.search = ''
    parsed.hash = ''
  }
  return parsed.toString()
}

async function readJsonResponse(response) {
  try {
    return await response.json()
  } catch {
    return {}
  }
}

function printEndpointResult(result) {
  if (!Array.isArray(result.sent) || !result.sent.length) {
    console.log('[updates:auto-broadcast] Endpoint completed with no sent topics.')
  }

  result.sent?.forEach((entry) => {
    console.log(`\n[updates:auto-broadcast] Topic: ${entry.topic}`)
    console.log(`Subject: ${entry.subject}`)
    if (entry.whatChanged) {
      console.log(`What changed: ${entry.whatChanged}`)
    }
    if (entry.whyRelevant) {
      console.log(`Why relevant: ${entry.whyRelevant}`)
    }
    if (entry.link) {
      console.log(`Link: ${entry.link}`)
    }
    if (entry.broadcastId) {
      console.log(`Broadcast ID: ${entry.broadcastId}`)
    }
    console.log(`Generation: ${entry.generationMode || 'fallback'}`)
  })

  result.skipped?.forEach((entry) => {
    console.log(`[updates:auto-broadcast] Skipped ${entry.topic}: ${entry.reason}`)
  })
}

async function runLocalDirectBroadcast({ config, dryRun, headCommit, locale, siteBaseUrl, stateFile, source, topicDetails }) {
  const updatesSignupService = createResendUpdatesSignupService({
    ...config.updatesSignup,
    fetchImpl: fetch
  })
  const openAiClient = config.apiKey ? new OpenAI({ apiKey: config.apiKey }) : null

  if (!dryRun && !updatesSignupService.broadcastEnabled) {
    throw new Error(
      'Updates auto-broadcast is not configured. Set RESEND_API_KEY, RESEND_UPDATES_FROM_EMAIL, RESEND_UPDATES_SEGMENT_ID, and RESEND_TOPIC_* IDs.'
    )
  }

  const sentTopics = []

  for (const topicDetail of topicDetails) {
    const draft = await generateBroadcastDraft({
      client: openAiClient,
      model: config.model,
      locale,
      topic: topicDetail.topic,
      siteBaseUrl,
      commitSubjects: topicDetail.commitSubjects,
      files: topicDetail.files,
      diffText: topicDetail.diffText,
      requestTimeoutMs: DEFAULT_REQUEST_TIMEOUT_MS,
      withTimeout
    })

    if (dryRun) {
      console.log(`\n[updates:auto-broadcast] Topic: ${topicDetail.topic}`)
      console.log(`Subject: ${draft.subject}`)
      console.log(`What changed: ${draft.whatChanged}`)
      console.log(`Why relevant: ${draft.whyRelevant}`)
      console.log(`Link: ${draft.link}`)
      console.log(`Generation: ${draft.generationMode}`)
      continue
    }

    const result = await updatesSignupService.sendUpdateBroadcast({
      topic: topicDetail.topic,
      locale,
      subject: draft.subject,
      whatChanged: draft.whatChanged,
      whyRelevant: draft.whyRelevant,
      link: draft.link,
      linkLabel: draft.linkLabel
    })

    sentTopics.push({
      topic: topicDetail.topic,
      id: result.id || '',
      generationMode: draft.generationMode || 'fallback'
    })
    console.log(`[updates:auto-broadcast] Sent ${topicDetail.topic} broadcast (${result.id || 'unknown id'}).`)
  }

  if (!dryRun) {
    writeStateFile(stateFile, {
      lastBroadcastedCommit: headCommit,
      updatedAt: new Date().toISOString(),
      mode: 'direct',
      source,
      topics: sentTopics
    })
  }
}

function normalizeSource(value) {
  return String(value || 'deploy')
    .trim()
    .toLowerCase()
    .slice(0, 64)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
