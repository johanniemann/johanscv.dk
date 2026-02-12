import mockAnswers from '../data/mockAnswers.json'

const API_MODE = import.meta.env.VITE_ASK_JOHAN_MODE === 'api'

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

  const respond = async () => {
    const query = input.value.trim().toLowerCase()
    button.disabled = true

    try {
      answer.textContent = await getAnswer(query)
    } finally {
      button.disabled = false
    }
  }

  button.addEventListener('click', respond)
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') respond()
  })
}

async function getAnswer(query) {
  if (!query) return mockAnswers.default

  if (API_MODE) {
    try {
      const response = await fetch('/api/ask-johan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query })
      })

      if (response.ok) {
        const payload = await response.json()
        if (typeof payload.answer === 'string' && payload.answer.trim()) {
          return payload.answer
        }
      }
    } catch {
      return mockAnswers.default
    }
  }

  return getMockAnswer(query)
}

function getMockAnswer(query) {
  if (query.includes('skill')) return mockAnswers.skills
  if (query.includes('project')) return mockAnswers.projects
  if (query.includes('architect')) return mockAnswers.architecture
  return mockAnswers.default
}
