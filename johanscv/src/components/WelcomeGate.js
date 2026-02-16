export function WelcomeGate({ t }) {
  return `
    <section class="welcome-screen" aria-label="Welcome">
      <div class="welcome-panel">
        <p class="welcome-kicker">johanscv.dk</p>
        <h1 class="welcome-title">${t.welcome.title}</h1>
        <p class="welcome-intro">${t.welcome.intro}</p>
        <ul class="welcome-points">
          <li>${t.welcome.point1}</li>
          <li>${t.welcome.point2}</li>
          <li>${t.welcome.point3}</li>
        </ul>
        <div class="welcome-input-wrap">
          <label class="welcome-input-label" for="welcome-access-code">${t.welcome.passwordLabel}</label>
          <input
            id="welcome-access-code"
            class="welcome-input"
            type="password"
            autocomplete="current-password"
            placeholder="${t.welcome.passwordPlaceholder}"
          />
          <p id="welcome-error" class="welcome-error" aria-live="polite"></p>
          <p id="welcome-status" class="welcome-status" aria-live="polite"></p>
        </div>
        <button id="welcome-continue" class="welcome-button" type="button">
          <span class="welcome-button-text">${t.welcome.continue}</span>
          <span class="welcome-button-spinner" aria-hidden="true"></span>
        </button>
      </div>
    </section>
  `
}

export function bindWelcomeGate(onContinue, { t, apiMode = false } = {}) {
  const button = document.querySelector('#welcome-continue')
  const input = document.querySelector('#welcome-access-code')
  const errorEl = document.querySelector('#welcome-error')
  const statusEl = document.querySelector('#welcome-status')
  if (!button || !input) return

  const setStatus = (message = '') => {
    if (!statusEl) return
    statusEl.textContent = message
    statusEl.classList.toggle('has-message', Boolean(String(message).trim()))
  }

  const setLoading = (loading) => {
    button.disabled = loading
    input.disabled = loading
    button.classList.toggle('is-loading', loading)
    button.setAttribute('aria-busy', loading ? 'true' : 'false')
  }

  const submit = async () => {
    if (button.disabled) return
    if (errorEl) errorEl.textContent = ''
    setLoading(true)
    setStatus(t?.welcome?.loggingIn || '')

    let warmupHintTimer = null
    if (apiMode) {
      warmupHintTimer = window.setTimeout(() => {
        setStatus(t?.welcome?.warmingUp || '')
      }, 1200)
    }

    let result = null
    try {
      result = await onContinue(input.value.trim())
    } finally {
      if (warmupHintTimer) {
        window.clearTimeout(warmupHintTimer)
      }
      setLoading(false)
    }

    if (result?.ok) {
      if (errorEl) errorEl.textContent = ''
      setStatus('')
      return
    }
    if (errorEl) errorEl.textContent = result?.message || ''
    setStatus('')
    input.focus()
    input.select()
  }

  button.addEventListener('click', submit)
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') submit()
  })
}
