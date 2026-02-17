import projects from '../data/projects.json'

const PROJECT_DETAIL_PREFIX = '/projects/'

export function render({ t, language, route = '/projects' }) {
  const projectId = getProjectIdFromRoute(route)

  if (projectId) {
    return renderProjectDetail({ t, language, projectId })
  }

  return renderProjectsIndex({ t, language })
}

function renderProjectsIndex({ t, language }) {
  return `
    <main class="page-stack">
      <section class="content-section section-reveal" id="projects">
        <h2 class="section-title">${t.projects.title}</h2>
        <p class="section-body">${t.projects.intro}</p>
      </section>
      <section class="projects-grid section-reveal" aria-label="${t.projects.title}">
        ${projects.map((project) => projectCard(project, language, t)).join('')}
      </section>
    </main>
  `
}

function renderProjectDetail({ t, language, projectId }) {
  const project = projects.find((entry) => entry.id === projectId)

  if (!project) {
    return `
      <main class="page-stack">
        <section class="content-section section-reveal" id="project-detail-missing">
          <h2 class="section-title">${t.projects.notFoundTitle}</h2>
          <p class="section-body">${t.projects.notFoundBody}</p>
          <a class="projects-cta project-back-link" href="/projects" data-link>${t.projects.backToProjects}</a>
        </section>
      </main>
    `
  }

  const title = project.title[language] || project.title.en
  const summary = project.summary[language] || project.summary.en
  const details = resolveDetailParagraphs(project, language, summary)

  return `
    <main class="page-stack">
      <section class="content-section section-reveal" id="project-detail-intro">
        <p class="project-detail-kicker">${t.projects.detailKicker}</p>
        <h2 class="section-title">${title}</h2>
        <p class="section-body">${summary}</p>
      </section>

      <section class="project-card project-detail-card section-reveal" aria-label="${title}">
        <h3 class="project-title">${t.projects.detailHeading}</h3>
        <div class="project-detail-body">
          ${details.map((paragraph) => `<p>${paragraph}</p>`).join('')}
        </div>
        <div class="project-tags">
          ${project.tags.map((tag) => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
      </section>

      <section class="content-section section-reveal" id="project-detail-navigation">
        <h3 class="section-title">${t.projects.exploreOtherHeading}</h3>
        <a class="projects-cta project-back-link" href="/projects" data-link>${t.projects.backToProjects}</a>
      </section>
    </main>
  `
}

function projectCard(project, language, t) {
  const title = project.title[language] || project.title.en
  const summary = project.summary[language] || project.summary.en
  const detailPath = `/projects/${encodeURIComponent(project.id)}`

  return `
    <article class="project-card">
      <h3 class="project-title">${title}</h3>
      <p class="project-summary">${summary}</p>
      <div class="project-tags">
        ${project.tags.map((tag) => `<span class="project-tag">${tag}</span>`).join('')}
      </div>
      <a class="projects-cta project-read-more" href="${detailPath}" data-link aria-label="${t.projects.readMore}: ${title}">
        ${t.projects.readMore}
      </a>
    </article>
  `
}

function getProjectIdFromRoute(route = '') {
  if (!route.startsWith(PROJECT_DETAIL_PREFIX)) return ''

  const rawProjectId = route.slice(PROJECT_DETAIL_PREFIX.length).replace(/\/+$/, '').trim()
  if (!rawProjectId) return ''

  try {
    return decodeURIComponent(rawProjectId)
  } catch {
    return rawProjectId
  }
}

function resolveDetailParagraphs(project, language, summary) {
  const localized = project.details?.[language] || project.details?.en
  if (Array.isArray(localized) && localized.length > 0) return localized
  return [summary]
}
