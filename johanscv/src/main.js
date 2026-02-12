import './styles/globals.css'
import './styles/animations.css'
import translations from './data/translations.json'
import { Navbar } from './components/Navbar.js'
import { bindThemeToggle } from './components/ThemeToggle.js'
import { bindLanguageToggle } from './components/LanguageToggle.js'
import { getState, setState, subscribe } from './state.js'
import { initRouter } from './router.js'

restoreRedirectedPath()

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="site-shell">
    <div id="nav-root"></div>
    <div id="page-root"></div>
  </div>
`

const navRoot = document.querySelector('#nav-root')
const pageRoot = document.querySelector('#page-root')
let navHidden = false

initRouter({
  mountEl: pageRoot,
  renderFrame: (renderRoute) => {
    renderRoute()
    initNavbarScrollBehavior()
    subscribe(() => {
      renderNav()
    })
  },
  pageContext: () => {
    const state = getState()
    const t = translations[state.language] || translations.en

    return {
      t,
      onQuizComplete: () => setState({ quizUnlocked: true })
    }
  },
  onRouteChange: (route) => {
    setState({ route })
    renderNav()
    initRevealObserver()
  }
})

function renderNav() {
  const state = getState()
  const t = translations[state.language] || translations.en

  navRoot.innerHTML = Navbar({
    route: state.route,
    t,
    theme: state.theme,
    language: state.language
  })

  bindThemeToggle(() => {
    const next = getState().theme === 'dark' ? 'light' : 'dark'
    setState({ theme: next })
  })

  bindLanguageToggle(() => {
    const next = getState().language === 'en' ? 'dk' : 'en'
    setState({ language: next })
    window.dispatchEvent(new PopStateEvent('popstate'))
  })

  syncNavbarVisibility()
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
    { threshold: 0.2 }
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
