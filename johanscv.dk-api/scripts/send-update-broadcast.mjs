import 'dotenv/config'
import { readRuntimeConfig } from '../src/config/runtime-config.js'
import { buildUpdateBroadcastEmail, isValidUpdateTopic } from '../src/features/updates-email-content.js'
import { createResendUpdatesSignupService } from '../src/features/resend-client.js'

const HELP_TEXT = `
Usage:
  npm run updates:broadcast -- --topic <projects|resume|interactive_services> --subject "<subject>" --what "<what changed>" --why "<why it matters>" --link "<https://...>" [--locale <dk|en>] [--label "<cta label>"] [--dry-run]

Examples:
  npm run updates:broadcast -- --topic projects --locale dk --subject "Nyt projekt pa johanscv.dk" --what "Jeg har publiceret et nyt case study." --why "Det viser den nyeste retning i mit arbejde." --link "https://johanscv.dk/projects"

  npm run updates:broadcast -- --topic interactive_services --locale en --subject "GeoJohan just got a new round" --what "I added a new playground iteration to GeoJohan." --why "It shows how I work with interaction, maps, and feedback loops." --link "https://johanscv.dk/playground"
`.trim()

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) {
    console.log(HELP_TEXT)
    process.exit(0)
  }

  const topic = String(args.topic || '').trim()
  const locale = args.locale === 'en' ? 'en' : 'dk'
  const subject = String(args.subject || '').trim()
  const whatChanged = String(args.what || '').trim()
  const whyRelevant = String(args.why || '').trim()
  const link = String(args.link || '').trim()
  const linkLabel = String(args.label || '').trim()
  const dryRun = Boolean(args['dry-run'])

  validateRequiredArgument(isValidUpdateTopic(topic), 'A valid --topic is required.')
  validateRequiredArgument(Boolean(subject), '--subject is required.')
  validateRequiredArgument(Boolean(whatChanged), '--what is required.')
  validateRequiredArgument(Boolean(whyRelevant), '--why is required.')
  validateRequiredArgument(isHttpUrl(link), '--link must be a valid http/https URL.')

  const preview = buildUpdateBroadcastEmail({
    locale,
    topic,
    subject,
    whatChanged,
    whyRelevant,
    link,
    linkLabel
  })

  if (dryRun) {
    console.log('Dry run only. No email was sent.')
    console.log(`Topic: ${topic}`)
    console.log(`Locale: ${locale}`)
    console.log(`Subject: ${preview.subject}`)
    console.log(`Link: ${link}`)
    console.log('')
    console.log(preview.text)
    return
  }

  const config = readRuntimeConfig(process.env)
  const updatesSignupService = createResendUpdatesSignupService({
    ...config.updatesSignup,
    fetchImpl: fetch
  })

  if (!updatesSignupService.broadcastEnabled) {
    throw new Error(
      'Updates broadcast sending is not configured. Set RESEND_API_KEY, RESEND_TOPIC_* IDs, RESEND_UPDATES_FROM_EMAIL, and RESEND_UPDATES_SEGMENT_ID.'
    )
  }

  const result = await updatesSignupService.sendUpdateBroadcast({
    topic,
    locale,
    subject,
    whatChanged,
    whyRelevant,
    link,
    linkLabel
  })

  console.log(`Broadcast sent successfully. ID: ${result.id || 'unknown'}`)
}

function parseArgs(argv) {
  const parsed = {}

  for (let index = 0; index < argv.length; index += 1) {
    const entry = argv[index]
    if (!entry.startsWith('--')) continue

    const key = entry.slice(2)
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

function validateRequiredArgument(condition, message) {
  if (!condition) {
    throw new Error(`${message}\n\n${HELP_TEXT}`)
  }
}

function isHttpUrl(value) {
  try {
    const parsed = new URL(String(value || '').trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
