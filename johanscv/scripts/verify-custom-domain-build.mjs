import { readFileSync } from 'node:fs'

const indexHtml = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')

if (indexHtml.includes('/johanscv.dk/assets/')) {
  console.error('[verify-custom-domain-build] Build uses /johanscv.dk/ asset paths. Refusing deploy.')
  process.exit(1)
}

if (!indexHtml.includes('/assets/index-')) {
  console.error('[verify-custom-domain-build] Could not find expected /assets/index- bundle path in dist/index.html.')
  process.exit(1)
}

console.log('[verify-custom-domain-build] OK')
