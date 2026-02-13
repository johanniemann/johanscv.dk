import mockAnswers from '../data/mockAnswers.json'

const API_MODE = import.meta.env.VITE_ASK_JOHAN_MODE === 'api'
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const ACCESS_CODE_KEY = 'johanscv.askJohanAccessCode'
const ACCESS_CODE_REQUIRED_MESSAGE = 'Access code is required to use Ask Johan.'
const PLACEHOLDER_SPEED_MS = 42
const ERASE_SPEED_MS = 24
const HOLD_MS = 1200
const NEXT_MS = 260
const ANSWER_TRANSITION_MS = 520

const SAMPLE_QUESTIONS = {
  en: [
    'What kind of IT architecture do you want to work with?',
    'What is your strongest technical skill right now?',
    'How do you approach system design decisions?',
    'What have you learned from your current student job?',
    'Which projects best represent your profile?',
    'How do you balance UX quality and performance?',
    'What tools do you use for architecture work?',
    'How do you work with data quality in practice?',
    'What are your goals for the next two years?',
    'How can we collaborate on a relevant opportunity?'
  ],
  dk: [
    'Hvilken type IT-arkitektur vil du arbejde med?',
    'Hvad er din stærkeste tekniske kompetence lige nu?',
    'Hvordan træffer du arkitektur- og designbeslutninger?',
    'Hvad har du lært i dit nuværende studiejob?',
    'Hvilke projekter repræsenterer dig bedst?',
    'Hvordan balancerer du UX-kvalitet og performance?',
    'Hvilke værktøjer bruger du i arkitekturarbejde?',
    'Hvordan arbejder du med datakvalitet i praksis?',
    'Hvad er dine mål de næste to år?',
    'Hvordan kan vi samarbejde om en relevant mulighed?'
  ]
}

let placeholderTimer = null
let placeholderRunId = 0

export function AskJohan({ t }) {
  const [askLabel, johanLabel] = splitAskTitle(t.ask.title)
  const aiIconPath = `${import.meta.env.BASE_URL}images/ai-icon.png`

  return `
    <section class="ask-card section-reveal" id="ask-johan">
      <h2 class="section-title ask-title">
        <span>${askLabel}</span>
        <span class="ask-title-johan">
          <span class="ask-title-johan-text">${johanLabel}</span>
          <span class="ask-title-ai-icon-png" style="--ai-icon-url: url('${aiIconPath}')" aria-hidden="true"></span>
        </span>
      </h2>
      <div class="ask-input-wrap">
        <input id="ask-input" class="ask-input" type="text" placeholder="${t.ask.placeholder}" />
        <button id="ask-submit" class="ask-button" type="button" aria-label="${t.ask.button}">
          <span class="ask-button-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 19V7.2" />
              <path d="M7.5 11.7 12 7.2l4.5 4.5" />
            </svg>
          </span>
        </button>
      </div>
      <p id="ask-answer" class="ask-answer"></p>
    </section>
  `
}

function splitAskTitle(title = 'Ask Johan') {
  const trimmed = String(title).trim()
  if (!trimmed) return ['Ask', 'Johan']

  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) return [parts[0], '']

  const johan = parts.pop()
  const ask = parts.join(' ')
  return [ask, johan]
}

export function bindAskJohan(language = 'en') {
  const input = document.querySelector('#ask-input')
  const button = document.querySelector('#ask-submit')
  const answer = document.querySelector('#ask-answer')
  if (!input || !button || !answer) return

  bindPlaceholderTypewriter(input, language)

  const respond = async () => {
    const query = input.value.trim().toLowerCase()
    button.disabled = true

    try {
      const nextAnswer = await getAnswer(query)
      await revealAnswer(answer, nextAnswer)
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
      return await getApiAnswer(query)
    } catch (error) {
      return formatApiError(error)
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

function getAccessCode() {
  const saved = localStorage.getItem(ACCESS_CODE_KEY)
  if (saved && saved.trim()) return saved
  return ''
}

async function getApiAnswer(question) {
  if (!API_BASE) {
    throw new Error('VITE_API_BASE_URL is not configured.')
  }

  const accessCode = getAccessCode()
  if (!accessCode) return ACCESS_CODE_REQUIRED_MESSAGE

  const response = await postQuestion(question, accessCode)

  if (response.status === 401) {
    localStorage.removeItem(ACCESS_CODE_KEY)
    return ACCESS_CODE_REQUIRED_MESSAGE
  }

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response))
  }

  const payload = await response.json()
  const answer = parseAnswer(payload)
  if (!answer) {
    throw new Error('API returned an empty answer.')
  }

  return answer
}

function postQuestion(question, accessCode) {
  return fetch(`${API_BASE}/api/ask-johan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-code': accessCode
    },
    body: JSON.stringify({ question })
  })
}

function parseAnswer(payload) {
  if (typeof payload?.answer !== 'string') return ''
  const answer = payload.answer.trim()
  return answer || ''
}

async function getApiErrorMessage(response) {
  try {
    const payload = await response.json()
    if (typeof payload?.answer === 'string' && payload.answer.trim()) {
      return `${response.status} ${response.statusText}: ${payload.answer.trim()}`
    }
  } catch {
    // Ignore JSON parse errors and use a generic message below.
  }

  return `${response.status} ${response.statusText}: API request failed.`
}

function formatApiError(error) {
  const message = error instanceof Error ? error.message : String(error)
  return `Ask Johan API error: ${message}`
}

function bindPlaceholderTypewriter(input, language) {
  stopPlaceholderTypewriter()
  const prompts = SAMPLE_QUESTIONS[language] || SAMPLE_QUESTIONS.en
  const runId = ++placeholderRunId

  let promptIndex = 0
  let charIndex = 0
  let deleting = false

  const tick = () => {
    if (runId !== placeholderRunId) return

    const prompt = prompts[promptIndex]

    if (!deleting) {
      charIndex += 1
      input.placeholder = prompt.slice(0, charIndex)

      if (charIndex >= prompt.length) {
        deleting = true
        placeholderTimer = window.setTimeout(tick, HOLD_MS)
        return
      }

      placeholderTimer = window.setTimeout(tick, PLACEHOLDER_SPEED_MS)
      return
    }

    charIndex -= 1
    input.placeholder = prompt.slice(0, Math.max(charIndex, 0))

    if (charIndex <= 0) {
      deleting = false
      promptIndex = (promptIndex + 1) % prompts.length
      placeholderTimer = window.setTimeout(tick, NEXT_MS)
      return
    }

    placeholderTimer = window.setTimeout(tick, ERASE_SPEED_MS)
  }

  tick()
}

function stopPlaceholderTypewriter() {
  if (placeholderTimer) {
    window.clearTimeout(placeholderTimer)
    placeholderTimer = null
  }
  placeholderRunId += 1
}

async function revealAnswer(answerEl, text) {
  const nextText = String(text || '')
  const currentHeight = answerEl.offsetHeight
  answerEl.style.height = `${currentHeight}px`
  answerEl.classList.add('is-animating')

  answerEl.textContent = nextText
  answerEl.classList.toggle('has-content', Boolean(nextText.trim()))
  const targetHeight = nextText.trim() ? answerEl.scrollHeight : 0

  // Force style recalculation before starting transition.
  void answerEl.offsetHeight
  answerEl.style.height = `${targetHeight}px`

  await waitForHeightTransition(answerEl)

  answerEl.classList.remove('is-animating')
  answerEl.style.height = nextText.trim() ? 'auto' : '0px'
}

function waitForHeightTransition(element) {
  return new Promise((resolve) => {
    let resolved = false
    const finish = () => {
      if (resolved) return
      resolved = true
      element.removeEventListener('transitionend', onEnd)
      resolve()
    }
    const onEnd = (event) => {
      if (event.propertyName === 'height') finish()
    }

    element.addEventListener('transitionend', onEnd)
    window.setTimeout(finish, ANSWER_TRANSITION_MS + 80)
  })
}
