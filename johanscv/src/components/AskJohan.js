import mockAnswers from '../data/mockAnswers.json'

export function AskJohan({ t }) {
  return `
    <section class="ask-card section-reveal" id="ask-johan">
      <h2 class="section-title">${t.ask.title}</h2>
      <div class="ask-input-wrap">
        <input id="ask-input" class="ask-input" type="text" placeholder="${t.ask.placeholder}" />
        <button id="ask-submit" class="ask-button" type="button">${t.ask.button}</button>
      </div>
      <p id="ask-answer" class="ask-answer"></p>
    </section>
  `
}

export function bindAskJohan() {
  const input = document.querySelector('#ask-input')
  const button = document.querySelector('#ask-submit')
  const answer = document.querySelector('#ask-answer')
  if (!input || !button || !answer) return

  const respond = () => {
    const query = input.value.trim().toLowerCase()
    if (query.includes('skill')) {
      answer.textContent = mockAnswers.skills
      return
    }
    if (query.includes('project')) {
      answer.textContent = mockAnswers.projects
      return
    }
    if (query.includes('architect')) {
      answer.textContent = mockAnswers.architecture
      return
    }
    answer.textContent = mockAnswers.default
  }

  button.addEventListener('click', respond)
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') respond()
  })
}
