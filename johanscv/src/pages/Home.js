import projects from '../data/projects.json'
import { Hero } from '../components/Hero.js'
import { AskJohan, bindAskJohan } from '../features/ask-johan/AskJohanWidget.js'
import { FileScroller, bindFileScroller } from '../components/FileScroller.js'

export function render({ t, language }) {
  return `
    <main class="page-stack">
      ${Hero({ t })}
      <section class="content-section section-reveal" id="projects-preview">
        <h2 class="section-title">${t.projects.previewTitle}</h2>
        <p class="section-body">${t.projects.previewIntro}</p>
        <div class="projects-grid projects-grid-compact">
          ${projects.slice(0, 2).map((project) => projectCard(project, language)).join('')}
        </div>
        <a class="projects-cta" href="/projects" data-link>${t.projects.cta}</a>
      </section>

      <section class="content-section section-reveal" id="resume-preview">
        <h2 class="section-title">${t.resume.previewTitle}</h2>
        <p class="section-body">${t.resume.previewIntro}</p>
        <a class="projects-cta" href="/resume" data-link>${t.resume.cta}</a>
      </section>

      ${AskJohan({ t })}
      ${FileScroller({ t, language })}
    </main>
  `
}

export function mount({ language }) {
  bindAskJohan(language)
  bindFileScroller()
}

function projectCard(project, language) {
  const title = project.title[language] || project.title.en
  const summary = project.summary[language] || project.summary.en

  return `
    <article class="project-card">
      <h3 class="project-title">${title}</h3>
      <p class="project-summary">${summary}</p>
    </article>
  `
}
