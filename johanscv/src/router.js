import * as Home from './pages/Home.js'
import * as Projects from './pages/Projects.js'
import * as Files from './pages/Files.js'
import * as QuizPage from './pages/QuizPage.js'
import { PageTransition } from './components/PageTransition.js'

const routes = {
  '/': Home,
  '/projects': Projects,
  '/resume': Files,
  '/quiz': QuizPage
}

const BASE = import.meta.env.BASE_URL
const MAJOR_DURATION_MS = 500
const routeRedirects = {
  '/files': '/resume'
}

export function withBase(path) {
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${BASE}${clean}`
}

export function appPathFromLocation(pathname = window.location.pathname) {
  if (!pathname.startsWith(BASE)) return '/'

  const trimmed = pathname.slice(BASE.length - 1) || '/'
  if (trimmed.length > 1 && trimmed.endsWith('/')) return trimmed.slice(0, -1)
  return trimmed
}

export function initRouter({ mountEl, renderFrame, pageContext, onRouteChange }) {
  let transitionLock = false

  const renderCurrent = () => {
    const rawPath = appPathFromLocation()
    const path = routeRedirects[rawPath] || rawPath
    const page = routes[path] || routes['/']

    if (rawPath !== path) {
      history.replaceState({}, '', withBase(path))
    }

    mountEl.innerHTML = PageTransition(page.render(pageContext(path)))
    if (page.mount) {
      page.mount(pageContext(path))
    }
    onRouteChange(path)

    requestAnimationFrame(() => {
      const transitionNode = mountEl.querySelector('.page-transition-enter')
      if (transitionNode) transitionNode.classList.add('is-visible')
    })
  }

  const transitionToCurrent = () => {
    if (transitionLock) return

    transitionLock = true
    const activeView = mountEl.querySelector('.page-transition-enter')

    if (!activeView) {
      renderCurrent()
      transitionLock = false
      return
    }

    activeView.classList.remove('is-visible')
    activeView.classList.add('is-exiting')

    window.setTimeout(() => {
      renderCurrent()
      transitionLock = false
    }, MAJOR_DURATION_MS)
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-link]')
    if (!link) return

    const href = link.getAttribute('href')
    if (!href || !href.startsWith('/')) return

    event.preventDefault()
    if (href === appPathFromLocation()) return
    navigate(href, transitionToCurrent)
  })

  window.addEventListener('popstate', transitionToCurrent)
  renderFrame(renderCurrent)

  return {
    refresh: transitionToCurrent
  }
}

export function navigate(path, callback) {
  history.pushState({}, '', withBase(path))
  callback()
}
