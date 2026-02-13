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
`

const ACCESS_CODE_KEY = 'johanscv.askJohanAccessCode'
const SITE_ACCESS_KEY = 'johanscv.siteAccessGranted'
const WELCOME_EXIT_MS = 500
const REVEAL_THRESHOLD = 0.2
const welcomeRoot = document.querySelector('#welcome-root')
const navRoot = document.querySelector('#nav-root')
const pageRoot = document.querySelector('#page-root')
const footerRoot = document.querySelector('#footer-root')
let navHidden = false
let navScrollInitialized = false

renderNav()
renderFooter()
renderWelcomeGate()
updateActiveNav(getState().route)

const router = initRouter({
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
  }
})

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
    router.refresh()
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
  const savedAccessCode = localStorage.getItem(ACCESS_CODE_KEY)?.trim() || ''
  const expectedAccessCode = (import.meta.env.VITE_SITE_ACCESS_CODE || '').trim()

  const isAccessCodeValid = (accessCode) => {
    if (!accessCode) return false
    if (!expectedAccessCode) return true
    return accessCode === expectedAccessCode
  }

  const hasSiteAccess = localStorage.getItem(SITE_ACCESS_KEY) === 'true'
  if (hasSiteAccess && isAccessCodeValid(savedAccessCode)) return

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
    document.body.classList.remove('welcome-active')
    window.setTimeout(() => {
      welcomeRoot.innerHTML = ''
    }, WELCOME_EXIT_MS)
    return { ok: true }
  })
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
