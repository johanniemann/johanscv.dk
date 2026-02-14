import { AskJohan, bindAskJohan } from '../components/AskJohan.js'

export function render({ t, language }) {
  return `
    <main class="page-stack">
      <section class="content-section section-reveal" id="playground">
        <h2 class="section-title">${t.playground.title}</h2>
        <p class="section-body">${t.playground.intro}</p>
      </section>

      ${AskJohan({ t })}

      <section class="content-section section-reveal" id="playground-more">
        <h3 class="section-title">${t.playground.moreToComeTitle}</h3>
        <p class="section-body">${t.playground.moreToComeBody}</p>
      </section>
    </main>
  `
}

export function mount({ language }) {
  bindAskJohan(language)
}
