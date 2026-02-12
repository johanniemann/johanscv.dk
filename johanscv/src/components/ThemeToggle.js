export function ThemeToggle(theme) {
  const isDark = theme === 'dark'
  return `
    <button id="theme-toggle" class="toggle-pill ${isDark ? 'is-dark' : 'is-light'}" type="button" aria-label="Toggle theme">
      <span class="toggle-option toggle-option-light">Light</span>
      <span class="toggle-option toggle-option-dark">Dark</span>
      <span class="toggle-knob"></span>
    </button>
  `
}

export function bindThemeToggle(onToggle) {
  const element = document.querySelector('#theme-toggle')
  if (!element) return

  element.addEventListener('click', onToggle)
}
