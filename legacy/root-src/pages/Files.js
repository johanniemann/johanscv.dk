import { Section } from '../components/Section.js'
import { FileScroller, bindFileScroller } from '../components/FileScroller.js'

export function render({ t }) {
  return `
    <main class="page-stack">
      ${Section({ id: 'files', title: t.files.title, body: t.files.intro })}
      ${FileScroller()}
    </main>
  `
}

export function mount() {
  bindFileScroller()
}
