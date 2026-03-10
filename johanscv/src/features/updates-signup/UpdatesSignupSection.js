const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const API_SIGNUP_PATH = '/api/updates-signup'
const API_TIMEOUT_MS = 12000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TOPIC_ORDER = ['projects', 'resume', 'interactive_services']

export function UpdatesSignupSection({ t }) {
  const topics = TOPIC_ORDER.map((key) =>
    topicChoiceMarkup({
      key,
      label: t.contact.updates.topics[key],
      detail: t.contact.updates.topicDescriptions[key]
    })
  ).join('')
  const promiseText = t.contact.updates.promiseItems.join(' • ')

  return `
    <section class="ask-card updates-signup-card section-reveal" id="updates-signup">
      <div class="updates-signup-copy">
        <h2 class="section-title">${t.contact.updates.title}</h2>
        <p class="section-body">${t.contact.updates.intro}</p>
        <p class="updates-signup-feedback updates-signup-note">
          <strong>${t.contact.updates.promiseLabel}:</strong> ${promiseText}
        </p>
        <p class="updates-signup-feedback updates-signup-note">${t.contact.updates.cadence}</p>
      </div>
      <form id="updates-signup-form" class="updates-signup-form" novalidate>
        <fieldset class="updates-signup-choices">
          <legend class="updates-signup-legend">${t.contact.updates.topicsLabel}</legend>
          ${topics}
        </fieldset>
        <div class="updates-signup-input-wrap">
          <div class="updates-signup-honeypot-wrap" aria-hidden="true">
            <label for="updates-signup-company">Company</label>
            <input
              id="updates-signup-company"
              class="updates-signup-honeypot"
              name="company"
              type="text"
              tabindex="-1"
              autocomplete="off"
            />
          </div>
          <input
            id="updates-signup-email"
            class="ask-input updates-signup-input"
            name="email"
            type="email"
            inputmode="email"
            autocomplete="email"
            placeholder="${t.contact.updates.placeholder}"
            aria-label="${t.contact.updates.emailAriaLabel}"
          />
          <button id="updates-signup-submit" class="ask-button updates-signup-button" type="submit" aria-label="${t.contact.updates.button}">
            <span class="updates-signup-button-text">${t.contact.updates.button}</span>
            <span class="updates-signup-button-spinner" aria-hidden="true"></span>
          </button>
        </div>
        <p id="updates-signup-error" class="updates-signup-feedback updates-signup-error" aria-live="polite"></p>
        <p id="updates-signup-status" class="updates-signup-feedback updates-signup-status" aria-live="polite"></p>
        <p class="updates-signup-feedback updates-signup-note">${t.contact.updates.note}</p>
      </form>
    </section>
  `
}

export function bindUpdatesSignup({ t, language = 'en' }) {
  const form = document.querySelector('#updates-signup-form')
  const emailInput = document.querySelector('#updates-signup-email')
  const honeypotInput = document.querySelector('#updates-signup-company')
  const button = document.querySelector('#updates-signup-submit')
  const errorEl = document.querySelector('#updates-signup-error')
  const statusEl = document.querySelector('#updates-signup-status')
  const topicInputs = Array.from(document.querySelectorAll('input[name="updates-signup-topic"]'))

  if (!form || !emailInput || !honeypotInput || !button || !errorEl || !statusEl || !topicInputs.length) {
    return
  }

  const clearFeedback = () => {
    errorEl.textContent = ''
    statusEl.textContent = ''
  }

  const setError = (message) => {
    errorEl.textContent = message
    statusEl.textContent = ''
  }

  const setStatus = (message) => {
    statusEl.textContent = message
    errorEl.textContent = ''
  }

  const getSelectedTopics = () => {
    return topicInputs.filter((input) => input.checked).map((input) => input.value)
  }

  const validate = () => {
    const email = emailInput.value.trim()
    if (!EMAIL_PATTERN.test(email)) {
      return t.contact.updates.errors.invalidEmail
    }

    if (!getSelectedTopics().length) {
      return t.contact.updates.errors.noTopics
    }

    return ''
  }

  const onFieldChange = () => {
    if (errorEl.textContent || statusEl.textContent) {
      clearFeedback()
    }
  }

  emailInput.addEventListener('input', onFieldChange)
  topicInputs.forEach((input) => {
    input.addEventListener('change', onFieldChange)
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    button.disabled = true
    button.classList.add('is-loading')

    try {
      const response = await postSignup({
        email: emailInput.value.trim(),
        topics: getSelectedTopics(),
        locale: language,
        source: 'contact-page',
        company: honeypotInput.value.trim()
      })
      const payload = await parseJson(response)

      if (!response.ok) {
        setError(resolveErrorMessage(payload, t.contact.updates.errors.generic))
        return
      }

      setStatus(resolveSuccessMessage(payload, t.contact.updates.success))
      emailInput.value = ''
      honeypotInput.value = ''
      emailInput.focus()
    } catch {
      setError(t.contact.updates.errors.generic)
    } finally {
      button.disabled = false
      button.classList.remove('is-loading')
    }
  })
}

function topicChoiceMarkup({ key, label, detail }) {
  return `
    <label class="updates-signup-choice">
      <input class="updates-signup-choice-input" type="checkbox" name="updates-signup-topic" value="${key}" />
      <span class="file-action updates-signup-choice-visual">
        <span class="file-action-icon updates-signup-choice-indicator" aria-hidden="true"></span>
        <span class="file-action-text updates-signup-choice-label">
          ${label}<br />
          <span class="updates-signup-choice-note">${detail}</span>
        </span>
      </span>
    </label>
  `
}

async function postSignup(payload) {
  if (!API_BASE) {
    throw new Error('VITE_API_BASE_URL is not configured.')
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => {
    controller.abort()
  }, API_TIMEOUT_MS)

  try {
    return await fetch(`${API_BASE}${API_SIGNUP_PATH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
  } finally {
    window.clearTimeout(timeoutId)
  }
}

async function parseJson(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function resolveErrorMessage(payload, fallback) {
  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message.trim()
  }
  if (typeof payload?.answer === 'string' && payload.answer.trim()) {
    return payload.answer.trim()
  }
  return fallback
}

function resolveSuccessMessage(payload, fallback) {
  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message.trim()
  }
  return fallback
}
