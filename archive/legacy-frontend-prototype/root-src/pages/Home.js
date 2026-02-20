import { Hero } from '../components/Hero.js'
import { AskJohan, bindAskJohan } from '../components/AskJohan.js'
import { FileScroller, bindFileScroller } from '../components/FileScroller.js'

export function render({ t }) {
  return `
    <main class="page-stack">
      ${Hero({ t })}
      ${AskJohan({ t })}
      ${FileScroller()}
    </main>
  `
}

export function mount() {
  bindAskJohan()
  bindFileScroller()
}
