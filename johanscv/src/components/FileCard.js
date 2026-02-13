export function FileCard(file, language, isClone = false) {
  const title = localize(file.title, language)
  const description = localize(file.description, language)
  const href = resolveAssetPath(file.url)
  const cloneAttributes = isClone ? 'tabindex="-1"' : 'tabindex="0"'
  const cloneClass = isClone ? 'file-card file-card-clone' : 'file-card'
  const actionAttributes = buildActionAttributes(file, isClone)
  const actionIcon = actionIconMarkup(file.icon)
  const actionLabel = localize(file.actionLabel, language) || defaultActionLabel(file.actionType, title, language)

  return `
    <article class="${cloneClass}" ${cloneAttributes}>
      <h3 class="file-title">${title}</h3>
      <p class="file-description">${description}</p>
      <a class="file-action" href="${href}" ${actionAttributes} aria-label="${actionLabel}">
        <span class="file-action-icon" aria-hidden="true">${actionIcon}</span>
        <span class="file-action-text">${actionLabel}</span>
      </a>
    </article>
  `
}

function resolveAssetPath(path) {
  if (!path.startsWith('/')) return path
  return `${import.meta.env.BASE_URL}${path.slice(1)}`
}

function buildActionAttributes(file, isClone) {
  const attributes = []

  if (file.actionType === 'download') {
    attributes.push('download')
  } else {
    attributes.push('target="_blank"', 'rel="noopener noreferrer"')
  }

  if (isClone) {
    attributes.push('tabindex="-1"')
  }

  return attributes.join(' ')
}

function defaultActionLabel(actionType, title, language) {
  if (actionType === 'download') return `Download ${title}`
  return language === 'dk' ? `Gå til ${title}` : `Open ${title}`
}

function actionIconMarkup(icon) {
  if (icon === 'linkedin') return 'in'
  if (icon === 'github') return githubIcon()
  if (icon === 'location') return mapsIcon()
  return downloadIcon()
}

function githubIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.21.68-.48v-1.7c-2.78.6-3.37-1.17-3.37-1.17-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.52 1.03 1.52 1.03.89 1.52 2.33 1.08 2.9.82.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.41.11 2.66.64.7 1.02 1.59 1.02 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  `
}

function mapsIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2.25a6.75 6.75 0 0 0-6.75 6.75c0 4.98 6.05 11.86 6.3 12.15a.6.6 0 0 0 .9 0c.25-.29 6.3-7.17 6.3-12.15A6.75 6.75 0 0 0 12 2.25Zm0 9.75a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
      />
    </svg>
  `
}

function downloadIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M11.25 3.75a.75.75 0 0 1 1.5 0v9.69l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V3.75Z"/>
      <path d="M4.5 17.25a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1-.75-.75Z"/>
    </svg>
  `
}

function localize(value, language) {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') {
    return value[language] || value.en || Object.values(value)[0] || ''
  }
  return ''
}
