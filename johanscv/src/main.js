import './styles/globals.css'
import './styles/animations.css'
import translations from './data/translations.json'
import { Navbar } from './components/Navbar.js'
import { Footer } from './components/Footer.js'
import { WelcomeGate, bindWelcomeGate } from './components/WelcomeGate.js'
import { bindThemeToggle } from './components/ThemeToggle.js'
import { bindLanguageToggle } from './components/LanguageToggle.js'
import { getState, setState } from './state.js'
import { initRouter } from './router.js'

restoreRedirectedPath()

const app = document.querySelector('#app')

app.innerHTML = `
  <div id="welcome-root"></div>
  <div class="site-shell" id="site-shell">
    <div id="nav-root"></div>
    <div id="page-root"></div>
    <div id="footer-root"></div>
  </div>
  <div id="scroll-hint-root"></div>
`

const ACCESS_CODE_KEY = 'johanscv.askJohanAccessCode'
const SITE_ACCESS_KEY = 'johanscv.siteAccessGranted'
const WELCOME_EXIT_MS = 500
const REVEAL_THRESHOLD = 0.2
const welcomeRoot = document.querySelector('#welcome-root')
const navRoot = document.querySelector('#nav-root')
const pageRoot = document.querySelector('#page-root')
const footerRoot = document.querySelector('#footer-root')
const scrollHintRoot = document.querySelector('#scroll-hint-root')
let navHidden = false
let navScrollInitialized = false
let siteBootstrapped = false
let router = null
let scrollHintBound = false

if (hasValidSiteAccess()) {
  bootstrapSite()
} else {
  renderWelcomeGate()
}

function bootstrapSite() {
  if (siteBootstrapped) return
  siteBootstrapped = true

  router = initRouter({
    mountEl: pageRoot,
    renderFrame: (renderRoute) => {
      renderRoute()
      initNavbarScrollBehavior()
    },
    pageContext: () => {
      const state = getState()
      const t = getTranslations(state.language)

      return {
        t,
        language: state.language
      }
    },
    onRouteChange: (route) => {
      setState({ route })
      updateActiveNav(route)
      initRevealObserver()
      updateScrollHintVisibility()
    }
  })

  renderNav()
  renderFooter()
  renderScrollHint()
  bindScrollHint()
  updateActiveNav(getState().route)
  updateScrollHintVisibility()
}

function renderNav() {
  const state = getState()
  const t = getTranslations(state.language)

  navRoot.innerHTML = Navbar({
    route: state.route,
    t
  })

  syncNavbarVisibility()
}

function renderFooter() {
  const state = getState()
  const t = getTranslations(state.language)
  footerRoot.innerHTML = Footer({
    t,
    theme: state.theme,
    language: state.language
  })

  bindThemeToggle(() => {
    toggleTheme()
    renderFooter()
  })

  bindLanguageToggle(() => {
    toggleLanguage()
    renderNav()
    updateActiveNav(getState().route)
    renderFooter()
    renderScrollHint()
    updateScrollHintVisibility()
    router?.refresh()
  })
}

function initRevealObserver() {
  const elements = document.querySelectorAll('.section-reveal')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: REVEAL_THRESHOLD }
  )

  elements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 70, 240)}ms`
    observer.observe(element)
  })
}

function restoreRedirectedPath() {
  const url = new URL(window.location.href)
  const encodedPath = url.searchParams.get('p')

  if (!encodedPath) {
    return
  }

  const decoded = decodeURIComponent(encodedPath)
  const [pathPart, queryPart] = decoded.split('&q=')
  const restoredQuery = queryPart ? `?${decodeURIComponent(queryPart)}` : ''
  const restoredPath = `${pathPart}${restoredQuery}${url.hash}`

  window.history.replaceState(null, '', restoredPath)
}

function initNavbarScrollBehavior() {
  if (navScrollInitialized) return
  navScrollInitialized = true

  let lastY = window.scrollY
  let ticking = false

  const onScroll = () => {
    if (ticking) return
    ticking = true

    window.requestAnimationFrame(() => {
      const currentY = window.scrollY
      const delta = currentY - lastY

      if (currentY < 36 || delta < -8) {
        navHidden = false
      } else if (delta > 8) {
        navHidden = true
      }

      lastY = currentY
      syncNavbarVisibility()
      ticking = false
    })
  }

  window.addEventListener('scroll', onScroll, { passive: true })
}

function syncNavbarVisibility() {
  const navbar = document.querySelector('#navbar')
  if (!navbar) return
  navbar.classList.toggle('nav-hidden', navHidden)
}

function updateActiveNav(route) {
  const links = document.querySelectorAll('.nav-link')
  links.forEach((link) => {
    const href = link.getAttribute('href')
    link.classList.toggle('active', href === route)
  })
}

function renderWelcomeGate() {
  const state = getState()
  const t = getTranslations(state.language)
  welcomeRoot.innerHTML = WelcomeGate({ t })
  document.body.classList.add('welcome-active')

  const screen = welcomeRoot.querySelector('.welcome-screen')
  window.requestAnimationFrame(() => {
    screen?.classList.add('is-visible')
  })

  bindWelcomeGate((accessCode) => {
    if (!isAccessCodeValid(accessCode)) {
      return { ok: false, message: t.welcome.passwordError }
    }

    localStorage.setItem(ACCESS_CODE_KEY, accessCode)
    localStorage.setItem(SITE_ACCESS_KEY, 'true')
    screen?.classList.remove('is-visible')
    screen?.classList.add('is-exiting')
    bootstrapSite()
    window.setTimeout(() => {
      welcomeRoot.innerHTML = ''
      document.body.classList.remove('welcome-active')
    }, WELCOME_EXIT_MS)
    return { ok: true }
  })
}

function isAccessCodeValid(accessCode) {
  const expectedAccessCode = (import.meta.env.VITE_SITE_ACCESS_CODE || '').trim()
  if (!accessCode) return false
  if (!expectedAccessCode) return true
  return accessCode === expectedAccessCode
}

function hasValidSiteAccess() {
  const hasSiteAccess = localStorage.getItem(SITE_ACCESS_KEY) === 'true'
  const savedAccessCode = localStorage.getItem(ACCESS_CODE_KEY)?.trim() || ''
  return hasSiteAccess && isAccessCodeValid(savedAccessCode)
}

function getTranslations(language) {
  return translations[language] || translations.en
}

function toggleTheme() {
  const currentTheme = getState().theme
  setState({ theme: currentTheme === 'dark' ? 'light' : 'dark' })
}

function toggleLanguage() {
  const currentLanguage = getState().language
  setState({ language: currentLanguage === 'en' ? 'dk' : 'en' })
}

function renderScrollHint() {
  const state = getState()
  const t = getTranslations(state.language)
  const hiddenClass = shouldHideScrollHint() ? ' is-hidden' : ''

  scrollHintRoot.innerHTML = `
    <button id="scroll-hint" class="scroll-hint${hiddenClass}" type="button" aria-label="${t.scrollHint.label}">
      <span class="scroll-hint-text">${t.scrollHint.label}</span>
      <span class="scroll-hint-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M12 6v12" />
          <path d="m7.5 13.5 4.5 4.5 4.5-4.5" />
        </svg>
      </span>
    </button>
  `
}

function bindScrollHint() {
  if (scrollHintBound) return
  scrollHintBound = true

  scrollHintRoot.addEventListener('click', (event) => {
    const button = event.target.closest('#scroll-hint')
    if (!button) return
    window.scrollBy({
      top: Math.max(window.innerHeight * 0.92, 240),
      behavior: 'smooth'
    })
  })

  window.addEventListener('scroll', updateScrollHintVisibility, { passive: true })
  window.addEventListener('resize', updateScrollHintVisibility)
}

function updateScrollHintVisibility() {
  const button = document.querySelector('#scroll-hint')
  if (!button) return
  button.classList.toggle('is-hidden', shouldHideScrollHint())
}

function shouldHideScrollHint() {
  const doc = document.documentElement
  const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight)
  const canScroll = maxScroll > 24
  const nearBottom = window.scrollY >= maxScroll - 28
  return !siteBootstrapped || !canScroll || nearBottom
}
