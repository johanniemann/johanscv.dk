export function LanguageToggle(language) {
  const isDk = language === 'dk'

  return `
    <button id="language-toggle" class="lang-pill ${isDk ? 'is-dk' : 'is-en'}" type="button" aria-label="Toggle language">
      <span class="lang-indicator"></span>
      <span class="lang-option">EN</span>
      <span class="lang-option">DK</span>
    </button>
  `
}

export function bindLanguageToggle(onToggle) {
  const element = document.querySelector('#language-toggle')
  if (!element) return

  element.addEventListener('click', onToggle)
}
