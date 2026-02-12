import { ThemeToggle } from './ThemeToggle.js'
import { LanguageToggle } from './LanguageToggle.js'

export function Footer({ t, theme, language }) {
  const year = new Date().getFullYear()

  return `
    <footer class="site-footer" aria-label="Footer">
      <div class="footer-top">
        <nav class="footer-links" aria-label="Footer navigation">
          <a href="/" data-link>${t.nav.home}</a>
          <a href="/projects" data-link>${t.nav.projects}</a>
          <a href="/resume" data-link>${t.nav.files}</a>
          <a href="/quiz" data-link>${t.nav.quiz}</a>
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
