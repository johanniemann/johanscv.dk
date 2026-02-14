export function render({ t }) {
  return `
    <main class="page-stack">
      <section class="content-section section-reveal" id="contact-intro">
        <h2 class="section-title">${t.contact.title}</h2>
        <p class="section-body">${t.contact.intro}</p>
      </section>

      <section class="contact-stack section-reveal" aria-label="${t.contact.title}">
        ${contactRow({
          label: t.contact.emailLabel,
          value: 'johan.niemann.husbjerg@gmail.com',
          action: contactButton({
            type: 'button',
            icon: emailIcon(),
            text: t.contact.copyEmail,
            attrs: 'data-copy="johan.niemann.husbjerg@gmail.com"'
          })
        })}
        ${contactRow({
          label: t.contact.phoneLabel,
          value: '+45 60 47 42 36',
          action: contactButton({
            type: 'button',
            icon: phoneIcon(),
            text: t.contact.copyPhone,
            attrs: 'data-copy="+45 60 47 42 36"'
          })
        })}
        ${contactRow({
          label: t.contact.linkedinLabel,
          value: 'linkedin.com/in/johan-niemann-h-038906312',
          action: contactButton({
            type: 'link',
            icon: 'in',
            text: t.contact.connectLinkedin,
            attrs: 'href="https://www.linkedin.com/in/johan-niemann-h-038906312/" target="_blank" rel="noopener noreferrer"'
          })
        })}
      </section>
    </main>
  `
}

export function mount({ t }) {
  const copyButtons = document.querySelectorAll('[data-copy]')
  copyButtons.forEach((button) => {
    button.dataset.defaultLabel = button.querySelector('.file-action-text')?.textContent || ''
    button.addEventListener('click', async () => {
      if (button.dataset.busy === 'true') return
      const value = button.getAttribute('data-copy') || ''
      if (!value) return
      const copied = await copyToClipboard(value)
      if (!copied) return

      await animateCopyLabel(button, t.contact.copied)
    })
  })
}

function contactRow({ label, value, action }) {
  return `
    <article class="contact-row">
      <div class="contact-meta">
        <h3 class="contact-label">${label}</h3>
        <p class="contact-value">${value}</p>
      </div>
      <div class="contact-action-wrap">
        ${action}
      </div>
    </article>
  `
}

function contactButton({ type, icon, text, attrs }) {
  const tag = type === 'link' ? 'a' : 'button'
  const typeAttr = type === 'button' ? 'type="button"' : ''
  return `
    <${tag} class="file-action contact-action" ${typeAttr} ${attrs} aria-label="${text}">
      <span class="file-action-icon" aria-hidden="true">${icon}</span>
      <span class="file-action-text">${text}</span>
    </${tag}>
  `
}

function emailIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.75 5.5h14.5A1.25 1.25 0 0 1 20.5 6.75v10.5a1.25 1.25 0 0 1-1.25 1.25H4.75a1.25 1.25 0 0 1-1.25-1.25V6.75A1.25 1.25 0 0 1 4.75 5.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="m4.5 7 7.5 5.8L19.5 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

function phoneIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.9 3.8h2.8c.4 0 .8.27.9.67l.78 3.15a1 1 0 0 1-.28.96L9.78 10.9a13.2 13.2 0 0 0 3.31 3.31l2.32-1.32a1 1 0 0 1 .96-.28l3.15.78c.4.1.67.49.67.9v2.8a1.9 1.9 0 0 1-2.06 1.9c-2.7-.2-5.3-1.42-7.79-3.66-2.24-2.03-3.7-4.28-4.36-6.76-.29-1.1-.45-2.2-.49-3.3A1.9 1.9 0 0 1 6.9 3.8Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
}

async function copyToClipboard(value) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(textarea)
    return copied
  }
}

async function animateCopyLabel(button, copiedLabel) {
  const labelEl = button.querySelector('.file-action-text')
  if (!labelEl) return

  const originalLabel = button.dataset.defaultLabel || labelEl.textContent || ''
  const FADE_MS = 180
  const HOLD_MS = 900

  button.dataset.busy = 'true'
  button.classList.add('is-label-hidden')
  await wait(FADE_MS)

  labelEl.textContent = copiedLabel
  button.classList.remove('is-label-hidden')
  await wait(HOLD_MS)

  button.classList.add('is-label-hidden')
  await wait(FADE_MS)

  labelEl.textContent = originalLabel
  button.classList.remove('is-label-hidden')
  button.dataset.busy = 'false'
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
