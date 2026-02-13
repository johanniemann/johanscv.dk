(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();const ae={nav:{home:"Home",projects:"Projects",files:"Resume",quiz:"Quiz"},hero:{name:"Johan Niemann Husbjerg",title:"IT Architecture student shaping precise, human-centered systems."},welcome:{title:"Welcome",intro:"This site is a focused overview of my architecture profile, practical experience, and current projects.",point1:"Explore projects and implementation work.",point2:"Review my full Resume / CV structure.",point3:"Use Ask Johan for quick context.",continue:"Continue"},ask:{title:"Ask Johan",placeholder:"Ask about skills, projects, or architecture...",button:"Answer"},projects:{title:"Projects",intro:"Focused work in architecture, frontend systems, and product execution.",previewTitle:"Selected Work",previewIntro:"A snapshot of practical architecture and frontend execution.",cta:"View all projects"},files:{title:"Resume / CV",intro:"Education, experience, voluntary work, and qualifications."},resume:{previewTitle:"Resume Snapshot",previewIntro:"A structured view of my education, practical experience, and key competencies.",cta:"Open Resume / CV",education:"Education",experience:"Work Experience",voluntary:"Voluntary Work",qualifications:"Qualifications",itSkills:"Core IT Skills",personalQualities:"Personal Qualities"},quiz:{title:"Architecture Quiz",intro:"Quick challenge to unlock enhanced visual mode."},footer:{builtWith:"Built with Vite, Tailwind, and Vanilla JavaScript.",rights:"All rights reserved."}},le={nav:{home:"Hjem",projects:"Projekter",files:"CV",quiz:"Quiz"},hero:{name:"Johan Niemann Husbjerg",title:"IT-arkitekturstuderende med fokus på præcise, menneskelige systemer."},welcome:{title:"Velkommen",intro:"Denne side giver et fokuseret overblik over min arkitekturprofil, praktiske erfaring og nuværende projekter.",point1:"Se projekter og konkret implementeringsarbejde.",point2:"Gennemgå mit fulde Resume / CV.",point3:"Brug Ask Johan for hurtig kontekst.",continue:"Fortsat"},ask:{title:"Spørg Johan",placeholder:"Spørg om kompetencer, projekter eller arkitektur...",button:"Svar"},projects:{title:"Projekter",intro:"Fokuseret arbejde inden for arkitektur, frontend-systemer og produktudførelse.",previewTitle:"Udvalgt Arbejde",previewIntro:"Et udsnit af praktisk arkitektur og frontend-udførelse.",cta:"Se alle projekter"},files:{title:"Resume / CV",intro:"Uddannelse, arbejdserfaring, frivilligt arbejde og kvalifikationer."},resume:{previewTitle:"CV overblik",previewIntro:"Et struktureret overblik over uddannelse, praktisk erfaring og væsentlige kompetencer.",cta:"Åbn Resume / CV",education:"Uddannelse",experience:"Arbejdserfaring",voluntary:"Frivilligt arbejde",qualifications:"Kvalifikationer",itSkills:"Væsentlige IT-kundskaber",personalQualities:"Personlige kvaliteter"},quiz:{title:"Arkitektur Quiz",intro:"Kort udfordring der låser op for forbedret visuel tilstand."},footer:{builtWith:"Bygget med Vite, Tailwind og Vanilla JavaScript.",rights:"Alle rettigheder forbeholdes."}},h={en:ae,dk:le};function ce({route:e,t}){return`
    <header id="navbar" class="site-nav">
      <a class="brand" href="/" data-link>johanscv.dk</a>
      <nav class="nav-links" aria-label="Primary">
        ${E("/",t.nav.home,e)}
        ${E("/projects",t.nav.projects,e)}
        ${E("/resume",t.nav.files,e)}
        ${E("/quiz",t.nav.quiz,e)}
      </nav>
    </header>
  `}function E(e,t,n){const i=e==="/"?"home":e.slice(1);return`<a class="${n===e?`nav-link nav-link-${i} active`:`nav-link nav-link-${i}`}" href="${e}" data-link>${t}</a>`}function ue(e){return`
    <button id="theme-toggle" class="toggle-pill ${e==="dark"?"is-dark":"is-light"}" type="button" aria-label="Toggle theme">
      <span class="toggle-option toggle-option-light">Light</span>
      <span class="toggle-option toggle-option-dark">Dark</span>
      <span class="toggle-knob"></span>
    </button>
  `}function de(e){const t=document.querySelector("#theme-toggle");t&&t.addEventListener("click",e)}function pe(e){return`
    <button id="language-toggle" class="lang-pill ${e==="dk"?"is-dk":"is-en"}" type="button" aria-label="Toggle language">
      <span class="lang-indicator"></span>
      <span class="lang-option">EN</span>
      <span class="lang-option">DK</span>
    </button>
  `}function me(e){const t=document.querySelector("#language-toggle");t&&t.addEventListener("click",e)}function ge({t:e,theme:t,language:n}){const i=new Date().getFullYear();return`
    <footer class="site-footer" aria-label="Footer">
      <div class="footer-top">
        <nav class="footer-links" aria-label="Footer navigation">
          <a href="/" data-link>${e.nav.home}</a>
          <a href="/projects" data-link>${e.nav.projects}</a>
          <a href="/resume" data-link>${e.nav.files}</a>
          <a href="/quiz" data-link>${e.nav.quiz}</a>
        </nav>
        <div class="footer-controls">
          ${pe(n)}
          ${ue(t)}
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">&copy; ${i} Johan Niemann Husbjerg. ${e.footer.rights}</p>
        <p class="footer-built">${e.footer.builtWith}</p>
      </div>
    </footer>
  `}function fe({t:e}){return`
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
  `}function he(e){const t=document.querySelector("#welcome-continue");t&&t.addEventListener("click",e)}const k={theme:"johanscv.theme",language:"johanscv.language",quizUnlocked:"johanscv.quizUnlocked"},ve=new Set;let d={theme:localStorage.getItem(k.theme)||"dark",language:localStorage.getItem(k.language)||"en",quizUnlocked:localStorage.getItem(k.quizUnlocked)==="true",route:"/"};X(d);function f(){return d}function P(e){const t=d;d={...d,...e},ye(t,d)&&be(),we(t,d)&&X(d),ke()}function ke(){ve.forEach(e=>e(d))}function be(){localStorage.setItem(k.theme,d.theme),localStorage.setItem(k.language,d.language),localStorage.setItem(k.quizUnlocked,String(d.quizUnlocked))}function X(e){document.documentElement.dataset.theme=e.theme,document.documentElement.classList.toggle("dark",e.theme==="dark"),document.body.classList.toggle("quiz-unlocked",e.quizUnlocked)}function ye(e,t){return e.theme!==t.theme||e.language!==t.language||e.quizUnlocked!==t.quizUnlocked}function we(e,t){return e.theme!==t.theme||e.quizUnlocked!==t.quizUnlocked}const Y=[{id:"spa-architecture",title:{en:"SPA Architecture Foundation",dk:"SPA Arkitekturgrundlag"},summary:{en:"Designed a lightweight Vanilla JS SPA with explicit routing, transition orchestration, and durable state boundaries.",dk:"Designede en letvægts Vanilla JS SPA med tydelig routing, overgangsorkestrering og robuste state-graenser."},tags:["Vite","Vanilla JS","Routing"]},{id:"design-system",title:{en:"Interaction-Led Design System",dk:"Interaktionsdrevet Designsystem"},summary:{en:"Built a restrained visual language with theme tokens, glass surfaces, motion hierarchy, and responsive rhythm.",dk:"Byggede et afdaempet visuelt sprog med tematiske tokens, glasflader, motion-hierarki og responsiv rytme."},tags:["Tailwind","Theming","UX Motion"]},{id:"deployment-flow",title:{en:"GitHub Pages Deployment Flow",dk:"GitHub Pages Deploy-flow"},summary:{en:"Configured stable project-page deployment with base-path-safe assets and SPA fallback for deep links.",dk:"Konfigurerede stabil project-pages deployment med base-path-sikre assets og SPA fallback til deep links."},tags:["GitHub Pages","CI-ready","Reliability"]}];function Se({t:e}){return`
    <section class="hero section-reveal" id="hero">
      <div class="avatar-wrap">
        <div class="avatar-ring"></div>
        <img class="avatar" src="/WEBSITE/images/johan-placeholder.jpg" alt="Portrait of Johan" />
      </div>
      <h1 class="hero-name">${e.hero.name}</h1>
      <p class="hero-title">${e.hero.title}</p>
    </section>
  `}const je="I focus on architecture thinking, frontend systems, and product-minded delivery.",$e="Recent work centers on SPA structure, interaction quality, and maintainable design systems.",qe="I prioritize separation of concerns, explicit state, and measurable performance.",v={skills:je,projects:$e,architecture:qe,default:"Great question. In this phase, I can answer on skills, projects, and architecture approach."},W="http://127.0.0.1:8787".replace(/\/$/,""),D="johanscv.askJohanAccessCode",Ae=42,Ee=24,Pe=1200,Te=260,F={en:["What kind of IT architecture do you want to work with?","What is your strongest technical skill right now?","How do you approach system design decisions?","What have you learned from your current student job?","Which projects best represent your profile?","How do you balance UX quality and performance?","What tools do you use for architecture work?","How do you work with data quality in practice?","What are your goals for the next two years?","How can we collaborate on a relevant opportunity?"],dk:["Hvilken type IT-arkitektur vil du arbejde med?","Hvad er din stærkeste tekniske kompetence lige nu?","Hvordan træffer du arkitektur- og designbeslutninger?","Hvad har du lært i dit nuværende studiejob?","Hvilke projekter repræsenterer dig bedst?","Hvordan balancerer du UX-kvalitet og performance?","Hvilke værktøjer bruger du i arkitekturarbejde?","Hvordan arbejder du med datakvalitet i praksis?","Hvad er dine mål de næste to år?","Hvordan kan vi samarbejde om en relevant mulighed?"]};let g=null,C=0;function Ie({t:e}){return`
    <section class="ask-card section-reveal" id="ask-johan">
      <h2 class="section-title">${e.ask.title}</h2>
      <div class="ask-input-wrap">
        <input id="ask-input" class="ask-input" type="text" placeholder="${e.ask.placeholder}" />
        <button id="ask-submit" class="ask-button" type="button">${e.ask.button}</button>
      </div>
      <p id="ask-answer" class="ask-answer"></p>
    </section>
  `}function Le(e="en"){const t=document.querySelector("#ask-input"),n=document.querySelector("#ask-submit"),i=document.querySelector("#ask-answer");if(!t||!n||!i)return;xe(t,e);const r=async()=>{const o=t.value.trim().toLowerCase();n.disabled=!0;try{i.textContent=await Ce(o)}finally{n.disabled=!1}};n.addEventListener("click",r),t.addEventListener("keydown",o=>{o.key==="Enter"&&r()})}async function Ce(e){if(!e)return v.default;try{let t=Me();if(!t)return"Access code is required to use Ask Johan.";const n=await fetch(`${W}/api/ask-johan`,{method:"POST",headers:{"Content-Type":"application/json","x-access-code":t},body:JSON.stringify({question:e})});if(n.status===401){if(localStorage.removeItem(D),t=Z(),!t)return"Access code is required to use Ask Johan.";const i=await fetch(`${W}/api/ask-johan`,{method:"POST",headers:{"Content-Type":"application/json","x-access-code":t},body:JSON.stringify({question:e})});if(i.ok){const r=await i.json();if(typeof r.answer=="string"&&r.answer.trim())return r.answer}}if(n.ok){const i=await n.json();if(typeof i.answer=="string"&&i.answer.trim())return i.answer}}catch{return v.default}return ze(e)}function ze(e){return e.includes("skill")?v.skills:e.includes("project")?v.projects:e.includes("architect")?v.architecture:v.default}function Me(){const e=localStorage.getItem(D);return e&&e.trim()?e:Z()}function Z(){const t=window.prompt("Enter access code for Ask Johan:")?.trim();return t?(localStorage.setItem(D,t),t):""}function xe(e,t){Oe();const n=F[t]||F.en,i=++C;let r=0,o=0,a=!1;const s=()=>{if(i!==C)return;if(document.activeElement===e||e.value.trim()){g=window.setTimeout(s,220);return}const l=n[r];if(!a){if(o+=1,e.placeholder=l.slice(0,o),o>=l.length){a=!0,g=window.setTimeout(s,Pe);return}g=window.setTimeout(s,Ae);return}if(o-=1,e.placeholder=l.slice(0,Math.max(o,0)),o<=0){a=!1,r=(r+1)%n.length,g=window.setTimeout(s,Te);return}g=window.setTimeout(s,Ee)};s()}function Oe(){g&&(window.clearTimeout(g),g=null),C+=1}const _=[{id:"cv",title:"CV",description:"Updated profile and experience summary.",url:"/files/johan-niemann-husbjerg-cv.pdf"},{id:"portfolio",title:"Portfolio",description:"Project snapshots and architecture notes.",url:"/files/johan-portfolio.txt"},{id:"architecture-notes",title:"Architecture Notes",description:"Patterns, tradeoffs, and implementation thinking.",url:"/files/architecture-notes.txt"}];function J(e,t=!1){const n=De(e.url);return`
    <article class="${t?"file-card file-card-clone":"file-card"}" ${t?'tabindex="-1"':'tabindex="0"'}>
      <h3 class="file-title">${e.title}</h3>
      <p class="file-description">${e.description}</p>
      <a class="file-download" href="${n}" download aria-label="Download ${e.title}">
        <span class="file-download-icon">↧</span>
      </a>
    </article>
  `}function De(e){return e.startsWith("/")?`/WEBSITE/${e.slice(1)}`:e}let b=null,$=!1,y=null;const Re=.018;function He(){const e=_.map(n=>J(n)).join(""),t=_.map(n=>J(n,!0)).join("");return`
    <section class="files-strip section-reveal" id="file-scroller-wrap">
      <div id="file-scroller-viewport" class="file-scroller-viewport" tabindex="0" aria-label="Downloadable files">
        <div id="file-scroller-track" class="file-scroller-track">
          ${e}
          ${t}
        </div>
      </div>
    </section>
  `}function We(){const e=document.querySelector("#file-scroller-viewport"),t=document.querySelector("#file-scroller-track");if(!e||!t)return;Fe(),U(),$=!0;const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let i=!1,r=!1,o=null,a=!1,s=0,l=0,c=0,p=t.scrollWidth/2,w=performance.now();const A=()=>{t.style.transform=`translate3d(${-c}px, 0, 0)`},T=u=>{if(!p)return 0;const m=u%p;return m<0?m+p:m},I=u=>{if(!$||n||i)return;const m=u-w;w=u,c=T(c+m*Re),A(),b=window.requestAnimationFrame(I)},S=()=>{z(),$=!1,U()},j=()=>{z(),!($||n||i)&&($=!0,w=performance.now(),b=window.requestAnimationFrame(I))},re=u=>{if(u.target.closest("a, button, input, textarea, select")){S(),y=window.setTimeout(j,1200);return}r=!0,o=u.pointerId,a=!1,s=u.clientX,l=c,S(),e.setPointerCapture(o)},oe=u=>{if(!r||u.pointerId!==o)return;const m=u.clientX-s;!a&&Math.abs(m)>6&&(a=!0,i=!0,e.classList.add("is-dragging")),i&&(c=T(l-m),A())},H=u=>{!r||u.pointerId!==o||(r=!1,o=null,i=!1,e.classList.remove("is-dragging"),e.hasPointerCapture(u.pointerId)&&e.releasePointerCapture(u.pointerId),y=window.setTimeout(j,a?900:1200))},se=u=>{S(),c=T(c+u.deltaY*.8+u.deltaX),A(),y=window.setTimeout(j,1100)};e.addEventListener("mouseenter",S),e.addEventListener("mouseleave",j),e.addEventListener("focusin",S),e.addEventListener("focusout",j),e.addEventListener("pointerdown",re),e.addEventListener("pointermove",oe),e.addEventListener("pointerup",H),e.addEventListener("pointercancel",H),e.addEventListener("wheel",se,{passive:!0}),window.requestAnimationFrame(()=>{p=t.scrollWidth/2,A()}),n||(b=window.requestAnimationFrame(I))}function U(){b&&(window.cancelAnimationFrame(b),b=null)}function z(){y&&(window.clearTimeout(y),y=null)}function Fe(){z()}function _e({t:e,language:t}){return`
    <main class="page-stack">
      ${Se({t:e})}
      <section class="content-section section-reveal" id="projects-preview">
        <h2 class="section-title">${e.projects.previewTitle}</h2>
        <p class="section-body">${e.projects.previewIntro}</p>
        <div class="projects-grid projects-grid-compact">
          ${Y.slice(0,2).map(n=>Ue(n,t)).join("")}
        </div>
        <a class="projects-cta" href="/projects" data-link>${e.projects.cta}</a>
      </section>

      <section class="content-section section-reveal" id="resume-preview">
        <h2 class="section-title">${e.resume.previewTitle}</h2>
        <p class="section-body">${e.resume.previewIntro}</p>
        <a class="projects-cta" href="/resume" data-link>${e.resume.cta}</a>
      </section>

      ${Ie({t:e})}
      ${He()}
    </main>
  `}function Je({language:e}){Le(e),We()}function Ue(e,t){const n=e.title[t]||e.title.en,i=e.summary[t]||e.summary.en;return`
    <article class="project-card">
      <h3 class="project-title">${n}</h3>
      <p class="project-summary">${i}</p>
    </article>
  `}const Ne=Object.freeze(Object.defineProperty({__proto__:null,mount:Je,render:_e},Symbol.toStringTag,{value:"Module"}));function Ve({t:e,language:t}){return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="projects">
        <h2 class="section-title">${e.projects.title}</h2>
        <p class="section-body">${e.projects.intro}</p>
      </section>
      <section class="projects-grid section-reveal" aria-label="${e.projects.title}">
        ${Y.map(n=>Be(n,t)).join("")}
      </section>
    </main>
  `}function Be(e,t){const n=e.title[t]||e.title.en,i=e.summary[t]||e.summary.en;return`
    <article class="project-card">
      <h3 class="project-title">${n}</h3>
      <p class="project-summary">${i}</p>
      <div class="project-tags">
        ${e.tags.map(r=>`<span class="project-tag">${r}</span>`).join("")}
      </div>
    </article>
  `}const Qe=Object.freeze(Object.defineProperty({__proto__:null,render:Ve},Symbol.toStringTag,{value:"Module"})),Ke={education:[{level:"Videregående uddannelse",institution:"Københavns Erhvervsakademi",focus:"Professionsbachelor, IT-arkitektur",period:"August 2024 - Januar 2028"},{level:"Gymnasial uddannelse (STX)",institution:"Nærum Gymnasium",focus:"Samfundsfag/Engelsk A niveau",period:"August 2019 - Juni 2022"},{level:"Folkeskole",institution:"Engelsborgskolen, Kongens Lyngby",focus:"Grundskoleforløb",period:"August 2008 - Juni 2018"}],experience:[{role:"Product Data & Systems Assistant hos Norlys",description:"Arbejdet med digitale e-commerce-løsninger med ansvar for oprettelse, strukturering og vedligeholdelse af produktdata på tværs af databaser, PIM- og CMS-systemer. Fokus på datakvalitet, korrekthed, konsistens samt samarbejde med forretning, leverandører og tekniske teams. Løbende optimering af produkt- og kategorisider med SEO-fokus.",type:"Studentermedhjælper",period:"Februar 2026 - d.d."},{role:"Indkøbs- og salgskonsulent hos Nofipa ApS",description:"Arbejdet med finansielle transaktioner og rådgivning inden for asset-backed lending, herunder værdifastsættelse af aktiver. Udført AML- og KYC-kontroller, due diligence og risikovurderinger samt rådgivning til privat- og erhvervskunder med fokus på compliance og kvalitet. Udarbejdet 1.000+ kontrakter og bidraget til digitalisering af manuelle processer.",type:"Studentermedhjælper",period:"Januar 2025 - d.d."},{role:"Lektiehjælper til folkeskoleelev i matematik og dansk",description:"Erfaring med undervisning, formidling og planlægning af faglige forløb.",type:"Deltid",period:"December 2021 - d.d."},{role:"Pædagogmedhjælper i Børnehuset Klokkeblomsten",description:"Erfaring med børns udvikling, læring og behov i en struktureret hverdagsramme.",type:"Fuldtid",period:"August 2022 - Oktober 2023"}],voluntary:[{role:"Studentermiljørepræsentant (SMR) for IT-arkitekturuddannelsen på EK",description:"Repræsenterer de studerendes interesser i forhold til trivsel og studiemiljø. Indsamler input fra medstuderende og deltager i dialog med undervisere og ledelse om forbedringer af studiehverdagen.",period:"September 2024 - d.d."}],qualifications:{it:["Microsoft Office pakken","CMS- og PIM-systemer","Adobe pakken","Git og GitHub","SQL og NoSQL","Datamodellering og datahåndtering (JSON, CSV, XML m.fl.)","Visualisering af dashboards (Tableau, Excel m.fl.)","UI/UX-design i Compose og Figma","Stærkt kendskab til JavaScript, Python, Kotlin m.fl.","Stærkt kendskab til API-drevet softwarearkitektur","Iterativ udvikling, prototyper og brugertests","Business Modeling Frameworks (BPMN, RCA, SWOT, BMC, AS-IS, TO-BE m.fl.)"],personal:["Ansvarsbevidst - overholder deadlines og følger opgaver til dørs","Lærenem - sætter mig hurtigt ind i nye systemer og arbejdsgange","Struktureret - arbejder metodisk og bevarer overblik","Samarbejdsorienteret - trives i teams og kommunikerer klart","Selvstændig - tager initiativ og kan arbejde uden tæt styring"]}},Ge={education:[{level:"Higher Education",institution:"Copenhagen School of Design and Technology",focus:"Professional Bachelor's Degree, IT Architecture",period:"August 2024 - January 2028"},{level:"Upper Secondary Education (STX)",institution:"Nærum Gymnasium",focus:"Social Sciences / English, A-level",period:"August 2019 - June 2022"},{level:"Primary and Lower Secondary School",institution:"Engelsborgskolen, Kongens Lyngby",focus:"General school program",period:"August 2008 - June 2018"}],experience:[{role:"Product Data & Systems Assistant at Norlys",description:"Worked on digital e-commerce solutions with responsibility for creating, structuring, and maintaining product data across databases, PIM and CMS systems. Focused on data quality, consistency, and coordination with business, suppliers, and technical teams. Continuously optimized product and category pages with SEO focus.",type:"Student Assistant",period:"February 2026 - Present"},{role:"Purchasing and Sales Consultant at Nofipa ApS",description:"Worked with financial transactions and advisory within asset-backed lending, including valuation-based lending. Performed AML/KYC controls, due diligence, and risk assessments, and advised private and business customers with focus on compliance and quality. Prepared 1,000+ contracts and supported digitalization of manual workflows.",type:"Student Assistant",period:"January 2025 - Present"},{role:"Private Tutor in Mathematics and Danish",description:"Experience in teaching, communication, and planning subject-focused sessions.",type:"Part-time",period:"December 2021 - Present"},{role:"Pedagogical Assistant at Børnehuset Klokkeblomsten",description:"Experience with child development, learning needs, and structured care environments.",type:"Full-time",period:"August 2022 - October 2023"}],voluntary:[{role:"Student Environment Representative (SMR) for IT Architecture at EK",description:"Represent students in matters related to well-being and study environment. Collect input from students and participate in dialogue with lecturers and management to improve the study experience.",period:"September 2024 - Present"}],qualifications:{it:["Microsoft Office suite","CMS and PIM systems","Adobe suite","Git and GitHub","SQL and NoSQL","Data modeling and handling (JSON, CSV, XML, etc.)","Dashboard visualization (Tableau, Excel, etc.)","UI/UX design in Compose and Figma","Strong command of JavaScript, Python, Kotlin, and more","Strong command of API-driven software architecture","Iterative development, prototypes, and user testing","Business modeling frameworks (BPMN, RCA, SWOT, BMC, AS-IS, TO-BE, etc.)"],personal:["Responsible - meet deadlines and carry tasks through","Fast learner - quickly adapt to new systems and workflows","Structured - work methodically and maintain overview","Collaborative - thrive in teams and communicate clearly","Independent - take initiative and work without close supervision"]}},N={dk:Ke,en:Ge};function Xe({t:e,language:t}){const n=N[t]||N.dk;return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="resume-intro">
        <h2 class="section-title">${e.files.title}</h2>
        <p class="section-body">${e.files.intro}</p>
      </section>

      <section class="resume-section section-reveal" id="resume-education">
        <h3 class="resume-heading">${e.resume.education}</h3>
        <div class="resume-list">
          ${n.education.map(Ye).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-experience">
        <h3 class="resume-heading">${e.resume.experience}</h3>
        <div class="resume-list">
          ${n.experience.map(Ze).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-voluntary">
        <h3 class="resume-heading">${e.resume.voluntary}</h3>
        <div class="resume-list">
          ${n.voluntary.map(et).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-qualifications">
        <h3 class="resume-heading">${e.resume.qualifications}</h3>
        <div class="qual-grid">
          <article class="qual-card">
            <h4 class="qual-title">${e.resume.itSkills}</h4>
            <ul class="qual-list">
              ${n.qualifications.it.map(V).join("")}
            </ul>
          </article>
          <article class="qual-card">
            <h4 class="qual-title">${e.resume.personalQualities}</h4>
            <ul class="qual-list">
              ${n.qualifications.personal.map(V).join("")}
            </ul>
          </article>
        </div>
      </section>
    </main>
  `}function Ye(e){return`
    <article class="resume-item">
      <p class="resume-item-type">${e.level}</p>
      <h4 class="resume-item-title">${e.institution}</h4>
      <p class="resume-item-focus">- ${e.focus}</p>
      <p class="resume-item-period">${e.period}</p>
    </article>
  `}function Ze(e){return`
    <article class="resume-item">
      <h4 class="resume-item-title">${e.role}</h4>
      <p class="resume-item-body">${e.description}</p>
      <p class="resume-item-period"><span class="resume-item-type">${e.type}</span>: ${e.period}</p>
    </article>
  `}function et(e){return`
    <article class="resume-item">
      <h4 class="resume-item-title">${e.role}</h4>
      <p class="resume-item-body">${e.description}</p>
      <p class="resume-item-period">${e.period}</p>
    </article>
  `}function V(e){return`<li>${e}</li>`}const tt=Object.freeze(Object.defineProperty({__proto__:null,render:Xe},Symbol.toStringTag,{value:"Module"}));function nt({title:e,body:t,id:n}){return`
    <section id="${n}" class="content-section section-reveal">
      <h2 class="section-title">${e}</h2>
      <p class="section-body">${t}</p>
    </section>
  `}const q=[{id:1,question:"What is the main purpose of a layered architecture?",options:["To separate concerns and reduce coupling","To make all code run faster","To avoid documentation"],answer:0},{id:2,question:"Which metric is most useful for frontend performance perception?",options:["Time to first commit","Largest Contentful Paint","Lines of CSS"],answer:1},{id:3,question:"Why use a state store in a small SPA?",options:["To centralize cross-page UI state","To avoid any event listeners","To remove routing"],answer:0}];function it(){const e=q[0];return`
    <section class="quiz-card section-reveal">
      <div class="quiz-progress"><span id="quiz-progress">1</span>/${q.length}</div>
      <h2 class="quiz-question" id="quiz-question">${e.question}</h2>
      <div class="quiz-options" id="quiz-options">
        ${e.options.map((t,n)=>ee(t,n)).join("")}
      </div>
      <p class="quiz-feedback" id="quiz-feedback"></p>
    </section>
  `}function rt(e){let t=0;const n=document.querySelector("#quiz-question"),i=document.querySelector("#quiz-options"),r=document.querySelector("#quiz-progress"),o=document.querySelector("#quiz-feedback");if(!n||!i||!r||!o)return;function a(){const s=q[t];n.textContent=s.question,i.innerHTML=s.options.map((l,c)=>ee(l,c)).join(""),r.textContent=String(t+1)}i.addEventListener("click",s=>{const l=s.target.closest("button[data-option]");if(!l)return;const c=q[t],w=Number(l.dataset.option)===c.answer;o.textContent=w?"Correct":"Not quite",window.setTimeout(()=>{if(t+=1,t>=q.length){o.textContent="Quiz completed. Enhanced mode unlocked.",e(),i.innerHTML="";return}o.textContent="",a()},350)}),a()}function ee(e,t){return`<button class="quiz-option" type="button" data-option="${t}">${e}</button>`}function ot({t:e}){return`
    <main class="page-stack">
      ${nt({id:"quiz-intro",title:e.quiz.title,body:e.quiz.intro})}
      ${it()}
    </main>
  `}function st({onQuizComplete:e}){rt(e)}const at=Object.freeze(Object.defineProperty({__proto__:null,mount:st,render:ot},Symbol.toStringTag,{value:"Module"}));function lt(e){return`<div class="page-transition-enter">${e}</div>`}const B={"/":Ne,"/projects":Qe,"/resume":tt,"/quiz":at},M="/WEBSITE/",ct=500,ut={"/files":"/resume"};function te(e){const t=e.startsWith("/")?e.slice(1):e;return`${M}${t}`}function Q(e=window.location.pathname){if(!e.startsWith(M))return"/";const t=e.slice(M.length-1)||"/";return t.length>1&&t.endsWith("/")?t.slice(0,-1):t}function dt({mountEl:e,renderFrame:t,pageContext:n,onRouteChange:i}){let r=!1;const o=()=>{const s=Q(),l=ut[s]||s,c=B[l]||B["/"];s!==l&&history.replaceState({},"",te(l)),e.innerHTML=lt(c.render(n(l))),c.mount&&c.mount(n(l)),i(l),requestAnimationFrame(()=>{const p=e.querySelector(".page-transition-enter");p&&p.classList.add("is-visible")})},a=()=>{if(r)return;r=!0;const s=e.querySelector(".page-transition-enter");if(!s){o(),r=!1;return}s.classList.remove("is-visible"),s.classList.add("is-exiting"),window.setTimeout(()=>{o(),r=!1},ct)};return document.addEventListener("click",s=>{const l=s.target.closest("[data-link]");if(!l)return;const c=l.getAttribute("href");!c||!c.startsWith("/")||(s.preventDefault(),c!==Q()&&pt(c,a))}),window.addEventListener("popstate",a),t(o),{refresh:a}}function pt(e,t){history.pushState({},"",te(e)),t()}yt();const mt=document.querySelector("#app");mt.innerHTML=`
  <div id="welcome-root"></div>
  <div class="site-shell" id="site-shell">
    <div id="nav-root"></div>
    <div id="page-root"></div>
    <div id="footer-root"></div>
  </div>
`;const K="johanscv.welcomeSeen",gt=500,L=document.querySelector("#welcome-root"),ft=document.querySelector("#nav-root"),ht=document.querySelector("#page-root"),vt=document.querySelector("#footer-root");let x=!1,G=!1;ne();O();St();R(f().route);const kt=dt({mountEl:ht,renderFrame:e=>{e(),wt()},pageContext:()=>{const e=f();return{t:h[e.language]||h.en,language:e.language,onQuizComplete:()=>P({quizUnlocked:!0})}},onRouteChange:e=>{P({route:e}),R(e),bt()}});function ne(){const e=f(),t=h[e.language]||h.en;ft.innerHTML=ce({route:e.route,t}),ie()}function O(){const e=f(),t=h[e.language]||h.en;vt.innerHTML=ge({t,theme:e.theme,language:e.language}),de(()=>{const n=f().theme==="dark"?"light":"dark";P({theme:n}),O()}),me(()=>{const n=f().language==="en"?"dk":"en";P({language:n}),ne(),R(f().route),O(),kt.refresh()})}function bt(){const e=document.querySelectorAll(".section-reveal"),t=new IntersectionObserver(n=>{n.forEach(i=>{i.isIntersecting&&(i.target.classList.add("is-visible"),t.unobserve(i.target))})},{threshold:.2});e.forEach((n,i)=>{n.style.transitionDelay=`${Math.min(i*70,240)}ms`,t.observe(n)})}function yt(){const e=new URL(window.location.href),t=e.searchParams.get("p");if(!t)return;const n=decodeURIComponent(t),[i,r]=n.split("&q="),o=r?`?${decodeURIComponent(r)}`:"",a=`${i}${o}${e.hash}`;window.history.replaceState(null,"",a)}function wt(){if(G)return;G=!0;let e=window.scrollY,t=!1;const n=()=>{t||(t=!0,window.requestAnimationFrame(()=>{const i=window.scrollY,r=i-e;i<36||r<-8?x=!1:r>8&&(x=!0),e=i,ie(),t=!1}))};window.addEventListener("scroll",n,{passive:!0})}function ie(){const e=document.querySelector("#navbar");e&&e.classList.toggle("nav-hidden",x)}function R(e){document.querySelectorAll(".nav-link").forEach(n=>{const i=n.getAttribute("href");n.classList.toggle("active",i===e)})}function St(){if(localStorage.getItem(K)==="true")return;const e=f(),t=h[e.language]||h.en;L.innerHTML=fe({t}),document.body.classList.add("welcome-active");const n=L.querySelector(".welcome-screen");window.requestAnimationFrame(()=>{n?.classList.add("is-visible")}),he(()=>{localStorage.setItem(K,"true"),n?.classList.remove("is-visible"),n?.classList.add("is-exiting"),document.body.classList.remove("welcome-active"),window.setTimeout(()=>{L.innerHTML=""},gt)})}
