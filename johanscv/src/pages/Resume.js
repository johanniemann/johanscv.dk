import resumeData from '../data/resume.json'

export function render({ t, language }) {
  const data = resumeData[language] || resumeData.dk
  const resumePdfUrl = `${import.meta.env.BASE_URL}files/johan-niemann-husbjerg-cv.pdf`

  return `
    <main class="page-stack">
      <section class="content-section section-reveal" id="resume-intro">
        <div class="resume-intro-head">
          <div>
            <h2 class="section-title">${t.files.title}</h2>
            <p class="section-body">${t.files.intro}</p>
          </div>
          <a class="file-action resume-download-action" href="${resumePdfUrl}" download aria-label="${t.resume.downloadPdf}">
            <span class="file-action-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M11.25 3.75a.75.75 0 0 1 1.5 0v9.69l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V3.75Z"/>
                <path d="M4.5 17.25a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1-.75-.75Z"/>
              </svg>
            </span>
            <span class="file-action-text">${t.resume.downloadPdf}</span>
          </a>
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-education">
        <h3 class="resume-heading">${t.resume.education}</h3>
        <div class="resume-list">
          ${data.education.map(educationItem).join('')}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-experience">
        <h3 class="resume-heading">${t.resume.experience}</h3>
        <div class="resume-list">
          ${data.experience.map(experienceItem).join('')}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-voluntary">
        <h3 class="resume-heading">${t.resume.voluntary}</h3>
        <div class="resume-list">
          ${data.voluntary.map(voluntaryItem).join('')}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-qualifications">
        <h3 class="resume-heading">${t.resume.qualifications}</h3>
        <div class="qual-grid">
          <article class="qual-card">
            <h4 class="qual-title">${t.resume.itSkills}</h4>
            <ul class="qual-list">
              ${data.qualifications.it.map(listItem).join('')}
            </ul>
          </article>
          <article class="qual-card">
            <h4 class="qual-title">${t.resume.personalQualities}</h4>
            <ul class="qual-list">
              ${data.qualifications.personal.map(listItem).join('')}
            </ul>
          </article>
        </div>
      </section>
    </main>
  `
}

function educationItem(item) {
  return `
    <article class="resume-item">
      <p class="resume-item-type">${item.level}</p>
      <h4 class="resume-item-title">${item.institution}</h4>
      <p class="resume-item-focus">- ${item.focus}</p>
      <p class="resume-item-period">${item.period}</p>
    </article>
  `
}

function experienceItem(item) {
  return `
    <article class="resume-item">
      <h4 class="resume-item-title">${item.role}</h4>
      <p class="resume-item-body">${item.description}</p>
      <p class="resume-item-period"><span class="resume-item-type">${item.type}</span>: ${item.period}</p>
    </article>
  `
}

function voluntaryItem(item) {
  return `
    <article class="resume-item">
      <h4 class="resume-item-title">${item.role}</h4>
      <p class="resume-item-body">${item.description}</p>
      <p class="resume-item-period">${item.period}</p>
    </article>
  `
}

function listItem(item) {
  return `<li>${item}</li>`
}
