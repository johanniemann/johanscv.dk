import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const API_DIR = path.resolve(__dirname, '..')
const DEFAULT_ZIP_PATH = '/tmp/ask-johan-api-with-modules.zip'

function run(command, args, cwd = API_DIR) {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
    env: process.env
  })
}

function main() {
  const resourceGroup = String(process.env.AZURE_RESOURCE_GROUP || 'johanscv-rg-no').trim()
  const webAppName = String(process.env.AZURE_WEBAPP_NAME || 'johanscv-api-johu0002-no').trim()
  const zipPath = String(process.env.AZURE_DEPLOY_ZIP_PATH || DEFAULT_ZIP_PATH).trim()
  const siteBaseUrl = String(process.env.UPDATES_BROADCAST_SITE_BASE_URL || 'https://johanscv.dk').trim()

  run('npm', ['ci'])
  run('rm', ['-f', zipPath], API_DIR)
  run(
    'zip',
    [
      '-r',
      zipPath,
      '.',
      '-x',
      '.git/*',
      '.env',
      'johan-context.private.md',
      '.updates-broadcast-state.json'
    ],
    API_DIR
  )
  run('az', ['webapp', 'deploy', '--resource-group', resourceGroup, '--name', webAppName, '--src-path', zipPath, '--type', 'zip'])

  if (String(process.env.UPDATES_AUTO_BROADCAST || '').trim().toLowerCase() === 'false') {
    console.log('[deploy:azure] Updates auto-broadcast disabled via UPDATES_AUTO_BROADCAST=false.')
    return
  }

  run('npm', ['run', 'updates:auto-broadcast', '--', '--source', 'azure-api-deploy', '--site-base-url', siteBaseUrl], API_DIR)
}

main()
