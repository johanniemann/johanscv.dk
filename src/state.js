const STORAGE_KEYS = {
  theme: 'johanscv.theme',
  language: 'johanscv.language',
  quizUnlocked: 'johanscv.quizUnlocked'
}

const listeners = new Set()

let state = {
  theme: localStorage.getItem(STORAGE_KEYS.theme) || 'dark',
  language: localStorage.getItem(STORAGE_KEYS.language) || 'en',
  quizUnlocked: localStorage.getItem(STORAGE_KEYS.quizUnlocked) === 'true',
  route: '/'
}

applyDomState(state)

export function getState() {
  return state
}

export function setState(partial) {
  state = { ...state, ...partial }
  persistState()
  applyDomState(state)
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
  localStorage.setItem(STORAGE_KEYS.quizUnlocked, String(state.quizUnlocked))
}

function applyDomState(current) {
  document.documentElement.dataset.theme = current.theme
  document.documentElement.classList.toggle('dark', current.theme === 'dark')
  document.body.classList.toggle('quiz-unlocked', current.quizUnlocked)
}
