export function FileCard(file, isClone = false) {
  const href = resolveAssetPath(file.url)
  const cloneAttributes = isClone ? 'tabindex="-1"' : 'tabindex="0"'
  const cloneClass = isClone ? 'file-card file-card-clone' : 'file-card'

  return `
    <article class="${cloneClass}" ${cloneAttributes}>
      <h3 class="file-title">${file.title}</h3>
      <p class="file-description">${file.description}</p>
      <a class="file-download" href="${href}" download aria-label="Download ${file.title}">
        <span class="file-download-icon">↧</span>
      </a>
    </article>
  `
}

function resolveAssetPath(path) {
  if (!path.startsWith('/')) return path
  return `${import.meta.env.BASE_URL}${path.slice(1)}`
}
