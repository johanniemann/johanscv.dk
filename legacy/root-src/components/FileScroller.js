import files from '../data/files.json'
import { FileCard } from './FileCard.js'

let rafId = null
let running = false

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

  stopAutoScroll()
  running = true

  const step = () => {
    if (!running) return
    container.scrollLeft += 0.2

    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
      container.scrollLeft = 0
    }

    rafId = window.requestAnimationFrame(step)
  }

  const pause = () => {
    running = false
    stopAutoScroll()
  }

  const resume = () => {
    if (running) return
    running = true
    rafId = window.requestAnimationFrame(step)
  }

  container.addEventListener('mouseenter', pause)
  container.addEventListener('mouseleave', resume)
  container.addEventListener('focusin', pause)
  container.addEventListener('focusout', resume)

  rafId = window.requestAnimationFrame(step)
}

function stopAutoScroll() {
  if (rafId) {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }
}
