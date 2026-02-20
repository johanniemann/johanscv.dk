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

initRouter({
  mountEl: pageRoot,
  renderFrame: (renderRoute) => {
    renderRoute()
    subscribe(() => {
      renderNav()
    })
  },
  pageContext: () => {
    const state = getState()
    const t = translations[state.language] || translations.en

    return {
      t
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
    window.location.reload()
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
    { threshold: 0.2 }
  )

  elements.forEach((element) => observer.observe(element))
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
