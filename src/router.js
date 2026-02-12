import * as Home from './pages/Home.js'
import * as Projects from './pages/Projects.js'
import * as Files from './pages/Files.js'
import * as QuizPage from './pages/QuizPage.js'
import { PageTransition } from './components/PageTransition.js'

const routes = {
  '/': Home,
  '/projects': Projects,
  '/files': Files,
  '/quiz': QuizPage
}

const BASE = import.meta.env.BASE_URL

export function withBase(path) {
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${BASE}${clean}`
}

export function appPathFromLocation(pathname = window.location.pathname) {
  if (!pathname.startsWith(BASE)) return '/'

  const trimmed = pathname.slice(BASE.length - 1)
  return trimmed === '' ? '/' : trimmed
}

export function initRouter({ mountEl, renderFrame, pageContext, onRouteChange }) {
  const renderCurrent = () => {
    const path = appPathFromLocation()
    const page = routes[path] || routes['/']
    onRouteChange(path)

    mountEl.innerHTML = PageTransition(page.render(pageContext(path)))
    if (page.mount) {
      page.mount(pageContext(path))
    }

    requestAnimationFrame(() => {
      const transitionNode = mountEl.querySelector('.page-transition-enter')
      if (transitionNode) transitionNode.classList.add('is-visible')
    })
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-link]')
    if (!link) return

    const href = link.getAttribute('href')
    if (!href || !href.startsWith('/')) return

    event.preventDefault()
    navigate(href, renderCurrent)
  })

  window.addEventListener('popstate', renderCurrent)
  renderFrame(renderCurrent)
}

export function navigate(path, callback) {
  history.pushState({}, '', withBase(path))
  callback()
}
