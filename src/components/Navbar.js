import { ThemeToggle } from './ThemeToggle.js'
import { LanguageToggle } from './LanguageToggle.js'

export function Navbar({ route, t, theme, language }) {
  return `
    <header id="navbar" class="site-nav">
      <a class="brand" href="/" data-link>johanscv.dk</a>
      <nav class="nav-links" aria-label="Primary">
        ${navLink('/', t.nav.home, route)}
        ${navLink('/projects', t.nav.projects, route)}
        ${navLink('/files', t.nav.files, route)}
      </nav>
      <div class="nav-controls">
        ${LanguageToggle(language)}
        ${ThemeToggle(theme)}
      </div>
    </header>
  `
}

function navLink(path, label, currentRoute) {
  const active = currentRoute === path ? 'nav-link active' : 'nav-link'
  return `<a class="${active}" href="${path}" data-link>${label}</a>`
}
