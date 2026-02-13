(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=n(o);fetch(o.href,r)}})();const me={nav:{home:"Home",projects:"Projects",files:"Resume",contact:"Contact"},hero:{name:"Johan Niemann Husbjerg",title:"IT Architecture student shaping precise, human-centered systems."},welcome:{title:"Welcome",intro:"This site is a focused overview of my architecture profile, practical experience, and current projects.",point1:"Explore projects and implementation work.",point2:"Review my full Resume / CV structure.",point3:"Use Ask Johan for quick context.",continue:"Continue",passwordLabel:"Site access code",passwordPlaceholder:"Enter access code",passwordError:"Invalid access code. Please try again."},ask:{title:"Ask Johan",placeholder:"Ask about skills, projects, or architecture...",button:"Answer"},projects:{title:"Projects",intro:"Focused work in architecture, frontend systems, and product execution.",previewTitle:"Selected Work",previewIntro:"A snapshot of practical architecture and frontend execution.",cta:"View all projects"},files:{title:"Resume / CV",intro:"Education, experience, voluntary work, and qualifications."},fileScroller:{title:"Links and files",ariaLabel:"Links and files carousel"},resume:{previewTitle:"Resume Snapshot",previewIntro:"A structured view of my education, practical experience, and key competencies.",cta:"Open Resume / CV",downloadPdf:"Download resume as PDF",education:"Education",experience:"Work Experience",voluntary:"Voluntary Work",qualifications:"Qualifications",itSkills:"Core IT Skills",personalQualities:"Personal Qualities"},contact:{title:"Contact",intro:"Reach out directly by email, phone, or LinkedIn.",emailLabel:"Email",phoneLabel:"Phone",linkedinLabel:"LinkedIn",copyEmail:"Copy E-Mail",copyPhone:"Copy phonenumber",connectLinkedin:"Connect on LinkedIn",copied:"Copied"},footer:{builtWith:"Built with Vite, Tailwind, and Vanilla JavaScript.",rights:"All rights reserved."}},fe={nav:{home:"Hjem",projects:"Projekter",files:"CV",contact:"Kontakt"},hero:{name:"Johan Niemann Husbjerg",title:"IT-arkitekturstuderende med fokus på præcise, menneskelige systemer."},welcome:{title:"Velkommen",intro:"Denne side giver et fokuseret overblik over min arkitekturprofil, praktiske erfaring og nuværende projekter.",point1:"Se projekter og konkret implementeringsarbejde.",point2:"Gennemgå mit fulde Resume / CV.",point3:"Brug Ask Johan for hurtig kontekst.",continue:"Fortsæt",passwordLabel:"Adgangskode til siden",passwordPlaceholder:"Indtast adgangskode",passwordError:"Ugyldig adgangskode. Prøv igen."},ask:{title:"Spørg Johan",placeholder:"Spørg om kompetencer, projekter eller arkitektur...",button:"Svar"},projects:{title:"Projekter",intro:"Fokuseret arbejde inden for arkitektur, frontend-systemer og produktudførelse.",previewTitle:"Udvalgt Arbejde",previewIntro:"Et udsnit af praktisk arkitektur og frontend-udførelse.",cta:"Se alle projekter"},files:{title:"Resume / CV",intro:"Uddannelse, arbejdserfaring, frivilligt arbejde og kvalifikationer."},fileScroller:{title:"Links og filer",ariaLabel:"Karusel med links og filer"},resume:{previewTitle:"CV overblik",previewIntro:"Et struktureret overblik over uddannelse, praktisk erfaring og væsentlige kompetencer.",cta:"Åbn Resume / CV",downloadPdf:"Download resume som PDF",education:"Uddannelse",experience:"Arbejdserfaring",voluntary:"Frivilligt arbejde",qualifications:"Kvalifikationer",itSkills:"Væsentlige IT-kundskaber",personalQualities:"Personlige kvaliteter"},contact:{title:"Kontakt",intro:"Kontakt mig direkte via e-mail, telefon eller LinkedIn.",emailLabel:"E-mail",phoneLabel:"Telefon",linkedinLabel:"LinkedIn",copyEmail:"Kopiér e-mail",copyPhone:"Kopiér telefonnummer",connectLinkedin:"Forbind på LinkedIn",copied:"Kopieret"},footer:{builtWith:"Bygget med Vite, Tailwind og Vanilla JavaScript.",rights:"Alle rettigheder forbeholdes."}},G={en:me,dk:fe};function ge({route:e,t}){return`
    <header id="navbar" class="site-nav">
      <a class="brand" href="/" data-link>johanscv.dk</a>
      <nav class="nav-links" aria-label="Primary">
        ${[{path:"/",label:t.nav.home},{path:"/projects",label:t.nav.projects},{path:"/resume",label:t.nav.files}].map(i=>U(i.path,i.label,e)).join("")}
      </nav>
      <div class="nav-right">
        ${U("/contact",t.nav.contact,e,"nav-contact-link")}
      </div>
    </header>
  `}function U(e,t,n,i=""){const r=`nav-link nav-link-${e==="/"?"home":e.slice(1)} ${i}`.trim();return`<a class="${n===e?`${r} active`:r}" href="${e}" data-link>${t}</a>`}function he(e){return`
    <button id="theme-toggle" class="toggle-pill ${e==="dark"?"is-dark":"is-light"}" type="button" aria-label="Toggle theme">
      <span class="toggle-option toggle-option-light">Light</span>
      <span class="toggle-option toggle-option-dark">Dark</span>
      <span class="toggle-knob"></span>
    </button>
  `}function ve(e){const t=document.querySelector("#theme-toggle");t&&t.addEventListener("click",e)}function ke(e){return`
    <button id="language-toggle" class="lang-pill ${e==="dk"?"is-dk":"is-en"}" type="button" aria-label="Toggle language">
      <span class="lang-indicator"></span>
      <span class="lang-option">EN</span>
      <span class="lang-option">DK</span>
    </button>
  `}function be(e){const t=document.querySelector("#language-toggle");t&&t.addEventListener("click",e)}function we({t:e,theme:t,language:n}){const i=new Date().getFullYear();return`
    <footer class="site-footer" aria-label="Footer">
      <div class="footer-top">
        <nav class="footer-links" aria-label="Footer navigation">
          ${[{href:"/",label:e.nav.home},{href:"/projects",label:e.nav.projects},{href:"/resume",label:e.nav.files}].map(r=>`<a href="${r.href}" data-link>${r.label}</a>`).join("")}
        </nav>
        <div class="footer-controls">
          ${ke(n)}
          ${he(t)}
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">&copy; ${i} Johan Niemann Husbjerg. ${e.footer.rights}</p>
        <p class="footer-built">${e.footer.builtWith}</p>
      </div>
    </footer>
  `}function ye({t:e}){return`
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
        <div class="welcome-input-wrap">
          <label class="welcome-input-label" for="welcome-access-code">${e.welcome.passwordLabel}</label>
          <input
            id="welcome-access-code"
            class="welcome-input"
            type="password"
            autocomplete="current-password"
            placeholder="${e.welcome.passwordPlaceholder}"
          />
          <p id="welcome-error" class="welcome-error" aria-live="polite"></p>
        </div>
        <button id="welcome-continue" class="welcome-button" type="button">${e.welcome.continue}</button>
      </div>
    </section>
  `}function Se(e){const t=document.querySelector("#welcome-continue"),n=document.querySelector("#welcome-access-code"),i=document.querySelector("#welcome-error");if(!t||!n)return;const o=()=>{const r=e(n.value.trim());if(r?.ok){i&&(i.textContent="");return}i&&(i.textContent=r?.message||""),n.focus(),n.select()};t.addEventListener("click",o),n.addEventListener("keydown",r=>{r.key==="Enter"&&o()})}const E={theme:"johanscv.theme",language:"johanscv.language"};let p={theme:localStorage.getItem(E.theme)||"dark",language:localStorage.getItem(E.language)||"en",route:"/"};ae(p);function f(){return p}function V(e){const t=p,n={...p,...e};Ae(t,n)&&(p=n,je(t,p)&&$e(),Le(t,p)&&ae(p))}function $e(){localStorage.setItem(E.theme,p.theme),localStorage.setItem(E.language,p.language)}function ae(e){document.documentElement.dataset.theme=e.theme,document.documentElement.classList.toggle("dark",e.theme==="dark")}function je(e,t){return e.theme!==t.theme||e.language!==t.language}function Le(e,t){return e.theme!==t.theme}function Ae(e,t){return e.theme!==t.theme||e.language!==t.language||e.route!==t.route}const se=[{id:"spa-architecture",title:{en:"SPA Architecture Foundation",dk:"SPA Arkitekturgrundlag"},summary:{en:"Designed a lightweight Vanilla JS SPA with explicit routing, transition orchestration, and durable state boundaries.",dk:"Designede en letvægts Vanilla JS SPA med tydelig routing, overgangsorkestrering og robuste state-grænser."},tags:["Vite","Vanilla JS","Routing"]},{id:"design-system",title:{en:"Interaction-Led Design System",dk:"Interaktionsdrevet Designsystem"},summary:{en:"Built a restrained visual language with theme tokens, glass surfaces, motion hierarchy, and responsive rhythm.",dk:"Byggede et afdæmpet visuelt sprog med tematiske tokens, glasflader, motion-hierarki og responsiv rytme."},tags:["Tailwind","Theming","UX Motion"]},{id:"deployment-flow",title:{en:"GitHub Pages Deployment Flow",dk:"GitHub Pages Deploy-flow"},summary:{en:"Configured stable project-page deployment with base-path-safe assets and SPA fallback for deep links.",dk:"Konfigurerede stabil project-pages deployment med base-path-sikre assets og SPA fallback til deep links."},tags:["GitHub Pages","CI-ready","Reliability"]}];function Ee({t:e}){return`
    <section class="hero section-reveal" id="hero">
      <div class="avatar-wrap">
        <div class="avatar-ring"></div>
        <img class="avatar" src="/johanscv.dk/images/johan-placeholder.jpg" alt="Portrait of Johan" />
      </div>
      <h1 class="hero-name">${e.hero.name}</h1>
      <p class="hero-title">${e.hero.title}</p>
    </section>
  `}const Pe="I focus on architecture thinking, frontend systems, and product-minded delivery.",Ie="Recent work centers on SPA structure, interaction quality, and maintainable design systems.",Te="I prioritize separation of concerns, explicit state, and measurable performance.",S={skills:Pe,projects:Ie,architecture:Te,default:"Great question. In this phase, I can answer on skills, projects, and architecture approach."},le="http://127.0.0.1:8787".replace(/\/$/,""),ce="johanscv.askJohanAccessCode",X="Access code is required to use Ask Johan.",Ce=42,xe=24,Me=1200,De=260,qe=520,Q={en:["What is Johan’s favorite dish?","When is Johan’s birth date?","Where does Johan live?","What kind of IT architecture do you want to work with?","What is your strongest technical skill right now?","How do you approach system design decisions?","What have you learned from your current student job?","Which projects best represent your profile?","How do you balance UX quality and performance?","How do you work with data quality in practice?","How can we collaborate on a relevant opportunity?"],dk:["Hvad er Johans yndlingsret?","Hvornår har Johan fødselsdag?","Hvor bor Johan?","Hvilken type IT-arkitektur vil du arbejde med?","Hvad er din stærkeste tekniske kompetence lige nu?","Hvordan træffer du arkitektur- og designbeslutninger?","Hvad har du lært i dit nuværende studiejob?","Hvilke projekter repræsenterer dig bedst?","Hvordan balancerer du UX-kvalitet og performance?","Hvordan arbejder du med datakvalitet i praksis?","Hvordan kan vi samarbejde om en relevant mulighed?"]};let v=null,H=0;function He({t:e}){const[t,n]=_e(e.ask.title);return`
    <section class="ask-card section-reveal" id="ask-johan">
      <h2 class="section-title ask-title">
        <span>${t}</span>
        <span class="ask-title-johan">
          <span class="ask-title-johan-text">${n}</span>
          <span class="ask-title-ai-icon-png" style="--ai-icon-url: url('/johanscv.dk/images/ai-icon.png')" aria-hidden="true"></span>
        </span>
      </h2>
      <div class="ask-input-wrap">
        <input id="ask-input" class="ask-input" type="text" placeholder="${e.ask.placeholder}" />
        <button id="ask-submit" class="ask-button" type="button" aria-label="${e.ask.button}">
          <span class="ask-button-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M12 19V7.2" />
              <path d="M7.5 11.7 12 7.2l4.5 4.5" />
            </svg>
          </span>
        </button>
      </div>
      <p id="ask-answer" class="ask-answer"></p>
    </section>
  `}function _e(e="Ask Johan"){const t=String(e).trim();if(!t)return["Ask","Johan"];const n=t.split(/\s+/);if(n.length===1)return[n[0],""];const i=n.pop();return[n.join(" "),i]}function Oe(e="en"){const t=document.querySelector("#ask-input"),n=document.querySelector("#ask-submit"),i=document.querySelector("#ask-answer");if(!t||!n||!i)return;Ge(t,e);const o=async()=>{const r=t.value.trim().toLowerCase();n.disabled=!0;try{const a=await Re(r);await Qe(i,a)}finally{n.disabled=!1}};n.addEventListener("click",o),t.addEventListener("keydown",r=>{r.key==="Enter"&&o()})}async function Re(e){if(!e)return S.default;try{return await Ve(e)}catch(t){return Ke(t)}return Fe(e)}function Fe(e){return e.includes("skill")?S.skills:e.includes("project")?S.projects:e.includes("architect")?S.architecture:S.default}function Je(){const e=localStorage.getItem(ce);return e&&e.trim()?e:""}async function Ve(e){if(!le)throw new Error("VITE_API_BASE_URL is not configured.");const t=Je();if(!t)return X;const n=await We(e,t);if(n.status===401)return localStorage.removeItem(ce),X;if(!n.ok)throw new Error(await Ne(n));const i=await n.json(),o=Be(i);if(!o)throw new Error("API returned an empty answer.");return o}function We(e,t){return fetch(`${le}/api/ask-johan`,{method:"POST",headers:{"Content-Type":"application/json","x-access-code":t},body:JSON.stringify({question:e})})}function Be(e){return typeof e?.answer!="string"?"":e.answer.trim()||""}async function Ne(e){try{const t=await e.json();if(typeof t?.answer=="string"&&t.answer.trim())return`${e.status} ${e.statusText}: ${t.answer.trim()}`}catch{}return`${e.status} ${e.statusText}: API request failed.`}function Ke(e){return`Ask Johan API error: ${e instanceof Error?e.message:String(e)}`}function Ge(e,t){Xe();const n=Ue(Q[t]||Q.en),i=++H;let o=0,r=0,a=!1;const s=()=>{if(i!==H)return;const d=n[o];if(!a){if(r+=1,e.placeholder=d.slice(0,r),r>=d.length){a=!0,v=window.setTimeout(s,Me);return}v=window.setTimeout(s,Ce);return}if(r-=1,e.placeholder=d.slice(0,Math.max(r,0)),r<=0){a=!1,o=(o+1)%n.length,v=window.setTimeout(s,De);return}v=window.setTimeout(s,xe)};s()}function Ue(e){const t=[...e];for(let n=t.length-1;n>0;n-=1){const i=Math.floor(Math.random()*(n+1));[t[n],t[i]]=[t[i],t[n]]}return t}function Xe(){v&&(window.clearTimeout(v),v=null),H+=1}async function Qe(e,t){const n=String(t||""),i=e.offsetHeight;e.style.height=`${i}px`,e.textContent=n,e.classList.toggle("has-content",!!n.trim());const o=n.trim()?e.scrollHeight:0;e.offsetHeight,e.style.height=`${o}px`,await Ye(e),e.style.height=n.trim()?"auto":"0px"}function Ye(e){return new Promise(t=>{let n=!1;const i=()=>{n||(n=!0,e.removeEventListener("transitionend",o),t())},o=r=>{r.propertyName==="height"&&i()};e.addEventListener("transitionend",o),window.setTimeout(i,qe+80)})}const Y=[{id:"cv",title:{en:"CV",dk:"CV"},description:{en:"Updated profile and experience summary.",dk:"Opdateret profil og erfaringsoversigt."},url:"/files/johan-niemann-husbjerg-cv.pdf",actionLabel:{en:"Download CV",dk:"Download CV"},actionType:"download",icon:"download"},{id:"linkedin",title:{en:"LinkedIn",dk:"LinkedIn"},description:{en:"Professional profile, education, and work history.",dk:"Professionel profil, uddannelse og arbejdserfaring."},url:"https://www.linkedin.com/in/johan-niemann-h-038906312/",actionLabel:{en:"Go to LinkedIn",dk:"Gå til LinkedIn"},actionType:"external",icon:"linkedin"},{id:"github",title:{en:"GitHub",dk:"GitHub"},description:{en:"Code repositories, projects, and technical work.",dk:"Kode-repositorier, projekter og teknisk arbejde."},url:"https://github.com/johanniemann",actionLabel:{en:"Go to GitHub",dk:"Gå til GitHub"},actionType:"external",icon:"github"},{id:"location",title:{en:"Location",dk:"Lokation"},description:{en:"Where I live in Copenhagen.",dk:"Hvor jeg bor i København."},url:"https://www.google.com/maps/place/Enghavevej+63,+1674+K%C3%B8benhavn/@55.665423,12.5330593,15z/data=!3m1!4b1!4m6!3m5!1s0x4652539dab759293:0xf1e50266a0d1baf1!8m2!3d55.6654113!4d12.5433376!16s%2Fg%2F11nnv8kwnj?entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D",actionLabel:{en:"Open in Maps",dk:"Åbn i Maps"},actionType:"external",icon:"location"}];function z(e,t,n=!1){const i=C(e.title,t),o=C(e.description,t),r=ze(e.url),a=n?'tabindex="-1"':'tabindex="0"',s=n?"file-card file-card-clone":"file-card",d=Ze(e,n),l=tt(e.icon),u=C(e.actionLabel,t)||et(e.actionType,i,t);return`
    <article class="${s}" ${a}>
      <h3 class="file-title">${i}</h3>
      <p class="file-description">${o}</p>
      <a class="file-action" href="${r}" ${d} aria-label="${u}">
        <span class="file-action-icon" aria-hidden="true">${l}</span>
        <span class="file-action-text">${u}</span>
      </a>
    </article>
  `}function ze(e){return e.startsWith("/")?`/johanscv.dk/${e.slice(1)}`:e}function Ze(e,t){const n=[];return e.actionType==="download"?n.push("download"):n.push('target="_blank"','rel="noopener noreferrer"'),t&&n.push('tabindex="-1"'),n.join(" ")}function et(e,t,n){return e==="download"?`Download ${t}`:n==="dk"?`Gå til ${t}`:`Open ${t}`}function tt(e){return e==="linkedin"?"in":e==="github"?nt():e==="location"?it():ot()}function nt(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.21.68-.48v-1.7c-2.78.6-3.37-1.17-3.37-1.17-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.52 1.03 1.52 1.03.89 1.52 2.33 1.08 2.9.82.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.41.11 2.66.64.7 1.02 1.59 1.02 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  `}function it(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2.25a6.75 6.75 0 0 0-6.75 6.75c0 4.98 6.05 11.86 6.3 12.15a.6.6 0 0 0 .9 0c.25-.29 6.3-7.17 6.3-12.15A6.75 6.75 0 0 0 12 2.25Zm0 9.75a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
      />
    </svg>
  `}function ot(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M11.25 3.75a.75.75 0 0 1 1.5 0v9.69l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V3.75Z"/>
      <path d="M4.5 17.25a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1-.75-.75Z"/>
    </svg>
  `}function C(e,t){return typeof e=="string"?e:e&&typeof e=="object"&&(e[t]||e.en||Object.values(e)[0])||""}let w=null,b=!1,y=null,A=null;const rt=.018,L={interaction:1200,drag:900,wheel:1100};function at({t:e,language:t}){const n=Y.map(o=>z(o,t)).join(""),i=Y.map(o=>z(o,t,!0)).join("");return`
    <section class="files-strip section-reveal" id="file-scroller-wrap">
      <h2 class="section-title">${e.fileScroller.title}</h2>
      <div id="file-scroller-viewport" class="file-scroller-viewport" tabindex="0" aria-label="${e.fileScroller.ariaLabel}">
        <div id="file-scroller-track" class="file-scroller-track">
          ${n}
          ${i}
        </div>
      </div>
    </section>
  `}function st(){const e=document.querySelector("#file-scroller-viewport"),t=document.querySelector("#file-scroller-track");if(!e||!t)return;lt(),_(),b=!0;const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let i=!1,o=!1,r=null,a=!1,s=0,d=0,l=0,u=t.scrollWidth/2,k=performance.now();const $=()=>{t.style.transform=`translate3d(${-l}px, 0, 0)`},I=c=>{if(!u)return 0;const m=c%u;return m<0?m+u:m},T=c=>{if(!b||n||i)return;const m=c-k;k=c,l=I(l+m*rt),$(),w=window.requestAnimationFrame(T)},g=()=>{O(),b=!1,_()},h=()=>{O(),!(b||n||i)&&(b=!0,k=performance.now(),w=window.requestAnimationFrame(T))},B=c=>{if(c.target.closest("a, button, input, textarea, select")){g(),y=window.setTimeout(h,L.interaction);return}o=!0,r=c.pointerId,a=!1,s=c.clientX,d=l,g(),e.setPointerCapture(r)},N=c=>{if(!o||c.pointerId!==r)return;const m=c.clientX-s;!a&&Math.abs(m)>6&&(a=!0,i=!0,e.classList.add("is-dragging")),i&&(l=I(d-m),$())},j=c=>{!o||c.pointerId!==r||(o=!1,r=null,i=!1,e.classList.remove("is-dragging"),e.hasPointerCapture(c.pointerId)&&e.releasePointerCapture(c.pointerId),y=window.setTimeout(h,a?L.drag:L.interaction))},K=c=>{g(),l=I(l+c.deltaY*.8+c.deltaX),$(),y=window.setTimeout(h,L.wheel)};e.addEventListener("mouseenter",g),e.addEventListener("mouseleave",h),e.addEventListener("focusin",g),e.addEventListener("focusout",h),e.addEventListener("pointerdown",B),e.addEventListener("pointermove",N),e.addEventListener("pointerup",j),e.addEventListener("pointercancel",j),e.addEventListener("wheel",K,{passive:!0}),A=()=>{e.removeEventListener("mouseenter",g),e.removeEventListener("mouseleave",h),e.removeEventListener("focusin",g),e.removeEventListener("focusout",h),e.removeEventListener("pointerdown",B),e.removeEventListener("pointermove",N),e.removeEventListener("pointerup",j),e.removeEventListener("pointercancel",j),e.removeEventListener("wheel",K)},window.requestAnimationFrame(()=>{u=t.scrollWidth/2,$()}),n||(w=window.requestAnimationFrame(T))}function _(){w&&(window.cancelAnimationFrame(w),w=null)}function O(){y&&(window.clearTimeout(y),y=null)}function lt(){b=!1,A&&(A(),A=null),_(),O()}function ct({t:e,language:t}){return`
    <main class="page-stack">
      ${Ee({t:e})}
      <section class="content-section section-reveal" id="projects-preview">
        <h2 class="section-title">${e.projects.previewTitle}</h2>
        <p class="section-body">${e.projects.previewIntro}</p>
        <div class="projects-grid projects-grid-compact">
          ${se.slice(0,2).map(n=>ut(n,t)).join("")}
        </div>
        <a class="projects-cta" href="/projects" data-link>${e.projects.cta}</a>
      </section>

      <section class="content-section section-reveal" id="resume-preview">
        <h2 class="section-title">${e.resume.previewTitle}</h2>
        <p class="section-body">${e.resume.previewIntro}</p>
        <a class="projects-cta" href="/resume" data-link>${e.resume.cta}</a>
      </section>

      ${He({t:e})}
      ${at({t:e,language:t})}
    </main>
  `}function dt({language:e}){Oe(e),st()}function ut(e,t){const n=e.title[t]||e.title.en,i=e.summary[t]||e.summary.en;return`
    <article class="project-card">
      <h3 class="project-title">${n}</h3>
      <p class="project-summary">${i}</p>
    </article>
  `}const pt=Object.freeze(Object.defineProperty({__proto__:null,mount:dt,render:ct},Symbol.toStringTag,{value:"Module"}));function mt({t:e,language:t}){return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="projects">
        <h2 class="section-title">${e.projects.title}</h2>
        <p class="section-body">${e.projects.intro}</p>
      </section>
      <section class="projects-grid section-reveal" aria-label="${e.projects.title}">
        ${se.map(n=>ft(n,t)).join("")}
      </section>
    </main>
  `}function ft(e,t){const n=e.title[t]||e.title.en,i=e.summary[t]||e.summary.en;return`
    <article class="project-card">
      <h3 class="project-title">${n}</h3>
      <p class="project-summary">${i}</p>
      <div class="project-tags">
        ${e.tags.map(o=>`<span class="project-tag">${o}</span>`).join("")}
      </div>
    </article>
  `}const gt=Object.freeze(Object.defineProperty({__proto__:null,render:mt},Symbol.toStringTag,{value:"Module"})),ht={education:[{level:"Videregående uddannelse",institution:"Københavns Erhvervsakademi",focus:"Professionsbachelor, IT-arkitektur",period:"August 2024 - Januar 2028"},{level:"Gymnasial uddannelse (STX)",institution:"Nærum Gymnasium",focus:"Samfundsfag/Engelsk A niveau",period:"August 2019 - Juni 2022"},{level:"Folkeskole",institution:"Engelsborgskolen, Kongens Lyngby",focus:"Grundskoleforløb",period:"August 2008 - Juni 2018"}],experience:[{role:"Product Data & Systems Assistant hos Norlys",description:"Arbejdet med digitale e-commerce-løsninger med ansvar for oprettelse, strukturering og vedligeholdelse af produktdata på tværs af databaser, PIM- og CMS-systemer. Fokus på datakvalitet, korrekthed, konsistens samt samarbejde med forretning, leverandører og tekniske teams. Løbende optimering af produkt- og kategorisider med SEO-fokus.",type:"Studentermedhjælper",period:"Februar 2026 - d.d."},{role:"Indkøbs- og salgskonsulent hos Nofipa ApS",description:"Arbejdet med finansielle transaktioner og rådgivning inden for asset-backed lending, herunder værdifastsættelse af aktiver. Udført AML- og KYC-kontroller, due diligence og risikovurderinger samt rådgivning til privat- og erhvervskunder med fokus på compliance og kvalitet. Udarbejdet 1.000+ kontrakter og bidraget til digitalisering af manuelle processer.",type:"Studentermedhjælper",period:"Januar 2025 - d.d."},{role:"Lektiehjælper til folkeskoleelev i matematik og dansk",description:"Erfaring med undervisning, formidling og planlægning af faglige forløb.",type:"Deltid",period:"December 2021 - d.d."},{role:"Pædagogmedhjælper i Børnehuset Klokkeblomsten",description:"Erfaring med børns udvikling, læring og behov i en struktureret hverdagsramme.",type:"Fuldtid",period:"August 2022 - Oktober 2023"}],voluntary:[{role:"Studentermiljørepræsentant (SMR) for IT-arkitekturuddannelsen på EK",description:"Repræsenterer de studerendes interesser i forhold til trivsel og studiemiljø. Indsamler input fra medstuderende og deltager i dialog med undervisere og ledelse om forbedringer af studiehverdagen.",period:"September 2024 - d.d."}],qualifications:{it:["Microsoft Office pakken","CMS- og PIM-systemer","Adobe pakken","Git og GitHub","SQL og NoSQL","Datamodellering og datahåndtering (JSON, CSV, XML m.fl.)","Visualisering af dashboards (Tableau, Excel m.fl.)","UI/UX-design i Compose og Figma","Stærkt kendskab til JavaScript, Python, Kotlin m.fl.","Stærkt kendskab til API-drevet softwarearkitektur","Iterativ udvikling, prototyper og brugertests","Business Modeling Frameworks (BPMN, RCA, SWOT, BMC, AS-IS, TO-BE m.fl.)"],personal:["Ansvarsbevidst - overholder deadlines og følger opgaver til dørs","Lærenem - sætter mig hurtigt ind i nye systemer og arbejdsgange","Struktureret - arbejder metodisk og bevarer overblik","Samarbejdsorienteret - trives i teams og kommunikerer klart","Selvstændig - tager initiativ og kan arbejde uden tæt styring"]}},vt={education:[{level:"Higher Education",institution:"Copenhagen School of Design and Technology",focus:"Professional Bachelor's Degree, IT Architecture",period:"August 2024 - January 2028"},{level:"Upper Secondary Education (STX)",institution:"Nærum Gymnasium",focus:"Social Sciences / English, A-level",period:"August 2019 - June 2022"},{level:"Primary and Lower Secondary School",institution:"Engelsborgskolen, Kongens Lyngby",focus:"General school program",period:"August 2008 - June 2018"}],experience:[{role:"Product Data & Systems Assistant at Norlys",description:"Worked on digital e-commerce solutions with responsibility for creating, structuring, and maintaining product data across databases, PIM and CMS systems. Focused on data quality, consistency, and coordination with business, suppliers, and technical teams. Continuously optimized product and category pages with SEO focus.",type:"Student Assistant",period:"February 2026 - Present"},{role:"Purchasing and Sales Consultant at Nofipa ApS",description:"Worked with financial transactions and advisory within asset-backed lending, including valuation-based lending. Performed AML/KYC controls, due diligence, and risk assessments, and advised private and business customers with focus on compliance and quality. Prepared 1,000+ contracts and supported digitalization of manual workflows.",type:"Student Assistant",period:"January 2025 - Present"},{role:"Private Tutor in Mathematics and Danish",description:"Experience in teaching, communication, and planning subject-focused sessions.",type:"Part-time",period:"December 2021 - Present"},{role:"Pedagogical Assistant at Børnehuset Klokkeblomsten",description:"Experience with child development, learning needs, and structured care environments.",type:"Full-time",period:"August 2022 - October 2023"}],voluntary:[{role:"Student Environment Representative (SMR) for IT Architecture at EK",description:"Represent students in matters related to well-being and study environment. Collect input from students and participate in dialogue with lecturers and management to improve the study experience.",period:"September 2024 - Present"}],qualifications:{it:["Microsoft Office suite","CMS and PIM systems","Adobe suite","Git and GitHub","SQL and NoSQL","Data modeling and handling (JSON, CSV, XML, etc.)","Dashboard visualization (Tableau, Excel, etc.)","UI/UX design in Compose and Figma","Strong command of JavaScript, Python, Kotlin, and more","Strong command of API-driven software architecture","Iterative development, prototypes, and user testing","Business modeling frameworks (BPMN, RCA, SWOT, BMC, AS-IS, TO-BE, etc.)"],personal:["Responsible - meet deadlines and carry tasks through","Fast learner - quickly adapt to new systems and workflows","Structured - work methodically and maintain overview","Collaborative - thrive in teams and communicate clearly","Independent - take initiative and work without close supervision"]}},Z={dk:ht,en:vt};function kt({t:e,language:t}){const n=Z[t]||Z.dk;return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="resume-intro">
        <div class="resume-intro-head">
          <div>
            <h2 class="section-title">${e.files.title}</h2>
            <p class="section-body">${e.files.intro}</p>
          </div>
          <a class="file-action resume-download-action" href="/johanscv.dk/files/johan-niemann-husbjerg-cv.pdf" download aria-label="${e.resume.downloadPdf}">
            <span class="file-action-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M11.25 3.75a.75.75 0 0 1 1.5 0v9.69l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V3.75Z"/>
                <path d="M4.5 17.25a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1-.75-.75Z"/>
              </svg>
            </span>
            <span class="file-action-text">${e.resume.downloadPdf}</span>
          </a>
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-education">
        <h3 class="resume-heading">${e.resume.education}</h3>
        <div class="resume-list">
          ${n.education.map(bt).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-experience">
        <h3 class="resume-heading">${e.resume.experience}</h3>
        <div class="resume-list">
          ${n.experience.map(wt).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-voluntary">
        <h3 class="resume-heading">${e.resume.voluntary}</h3>
        <div class="resume-list">
          ${n.voluntary.map(yt).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-qualifications">
        <h3 class="resume-heading">${e.resume.qualifications}</h3>
        <div class="qual-grid">
          <article class="qual-card">
            <h4 class="qual-title">${e.resume.itSkills}</h4>
            <ul class="qual-list">
              ${n.qualifications.it.map(ee).join("")}
            </ul>
          </article>
          <article class="qual-card">
            <h4 class="qual-title">${e.resume.personalQualities}</h4>
            <ul class="qual-list">
              ${n.qualifications.personal.map(ee).join("")}
            </ul>
          </article>
        </div>
      </section>
    </main>
  `}function bt(e){return`
    <article class="resume-item">
      <p class="resume-item-type">${e.level}</p>
      <h4 class="resume-item-title">${e.institution}</h4>
      <p class="resume-item-focus">- ${e.focus}</p>
      <p class="resume-item-period">${e.period}</p>
    </article>
  `}function wt(e){return`
    <article class="resume-item">
      <h4 class="resume-item-title">${e.role}</h4>
      <p class="resume-item-body">${e.description}</p>
      <p class="resume-item-period"><span class="resume-item-type">${e.type}</span>: ${e.period}</p>
    </article>
  `}function yt(e){return`
    <article class="resume-item">
      <h4 class="resume-item-title">${e.role}</h4>
      <p class="resume-item-body">${e.description}</p>
      <p class="resume-item-period">${e.period}</p>
    </article>
  `}function ee(e){return`<li>${e}</li>`}const St=Object.freeze(Object.defineProperty({__proto__:null,render:kt},Symbol.toStringTag,{value:"Module"}));function $t({t:e}){return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="contact-intro">
        <h2 class="section-title">${e.contact.title}</h2>
        <p class="section-body">${e.contact.intro}</p>
      </section>

      <section class="contact-stack section-reveal" aria-label="${e.contact.title}">
        ${x({label:e.contact.emailLabel,value:"johan.niemann.husbjerg@gmail.com",action:M({type:"button",icon:Lt(),text:e.contact.copyEmail,attrs:'data-copy="johan.niemann.husbjerg@gmail.com"'})})}
        ${x({label:e.contact.phoneLabel,value:"+45 60 47 42 36",action:M({type:"button",icon:At(),text:e.contact.copyPhone,attrs:'data-copy="+45 60 47 42 36"'})})}
        ${x({label:e.contact.linkedinLabel,value:"linkedin.com/in/johan-niemann-h-038906312",action:M({type:"link",icon:"in",text:e.contact.connectLinkedin,attrs:'href="https://www.linkedin.com/in/johan-niemann-h-038906312/" target="_blank" rel="noopener noreferrer"'})})}
      </section>
    </main>
  `}function jt({t:e}){document.querySelectorAll("[data-copy]").forEach(n=>{n.dataset.defaultLabel=n.querySelector(".file-action-text")?.textContent||"",n.addEventListener("click",async()=>{if(n.dataset.busy==="true")return;const i=n.getAttribute("data-copy")||"";!i||!await Et(i)||await Pt(n,e.contact.copied)})})}function x({label:e,value:t,action:n}){return`
    <article class="contact-row">
      <div class="contact-meta">
        <h3 class="contact-label">${e}</h3>
        <p class="contact-value">${t}</p>
      </div>
      <div class="contact-action-wrap">
        ${n}
      </div>
    </article>
  `}function M({type:e,icon:t,text:n,attrs:i}){const o=e==="link"?"a":"button";return`
    <${o} class="file-action contact-action" ${e==="button"?'type="button"':""} ${i} aria-label="${n}">
      <span class="file-action-icon" aria-hidden="true">${t}</span>
      <span class="file-action-text">${n}</span>
    </${o}>
  `}function Lt(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 6.75A1.75 1.75 0 0 1 4.75 5h14.5A1.75 1.75 0 0 1 21 6.75v10.5A1.75 1.75 0 0 1 19.25 19H4.75A1.75 1.75 0 0 1 3 17.25V6.75Zm1.8.23 7.2 5.4 7.2-5.4a.25.25 0 0 0-.2-.48H5a.25.25 0 0 0-.2.48Z"/>
    </svg>
  `}function At(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.62 2.9a1.5 1.5 0 0 1 1.6.32l2.12 2.12a1.5 1.5 0 0 1 .33 1.62l-.86 1.72a1 1 0 0 0 .2 1.15l3.88 3.88a1 1 0 0 0 1.15.2l1.72-.86a1.5 1.5 0 0 1 1.62.33l2.12 2.12a1.5 1.5 0 0 1 .32 1.6l-.55 1.38a2.5 2.5 0 0 1-2.33 1.56c-2.13 0-5.22-1.1-8.35-4.24-3.14-3.13-4.24-6.22-4.24-8.35 0-.99.6-1.9 1.56-2.33l1.38-.55Z"/>
    </svg>
  `}async function Et(e){try{return await navigator.clipboard.writeText(e),!0}catch{const t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();const n=document.execCommand("copy");return document.body.removeChild(t),n}}async function Pt(e,t){const n=e.querySelector(".file-action-text");if(!n)return;const i=e.dataset.defaultLabel||n.textContent||"",o=180,r=900;e.dataset.busy="true",e.classList.add("is-label-hidden"),await D(o),n.textContent=t,e.classList.remove("is-label-hidden"),await D(r),e.classList.add("is-label-hidden"),await D(o),n.textContent=i,e.classList.remove("is-label-hidden"),e.dataset.busy="false"}function D(e){return new Promise(t=>{window.setTimeout(t,e)})}const It=Object.freeze(Object.defineProperty({__proto__:null,mount:jt,render:$t},Symbol.toStringTag,{value:"Module"}));function Tt(e){return`<div class="page-transition-enter">${e}</div>`}const te={"/":pt,"/projects":gt,"/resume":St,"/contact":It},R="/johanscv.dk/",Ct=500,xt={"/files":"/resume"};function de(e){const t=e.startsWith("/")?e.slice(1):e;return`${R}${t}`}function ne(e=window.location.pathname){if(!e.startsWith(R))return"/";const t=e.slice(R.length-1)||"/";return t.length>1&&t.endsWith("/")?t.slice(0,-1):t}function Mt({mountEl:e,renderFrame:t,pageContext:n,onRouteChange:i}){let o=!1;const r=()=>{const s=ne(),d=xt[s]||s,l=te[d]||te["/"],u=n(d);s!==d&&history.replaceState({},"",de(d)),e.innerHTML=Tt(l.render(u)),l.mount&&l.mount(u),i(d),requestAnimationFrame(()=>{const k=e.querySelector(".page-transition-enter");k&&k.classList.add("is-visible")})},a=()=>{if(o)return;o=!0;const s=e.querySelector(".page-transition-enter");if(!s){r(),o=!1;return}s.classList.remove("is-visible"),s.classList.add("is-exiting"),window.setTimeout(()=>{r(),o=!1},Ct)};return document.addEventListener("click",s=>{const d=s.target.closest("[data-link]");if(!d)return;const l=d.getAttribute("href");!l||!l.startsWith("/")||(s.preventDefault(),l!==ne()&&Dt(l,a))}),window.addEventListener("popstate",a),t(r),{refresh:a}}function Dt(e,t){history.pushState({},"",de(e)),t()}Wt();const qt=document.querySelector("#app");qt.innerHTML=`
  <div id="welcome-root"></div>
  <div class="site-shell" id="site-shell">
    <div id="nav-root"></div>
    <div id="page-root"></div>
    <div id="footer-root"></div>
  </div>
`;const ie="johanscv.askJohanAccessCode",oe="johanscv.siteAccessGranted",Ht=500,_t=.2,q=document.querySelector("#welcome-root"),Ot=document.querySelector("#nav-root"),Rt=document.querySelector("#page-root"),Ft=document.querySelector("#footer-root");let F=!1,re=!1;ue();J();Nt();W(f().route);const Jt=Mt({mountEl:Rt,renderFrame:e=>{e(),Bt()},pageContext:()=>{const e=f();return{t:P(e.language),language:e.language}},onRouteChange:e=>{V({route:e}),W(e),Vt()}});function ue(){const e=f(),t=P(e.language);Ot.innerHTML=ge({route:e.route,t}),pe()}function J(){const e=f(),t=P(e.language);Ft.innerHTML=we({t,theme:e.theme,language:e.language}),ve(()=>{Kt(),J()}),be(()=>{Gt(),ue(),W(f().route),J(),Jt.refresh()})}function Vt(){const e=document.querySelectorAll(".section-reveal"),t=new IntersectionObserver(n=>{n.forEach(i=>{i.isIntersecting&&(i.target.classList.add("is-visible"),t.unobserve(i.target))})},{threshold:_t});e.forEach((n,i)=>{n.style.transitionDelay=`${Math.min(i*70,240)}ms`,t.observe(n)})}function Wt(){const e=new URL(window.location.href),t=e.searchParams.get("p");if(!t)return;const n=decodeURIComponent(t),[i,o]=n.split("&q="),r=o?`?${decodeURIComponent(o)}`:"",a=`${i}${r}${e.hash}`;window.history.replaceState(null,"",a)}function Bt(){if(re)return;re=!0;let e=window.scrollY,t=!1;const n=()=>{t||(t=!0,window.requestAnimationFrame(()=>{const i=window.scrollY,o=i-e;i<36||o<-8?F=!1:o>8&&(F=!0),e=i,pe(),t=!1}))};window.addEventListener("scroll",n,{passive:!0})}function pe(){const e=document.querySelector("#navbar");e&&e.classList.toggle("nav-hidden",F)}function W(e){document.querySelectorAll(".nav-link").forEach(n=>{const i=n.getAttribute("href");n.classList.toggle("active",i===e)})}function Nt(){const e=f(),t=P(e.language),n=localStorage.getItem(ie)?.trim()||"",i="".trim(),o=s=>s?i?s===i:!0:!1;if(localStorage.getItem(oe)==="true"&&o(n))return;q.innerHTML=ye({t}),document.body.classList.add("welcome-active");const a=q.querySelector(".welcome-screen");window.requestAnimationFrame(()=>{a?.classList.add("is-visible")}),Se(s=>o(s)?(localStorage.setItem(ie,s),localStorage.setItem(oe,"true"),a?.classList.remove("is-visible"),a?.classList.add("is-exiting"),document.body.classList.remove("welcome-active"),window.setTimeout(()=>{q.innerHTML=""},Ht),{ok:!0}):{ok:!1,message:t.welcome.passwordError})}function P(e){return G[e]||G.en}function Kt(){const e=f().theme;V({theme:e==="dark"?"light":"dark"})}function Gt(){const e=f().language;V({language:e==="en"?"dk":"en"})}
