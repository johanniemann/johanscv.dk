import { ThemeToggle } from './ThemeToggle.js'
import { LanguageToggle } from './LanguageToggle.js'

const FOOTER_INFO_TRANSITION_MS = 320

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
          <a class="footer-playground-link" href="/playground" data-link>${t.footer.playground}</a>
        </nav>
        <div class="footer-controls">
          ${LanguageToggle(language)}
          ${ThemeToggle(theme)}
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">&copy; ${year} Johan Niemann Husbjerg. ${t.footer.rights}</p>
        <div class="footer-built-wrap">
          <p class="footer-built">${t.footer.builtWith}</p>
          <button
            id="footer-info-toggle"
            class="footer-info-button"
            type="button"
            aria-label="${t.footer.infoButtonAria}"
            aria-haspopup="dialog"
            aria-controls="footer-info-dialog"
            aria-expanded="false"
          >
            ?
          </button>
        </div>
      </div>

      <div id="footer-info-modal" class="footer-info-modal" hidden>
        <div class="footer-info-backdrop" data-footer-info-close></div>
        <section
          id="footer-info-dialog"
          class="footer-info-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-info-title"
        >
          <p class="footer-info-kicker">${t.footer.infoKicker}</p>
          <h2 id="footer-info-title" class="section-title footer-info-title">${t.footer.infoTitle}</h2>
          <p class="section-body footer-info-intro">${t.footer.infoIntro}</p>
          <ul class="footer-info-list">
            ${t.footer.infoPoints.map((point) => `<li>${point}</li>`).join('')}
          </ul>
          <button id="footer-info-close" class="projects-cta footer-info-close" type="button">
            ${t.footer.infoClose}
          </button>
        </section>
      </div>
    </footer>
  `
}

export function bindFooterInfoPopup() {
  const toggleButton = document.querySelector('#footer-info-toggle')
  const modal = mountFooterInfoModalPortal()
  const closeButton = modal?.querySelector('#footer-info-close')
  const backdrop = modal?.querySelector('[data-footer-info-close]')
  if (!toggleButton || !modal || !closeButton || !backdrop) return

  let closeTimer = null

  const setExpanded = (expanded) => {
    toggleButton.setAttribute('aria-expanded', expanded ? 'true' : 'false')
  }

  const open = () => {
    window.clearTimeout(closeTimer)
    modal.hidden = false
    modal.classList.remove('is-exiting')
    document.body.classList.add('footer-info-open')
    setExpanded(true)

    window.requestAnimationFrame(() => {
      modal.classList.add('is-visible')
      closeButton.focus({ preventScroll: true })
    })
  }

  const close = () => {
    modal.classList.remove('is-visible')
    modal.classList.add('is-exiting')
    setExpanded(false)

    window.clearTimeout(closeTimer)
    closeTimer = window.setTimeout(() => {
      modal.hidden = true
      modal.classList.remove('is-exiting')
      document.body.classList.remove('footer-info-open')
      toggleButton.focus({ preventScroll: true })
    }, FOOTER_INFO_TRANSITION_MS)
  }

  toggleButton.addEventListener('click', open)
  closeButton.addEventListener('click', close)
  backdrop.addEventListener('click', close)
  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close()
  })
}

function mountFooterInfoModalPortal() {
  document.body.classList.remove('footer-info-open')

  const existingPortalModal = document.querySelector('body > #footer-info-modal[data-footer-info-portal="true"]')
  if (existingPortalModal) {
    existingPortalModal.remove()
  }

  const inlineModal = document.querySelector('#footer-info-modal')
  if (!inlineModal) return null

  inlineModal.dataset.footerInfoPortal = 'true'
  document.body.append(inlineModal)
  return inlineModal
}
