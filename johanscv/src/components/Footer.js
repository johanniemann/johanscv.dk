import { ThemeToggle } from './ThemeToggle.js'
import { LanguageToggle } from './LanguageToggle.js'

export function Footer({ t, theme, language }) {
  const year = new Date().getFullYear()
  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/projects', label: t.nav.projects },
    { href: '/resume', label: t.nav.files }
  ]

  return `
    <footer class="site-footer" aria-label="Footer">
      <div class="footer-top">
        <nav class="footer-links" aria-label="Footer navigation">
          ${navLinks.map((link) => `<a href="${link.href}" data-link>${link.label}</a>`).join('')}
        </nav>
        <div class="footer-controls">
          ${LanguageToggle(language)}
          ${ThemeToggle(theme)}
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">&copy; ${year} Johan Niemann Husbjerg. ${t.footer.rights}</p>
        <p class="footer-built">${t.footer.builtWith}</p>
      </div>
    </footer>
  `
}
