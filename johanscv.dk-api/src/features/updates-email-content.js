export const UPDATE_TOPIC_KEYS = ['projects', 'resume', 'interactive_services']

const DEFAULT_SITE_BASE_URL = 'https://johanscv.dk'

const TOPIC_META = {
  projects: {
    route: '/projects',
    label: {
      en: 'Projects',
      dk: 'Projekter'
    }
  },
  resume: {
    route: '/resume',
    label: {
      en: 'Resume',
      dk: 'CV'
    }
  },
  interactive_services: {
    route: '/playground',
    label: {
      en: 'Interactive services',
      dk: 'Interaktive services'
    }
  }
}

export function isValidUpdateTopic(topic) {
  return UPDATE_TOPIC_KEYS.includes(String(topic || '').trim())
}

export function resolveTopicLink(siteBaseUrl, topic) {
  const normalizedBaseUrl = normalizeBaseUrl(siteBaseUrl)
  const normalizedTopic = isValidUpdateTopic(topic) ? topic : ''
  const topicRoute = normalizedTopic ? TOPIC_META[normalizedTopic].route : '/'
  return `${normalizedBaseUrl}${topicRoute}`
}

export function buildWelcomeEmail({ locale = 'en', topics = [], siteBaseUrl = '', unsubscribeUrl = '' } = {}) {
  const normalizedLocale = locale === 'dk' ? 'dk' : 'en'
  const selectedTopics = topics.filter((topic) => isValidUpdateTopic(topic))
  const primaryTopic = selectedTopics[0] || ''
  const directLinkUrl = resolveTopicLink(siteBaseUrl, primaryTopic)
  const directLinkLabel = primaryTopic
    ? topicLabel(primaryTopic, normalizedLocale)
    : normalizedLocale === 'dk'
      ? 'johanscv.dk'
      : 'johanscv.dk'
  const selectedTopicList = selectedTopics.length
    ? selectedTopics.map((topic) => topicLabel(topic, normalizedLocale)).join(', ')
    : normalizedLocale === 'dk'
      ? 'projekter, CV og interaktive services'
      : 'projects, resume, and interactive services'

  if (normalizedLocale === 'dk') {
    const subject = 'Velkommen til opdateringer fra johanscv.dk'
    const html = renderEmailLayout({
      eyebrow: 'Velkomstmail',
      title: 'Tak for din tilmelding',
      paragraphs: [
        `Du er nu tilmeldt opdateringer om ${escapeHtml(selectedTopicList)}.`,
        'Jeg er Johan Niemann Husbjerg, IT-arkitekturstuderende, og jeg bygger johanscv.dk som et præcist overblik over mine projekter, mit CV og de interaktive services, jeg udvikler undervejs.',
        'Du får kun mails, når der faktisk er en relevant ændring i de emner, du har valgt. Hver mail forklarer kort hvad der er ændret, hvorfor det er relevant og linker dig direkte videre.'
      ],
      ctaLabel: `Åbn ${escapeHtml(directLinkLabel)}`,
      ctaUrl: directLinkUrl,
      footerText: `Afmeld opdateringer: <a href="${escapeAttribute(unsubscribeUrl)}">Afmeld</a>`
    })
    const text = [
      subject,
      '',
      `Du er nu tilmeldt opdateringer om ${selectedTopicList}.`,
      '',
      'Jeg er Johan Niemann Husbjerg, IT-arkitekturstuderende, og jeg bygger johanscv.dk som et præcist overblik over mine projekter, mit CV og de interaktive services, jeg udvikler undervejs.',
      '',
      'Du får kun mails, når der faktisk er en relevant ændring i de emner, du har valgt. Hver mail forklarer kort hvad der er ændret, hvorfor det er relevant og linker dig direkte videre.',
      '',
      `Direkte link: ${directLinkUrl}`,
      `Afmeld: ${unsubscribeUrl}`
    ].join('\n')

    return { subject, html, text }
  }

  const subject = "Welcome to Johan's updates"
  const html = renderEmailLayout({
    eyebrow: 'Welcome',
    title: 'Thanks for signing up',
    paragraphs: [
      `You're now signed up for updates about ${escapeHtml(selectedTopicList)}.`,
      "I'm Johan Niemann Husbjerg, an IT Architecture student, and I build johanscv.dk as a focused overview of my projects, my resume, and the interactive services I'm shaping along the way.",
      "You'll only get an email when something relevant changes in the topics you selected. Each update explains what changed, why it matters, and links you straight to it."
    ],
    ctaLabel: `Open ${escapeHtml(directLinkLabel)}`,
    ctaUrl: directLinkUrl,
    footerText: `Unsubscribe from updates: <a href="${escapeAttribute(unsubscribeUrl)}">Unsubscribe</a>`
  })
  const text = [
    subject,
    '',
    `You're now signed up for updates about ${selectedTopicList}.`,
    '',
    "I'm Johan Niemann Husbjerg, an IT Architecture student, and I build johanscv.dk as a focused overview of my projects, my resume, and the interactive services I'm shaping along the way.",
    '',
    "You'll only get an email when something relevant changes in the topics you selected. Each update explains what changed, why it matters, and links you straight to it.",
    '',
    `Direct link: ${directLinkUrl}`,
    `Unsubscribe: ${unsubscribeUrl}`
  ].join('\n')

  return { subject, html, text }
}

export function buildUpdateBroadcastEmail({
  locale = 'dk',
  topic = '',
  subject = '',
  whatChanged = '',
  whyRelevant = '',
  link = '',
  linkLabel = ''
} = {}) {
  const normalizedLocale = locale === 'en' ? 'en' : 'dk'
  const normalizedSubject = String(subject || '').trim()
  const normalizedWhatChanged = String(whatChanged || '').trim()
  const normalizedWhyRelevant = String(whyRelevant || '').trim()
  const normalizedLink = String(link || '').trim()
  const normalizedLinkLabel = String(linkLabel || '').trim() || defaultUpdateCtaLabel(normalizedLocale, topic)
  const unsubscribeLabel = normalizedLocale === 'dk' ? 'Afmeld opdateringer' : 'Unsubscribe from updates'

  const sectionLabels =
    normalizedLocale === 'dk'
      ? {
          eyebrow: topic ? topicLabel(topic, 'dk') : 'Opdatering',
          title: normalizedSubject,
          changedHeading: 'Hvad er ændret',
          whyHeading: 'Hvorfor er det relevant'
        }
      : {
          eyebrow: topic ? topicLabel(topic, 'en') : 'Update',
          title: normalizedSubject,
          changedHeading: 'What changed',
          whyHeading: 'Why it matters'
        }

  const html = renderEmailLayout({
    eyebrow: sectionLabels.eyebrow,
    title: sectionLabels.title,
    sections: [
      {
        heading: sectionLabels.changedHeading,
        body: escapeHtml(normalizedWhatChanged)
      },
      {
        heading: sectionLabels.whyHeading,
        body: escapeHtml(normalizedWhyRelevant)
      }
    ],
    ctaLabel: escapeHtml(normalizedLinkLabel),
    ctaUrl: normalizedLink,
    footerText: `${unsubscribeLabel}: <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">${unsubscribeLabel}</a>`
  })

  const text = [
    normalizedSubject,
    '',
    `${sectionLabels.changedHeading}:`,
    normalizedWhatChanged,
    '',
    `${sectionLabels.whyHeading}:`,
    normalizedWhyRelevant,
    '',
    `${normalizedLinkLabel}: ${normalizedLink}`,
    `${unsubscribeLabel}: {{{RESEND_UNSUBSCRIBE_URL}}}`
  ].join('\n')

  return {
    subject: normalizedSubject,
    html,
    text
  }
}

function renderEmailLayout({ eyebrow, title, paragraphs = [], sections = [], ctaLabel, ctaUrl, footerText }) {
  const paragraphMarkup = paragraphs.map((paragraph) => `<p style="${paragraphStyle()}">${paragraph}</p>`).join('')
  const sectionMarkup = sections
    .map(
      (section) => `
        <section style="margin-top:20px;">
          <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1f2937;">${escapeHtml(section.heading)}</p>
          <p style="${paragraphStyle()}">${section.body}</p>
        </section>
      `
    )
    .join('')

  return `
    <div style="margin:0;padding:32px 16px;background:#f4efe6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5dccd;border-radius:20px;padding:28px 26px;">
        <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#8a5d38;">${escapeHtml(eyebrow)}</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.18;color:#111827;">${escapeHtml(title)}</h1>
        ${paragraphMarkup}
        ${sectionMarkup}
        <p style="margin:24px 0 0;">
          <a href="${escapeAttribute(ctaUrl)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#1f2937;color:#ffffff;text-decoration:none;font-weight:700;">${ctaLabel}</a>
        </p>
        <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#6b7280;">${footerText}</p>
      </div>
    </div>
  `
}

function paragraphStyle() {
  return 'margin:0 0 12px;font-size:15px;line-height:1.7;color:#374151;'
}

function topicLabel(topic, locale) {
  const normalizedTopic = isValidUpdateTopic(topic) ? topic : 'projects'
  const normalizedLocale = locale === 'dk' ? 'dk' : 'en'
  return TOPIC_META[normalizedTopic].label[normalizedLocale]
}

function defaultUpdateCtaLabel(locale, topic) {
  const normalizedLocale = locale === 'en' ? 'en' : 'dk'
  const normalizedTopic = isValidUpdateTopic(topic) ? topic : ''

  if (normalizedLocale === 'en') {
    if (!normalizedTopic) return 'Open update'
    return `Open ${topicLabel(normalizedTopic, 'en')}`
  }

  if (!normalizedTopic) return 'Åbn opdatering'
  return `Åbn ${topicLabel(normalizedTopic, 'dk')}`
}

function normalizeBaseUrl(value) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return DEFAULT_SITE_BASE_URL

  try {
    const parsed = new URL(trimmed)
    return parsed.toString().replace(/\/$/, '')
  } catch {
    return DEFAULT_SITE_BASE_URL
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttribute(value) {
  return escapeHtml(value)
}
