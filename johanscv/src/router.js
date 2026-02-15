import * as Home from './pages/Home.js'
import * as Projects from './pages/Projects.js'
import * as Files from './pages/Files.js'
import * as Contact from './pages/Contact.js'
import * as Playground from './pages/Playground.js'
import { PageTransition } from './components/PageTransition.js'

const ROUTES = {
  '/': { module: Home },
  '/projects': { module: Projects },
  '/resume': { module: Files },
  '/contact': { module: Contact },
  '/playground': { module: Playground },
  '/quiz': { module: Playground },
  '/quiz/geojohan': {
    load: () => import('./pages/GeoJohan.js'),
    loadedModule: null,
    loadingPromise: null
  }
}

const BASE = import.meta.env.BASE_URL
const MAJOR_DURATION_MS = 500
const ROUTE_REDIRECTS = {
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
  let renderVersion = 0

  const renderCurrent = async () => {
    const currentRenderVersion = ++renderVersion
    const rawPath = appPathFromLocation()
    const path = ROUTE_REDIRECTS[rawPath] || rawPath
    const context = pageContext(path)

    if (rawPath !== path) {
      history.replaceState({}, '', withBase(path))
    }

    let pageModule
    try {
      pageModule = await resolveRouteModule(path)
    } catch (error) {
      console.error('Failed to load route module:', error)
      pageModule = ROUTES['/'].module
    }

    if (currentRenderVersion !== renderVersion) {
      return
    }

    const page = pageModule || ROUTES['/'].module
    mountEl.innerHTML = PageTransition(page.render(context))
    if (page.mount) {
      page.mount(context)
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
    const finalizeTransition = () => {
      void renderCurrent().finally(() => {
        transitionLock = false
      })
    }

    if (!activeView) {
      finalizeTransition()
      return
    }

    activeView.classList.remove('is-visible')
    activeView.classList.add('is-exiting')

    window.setTimeout(() => {
      finalizeTransition()
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
  renderFrame(() => {
    void renderCurrent()
  })

  return {
    refresh: transitionToCurrent
  }
}

async function resolveRouteModule(path) {
  const route = ROUTES[path] || ROUTES['/']
  if (route.module) return route.module

  if (route.loadedModule) {
    return route.loadedModule
  }

  if (!route.loadingPromise) {
    route.loadingPromise = route.load()
      .then((module) => {
        route.loadedModule = module
        return module
      })
      .finally(() => {
        route.loadingPromise = null
      })
  }

  return route.loadingPromise
}

export function navigate(path, callback) {
  history.pushState({}, '', withBase(path))
  callback()
}
