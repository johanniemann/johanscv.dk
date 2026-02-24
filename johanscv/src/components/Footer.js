import { ThemeToggle } from './ThemeToggle.js'
import { LanguageToggle } from './LanguageToggle.js'

const FOOTER_INFO_MODAL_ID = 'footer-info-modal'
const FOOTER_INFO_DIALOG_ID = 'footer-info-dialog'
const FOOTER_INFO_FADE_MS = 320
const FOOTER_INFO_FOCUS_DELAY_MS = 140

export function Footer({ t, theme, language }) {
  const year = new Date().getFullYear()
  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/projects', label: t.nav.projects },
    { href: '/resume', label: t.nav.files },
    { href: '/playground', label: t.nav.playground }
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
        <div class="footer-built-wrap">
          <p class="footer-built">${t.footer.builtWith}</p>
          <button
            id="footer-info-toggle"
            class="footer-info-button"
            type="button"
            aria-label="${t.footer.infoButtonAria}"
            aria-haspopup="dialog"
            aria-controls="${FOOTER_INFO_DIALOG_ID}"
            aria-expanded="false"
          >
            ?
          </button>
        </div>
      </div>
    </footer>
  `
}

export function bindFooterInfoPopup(t, options = {}) {
  const overlayRoot = resolveOverlayRoot(options.overlayRoot)
  const toggleButton = document.querySelector('#footer-info-toggle')
  const modal = mountFooterInfoModalPortal(t, overlayRoot)
  const closeButton = modal?.querySelector('#footer-info-close')
  const backdrop = modal?.querySelector('[data-footer-info-close]')
  if (!toggleButton || !modal || !closeButton || !backdrop) return

  document.body.classList.remove('footer-info-lock')
  document.body.classList.remove('footer-info-open')
  let restoreFocusOnClose = false
  let isClosing = false
  let closeTimer = null
  let closeTransitionHandler = null
  let openFocusTimer = null

  const isOpen = () => !modal.hidden && modal.classList.contains('is-visible')

  const clearCloseWaiters = () => {
    if (closeTransitionHandler) {
      modal.removeEventListener('transitionend', closeTransitionHandler)
      closeTransitionHandler = null
    }
    if (closeTimer) {
      window.clearTimeout(closeTimer)
      closeTimer = null
    }
  }

  const clearOpenWaiters = () => {
    if (openFocusTimer) {
      window.clearTimeout(openFocusTimer)
      openFocusTimer = null
    }
  }

  const finalizeClose = () => {
    clearCloseWaiters()
    clearOpenWaiters()
    isClosing = false
    modal.hidden = true
    modal.classList.remove('is-visible')
    document.body.classList.remove('footer-info-lock')
    document.body.classList.remove('footer-info-open')
    if (restoreFocusOnClose) {
      toggleButton.focus({ preventScroll: true })
    }
    restoreFocusOnClose = false
  }

  const setExpanded = (expanded) => {
    toggleButton.setAttribute('aria-expanded', expanded ? 'true' : 'false')
  }

  const open = () => {
    if (isOpen() || isClosing) return
    clearCloseWaiters()
    clearOpenWaiters()
    restoreFocusOnClose = false
    modal.hidden = false
    modal.classList.remove('is-visible')
    document.body.classList.add('footer-info-lock')
    document.body.classList.add('footer-info-open')
    setExpanded(true)
    window.requestAnimationFrame(() => {
      modal.classList.add('is-visible')
      openFocusTimer = window.setTimeout(() => {
        openFocusTimer = null
        if (modal.hidden || isClosing || !modal.classList.contains('is-visible')) return
        closeButton.focus({ preventScroll: true })
      }, FOOTER_INFO_FOCUS_DELAY_MS)
    })
  }

  const close = ({ restoreFocus = false } = {}) => {
    if (modal.hidden || isClosing) return
    isClosing = true
    clearCloseWaiters()
    clearOpenWaiters()
    restoreFocusOnClose = restoreFocus
    setExpanded(false)
    modal.classList.remove('is-visible')

    closeTransitionHandler = (event) => {
      if (event.target !== modal || event.propertyName !== 'opacity') return
      finalizeClose()
    }

    modal.addEventListener('transitionend', closeTransitionHandler)
    closeTimer = window.setTimeout(finalizeClose, FOOTER_INFO_FADE_MS + 80)
  }

  toggleButton.addEventListener('click', () => {
    if (isOpen()) {
      close({ restoreFocus: true })
      return
    }
    open()
  })
  closeButton.addEventListener('click', () => close())
  backdrop.addEventListener('click', () => close())
  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close({ restoreFocus: true })
  })
}

function mountFooterInfoModalPortal(t, overlayRoot) {
  document.body.classList.remove('footer-info-lock')

  document.querySelectorAll(`#${FOOTER_INFO_MODAL_ID}`).forEach((existingModal) => {
    existingModal.remove()
  })

  if (!t?.footer) return null

  const targetRoot = resolveOverlayRoot(overlayRoot)

  const modal = document.createElement('div')
  modal.id = FOOTER_INFO_MODAL_ID
  modal.className = 'footer-info-modal'
  modal.hidden = true
  modal.innerHTML = `
    <div class="footer-info-backdrop" data-footer-info-close></div>
    <section
      id="${FOOTER_INFO_DIALOG_ID}"
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
      <button id="footer-info-close" class="footer-info-close-button" type="button">
        ${t.footer.infoClose}
      </button>
    </section>
  `

  targetRoot.append(modal)
  return modal
}

function resolveOverlayRoot(candidateRoot = null) {
  if (candidateRoot instanceof HTMLElement) return candidateRoot

  const overlayRoot = document.querySelector('#overlay-root')
  if (overlayRoot instanceof HTMLElement) return overlayRoot

  return document.body
}
