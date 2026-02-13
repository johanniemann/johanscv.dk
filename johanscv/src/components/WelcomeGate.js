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
        </div>
        <button id="welcome-continue" class="welcome-button" type="button">${t.welcome.continue}</button>
      </div>
    </section>
  `
}

export function bindWelcomeGate(onContinue) {
  const button = document.querySelector('#welcome-continue')
  const input = document.querySelector('#welcome-access-code')
  const errorEl = document.querySelector('#welcome-error')
  if (!button || !input) return

  const submit = () => {
    const result = onContinue(input.value.trim())
    if (result?.ok) {
      if (errorEl) errorEl.textContent = ''
      return
    }
    if (errorEl) errorEl.textContent = result?.message || ''
    input.focus()
    input.select()
  }

  button.addEventListener('click', submit)
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') submit()
  })
}
