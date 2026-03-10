import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const FRONTEND_DIR = path.resolve(__dirname, '..')
const API_DIR = path.resolve(FRONTEND_DIR, '..', 'johanscv.dk-api')

function run(command, args, cwd) {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: process.env
  })
}

function main() {
  run('./node_modules/.bin/gh-pages', ['-d', 'dist', '--no-history'], FRONTEND_DIR)

  if (String(process.env.UPDATES_AUTO_BROADCAST || '').trim().toLowerCase() === 'false') {
    console.log('[deploy] Updates auto-broadcast disabled via UPDATES_AUTO_BROADCAST=false.')
    return
  }

  run(
    'npm',
    ['run', 'updates:auto-broadcast', '--', '--source', 'frontend-gh-pages-deploy', '--site-base-url', 'https://johanscv.dk'],
    API_DIR
  )
}

main()
