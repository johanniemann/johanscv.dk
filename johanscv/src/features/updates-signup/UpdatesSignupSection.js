const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const API_SIGNUP_PATH = '/api/updates-signup'
const API_TIMEOUT_MS = 12000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TOPIC_ORDER = ['projects', 'resume', 'interactive_services']
const UPDATES_SIGNUP_INFO_MODAL_ID = 'updates-signup-info-modal'
const UPDATES_SIGNUP_INFO_DIALOG_ID = 'updates-signup-info-dialog'
const UPDATES_SIGNUP_INFO_FADE_MS = 320
const UPDATES_SIGNUP_INFO_FOCUS_DELAY_MS = 140

export function UpdatesSignupSection({ t }) {
  const topics = TOPIC_ORDER.map((key) =>
    topicChoiceMarkup({
      key,
      label: t.contact.updates.topics[key]
    })
  ).join('')

  return `
    ${updatesSignupScopedStyles()}
    <section class="ask-card updates-signup-card section-reveal" id="updates-signup">
      <div class="updates-signup-copy">
        <h2 class="section-title">${t.contact.updates.title}</h2>
        <p class="section-body updates-signup-intro">${t.contact.updates.intro}</p>
      </div>
      <form id="updates-signup-form" class="updates-signup-form" novalidate>
        <fieldset class="updates-signup-choices" aria-label="${t.contact.updates.topicsLabel}">
          <div class="updates-signup-choice-list">
            ${topics}
          </div>
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
        <div class="updates-signup-meta">
          <p id="updates-signup-error" class="updates-signup-feedback updates-signup-error" aria-live="polite"></p>
          <p id="updates-signup-status" class="updates-signup-feedback updates-signup-status" aria-live="polite"></p>
          <p class="updates-signup-feedback updates-signup-note">
            <button
              id="updates-signup-info-toggle"
              class="footer-info-button updates-signup-info-button"
              type="button"
              aria-label="${t.contact.updates.infoButtonAria}"
              aria-haspopup="dialog"
              aria-controls="${UPDATES_SIGNUP_INFO_DIALOG_ID}"
              aria-expanded="false"
            >
              ?
            </button>
            <span class="updates-signup-note-text">${t.contact.updates.note}</span>
          </p>
        </div>
      </form>
    </section>
  `
}

export function bindUpdatesSignup({ t, language = 'en' }) {
  bindUpdatesSignupInfoPopup(t)

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

function topicChoiceMarkup({ key, label }) {
  return `
    <label class="updates-signup-choice">
      <input class="updates-signup-choice-input" type="checkbox" name="updates-signup-topic" value="${key}" />
      <span class="file-action contact-action updates-signup-choice-visual">
        <span class="file-action-icon updates-signup-choice-indicator" aria-hidden="true"></span>
        <span class="file-action-text updates-signup-choice-label">${label}</span>
      </span>
    </label>
  `
}

function updatesSignupScopedStyles() {
  return `
    <style>
      #updates-signup .updates-signup-intro {
        margin: 0;
      }

      #updates-signup .updates-signup-form {
        gap: 0.55rem;
      }

      #updates-signup .updates-signup-info-button {
        flex: 0 0 auto;
      }

      #updates-signup .updates-signup-choice-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
        padding: 0.08rem 0 0.14rem;
        overflow: visible;
      }

      #updates-signup .updates-signup-choice {
        position: relative;
        display: block;
        flex: 0 0 auto;
        cursor: pointer;
        overflow: visible;
      }

      #updates-signup .updates-signup-choice-visual {
        padding-right: 0.72rem;
      }

      #updates-signup .updates-signup-choice-input:focus-visible + .updates-signup-choice-visual {
        outline: none;
        box-shadow: 0 0 0 3px rgba(128, 148, 204, 0.26);
      }

      #updates-signup .updates-signup-choice-label {
        display: block;
        white-space: nowrap;
      }

      #updates-signup .updates-signup-choice-indicator {
        background: transparent;
        border: 1px solid var(--surface-inner-border);
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.18);
      }

      #updates-signup .updates-signup-choice-input:checked + .updates-signup-choice-visual .updates-signup-choice-indicator {
        border-color: transparent;
        background: linear-gradient(120deg, #f3b885, #f9e3b9, #ebb17f, #f3b885);
        background-size: 220% 220%;
        animation: askButtonGradient 20s linear infinite;
        box-shadow: none;
      }

      :root[data-theme='dark'] #updates-signup .updates-signup-choice-visual {
        color: var(--text-primary);
      }

      :root[data-theme='dark'] #updates-signup .updates-signup-choice-indicator {
        box-shadow: inset 0 0 0 2px rgba(11, 18, 34, 0.34);
      }

      :root[data-theme='dark'] #updates-signup .updates-signup-choice-input:checked + .updates-signup-choice-visual .updates-signup-choice-indicator {
        background: linear-gradient(120deg, #5f77db, #8eb6ff, #6b57b9, #5f77db);
        background-size: 220% 220%;
      }

      #updates-signup .updates-signup-meta {
        display: grid;
        gap: 0.3rem;
      }

      #updates-signup .updates-signup-feedback:empty {
        display: none;
      }

      #updates-signup .updates-signup-note {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
      }

      #updates-signup .updates-signup-note-text {
        display: inline;
      }
    </style>
  `
}

function bindUpdatesSignupInfoPopup(t, options = {}) {
  const overlayRoot = resolveOverlayRoot(options.overlayRoot)
  const toggleButton = document.querySelector('#updates-signup-info-toggle')
  const modal = mountUpdatesSignupInfoModalPortal(t, overlayRoot)
  const closeButton = modal?.querySelector('#updates-signup-info-close')
  const backdrop = modal?.querySelector('[data-updates-signup-info-close]')
  if (!toggleButton || !modal || !closeButton || !backdrop) return

  document.body.classList.remove('footer-info-lock')
  document.body.classList.remove('footer-info-open')
  let restoreFocusOnClose = false
  let isClosing = false
  let closeTimer = null
  let closeTransitionHandler = null
  let openFocusTimer = null

  const isOpen = () => !modal.hidden && modal.classList.contains('is-visible')

  const clearCloseWaiters = () => {
    if (closeTransitionHandler) {
      modal.removeEventListener('transitionend', closeTransitionHandler)
      closeTransitionHandler = null
    }
    if (closeTimer) {
      window.clearTimeout(closeTimer)
      closeTimer = null
    }
  }

  const clearOpenWaiters = () => {
    if (openFocusTimer) {
      window.clearTimeout(openFocusTimer)
      openFocusTimer = null
    }
  }

  const finalizeClose = () => {
    clearCloseWaiters()
    clearOpenWaiters()
    isClosing = false
    modal.hidden = true
    modal.classList.remove('is-visible')
    document.body.classList.remove('footer-info-lock')
    document.body.classList.remove('footer-info-open')
    if (restoreFocusOnClose) {
      toggleButton.focus({ preventScroll: true })
    }
    restoreFocusOnClose = false
  }

  const setExpanded = (expanded) => {
    toggleButton.setAttribute('aria-expanded', expanded ? 'true' : 'false')
  }

  const open = () => {
    if (isOpen() || isClosing) return
    clearCloseWaiters()
    clearOpenWaiters()
    restoreFocusOnClose = false
    modal.hidden = false
    modal.classList.remove('is-visible')
    document.body.classList.add('footer-info-lock')
    document.body.classList.add('footer-info-open')
    setExpanded(true)
    window.requestAnimationFrame(() => {
      modal.classList.add('is-visible')
      openFocusTimer = window.setTimeout(() => {
        openFocusTimer = null
        if (modal.hidden || isClosing || !modal.classList.contains('is-visible')) return
        closeButton.focus({ preventScroll: true })
      }, UPDATES_SIGNUP_INFO_FOCUS_DELAY_MS)
    })
  }

  const close = ({ restoreFocus = false } = {}) => {
    if (modal.hidden || isClosing) return
    isClosing = true
    clearCloseWaiters()
    clearOpenWaiters()
    restoreFocusOnClose = restoreFocus
    setExpanded(false)
    modal.classList.remove('is-visible')

    closeTransitionHandler = (event) => {
      if (event.target !== modal || event.propertyName !== 'opacity') return
      finalizeClose()
    }

    modal.addEventListener('transitionend', closeTransitionHandler)
    closeTimer = window.setTimeout(finalizeClose, UPDATES_SIGNUP_INFO_FADE_MS + 80)
  }

  toggleButton.addEventListener('click', () => {
    if (isOpen()) {
      close({ restoreFocus: true })
      return
    }
    open()
  })
  closeButton.addEventListener('click', () => close())
  backdrop.addEventListener('click', () => close())
  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close({ restoreFocus: true })
  })
}

function mountUpdatesSignupInfoModalPortal(t, overlayRoot) {
  document.body.classList.remove('footer-info-lock')

  document.querySelectorAll(`#${UPDATES_SIGNUP_INFO_MODAL_ID}`).forEach((existingModal) => {
    existingModal.remove()
  })

  if (!t?.contact?.updates) return null

  const targetRoot = resolveOverlayRoot(overlayRoot)
  const modal = document.createElement('div')
  modal.id = UPDATES_SIGNUP_INFO_MODAL_ID
  modal.className = 'footer-info-modal updates-signup-info-modal'
  modal.hidden = true
  modal.innerHTML = `
    <div class="footer-info-backdrop" data-updates-signup-info-close></div>
    <section
      id="${UPDATES_SIGNUP_INFO_DIALOG_ID}"
      class="footer-info-dialog updates-signup-info-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="updates-signup-info-title"
    >
      <p class="footer-info-kicker">${t.contact.updates.infoKicker}</p>
      <h2 id="updates-signup-info-title" class="section-title footer-info-title">${t.contact.updates.infoTitle}</h2>
      <p class="section-body footer-info-intro">${t.contact.updates.infoIntro}</p>
      <ul class="footer-info-list">
        ${t.contact.updates.infoPoints.map((point) => `<li>${point}</li>`).join('')}
      </ul>
      <button id="updates-signup-info-close" class="footer-info-close-button" type="button">
        ${t.contact.updates.infoClose}
      </button>
    </section>
  `

  targetRoot.append(modal)
  return modal
}

function resolveOverlayRoot(candidateRoot = null) {
  if (candidateRoot instanceof HTMLElement) return candidateRoot

  const overlayRoot = document.querySelector('#overlay-root')
  if (overlayRoot instanceof HTMLElement) return overlayRoot

  return document.body
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
