export function FileCard(file) {
  return `
    <article class="file-card" tabindex="0">
      <h3 class="file-title">${file.title}</h3>
      <p class="file-description">${file.description}</p>
      <a class="file-download" href="${file.url}" download aria-label="Download ${file.title}">↧</a>
    </article>
  `
}
