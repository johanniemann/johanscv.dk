import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const checks = [
  {
    file: 'src/router.js',
    contains: [
      "'/'",
      "'/projects'",
      "'/resume'",
      "'/contact'",
      "'/playground'",
      "'/quiz'",
      "'/quiz/geojohan'"
    ]
  },
  {
    file: 'src/features/geojohan/GeoJohanPage.js',
    contains: ['new maps.StreetViewPanorama', "document.querySelector('#geojohan-map')", 'scoreDistance(']
  },
  {
    file: 'public/404.html',
    contains: ["'?p='", 'window.location.replace(base +']
  }
]

let hasFailures = false

for (const check of checks) {
  const absolutePath = path.join(rootDir, check.file)

  if (!fs.existsSync(absolutePath)) {
    hasFailures = true
    console.error(`[smoke] Missing expected file: ${check.file}`)
    continue
  }

  const content = fs.readFileSync(absolutePath, 'utf8')
  for (const expectedSnippet of check.contains) {
    if (!content.includes(expectedSnippet)) {
      hasFailures = true
      console.error(`[smoke] ${check.file} is missing expected snippet: ${expectedSnippet}`)
    }
  }
}

if (hasFailures) {
  process.exitCode = 1
} else {
  console.log('[smoke] Frontend route and feature smoke checks passed.')
}
