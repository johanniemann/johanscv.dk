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
        <button id="welcome-continue" class="welcome-button" type="button">${t.welcome.continue}</button>
      </div>
    </section>
  `
}

export function bindWelcomeGate(onContinue) {
  const button = document.querySelector('#welcome-continue')
  if (!button) return
  button.addEventListener('click', onContinue)
}
