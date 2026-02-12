import { Section } from '../components/Section.js'

export function render({ t }) {
  return `
    <main class="page-stack">
      ${Section({ id: 'projects', title: t.projects.title, body: t.projects.intro })}
    </main>
  `
}
