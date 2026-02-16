import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const distAssetsDir = path.resolve(process.cwd(), 'dist/assets')

const budgets = {
  jsRawPerFile: Number(process.env.BUNDLE_BUDGET_JS_RAW_PER_FILE ?? 133120),
  jsGzipPerFile: Number(process.env.BUNDLE_BUDGET_JS_GZIP_PER_FILE ?? 46080),
  cssRawPerFile: Number(process.env.BUNDLE_BUDGET_CSS_RAW_PER_FILE ?? 61440),
  cssGzipPerFile: Number(process.env.BUNDLE_BUDGET_CSS_GZIP_PER_FILE ?? 16384),
  jsRawTotal: Number(process.env.BUNDLE_BUDGET_JS_RAW_TOTAL ?? 225280),
  jsGzipTotal: Number(process.env.BUNDLE_BUDGET_JS_GZIP_TOTAL ?? 81920),
  cssRawTotal: Number(process.env.BUNDLE_BUDGET_CSS_RAW_TOTAL ?? 92160),
  cssGzipTotal: Number(process.env.BUNDLE_BUDGET_CSS_GZIP_TOTAL ?? 24576)
}

if (!fs.existsSync(distAssetsDir)) {
  console.error('[bundle-budget] Missing dist/assets. Run `npm run build` first.')
  process.exit(1)
}

const files = fs.readdirSync(distAssetsDir).filter((name) => name.endsWith('.js') || name.endsWith('.css'))
if (files.length === 0) {
  console.error('[bundle-budget] No JS/CSS bundles found in dist/assets.')
  process.exit(1)
}

const totals = {
  jsRaw: 0,
  jsGzip: 0,
  cssRaw: 0,
  cssGzip: 0
}

const errors = []

for (const fileName of files) {
  const absoluteFile = path.join(distAssetsDir, fileName)
  const content = fs.readFileSync(absoluteFile)
  const rawSize = content.length
  const gzipSize = zlib.gzipSync(content, { level: zlib.constants.Z_BEST_COMPRESSION }).length
  const fileType = fileName.endsWith('.js') ? 'js' : 'css'

  if (fileType === 'js') {
    totals.jsRaw += rawSize
    totals.jsGzip += gzipSize
    if (rawSize > budgets.jsRawPerFile) {
      errors.push(`[bundle-budget] ${fileName} raw size ${rawSize} exceeds ${budgets.jsRawPerFile}`)
    }
    if (gzipSize > budgets.jsGzipPerFile) {
      errors.push(`[bundle-budget] ${fileName} gzip size ${gzipSize} exceeds ${budgets.jsGzipPerFile}`)
    }
  } else {
    totals.cssRaw += rawSize
    totals.cssGzip += gzipSize
    if (rawSize > budgets.cssRawPerFile) {
      errors.push(`[bundle-budget] ${fileName} raw size ${rawSize} exceeds ${budgets.cssRawPerFile}`)
    }
    if (gzipSize > budgets.cssGzipPerFile) {
      errors.push(`[bundle-budget] ${fileName} gzip size ${gzipSize} exceeds ${budgets.cssGzipPerFile}`)
    }
  }

  console.log(`[bundle-budget] ${fileName}: raw=${rawSize} bytes gzip=${gzipSize} bytes`)
}

if (totals.jsRaw > budgets.jsRawTotal) {
  errors.push(`[bundle-budget] JS total raw size ${totals.jsRaw} exceeds ${budgets.jsRawTotal}`)
}
if (totals.jsGzip > budgets.jsGzipTotal) {
  errors.push(`[bundle-budget] JS total gzip size ${totals.jsGzip} exceeds ${budgets.jsGzipTotal}`)
}
if (totals.cssRaw > budgets.cssRawTotal) {
  errors.push(`[bundle-budget] CSS total raw size ${totals.cssRaw} exceeds ${budgets.cssRawTotal}`)
}
if (totals.cssGzip > budgets.cssGzipTotal) {
  errors.push(`[bundle-budget] CSS total gzip size ${totals.cssGzip} exceeds ${budgets.cssGzipTotal}`)
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error)
  }
  process.exit(1)
}

console.log('[bundle-budget] OK')
