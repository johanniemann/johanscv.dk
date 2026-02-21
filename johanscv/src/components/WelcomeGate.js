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
          <div class="welcome-input-row">
            <input
              id="welcome-access-code"
              class="welcome-input welcome-input-with-button"
              type="password"
              autocomplete="current-password"
              placeholder="${t.welcome.passwordPlaceholder}"
            />
            <button id="welcome-continue" class="ask-button welcome-continue-button" type="button" aria-label="${t.welcome.continue}">
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
          <p id="welcome-error" class="welcome-error" aria-live="polite"></p>
          <p id="welcome-status" class="welcome-status" aria-live="polite"></p>
        </div>
      </div>
    </section>
  `
}

export function WelcomeWarmupGate({ t }) {
  return `
    <section class="welcome-screen" aria-label="Service warmup">
      <div class="welcome-panel">
        <p class="welcome-kicker">johanscv.dk</p>
        <h1 class="welcome-title">${t.welcome.title}</h1>
        <p class="welcome-intro">${t.welcome.warmingUp}</p>
        <p class="welcome-status welcome-status-static has-message">${t.welcome.warmingUpAutoContinue || ''}</p>
        <div class="welcome-warmup-row" aria-hidden="true">
          <span class="welcome-warmup-spinner"></span>
        </div>
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
