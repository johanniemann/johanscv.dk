import files from '../data/files.json'
import { FileCard } from './FileCard.js'

let rafId = null
let running = false
let resumeTimer = null
const SPEED_PX_PER_MS = 0.018

export function FileScroller() {
  const cards = files.map((file) => FileCard(file)).join('')
  const clones = files.map((file) => FileCard(file, true)).join('')

  return `
    <section class="files-strip section-reveal" id="file-scroller-wrap">
      <div id="file-scroller-viewport" class="file-scroller-viewport" tabindex="0" aria-label="Downloadable files">
        <div id="file-scroller-track" class="file-scroller-track">
          ${cards}
          ${clones}
        </div>
      </div>
    </section>
  `
}

export function bindFileScroller() {
  const viewport = document.querySelector('#file-scroller-viewport')
  const track = document.querySelector('#file-scroller-track')
  if (!viewport || !track) return

  cleanup()
  stopAutoScroll()
  running = true
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let dragging = false
  let pointerActive = false
  let pointerId = null
  let moved = false
  let dragStartX = 0
  let dragStartOffset = 0
  let offset = 0
  let loopWidth = track.scrollWidth / 2
  let lastTime = performance.now()

  const applyOffset = () => {
    track.style.transform = `translate3d(${-offset}px, 0, 0)`
  }

  const normalizeOffset = (value) => {
    if (!loopWidth) return 0
    const next = value % loopWidth
    return next < 0 ? next + loopWidth : next
  }

  const step = (now) => {
    if (!running || reducedMotion || dragging) return
    const delta = now - lastTime
    lastTime = now
    offset = normalizeOffset(offset + delta * SPEED_PX_PER_MS)
    applyOffset()

    rafId = window.requestAnimationFrame(step)
  }

  const pause = () => {
    clearResume()
    running = false
    stopAutoScroll()
  }

  const resume = () => {
    clearResume()
    if (running || reducedMotion || dragging) return
    running = true
    lastTime = performance.now()
    rafId = window.requestAnimationFrame(step)
  }

  const pauseThenResume = () => {
    pause()
    resumeTimer = window.setTimeout(resume, 1200)
  }

  const onPointerDown = (event) => {
    if (event.target.closest('a, button, input, textarea, select')) {
      pause()
      resumeTimer = window.setTimeout(resume, 1200)
      return
    }

    pointerActive = true
    pointerId = event.pointerId
    moved = false
    dragStartX = event.clientX
    dragStartOffset = offset
    pause()
    viewport.setPointerCapture(pointerId)
  }

  const onPointerMove = (event) => {
    if (!pointerActive || event.pointerId !== pointerId) return
    const deltaX = event.clientX - dragStartX
    if (!moved && Math.abs(deltaX) > 6) {
      moved = true
      dragging = true
      viewport.classList.add('is-dragging')
    }
    if (!dragging) return
    offset = normalizeOffset(dragStartOffset - deltaX)
    applyOffset()
  }

  const onPointerUp = (event) => {
    if (!pointerActive || event.pointerId !== pointerId) return
    pointerActive = false
    pointerId = null
    dragging = false
    viewport.classList.remove('is-dragging')
    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId)
    }
    resumeTimer = window.setTimeout(resume, moved ? 900 : 1200)
  }

  const onWheel = (event) => {
    pause()
    offset = normalizeOffset(offset + event.deltaY * 0.8 + event.deltaX)
    applyOffset()
    resumeTimer = window.setTimeout(resume, 1100)
  }

  viewport.addEventListener('mouseenter', pause)
  viewport.addEventListener('mouseleave', resume)
  viewport.addEventListener('focusin', pause)
  viewport.addEventListener('focusout', resume)
  viewport.addEventListener('pointerdown', onPointerDown)
  viewport.addEventListener('pointermove', onPointerMove)
  viewport.addEventListener('pointerup', onPointerUp)
  viewport.addEventListener('pointercancel', onPointerUp)
  viewport.addEventListener('wheel', onWheel, { passive: true })

  // Ensure dimensions are up to date before starting animation.
  window.requestAnimationFrame(() => {
    loopWidth = track.scrollWidth / 2
    applyOffset()
  })

  if (!reducedMotion) {
    rafId = window.requestAnimationFrame(step)
  }
}

function stopAutoScroll() {
  if (rafId) {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }
}

function clearResume() {
  if (!resumeTimer) return
  window.clearTimeout(resumeTimer)
  resumeTimer = null
}

function cleanup() {
  clearResume()
}
