export function ThemeToggle(theme) {
  const isDark = theme === 'dark'
  return `
    <button id="theme-toggle" class="toggle-pill" type="button" aria-label="Toggle theme">
      <span class="toggle-knob ${isDark ? 'translate-x-6' : 'translate-x-0'}"></span>
      <span class="toggle-label">${isDark ? 'Dark' : 'Light'}</span>
    </button>
  `
}

export function bindThemeToggle(onToggle) {
  const element = document.querySelector('#theme-toggle')
  if (!element) return

  element.addEventListener('click', onToggle)
}
