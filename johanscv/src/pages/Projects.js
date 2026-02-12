import projects from '../data/projects.json'

export function render({ t, language }) {
  return `
    <main class="page-stack">
      <section class="content-section section-reveal" id="projects">
        <h2 class="section-title">${t.projects.title}</h2>
        <p class="section-body">${t.projects.intro}</p>
      </section>
      <section class="projects-grid section-reveal" aria-label="${t.projects.title}">
        ${projects.map((project) => projectCard(project, language)).join('')}
      </section>
    </main>
  `
}

function projectCard(project, language) {
  const title = project.title[language] || project.title.en
  const summary = project.summary[language] || project.summary.en

  return `
    <article class="project-card">
      <h3 class="project-title">${title}</h3>
      <p class="project-summary">${summary}</p>
      <div class="project-tags">
        ${project.tags.map((tag) => `<span class="project-tag">${tag}</span>`).join('')}
      </div>
    </article>
  `
}
