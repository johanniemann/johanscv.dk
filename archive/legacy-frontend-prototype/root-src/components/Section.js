export function Section({ title, body, id }) {
  return `
    <section id="${id}" class="content-section section-reveal">
      <h2 class="section-title">${title}</h2>
      <p class="section-body">${body}</p>
    </section>
  `
}
