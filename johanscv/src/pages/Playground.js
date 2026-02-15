import { AskJohan, bindAskJohan } from '../components/AskJohan.js'

export function render({ t }) {
  return `
    <main class="page-stack">
      <section class="content-section section-reveal" id="playground">
        <h2 class="section-title">${t.playground.title}</h2>
        <p class="section-body">${t.playground.intro}</p>
      </section>

      <section class="content-section section-reveal" id="playground-quizzes">
        <h3 class="section-title">${t.playground.quizHubTitle}</h3>
        <p class="section-body">${t.playground.quizHubIntro}</p>
        <div class="quiz-choice-grid">
          <article class="project-card quiz-choice-card">
            <h4 class="project-title">${t.playground.cards.askJohan.title}</h4>
            <p class="project-summary">${t.playground.cards.askJohan.subtitle}</p>
            <a class="projects-cta quiz-choice-action" href="#ask-johan">${t.playground.cards.askJohan.cta}</a>
          </article>

          <article class="project-card quiz-choice-card">
            <h4 class="project-title">${t.playground.cards.cityQuiz.title}</h4>
            <p class="project-summary">${t.playground.cards.cityQuiz.subtitle}</p>
            <button class="projects-cta quiz-choice-action is-disabled" type="button" disabled>
              ${t.playground.cards.cityQuiz.cta}
            </button>
          </article>

          <article class="project-card quiz-choice-card">
            <h4 class="project-title">${t.playground.cards.geoJohan.title}</h4>
            <p class="project-summary">${t.playground.cards.geoJohan.subtitle}</p>
            <a class="projects-cta quiz-choice-action" href="/quiz/geojohan" data-link>${t.playground.cards.geoJohan.cta}</a>
          </article>
        </div>
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
