export function LanguageToggle(language) {
  const isDk = language === 'dk'

  return `
    <button id="language-toggle" class="lang-pill" type="button" aria-label="Toggle language">
      <span class="lang-indicator ${isDk ? 'translate-x-8' : 'translate-x-0'}"></span>
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
