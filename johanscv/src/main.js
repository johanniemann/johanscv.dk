import './styles/globals.css'
import './styles/animations.css'
import translations from './data/translations.json'
import { Navbar } from './components/Navbar.js'
import { Footer, bindFooterInfoPopup } from './components/Footer.js'
import { WelcomeGate, bindWelcomeGate } from './components/WelcomeGate.js'
import { bindThemeToggle } from './components/ThemeToggle.js'
import { bindLanguageToggle } from './components/LanguageToggle.js'
import { warmUpAskJohanApi } from './features/ask-johan/AskJohanWidget.js'
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
const API_MODE = import.meta.env.VITE_ASK_JOHAN_MODE === 'api'
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const DEV_ACCESS_CODE = import.meta.env.DEV ? String(import.meta.env.VITE_DEV_ACCESS_CODE || '').trim() : ''
const DEV_AUTO_LOGIN =
  import.meta.env.DEV && import.meta.env.VITE_DEV_AUTO_LOGIN === 'true' && Boolean(DEV_ACCESS_CODE)
const API_LOGIN_PATH = '/auth/login'
const API_AUTH_TIMEOUT_MS = 10000
const API_AUTH_MAX_WAIT_MS = 75000
const API_AUTH_RETRY_DELAY_MS = 1200
const WELCOME_EXIT_MS = 500
const REVEAL_THRESHOLD = 0.2
const FOOTER_SHIFT_ANIMATION_MS = 340
const FOOTER_SHIFT_MAX_DELTA_PX = 120
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
let footerPositionObserver = null
let footerPositionAnimationFrame = 0
let footerTransitionResetTimer = null
let lastFooterTop = null

void initAccessGate()

async function initAccessGate() {
  if (DEV_AUTO_LOGIN) {
    localStorage.setItem(ACCESS_CODE_KEY, DEV_ACCESS_CODE)
    localStorage.setItem(SITE_ACCESS_KEY, 'true')
    bootstrapSite()
    return
  }

  if (await hasValidSiteAccess()) {
    bootstrapSite()
  } else {
    renderWelcomeGate()
  }
}

function bootstrapSite() {
  if (siteBootstrapped) return
  siteBootstrapped = true
  void warmUpAskJohanApi()

  router = initRouter({
    mountEl: pageRoot,
    renderFrame: (renderRoute) => {
      renderRoute()
      initNavbarScrollBehavior()
    },
    pageContext: (route) => {
      const state = getState()
      const t = getTranslations(state.language)

      return {
        t,
        language: state.language,
        route
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
  initFooterPositionSmoothing()
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
  window.clearTimeout(footerTransitionResetTimer)
  resetFooterMotionStyles()
  const previousFooterTop = footerRoot.getBoundingClientRect().top
  if (Number.isFinite(previousFooterTop)) {
    lastFooterTop = previousFooterTop
  }

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

  bindFooterInfoPopup()
  scheduleFooterPositionAnimation()
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
    link.classList.toggle('active', isNavActiveRoute(href, route))
  })
}

function isNavActiveRoute(linkPath, currentRoute) {
  if (!linkPath || !currentRoute) return false
  if (linkPath === '/') return currentRoute === '/'
  return currentRoute === linkPath || currentRoute.startsWith(`${linkPath}/`)
}

function initFooterPositionSmoothing() {
  if (footerPositionObserver || typeof ResizeObserver === 'undefined') return

  lastFooterTop = footerRoot.getBoundingClientRect().top
  footerPositionObserver = new ResizeObserver(() => {
    scheduleFooterPositionAnimation()
  })

  footerPositionObserver.observe(pageRoot)
  window.addEventListener('resize', scheduleFooterPositionAnimation, { passive: true })
}

function scheduleFooterPositionAnimation() {
  if (footerPositionAnimationFrame) {
    window.cancelAnimationFrame(footerPositionAnimationFrame)
  }

  footerPositionAnimationFrame = window.requestAnimationFrame(() => {
    footerPositionAnimationFrame = 0
    animateFooterPositionIfMoved()
  })
}

function animateFooterPositionIfMoved() {
  const nextTop = footerRoot.getBoundingClientRect().top
  if (!Number.isFinite(nextTop)) return

  if (lastFooterTop === null) {
    lastFooterTop = nextTop
    return
  }

  const deltaY = lastFooterTop - nextTop
  lastFooterTop = nextTop
  if (Math.abs(deltaY) < 1) {
    resetFooterMotionStyles()
    return
  }
  if (Math.abs(deltaY) > FOOTER_SHIFT_MAX_DELTA_PX) {
    resetFooterMotionStyles()
    return
  }

  window.clearTimeout(footerTransitionResetTimer)
  footerRoot.style.transition = 'none'
  footerRoot.style.transform = `translateY(${deltaY}px)`
  footerRoot.style.willChange = 'transform'

  void footerRoot.offsetHeight

  window.requestAnimationFrame(() => {
    footerRoot.style.transition = `transform ${FOOTER_SHIFT_ANIMATION_MS}ms var(--ease-standard)`
    footerRoot.style.transform = 'translateY(0)'

    footerTransitionResetTimer = window.setTimeout(resetFooterMotionStyles, FOOTER_SHIFT_ANIMATION_MS + 50)
  })
}

function resetFooterMotionStyles() {
  footerRoot.style.transition = ''
  footerRoot.style.transform = ''
  footerRoot.style.willChange = ''
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

  bindWelcomeGate(async (accessCode) => {
    const accessCheck = await validateSiteAccessCode(accessCode)
    if (!accessCheck?.ok) {
      return { ok: false, message: resolveWelcomeAccessErrorMessage(t, accessCheck) }
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
  }, { t, apiMode: API_MODE && Boolean(API_BASE) })
}

async function validateSiteAccessCode(accessCode) {
  if (!accessCode) {
    return {
      ok: false,
      status: 400
    }
  }
  if (API_MODE && API_BASE) {
    return validateAccessCodeWithApi(accessCode)
  }
  return {
    ok: true,
    status: 200
  }
}

async function hasValidSiteAccess() {
  const hasSiteAccess = localStorage.getItem(SITE_ACCESS_KEY) === 'true'
  const savedAccessCode = localStorage.getItem(ACCESS_CODE_KEY)?.trim() || ''
  if (!hasSiteAccess || !savedAccessCode) return false
  const accessCheck = await validateSiteAccessCode(savedAccessCode)
  return Boolean(accessCheck?.ok)
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

async function validateAccessCodeWithApi(accessCode) {
  const startedAt = Date.now()
  let lastResult = null

  while (Date.now() - startedAt < API_AUTH_MAX_WAIT_MS) {
    const result = await validateAccessCodeWithApiAttempt(accessCode)
    if (!isTransientAccessCheckResult(result)) {
      return result
    }

    lastResult = result
    const elapsedMs = Date.now() - startedAt
    const remainingMs = API_AUTH_MAX_WAIT_MS - elapsedMs
    if (remainingMs <= 0) break
    await delay(Math.min(API_AUTH_RETRY_DELAY_MS, remainingMs))
  }

  return lastResult || { ok: false, status: 0, reason: 'timeout' }
}

async function validateAccessCodeWithApiAttempt(accessCode) {
  try {
    const response = await fetchWithTimeout(`${API_BASE}${API_LOGIN_PATH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accessCode })
    })
    const payload = await parseJsonSafely(response)
    return {
      ok: response.ok,
      status: response.status,
      answer: typeof payload?.answer === 'string' ? payload.answer.trim() : ''
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      reason: error?.name === 'AbortError' ? 'timeout' : 'network'
    }
  }
}

function isTransientAccessCheckResult(result) {
  const status = Number(result?.status || 0)
  return status === 0 || status >= 500
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function resolveWelcomeAccessErrorMessage(t, accessCheck) {
  const status = Number(accessCheck?.status || 0)
  if (status === 0 && accessCheck?.reason === 'timeout') {
    return t.welcome.passwordColdStart || t.welcome.passwordNetwork || t.welcome.passwordError
  }
  if (status === 401 || status === 400) return t.welcome.passwordError
  if (status === 429) return t.welcome.passwordRateLimited || t.welcome.passwordError
  if (status === 403) return t.welcome.passwordForbidden || t.welcome.passwordError
  if (status >= 500) return t.welcome.passwordUnavailable || t.welcome.passwordError
  if (status === 0) return t.welcome.passwordNetwork || t.welcome.passwordError
  return t.welcome.passwordError
}

function fetchWithTimeout(url, options) {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), API_AUTH_TIMEOUT_MS)

  return fetch(url, {
    ...options,
    signal: controller.signal
  }).finally(() => {
    window.clearTimeout(timeoutId)
  })
}

async function parseJsonSafely(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}
