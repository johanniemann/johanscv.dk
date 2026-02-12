(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const te={nav:{home:"Home",projects:"Projects",files:"Resume",quiz:"Quiz"},hero:{name:"Johan Niemann Husbjerg",title:"IT Architecture student shaping precise, human-centered systems."},welcome:{title:"Welcome",intro:"This site is a focused overview of my architecture profile, practical experience, and current projects.",point1:"Explore projects and implementation work.",point2:"Review my full Resume / CV structure.",point3:"Use Ask Johan for quick context.",continue:"Continue"},ask:{title:"Ask Johan",placeholder:"Ask about skills, projects, or architecture...",button:"Answer"},projects:{title:"Projects",intro:"Focused work in architecture, frontend systems, and product execution.",previewTitle:"Selected Work",previewIntro:"A snapshot of practical architecture and frontend execution.",cta:"View all projects"},files:{title:"Resume / CV",intro:"Education, experience, voluntary work, and qualifications."},resume:{previewTitle:"Resume Snapshot",previewIntro:"A structured view of my education, practical experience, and key competencies.",cta:"Open Resume / CV",education:"Education",experience:"Work Experience",voluntary:"Voluntary Work",qualifications:"Qualifications",itSkills:"Core IT Skills",personalQualities:"Personal Qualities"},quiz:{title:"Architecture Quiz",intro:"Quick challenge to unlock enhanced visual mode."},footer:{builtWith:"Built with Vite, Tailwind, and Vanilla JavaScript.",rights:"All rights reserved."}},ne={nav:{home:"Hjem",projects:"Projekter",files:"CV",quiz:"Quiz"},hero:{name:"Johan Niemann Husbjerg",title:"IT-arkitekturstuderende med fokus på præcise, menneskelige systemer."},welcome:{title:"Velkommen",intro:"Denne side giver et fokuseret overblik over min arkitekturprofil, praktiske erfaring og nuværende projekter.",point1:"Se projekter og konkret implementeringsarbejde.",point2:"Gennemgå mit fulde Resume / CV.",point3:"Brug Ask Johan for hurtig kontekst.",continue:"Fortsat"},ask:{title:"Spørg Johan",placeholder:"Spørg om kompetencer, projekter eller arkitektur...",button:"Svar"},projects:{title:"Projekter",intro:"Fokuseret arbejde inden for arkitektur, frontend-systemer og produktudførelse.",previewTitle:"Udvalgt Arbejde",previewIntro:"Et udsnit af praktisk arkitektur og frontend-udførelse.",cta:"Se alle projekter"},files:{title:"Resume / CV",intro:"Uddannelse, arbejdserfaring, frivilligt arbejde og kvalifikationer."},resume:{previewTitle:"CV overblik",previewIntro:"Et struktureret overblik over uddannelse, praktisk erfaring og væsentlige kompetencer.",cta:"Åbn Resume / CV",education:"Uddannelse",experience:"Arbejdserfaring",voluntary:"Frivilligt arbejde",qualifications:"Kvalifikationer",itSkills:"Væsentlige IT-kundskaber",personalQualities:"Personlige kvaliteter"},quiz:{title:"Arkitektur Quiz",intro:"Kort udfordring der låser op for forbedret visuel tilstand."},footer:{builtWith:"Bygget med Vite, Tailwind og Vanilla JavaScript.",rights:"Alle rettigheder forbeholdes."}},f={en:te,dk:ne};function ie({route:e,t}){return`
    <header id="navbar" class="site-nav">
      <a class="brand" href="/" data-link>johanscv.dk</a>
      <nav class="nav-links" aria-label="Primary">
        ${A("/",t.nav.home,e)}
        ${A("/projects",t.nav.projects,e)}
        ${A("/resume",t.nav.files,e)}
        ${A("/quiz",t.nav.quiz,e)}
      </nav>
    </header>
  `}function A(e,t,n){const i=e==="/"?"home":e.slice(1);return`<a class="${n===e?`nav-link nav-link-${i} active`:`nav-link nav-link-${i}`}" href="${e}" data-link>${t}</a>`}function re(e){return`
    <button id="theme-toggle" class="toggle-pill ${e==="dark"?"is-dark":"is-light"}" type="button" aria-label="Toggle theme">
      <span class="toggle-option toggle-option-light">Light</span>
      <span class="toggle-option toggle-option-dark">Dark</span>
      <span class="toggle-knob"></span>
    </button>
  `}function se(e){const t=document.querySelector("#theme-toggle");t&&t.addEventListener("click",e)}function oe(e){return`
    <button id="language-toggle" class="lang-pill ${e==="dk"?"is-dk":"is-en"}" type="button" aria-label="Toggle language">
      <span class="lang-indicator"></span>
      <span class="lang-option">EN</span>
      <span class="lang-option">DK</span>
    </button>
  `}function ae(e){const t=document.querySelector("#language-toggle");t&&t.addEventListener("click",e)}function le({t:e,theme:t,language:n}){const i=new Date().getFullYear();return`
    <footer class="site-footer" aria-label="Footer">
      <div class="footer-top">
        <nav class="footer-links" aria-label="Footer navigation">
          <a href="/" data-link>${e.nav.home}</a>
          <a href="/projects" data-link>${e.nav.projects}</a>
          <a href="/resume" data-link>${e.nav.files}</a>
          <a href="/quiz" data-link>${e.nav.quiz}</a>
        </nav>
        <div class="footer-controls">
          ${oe(n)}
          ${re(t)}
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">&copy; ${i} Johan Niemann Husbjerg. ${e.footer.rights}</p>
        <p class="footer-built">${e.footer.builtWith}</p>
      </div>
    </footer>
  `}function ce({t:e}){return`
    <section class="welcome-screen" aria-label="Welcome">
      <div class="welcome-panel">
        <p class="welcome-kicker">johanscv.dk</p>
        <h1 class="welcome-title">${e.welcome.title}</h1>
        <p class="welcome-intro">${e.welcome.intro}</p>
        <ul class="welcome-points">
          <li>${e.welcome.point1}</li>
          <li>${e.welcome.point2}</li>
          <li>${e.welcome.point3}</li>
        </ul>
        <button id="welcome-continue" class="welcome-button" type="button">${e.welcome.continue}</button>
      </div>
    </section>
  `}function ue(e){const t=document.querySelector("#welcome-continue");t&&t.addEventListener("click",e)}const h={theme:"johanscv.theme",language:"johanscv.language",quizUnlocked:"johanscv.quizUnlocked"},de=new Set;let d={theme:localStorage.getItem(h.theme)||"dark",language:localStorage.getItem(h.language)||"en",quizUnlocked:localStorage.getItem(h.quizUnlocked)==="true",route:"/"};B(d);function g(){return d}function P(e){d={...d,...e},me(),B(d),pe()}function pe(){de.forEach(e=>e(d))}function me(){localStorage.setItem(h.theme,d.theme),localStorage.setItem(h.language,d.language),localStorage.setItem(h.quizUnlocked,String(d.quizUnlocked))}function B(e){document.documentElement.dataset.theme=e.theme,document.documentElement.classList.toggle("dark",e.theme==="dark"),document.body.classList.toggle("quiz-unlocked",e.quizUnlocked)}const H=[{id:"spa-architecture",title:{en:"SPA Architecture Foundation",dk:"SPA Arkitekturgrundlag"},summary:{en:"Designed a lightweight Vanilla JS SPA with explicit routing, transition orchestration, and durable state boundaries.",dk:"Designede en letvægts Vanilla JS SPA med tydelig routing, overgangsorkestrering og robuste state-graenser."},tags:["Vite","Vanilla JS","Routing"]},{id:"design-system",title:{en:"Interaction-Led Design System",dk:"Interaktionsdrevet Designsystem"},summary:{en:"Built a restrained visual language with theme tokens, glass surfaces, motion hierarchy, and responsive rhythm.",dk:"Byggede et afdaempet visuelt sprog med tematiske tokens, glasflader, motion-hierarki og responsiv rytme."},tags:["Tailwind","Theming","UX Motion"]},{id:"deployment-flow",title:{en:"GitHub Pages Deployment Flow",dk:"GitHub Pages Deploy-flow"},summary:{en:"Configured stable project-page deployment with base-path-safe assets and SPA fallback for deep links.",dk:"Konfigurerede stabil project-pages deployment med base-path-sikre assets og SPA fallback til deep links."},tags:["GitHub Pages","CI-ready","Reliability"]}];function ge({t:e}){return`
    <section class="hero section-reveal" id="hero">
      <div class="avatar-wrap">
        <div class="avatar-ring"></div>
        <img class="avatar" src="/WEBSITE/images/johan-placeholder.jpg" alt="Portrait of Johan" />
      </div>
      <h1 class="hero-name">${e.hero.name}</h1>
      <p class="hero-title">${e.hero.title}</p>
    </section>
  `}const fe="I focus on architecture thinking, frontend systems, and product-minded delivery.",he="Recent work centers on SPA structure, interaction quality, and maintainable design systems.",ve="I prioritize separation of concerns, explicit state, and measurable performance.",$={skills:fe,projects:he,architecture:ve,default:"Great question. In this phase, I can answer on skills, projects, and architecture approach."};function ke({t:e}){return`
    <section class="ask-card section-reveal" id="ask-johan">
      <h2 class="section-title">${e.ask.title}</h2>
      <div class="ask-input-wrap">
        <input id="ask-input" class="ask-input" type="text" placeholder="${e.ask.placeholder}" />
        <button id="ask-submit" class="ask-button" type="button">${e.ask.button}</button>
      </div>
      <p id="ask-answer" class="ask-answer"></p>
    </section>
  `}function be(){const e=document.querySelector("#ask-input"),t=document.querySelector("#ask-submit"),n=document.querySelector("#ask-answer");if(!e||!t||!n)return;const i=async()=>{const r=e.value.trim().toLowerCase();t.disabled=!0;try{n.textContent=await ye(r)}finally{t.disabled=!1}};t.addEventListener("click",i),e.addEventListener("keydown",r=>{r.key==="Enter"&&i()})}async function ye(e){return e?we(e):$.default}function we(e){return e.includes("skill")?$.skills:e.includes("project")?$.projects:e.includes("architect")?$.architecture:$.default}const O=[{id:"cv",title:"CV",description:"Updated profile and experience summary.",url:"/files/johan-niemann-husbjerg-cv.pdf"},{id:"portfolio",title:"Portfolio",description:"Project snapshots and architecture notes.",url:"/files/johan-portfolio.txt"},{id:"architecture-notes",title:"Architecture Notes",description:"Patterns, tradeoffs, and implementation thinking.",url:"/files/architecture-notes.txt"}];function R(e,t=!1){const n=Se(e.url);return`
    <article class="${t?"file-card file-card-clone":"file-card"}" ${t?'tabindex="-1"':'tabindex="0"'}>
      <h3 class="file-title">${e.title}</h3>
      <p class="file-description">${e.description}</p>
      <a class="file-download" href="${n}" download aria-label="Download ${e.title}">
        <span class="file-download-icon">↧</span>
      </a>
    </article>
  `}function Se(e){return e.startsWith("/")?`/WEBSITE/${e.slice(1)}`:e}let v=null,S=!1,k=null;const $e=.018;function je(){const e=O.map(n=>R(n)).join(""),t=O.map(n=>R(n,!0)).join("");return`
    <section class="files-strip section-reveal" id="file-scroller-wrap">
      <div id="file-scroller-viewport" class="file-scroller-viewport" tabindex="0" aria-label="Downloadable files">
        <div id="file-scroller-track" class="file-scroller-track">
          ${e}
          ${t}
        </div>
      </div>
    </section>
  `}function qe(){const e=document.querySelector("#file-scroller-viewport"),t=document.querySelector("#file-scroller-track");if(!e||!t)return;Ae(),D(),S=!0;const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let i=!1,r=!1,s=null,c=!1,a=0,u=0,o=0,p=t.scrollWidth/2,b=performance.now();const q=()=>{t.style.transform=`translate3d(${-o}px, 0, 0)`},E=l=>{if(!p)return 0;const m=l%p;return m<0?m+p:m},L=l=>{if(!S||n||i)return;const m=l-b;b=l,o=E(o+m*$e),q(),v=window.requestAnimationFrame(L)},y=()=>{I(),S=!1,D()},w=()=>{I(),!(S||n||i)&&(S=!0,b=performance.now(),v=window.requestAnimationFrame(L))},Y=l=>{if(l.target.closest("a, button, input, textarea, select")){y(),k=window.setTimeout(w,1200);return}r=!0,s=l.pointerId,c=!1,a=l.clientX,u=o,y(),e.setPointerCapture(s)},Z=l=>{if(!r||l.pointerId!==s)return;const m=l.clientX-a;!c&&Math.abs(m)>6&&(c=!0,i=!0,e.classList.add("is-dragging")),i&&(o=E(u-m),q())},F=l=>{!r||l.pointerId!==s||(r=!1,s=null,i=!1,e.classList.remove("is-dragging"),e.hasPointerCapture(l.pointerId)&&e.releasePointerCapture(l.pointerId),k=window.setTimeout(w,c?900:1200))},ee=l=>{y(),o=E(o+l.deltaY*.8+l.deltaX),q(),k=window.setTimeout(w,1100)};e.addEventListener("mouseenter",y),e.addEventListener("mouseleave",w),e.addEventListener("focusin",y),e.addEventListener("focusout",w),e.addEventListener("pointerdown",Y),e.addEventListener("pointermove",Z),e.addEventListener("pointerup",F),e.addEventListener("pointercancel",F),e.addEventListener("wheel",ee,{passive:!0}),window.requestAnimationFrame(()=>{p=t.scrollWidth/2,q()}),n||(v=window.requestAnimationFrame(L))}function D(){v&&(window.cancelAnimationFrame(v),v=null)}function I(){k&&(window.clearTimeout(k),k=null)}function Ae(){I()}function Pe({t:e,language:t}){return`
    <main class="page-stack">
      ${ge({t:e})}
      <section class="content-section section-reveal" id="projects-preview">
        <h2 class="section-title">${e.projects.previewTitle}</h2>
        <p class="section-body">${e.projects.previewIntro}</p>
        <div class="projects-grid projects-grid-compact">
          ${H.slice(0,2).map(n=>Le(n,t)).join("")}
        </div>
        <a class="projects-cta" href="/projects" data-link>${e.projects.cta}</a>
      </section>

      <section class="content-section section-reveal" id="resume-preview">
        <h2 class="section-title">${e.resume.previewTitle}</h2>
        <p class="section-body">${e.resume.previewIntro}</p>
        <a class="projects-cta" href="/resume" data-link>${e.resume.cta}</a>
      </section>

      ${ke({t:e})}
      ${je()}
    </main>
  `}function Ee(){be(),qe()}function Le(e,t){const n=e.title[t]||e.title.en,i=e.summary[t]||e.summary.en;return`
    <article class="project-card">
      <h3 class="project-title">${n}</h3>
      <p class="project-summary">${i}</p>
    </article>
  `}const Te=Object.freeze(Object.defineProperty({__proto__:null,mount:Ee,render:Pe},Symbol.toStringTag,{value:"Module"}));function Ie({t:e,language:t}){return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="projects">
        <h2 class="section-title">${e.projects.title}</h2>
        <p class="section-body">${e.projects.intro}</p>
      </section>
      <section class="projects-grid section-reveal" aria-label="${e.projects.title}">
        ${H.map(n=>Ce(n,t)).join("")}
      </section>
    </main>
  `}function Ce(e,t){const n=e.title[t]||e.title.en,i=e.summary[t]||e.summary.en;return`
    <article class="project-card">
      <h3 class="project-title">${n}</h3>
      <p class="project-summary">${i}</p>
      <div class="project-tags">
        ${e.tags.map(r=>`<span class="project-tag">${r}</span>`).join("")}
      </div>
    </article>
  `}const ze=Object.freeze(Object.defineProperty({__proto__:null,render:Ie},Symbol.toStringTag,{value:"Module"})),Me={education:[{level:"Videregående uddannelse",institution:"Københavns Erhvervsakademi",focus:"Professionsbachelor, IT-arkitektur",period:"August 2024 - Januar 2028"},{level:"Gymnasial uddannelse (STX)",institution:"Nærum Gymnasium",focus:"Samfundsfag/Engelsk A niveau",period:"August 2019 - Juni 2022"},{level:"Folkeskole",institution:"Engelsborgskolen, Kongens Lyngby",focus:"Grundskoleforløb",period:"August 2008 - Juni 2018"}],experience:[{role:"Product Data & Systems Assistant hos Norlys",description:"Arbejdet med digitale e-commerce-løsninger med ansvar for oprettelse, strukturering og vedligeholdelse af produktdata på tværs af databaser, PIM- og CMS-systemer. Fokus på datakvalitet, korrekthed, konsistens samt samarbejde med forretning, leverandører og tekniske teams. Løbende optimering af produkt- og kategorisider med SEO-fokus.",type:"Studentermedhjælper",period:"Februar 2026 - d.d."},{role:"Indkøbs- og salgskonsulent hos Nofipa ApS",description:"Arbejdet med finansielle transaktioner og rådgivning inden for asset-backed lending, herunder værdifastsættelse af aktiver. Udført AML- og KYC-kontroller, due diligence og risikovurderinger samt rådgivning til privat- og erhvervskunder med fokus på compliance og kvalitet. Udarbejdet 1.000+ kontrakter og bidraget til digitalisering af manuelle processer.",type:"Studentermedhjælper",period:"Januar 2025 - d.d."},{role:"Lektiehjælper til folkeskoleelev i matematik og dansk",description:"Erfaring med undervisning, formidling og planlægning af faglige forløb.",type:"Deltid",period:"December 2021 - d.d."},{role:"Pædagogmedhjælper i Børnehuset Klokkeblomsten",description:"Erfaring med børns udvikling, læring og behov i en struktureret hverdagsramme.",type:"Fuldtid",period:"August 2022 - Oktober 2023"}],voluntary:[{role:"Studentermiljørepræsentant (SMR) for IT-arkitekturuddannelsen på EK",description:"Repræsenterer de studerendes interesser i forhold til trivsel og studiemiljø. Indsamler input fra medstuderende og deltager i dialog med undervisere og ledelse om forbedringer af studiehverdagen.",period:"September 2024 - d.d."}],qualifications:{it:["Microsoft Office pakken","CMS- og PIM-systemer","Adobe pakken","Git og GitHub","SQL og NoSQL","Datamodellering og datahåndtering (JSON, CSV, XML m.fl.)","Visualisering af dashboards (Tableau, Excel m.fl.)","UI/UX-design i Compose og Figma","Stærkt kendskab til JavaScript, Python, Kotlin m.fl.","Stærkt kendskab til API-drevet softwarearkitektur","Iterativ udvikling, prototyper og brugertests","Business Modeling Frameworks (BPMN, RCA, SWOT, BMC, AS-IS, TO-BE m.fl.)"],personal:["Ansvarsbevidst - overholder deadlines og følger opgaver til dørs","Lærenem - sætter mig hurtigt ind i nye systemer og arbejdsgange","Struktureret - arbejder metodisk og bevarer overblik","Samarbejdsorienteret - trives i teams og kommunikerer klart","Selvstændig - tager initiativ og kan arbejde uden tæt styring"]}},xe={education:[{level:"Higher Education",institution:"Copenhagen School of Design and Technology",focus:"Professional Bachelor's Degree, IT Architecture",period:"August 2024 - January 2028"},{level:"Upper Secondary Education (STX)",institution:"Nærum Gymnasium",focus:"Social Sciences / English, A-level",period:"August 2019 - June 2022"},{level:"Primary and Lower Secondary School",institution:"Engelsborgskolen, Kongens Lyngby",focus:"General school program",period:"August 2008 - June 2018"}],experience:[{role:"Product Data & Systems Assistant at Norlys",description:"Worked on digital e-commerce solutions with responsibility for creating, structuring, and maintaining product data across databases, PIM and CMS systems. Focused on data quality, consistency, and coordination with business, suppliers, and technical teams. Continuously optimized product and category pages with SEO focus.",type:"Student Assistant",period:"February 2026 - Present"},{role:"Purchasing and Sales Consultant at Nofipa ApS",description:"Worked with financial transactions and advisory within asset-backed lending, including valuation-based lending. Performed AML/KYC controls, due diligence, and risk assessments, and advised private and business customers with focus on compliance and quality. Prepared 1,000+ contracts and supported digitalization of manual workflows.",type:"Student Assistant",period:"January 2025 - Present"},{role:"Private Tutor in Mathematics and Danish",description:"Experience in teaching, communication, and planning subject-focused sessions.",type:"Part-time",period:"December 2021 - Present"},{role:"Pedagogical Assistant at Børnehuset Klokkeblomsten",description:"Experience with child development, learning needs, and structured care environments.",type:"Full-time",period:"August 2022 - October 2023"}],voluntary:[{role:"Student Environment Representative (SMR) for IT Architecture at EK",description:"Represent students in matters related to well-being and study environment. Collect input from students and participate in dialogue with lecturers and management to improve the study experience.",period:"September 2024 - Present"}],qualifications:{it:["Microsoft Office suite","CMS and PIM systems","Adobe suite","Git and GitHub","SQL and NoSQL","Data modeling and handling (JSON, CSV, XML, etc.)","Dashboard visualization (Tableau, Excel, etc.)","UI/UX design in Compose and Figma","Strong command of JavaScript, Python, Kotlin, and more","Strong command of API-driven software architecture","Iterative development, prototypes, and user testing","Business modeling frameworks (BPMN, RCA, SWOT, BMC, AS-IS, TO-BE, etc.)"],personal:["Responsible - meet deadlines and carry tasks through","Fast learner - quickly adapt to new systems and workflows","Structured - work methodically and maintain overview","Collaborative - thrive in teams and communicate clearly","Independent - take initiative and work without close supervision"]}},W={dk:Me,en:xe};function Fe({t:e,language:t}){const n=W[t]||W.dk;return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="resume-intro">
        <h2 class="section-title">${e.files.title}</h2>
        <p class="section-body">${e.files.intro}</p>
      </section>

      <section class="resume-section section-reveal" id="resume-education">
        <h3 class="resume-heading">${e.resume.education}</h3>
        <div class="resume-list">
          ${n.education.map(Oe).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-experience">
        <h3 class="resume-heading">${e.resume.experience}</h3>
        <div class="resume-list">
          ${n.experience.map(Re).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-voluntary">
        <h3 class="resume-heading">${e.resume.voluntary}</h3>
        <div class="resume-list">
          ${n.voluntary.map(De).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-qualifications">
        <h3 class="resume-heading">${e.resume.qualifications}</h3>
        <div class="qual-grid">
          <article class="qual-card">
            <h4 class="qual-title">${e.resume.itSkills}</h4>
            <ul class="qual-list">
              ${n.qualifications.it.map(N).join("")}
            </ul>
          </article>
          <article class="qual-card">
            <h4 class="qual-title">${e.resume.personalQualities}</h4>
            <ul class="qual-list">
              ${n.qualifications.personal.map(N).join("")}
            </ul>
          </article>
        </div>
      </section>
    </main>
  `}function Oe(e){return`
    <article class="resume-item">
      <p class="resume-item-type">${e.level}</p>
      <h4 class="resume-item-title">${e.institution}</h4>
      <p class="resume-item-focus">- ${e.focus}</p>
      <p class="resume-item-period">${e.period}</p>
    </article>
  `}function Re(e){return`
    <article class="resume-item">
      <h4 class="resume-item-title">${e.role}</h4>
      <p class="resume-item-body">${e.description}</p>
      <p class="resume-item-period"><span class="resume-item-type">${e.type}</span>: ${e.period}</p>
    </article>
  `}function De(e){return`
    <article class="resume-item">
      <h4 class="resume-item-title">${e.role}</h4>
      <p class="resume-item-body">${e.description}</p>
      <p class="resume-item-period">${e.period}</p>
    </article>
  `}function N(e){return`<li>${e}</li>`}const We=Object.freeze(Object.defineProperty({__proto__:null,render:Fe},Symbol.toStringTag,{value:"Module"}));function Ne({title:e,body:t,id:n}){return`
    <section id="${n}" class="content-section section-reveal">
      <h2 class="section-title">${e}</h2>
      <p class="section-body">${t}</p>
    </section>
  `}const j=[{id:1,question:"What is the main purpose of a layered architecture?",options:["To separate concerns and reduce coupling","To make all code run faster","To avoid documentation"],answer:0},{id:2,question:"Which metric is most useful for frontend performance perception?",options:["Time to first commit","Largest Contentful Paint","Lines of CSS"],answer:1},{id:3,question:"Why use a state store in a small SPA?",options:["To centralize cross-page UI state","To avoid any event listeners","To remove routing"],answer:0}];function Je(){const e=j[0];return`
    <section class="quiz-card section-reveal">
      <div class="quiz-progress"><span id="quiz-progress">1</span>/${j.length}</div>
      <h2 class="quiz-question" id="quiz-question">${e.question}</h2>
      <div class="quiz-options" id="quiz-options">
        ${e.options.map((t,n)=>Q(t,n)).join("")}
      </div>
      <p class="quiz-feedback" id="quiz-feedback"></p>
    </section>
  `}function Ue(e){let t=0;const n=document.querySelector("#quiz-question"),i=document.querySelector("#quiz-options"),r=document.querySelector("#quiz-progress"),s=document.querySelector("#quiz-feedback");if(!n||!i||!r||!s)return;function c(){const a=j[t];n.textContent=a.question,i.innerHTML=a.options.map((u,o)=>Q(u,o)).join(""),r.textContent=String(t+1)}i.addEventListener("click",a=>{const u=a.target.closest("button[data-option]");if(!u)return;const o=j[t],b=Number(u.dataset.option)===o.answer;s.textContent=b?"Correct":"Not quite",window.setTimeout(()=>{if(t+=1,t>=j.length){s.textContent="Quiz completed. Enhanced mode unlocked.",e(),i.innerHTML="";return}s.textContent="",c()},350)}),c()}function Q(e,t){return`<button class="quiz-option" type="button" data-option="${t}">${e}</button>`}function Ve({t:e}){return`
    <main class="page-stack">
      ${Ne({id:"quiz-intro",title:e.quiz.title,body:e.quiz.intro})}
      ${Je()}
    </main>
  `}function _e({onQuizComplete:e}){Ue(e)}const Be=Object.freeze(Object.defineProperty({__proto__:null,mount:_e,render:Ve},Symbol.toStringTag,{value:"Module"}));function He(e){return`<div class="page-transition-enter">${e}</div>`}const J={"/":Te,"/projects":ze,"/resume":We,"/quiz":Be},C="/WEBSITE/",Qe=500,Ge={"/files":"/resume"};function G(e){const t=e.startsWith("/")?e.slice(1):e;return`${C}${t}`}function U(e=window.location.pathname){if(!e.startsWith(C))return"/";const t=e.slice(C.length-1)||"/";return t.length>1&&t.endsWith("/")?t.slice(0,-1):t}function Ke({mountEl:e,renderFrame:t,pageContext:n,onRouteChange:i}){let r=!1;const s=()=>{const a=U(),u=Ge[a]||a,o=J[u]||J["/"];a!==u&&history.replaceState({},"",G(u)),e.innerHTML=He(o.render(n(u))),o.mount&&o.mount(n(u)),i(u),requestAnimationFrame(()=>{const p=e.querySelector(".page-transition-enter");p&&p.classList.add("is-visible")})},c=()=>{if(r)return;r=!0;const a=e.querySelector(".page-transition-enter");if(!a){s(),r=!1;return}a.classList.remove("is-visible"),a.classList.add("is-exiting"),window.setTimeout(()=>{s(),r=!1},Qe)};return document.addEventListener("click",a=>{const u=a.target.closest("[data-link]");if(!u)return;const o=u.getAttribute("href");!o||!o.startsWith("/")||(a.preventDefault(),o!==U()&&Xe(o,c))}),window.addEventListener("popstate",c),t(s),{refresh:c}}function Xe(e,t){history.pushState({},"",G(e)),t()}st();const Ye=document.querySelector("#app");Ye.innerHTML=`
  <div id="welcome-root"></div>
  <div class="site-shell" id="site-shell">
    <div id="nav-root"></div>
    <div id="page-root"></div>
    <div id="footer-root"></div>
  </div>
`;const V="johanscv.welcomeSeen",Ze=500,T=document.querySelector("#welcome-root"),et=document.querySelector("#nav-root"),tt=document.querySelector("#page-root"),nt=document.querySelector("#footer-root");let z=!1,_=!1;K();M();at();x(g().route);const it=Ke({mountEl:tt,renderFrame:e=>{e(),ot()},pageContext:()=>{const e=g();return{t:f[e.language]||f.en,language:e.language,onQuizComplete:()=>P({quizUnlocked:!0})}},onRouteChange:e=>{P({route:e}),x(e),rt()}});function K(){const e=g(),t=f[e.language]||f.en;et.innerHTML=ie({route:e.route,t}),X()}function M(){const e=g(),t=f[e.language]||f.en;nt.innerHTML=le({t,theme:e.theme,language:e.language}),se(()=>{const n=g().theme==="dark"?"light":"dark";P({theme:n}),M()}),ae(()=>{const n=g().language==="en"?"dk":"en";P({language:n}),K(),x(g().route),M(),it.refresh()})}function rt(){const e=document.querySelectorAll(".section-reveal"),t=new IntersectionObserver(n=>{n.forEach(i=>{i.isIntersecting&&(i.target.classList.add("is-visible"),t.unobserve(i.target))})},{threshold:.2});e.forEach((n,i)=>{n.style.transitionDelay=`${Math.min(i*70,240)}ms`,t.observe(n)})}function st(){const e=new URL(window.location.href),t=e.searchParams.get("p");if(!t)return;const n=decodeURIComponent(t),[i,r]=n.split("&q="),s=r?`?${decodeURIComponent(r)}`:"",c=`${i}${s}${e.hash}`;window.history.replaceState(null,"",c)}function ot(){if(_)return;_=!0;let e=window.scrollY,t=!1;const n=()=>{t||(t=!0,window.requestAnimationFrame(()=>{const i=window.scrollY,r=i-e;i<36||r<-8?z=!1:r>8&&(z=!0),e=i,X(),t=!1}))};window.addEventListener("scroll",n,{passive:!0})}function X(){const e=document.querySelector("#navbar");e&&e.classList.toggle("nav-hidden",z)}function x(e){document.querySelectorAll(".nav-link").forEach(n=>{const i=n.getAttribute("href");n.classList.toggle("active",i===e)})}function at(){if(localStorage.getItem(V)==="true")return;const e=g(),t=f[e.language]||f.en;T.innerHTML=ce({t}),document.body.classList.add("welcome-active");const n=T.querySelector(".welcome-screen");window.requestAnimationFrame(()=>{n?.classList.add("is-visible")}),ue(()=>{localStorage.setItem(V,"true"),n?.classList.remove("is-visible"),n?.classList.add("is-exiting"),document.body.classList.remove("welcome-active"),window.setTimeout(()=>{T.innerHTML=""},Ze)})}
