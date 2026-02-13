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
      <path d="M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Zm1.8.23 7.2 5.4 7.2-5.4a.25.25 0 0 0-.2-.48H5a.25.25 0 0 0-.2.48Z"/>
    </svg>
  `
}

function phoneIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.62 2.9a1.5 1.5 0 0 1 1.6.32l2.12 2.12a1.5 1.5 0 0 1 .33 1.62l-.86 1.72a1 1 0 0 0 .2 1.15l3.88 3.88a1 1 0 0 0 1.15.2l1.72-.86a1.5 1.5 0 0 1 1.62.33l2.12 2.12a1.5 1.5 0 0 1 .32 1.6l-.55 1.38a2.5 2.5 0 0 1-2.33 1.56c-2.13 0-5.22-1.1-8.35-4.24-3.14-3.13-4.24-6.22-4.24-8.35 0-.99.6-1.9 1.56-2.33l1.38-.55Z"/>
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
