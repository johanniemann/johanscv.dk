import files from '../data/files.json'
import { FileCard } from './FileCard.js'

let rafId = null
let running = false
let resumeTimer = null

export function FileScroller() {
  return `
    <section class="files-strip section-reveal" id="file-scroller-wrap">
      <div id="file-scroller" class="file-scroller">
        ${files.map((file) => FileCard(file)).join('')}
      </div>
    </section>
  `
}

export function bindFileScroller() {
  const container = document.querySelector('#file-scroller')
  if (!container) return

  cleanup()
  stopAutoScroll()
  running = true
  let lastTime = performance.now()

  const step = (now) => {
    if (!running) return
    const delta = now - lastTime
    lastTime = now
    container.scrollLeft += delta * 0.02

    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
      container.scrollLeft = 0
    }

    rafId = window.requestAnimationFrame(step)
  }

  const pause = () => {
    clearResume()
    running = false
    stopAutoScroll()
  }

  const resume = () => {
    clearResume()
    if (running) return
    running = true
    lastTime = performance.now()
    rafId = window.requestAnimationFrame(step)
  }

  const pauseThenResume = () => {
    pause()
    resumeTimer = window.setTimeout(resume, 1200)
  }

  container.addEventListener('mouseenter', pause)
  container.addEventListener('mouseleave', resume)
  container.addEventListener('focusin', pause)
  container.addEventListener('focusout', resume)
  container.addEventListener('pointerdown', pauseThenResume)
  container.addEventListener('touchstart', pauseThenResume, { passive: true })
  container.addEventListener('wheel', pauseThenResume, { passive: true })

  rafId = window.requestAnimationFrame(step)
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
