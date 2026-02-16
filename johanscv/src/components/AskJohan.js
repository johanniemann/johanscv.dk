import mockAnswers from '../data/mockAnswers.json'

const API_MODE = import.meta.env.VITE_ASK_JOHAN_MODE === 'api'
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const SITE_ACCESS_CODE = (import.meta.env.VITE_SITE_ACCESS_CODE || '').trim()
const API_LOGIN_PATH = '/auth/login'
const API_ASK_PATH = '/api/ask-johan'
const ACCESS_CODE_KEY = 'johanscv.askJohanAccessCode'
const ACCESS_CODE_REQUIRED_MESSAGE = 'Access code is required to use Ask Johan.'
const API_TEMPORARY_UNAVAILABLE_MESSAGE =
  'Ask Johan is waking up on Render free hosting. Please try again in 10-20 seconds.'
const API_REQUEST_TIMEOUT_MS = 25000
const API_MAX_ATTEMPTS = 2
const API_RETRY_DELAY_MS = 2200
const PLACEHOLDER_SPEED_MS = 42
const ERASE_SPEED_MS = 24
const HOLD_MS = 1200
const NEXT_MS = 260
const ANSWER_TRANSITION_MS = 520

const SAMPLE_QUESTIONS = {
  en: [
    'What is your favorite dish?',
    'When is your birthday?',
    'Where do you live in Copenhagen?',
    'What kind of IT architecture do you want to work with?',
    'What is your strongest technical skill right now?',
    'How do you approach system design decisions?',
    'What have you learned from your current student job?',
    'Which projects best represent your profile?',
    'How do you balance UX quality and performance?',
    'How do you work with data quality in practice?',
    'How can we collaborate on a relevant opportunity?'
  ],
  dk: [
    'Hvad er din yndlingsret?',
    'Hvornår har du fødselsdag?',
    'Hvor bor du i København?',
    'Hvilken type IT-arkitektur vil du arbejde med?',
    'Hvad er din stærkeste tekniske kompetence lige nu?',
    'Hvordan træffer du arkitektur- og designbeslutninger?',
    'Hvad har du lært i dit nuværende studiejob?',
    'Hvilke projekter repræsenterer dig bedst?',
    'Hvordan balancerer du UX-kvalitet og performance?',
    'Hvordan arbejder du med datakvalitet i praksis?',
    'Hvordan kan vi samarbejde om en relevant mulighed?'
  ]
}

let placeholderTimer = null
let placeholderRunId = 0
let apiWarmupStarted = false
let apiAuthToken = ''

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
          <span class="ask-button-visual" aria-hidden="true">
            <span class="ask-button-icon ask-button-icon-arrow">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 19V7.2" />
                <path d="M7.5 11.7 12 7.2l4.5 4.5" />
              </svg>
            </span>
            <span class="ask-button-icon ask-button-icon-spinner">
              <svg viewBox="0 0 24 24" focusable="false">
                <circle class="spinner-track" cx="12" cy="12" r="8.2" />
                <circle class="spinner-head" cx="12" cy="12" r="8.2" />
              </svg>
            </span>
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
    button.classList.add('is-loading')

    try {
      const nextAnswer = await getAnswer(query)
      await revealAnswer(answer, nextAnswer)
    } finally {
      button.disabled = false
      button.classList.remove('is-loading')
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
      console.warn(formatApiError(error))
      return API_TEMPORARY_UNAVAILABLE_MESSAGE
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

  if (SITE_ACCESS_CODE) {
    localStorage.setItem(ACCESS_CODE_KEY, SITE_ACCESS_CODE)
    return SITE_ACCESS_CODE
  }

  return ''
}

export async function getApiBearerToken() {
  if (!API_MODE) {
    throw new Error('Ask Johan API mode is disabled.')
  }
  if (!API_BASE) {
    throw new Error('VITE_API_BASE_URL is not configured.')
  }

  const accessCode = getAccessCode()
  if (!accessCode) {
    throw new Error(ACCESS_CODE_REQUIRED_MESSAGE)
  }

  return ensureApiToken(accessCode)
}

async function getApiAnswer(question) {
  if (!API_BASE) {
    throw new Error('VITE_API_BASE_URL is not configured.')
  }

  const accessCode = getAccessCode()
  if (!accessCode) return ACCESS_CODE_REQUIRED_MESSAGE

  let lastError = null
  let forceTokenRefresh = false

  for (let attempt = 1; attempt <= API_MAX_ATTEMPTS; attempt += 1) {
    try {
      const token = await ensureApiToken(accessCode, forceTokenRefresh)
      forceTokenRefresh = false
      const response = await postQuestion(question, token)

      if (response.status === 401) {
        clearApiToken()
        if (attempt < API_MAX_ATTEMPTS) {
          forceTokenRefresh = true
          continue
        }

        localStorage.removeItem(ACCESS_CODE_KEY)
        return ACCESS_CODE_REQUIRED_MESSAGE
      }

      if (!response.ok) {
        const message = await getApiErrorMessage(response)
        if (shouldRetry(response.status, attempt)) {
          await wait(API_RETRY_DELAY_MS)
          continue
        }
        throw new Error(message)
      }

      const payload = await response.json()
      const answer = parseAnswer(payload)
      if (!answer) {
        throw new Error('API returned an empty answer.')
      }

      return answer
    } catch (error) {
      if (error instanceof Error && error.message === ACCESS_CODE_REQUIRED_MESSAGE) {
        return ACCESS_CODE_REQUIRED_MESSAGE
      }

      lastError = error
      if (attempt < API_MAX_ATTEMPTS && isRetryableError(error)) {
        await wait(API_RETRY_DELAY_MS)
        continue
      }
      throw error
    }
  }

  throw lastError || new Error('API request failed.')
}

async function ensureApiToken(accessCode, forceRefresh = false) {
  if (!forceRefresh && apiAuthToken) return apiAuthToken

  const response = await postLogin(accessCode)
  if (response.status === 401) {
    localStorage.removeItem(ACCESS_CODE_KEY)
    clearApiToken()
    throw new Error(ACCESS_CODE_REQUIRED_MESSAGE)
  }
  if (!response.ok) {
    const message = await getApiErrorMessage(response, 'Authentication failed.')
    throw new Error(message)
  }

  const payload = await response.json()
  const token = typeof payload?.token === 'string' ? payload.token.trim() : ''
  if (!token) {
    throw new Error('API login did not return a token.')
  }

  apiAuthToken = token
  return apiAuthToken
}

function clearApiToken() {
  apiAuthToken = ''
}

function postLogin(accessCode) {
  return fetchWithTimeout(`${API_BASE}${API_LOGIN_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ accessCode })
  })
}

function postQuestion(question, token) {
  return fetchWithTimeout(`${API_BASE}${API_ASK_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ question })
  })
}

function fetchWithTimeout(url, options) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT_MS)

  return fetch(url, {
    ...options,
    signal: controller.signal
  }).finally(() => {
    window.clearTimeout(timeoutId)
  })
}

function parseAnswer(payload) {
  if (typeof payload?.answer !== 'string') return ''
  const answer = payload.answer.trim()
  return answer || ''
}

async function getApiErrorMessage(response, fallbackMessage = 'API request failed.') {
  try {
    const payload = await response.json()
    if (typeof payload?.answer === 'string' && payload.answer.trim()) {
      return `${response.status} ${response.statusText}: ${payload.answer.trim()}`
    }
  } catch {
    // Ignore JSON parse errors and use a generic message below.
  }

  return `${response.status} ${response.statusText}: ${fallbackMessage}`
}

function formatApiError(error) {
  if (error?.name === 'AbortError') {
    return 'Ask Johan API error: request timed out.'
  }
  const message = error instanceof Error ? error.message : String(error)
  return `Ask Johan API error: ${message}`
}

function shouldRetry(status, attempt) {
  if (attempt >= API_MAX_ATTEMPTS) return false
  return status === 408 || status === 429 || status >= 500
}

function isRetryableError(error) {
  if (!error) return false
  if (error.name === 'AbortError') return true
  const message = String(error.message || '')
  return message.includes('Failed to fetch') || message.includes('NetworkError')
}

export function warmUpAskJohanApi() {
  if (!API_MODE || !API_BASE || apiWarmupStarted) return Promise.resolve()
  if (!getAccessCode()) return Promise.resolve()
  apiWarmupStarted = true

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 10000)

  return fetch(`${API_BASE}/health`, {
    method: 'GET',
    signal: controller.signal
  })
    .catch(() => null)
    .finally(() => {
      window.clearTimeout(timeoutId)
    })
}

function bindPlaceholderTypewriter(input, language) {
  stopPlaceholderTypewriter()
  const prompts = shufflePrompts(SAMPLE_QUESTIONS[language] || SAMPLE_QUESTIONS.en)
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

function shufflePrompts(prompts) {
  const items = [...prompts]
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
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

  answerEl.textContent = nextText
  answerEl.classList.toggle('has-content', Boolean(nextText.trim()))
  const targetHeight = nextText.trim() ? answerEl.scrollHeight : 0

  // Force style recalculation before starting transition.
  void answerEl.offsetHeight
  answerEl.style.height = `${targetHeight}px`

  await waitForHeightTransition(answerEl)

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

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
