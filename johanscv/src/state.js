const STORAGE_KEYS = {
  theme: 'johanscv.theme',
  language: 'johanscv.language'
}

const listeners = new Set()

let state = {
  theme: localStorage.getItem(STORAGE_KEYS.theme) || 'dark',
  language: localStorage.getItem(STORAGE_KEYS.language) || 'en',
  route: '/'
}

applyDomState(state)

export function getState() {
  return state
}

export function setState(partial) {
  const previous = state
  const next = { ...state, ...partial }
  if (!hasStateChange(previous, next)) return
  state = next

  if (hasPersistentChange(previous, state)) {
    persistState()
  }

  if (hasDomChange(previous, state)) {
    applyDomState(state)
  }

  notify()
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notify() {
  listeners.forEach((listener) => listener(state))
}

function persistState() {
  localStorage.setItem(STORAGE_KEYS.theme, state.theme)
  localStorage.setItem(STORAGE_KEYS.language, state.language)
}

function applyDomState(current) {
  document.documentElement.dataset.theme = current.theme
  document.documentElement.classList.toggle('dark', current.theme === 'dark')
}

function hasPersistentChange(previous, next) {
  return previous.theme !== next.theme || previous.language !== next.language
}

function hasDomChange(previous, next) {
  return previous.theme !== next.theme
}

function hasStateChange(previous, next) {
  return previous.theme !== next.theme || previous.language !== next.language || previous.route !== next.route
}
