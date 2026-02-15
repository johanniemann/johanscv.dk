import { AskJohan, bindAskJohan } from '../components/AskJohan.js'
import { renderGeoJohanSection, mount as mountGeoJohan } from './GeoJohan.js'

export function render({ t }) {
  return `
    <main class="page-stack">
      <section class="content-section section-reveal" id="playground">
        <h2 class="section-title">${t.playground.title}</h2>
        <p class="section-body">${t.playground.intro}</p>
      </section>

      ${AskJohan({ t })}
      ${renderGeoJohanSection({ t })}

      <section class="content-section section-reveal" id="playground-more">
        <h3 class="section-title">${t.playground.moreToComeTitle}</h3>
        <p class="section-body">${t.playground.moreToComeBody}</p>
      </section>
    </main>
  `
}

export function mount({ language, t }) {
  bindAskJohan(language)
  mountGeoJohan({ t })
}
