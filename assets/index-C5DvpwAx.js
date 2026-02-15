(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();const _e={nav:{home:"Home",projects:"Projects",files:"Resume",contact:"Contact"},hero:{name:"Johan Niemann Husbjerg",title:"IT Architecture student shaping precise, human-centered systems."},welcome:{title:"Welcome",intro:"This site is a focused overview of my architecture profile, practical experience, and current projects.",point1:"Explore projects and implementation work.",point2:"Review my full Resume / CV structure.",point3:"Use Ask Johan for quick context.",continue:"Continue",passwordLabel:"Site access code",passwordPlaceholder:"Enter access code",passwordError:"Invalid access code. Please try again."},ask:{title:"Ask Johan",placeholder:"Ask about skills, projects, or architecture...",button:"Answer"},projects:{title:"Projects",intro:"Focused work in architecture, frontend systems, and product execution.",previewTitle:"Selected Work",previewIntro:"A snapshot of practical architecture and frontend execution.",cta:"View all projects"},files:{title:"Resume",intro:"Education, experience, voluntary work, and qualifications."},fileScroller:{title:"Links and files",ariaLabel:"Links and files carousel"},resume:{previewTitle:"Resume Snapshot",previewIntro:"A structured view of my education, practical experience, and key competencies.",cta:"Open Resume / CV",downloadPdf:"Download Resume as PDF",education:"Education",experience:"Work Experience",voluntary:"Voluntary Work",qualifications:"Qualifications",itSkills:"Core IT Skills",personalQualities:"Personal Qualities"},contact:{title:"Contact",intro:"Reach out directly by email, phone, or LinkedIn.",emailLabel:"Email",phoneLabel:"Phone",linkedinLabel:"LinkedIn",copyEmail:"Copy E-Mail",copyPhone:"Copy phonenumber",connectLinkedin:"Connect on LinkedIn",copied:"Copied"},playground:{title:"Experimental Playground",intro:"This is a sandbox page for testing ideas, UI experiments, and prototypes.",moreToComeTitle:"More To Come",moreToComeBody:"More experiments and interactive prototypes will be added here soon."},scrollHint:{label:"Scroll for more"},footer:{builtWith:"Built with Vite, Tailwind, and Vanilla JavaScript.",rights:"All rights reserved.",playground:"Experimental Playground"}},He={nav:{home:"Hjem",projects:"Projekter",files:"CV",contact:"Kontakt"},hero:{name:"Johan Niemann Husbjerg",title:"IT-arkitekturstuderende med fokus på præcise, menneskelige systemer."},welcome:{title:"Velkommen",intro:"Denne side giver et fokuseret overblik over min arkitekturprofil, praktiske erfaring og nuværende projekter.",point1:"Se projekter og konkret implementeringsarbejde.",point2:"Gennemgå mit fulde Resume / CV.",point3:"Brug Ask Johan for hurtig kontekst.",continue:"Fortsæt",passwordLabel:"Adgangskode til siden",passwordPlaceholder:"Indtast adgangskode",passwordError:"Ugyldig adgangskode. Prøv igen."},ask:{title:"Spørg Johan",placeholder:"Spørg om kompetencer, projekter eller arkitektur...",button:"Svar"},projects:{title:"Projekter",intro:"Fokuseret arbejde inden for arkitektur, frontend-systemer og produktudførelse.",previewTitle:"Udvalgt Arbejde",previewIntro:"Et udsnit af praktisk arkitektur og frontend-udførelse.",cta:"Se alle projekter"},files:{title:"CV",intro:"Uddannelse, arbejdserfaring, frivilligt arbejde og kvalifikationer."},fileScroller:{title:"Links og filer",ariaLabel:"Karusel med links og filer"},resume:{previewTitle:"CV overblik",previewIntro:"Et struktureret overblik over uddannelse, praktisk erfaring og væsentlige kompetencer.",cta:"Åbn Resume / CV",downloadPdf:"Download CV som PDF",education:"Uddannelse",experience:"Arbejdserfaring",voluntary:"Frivilligt arbejde",qualifications:"Kvalifikationer",itSkills:"Væsentlige IT-kundskaber",personalQualities:"Personlige kvaliteter"},contact:{title:"Kontakt",intro:"Kontakt mig direkte via e-mail, telefon eller LinkedIn.",emailLabel:"E-mail",phoneLabel:"Telefon",linkedinLabel:"LinkedIn",copyEmail:"Kopiér e-mail",copyPhone:"Kopiér telefonnummer",connectLinkedin:"Forbind på LinkedIn",copied:"Kopieret"},playground:{title:"Eksperimentelt Playground",intro:"Dette er en sandbox-side til at teste ideer, UI-eksperimenter og prototyper.",moreToComeTitle:"Mere På Vej",moreToComeBody:"Flere eksperimenter og interaktive prototyper bliver tilføjet her snart."},scrollHint:{label:"Scroll for mere"},footer:{builtWith:"Bygget med Vite, Tailwind og Vanilla JavaScript.",rights:"Alle rettigheder forbeholdes.",playground:"Eksperimentelt Playground"}},te={en:_e,dk:He};function Re({route:e,t}){return`
    <header id="navbar" class="site-nav">
      <div class="nav-right">
        <nav class="nav-links" aria-label="Primary">
          ${[{path:"/",label:t.nav.home},{path:"/projects",label:t.nav.projects},{path:"/resume",label:t.nav.files}].map(o=>ne(o.path,o.label,e)).join("")}
        </nav>
        ${ne("/contact",t.nav.contact,e,"nav-contact-link")}
      </div>
    </header>
  `}function ne(e,t,n,o=""){const i=`nav-link nav-link-${e==="/"?"home":e.slice(1)} ${o}`.trim();return`<a class="${n===e?`${i} active`:i}" href="${e}" data-link>${t}</a>`}function De(e){return`
    <button id="theme-toggle" class="toggle-pill ${e==="dark"?"is-dark":"is-light"}" type="button" aria-label="Toggle theme">
      <span class="toggle-option toggle-option-light">Light</span>
      <span class="toggle-option toggle-option-dark">Dark</span>
      <span class="toggle-knob"></span>
    </button>
  `}function Oe(e){const t=document.querySelector("#theme-toggle");t&&t.addEventListener("click",e)}function qe(e){return`
    <button id="language-toggle" class="lang-pill ${e==="dk"?"is-dk":"is-en"}" type="button" aria-label="Toggle language">
      <span class="lang-indicator"></span>
      <span class="lang-option">EN</span>
      <span class="lang-option">DK</span>
    </button>
  `}function Fe(e){const t=document.querySelector("#language-toggle");t&&t.addEventListener("click",e)}function Be({t:e,theme:t,language:n}){const o=new Date().getFullYear();return`
    <footer class="site-footer" aria-label="Footer">
      <div class="footer-top">
        <nav class="footer-links" aria-label="Footer navigation">
          ${[{href:"/",label:e.nav.home},{href:"/projects",label:e.nav.projects},{href:"/resume",label:e.nav.files}].map(i=>`<a href="${i.href}" data-link>${i.label}</a>`).join("")}
          <a class="footer-playground-link" href="/playground" data-link>${e.footer.playground}</a>
        </nav>
        <div class="footer-controls">
          ${qe(n)}
          ${De(t)}
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">&copy; ${o} Johan Niemann Husbjerg. ${e.footer.rights}</p>
        <p class="footer-built">${e.footer.builtWith}</p>
      </div>
    </footer>
  `}function Ve({t:e}){return`
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
  `}function Je(e){const t=document.querySelector("#welcome-continue"),n=document.querySelector("#welcome-access-code"),o=document.querySelector("#welcome-error");if(!t||!n)return;const r=()=>{const i=e(n.value.trim());if(i?.ok){o&&(o.textContent="");return}o&&(o.textContent=i?.message||""),n.focus(),n.select()};t.addEventListener("click",r),n.addEventListener("keydown",i=>{i.key==="Enter"&&r()})}const Ne="I focus on architecture thinking, frontend systems, and product-minded delivery.",We="Recent work centers on SPA structure, interaction quality, and maintainable design systems.",Ue="I prioritize separation of concerns, explicit state, and measurable performance.",S={skills:Ne,projects:We,architecture:Ue,default:"In this phase, I can answer on skills, projects, and architecture approach."},E="https://ask-johan-api.onrender.com".replace(/\/$/,""),D="family-friends-2026".trim(),Ke="/auth/login",Ge="/api/ask-johan",M="johanscv.askJohanAccessCode",A="Access code is required to use Ask Johan.",Xe="Ask Johan is waking up on Render free hosting. Please try again in 10-20 seconds.",Ye=25e3,C=2,oe=2200,ze=42,Qe=24,Ze=1200,et=260,tt=520,re={en:["What is your favorite dish?","When is your birthday?","Where do you live in Copenhagen?","What kind of IT architecture do you want to work with?","What is your strongest technical skill right now?","How do you approach system design decisions?","What have you learned from your current student job?","Which projects best represent your profile?","How do you balance UX quality and performance?","How do you work with data quality in practice?","How can we collaborate on a relevant opportunity?"],dk:["Hvad er din yndlingsret?","Hvornår har du fødselsdag?","Hvor bor du i København?","Hvilken type IT-arkitektur vil du arbejde med?","Hvad er din stærkeste tekniske kompetence lige nu?","Hvordan træffer du arkitektur- og designbeslutninger?","Hvad har du lært i dit nuværende studiejob?","Hvilke projekter repræsenterer dig bedst?","Hvordan balancerer du UX-kvalitet og performance?","Hvordan arbejder du med datakvalitet i praksis?","Hvordan kan vi samarbejde om en relevant mulighed?"]};let v=null,J=0,ie=!1,$="";function ge({t:e}){const[t,n]=nt(e.ask.title);return`
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
          <span class="ask-button-visual" aria-hidden="true">
            <span class="ask-button-icon ask-button-icon-arrow">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 19V7.2" />
                <path d="M7.5 11.7 12 7.2l4.5 4.5" />
              </svg>
            </span>
            <span class="ask-button-icon ask-button-icon-spinner">
              <svg viewBox="0 0 24 24" focusable="false">
                <circle class="spinner-track" cx="12" cy="12" r="8.2" />
                <circle class="spinner-head" cx="12" cy="12" r="8.2" />
              </svg>
            </span>
          </span>
        </button>
      </div>
      <p id="ask-answer" class="ask-answer"></p>
    </section>
  `}function nt(e="Ask Johan"){const t=String(e).trim();if(!t)return["Ask","Johan"];const n=t.split(/\s+/);if(n.length===1)return[n[0],""];const o=n.pop();return[n.join(" "),o]}function he(e="en"){const t=document.querySelector("#ask-input"),n=document.querySelector("#ask-submit"),o=document.querySelector("#ask-answer");if(!t||!n||!o)return;ft(t,e);const r=async()=>{const i=t.value.trim().toLowerCase();n.disabled=!0,n.classList.add("is-loading");try{const a=await ot(i);await vt(o,a)}finally{n.disabled=!1,n.classList.remove("is-loading")}};n.addEventListener("click",r),t.addEventListener("keydown",i=>{i.key==="Enter"&&r()})}async function ot(e){if(!e)return S.default;try{return await it(e)}catch(t){return console.warn(dt(t)),Xe}return rt(e)}function rt(e){return e.includes("skill")?S.skills:e.includes("project")?S.projects:e.includes("architect")?S.architecture:S.default}function ve(){const e=localStorage.getItem(M);return e&&e.trim()?e:D?(localStorage.setItem(M,D),D):""}async function it(e){if(!E)throw new Error("VITE_API_BASE_URL is not configured.");const t=ve();if(!t)return A;let n=null,o=!1;for(let r=1;r<=C;r+=1)try{const i=await at(t,o);o=!1;const a=await lt(e,i);if(a.status===401){if(ke(),r<C){o=!0;continue}return localStorage.removeItem(M),A}if(!a.ok){const c=await we(a);if(ut(a.status,r)){await ae(oe);continue}throw new Error(c)}const s=await a.json(),l=ct(s);if(!l)throw new Error("API returned an empty answer.");return l}catch(i){if(i instanceof Error&&i.message===A)return A;if(n=i,r<C&&pt(i)){await ae(oe);continue}throw i}throw n||new Error("API request failed.")}async function at(e,t=!1){if(!t&&$)return $;const n=await st(e);if(n.status===401)throw localStorage.removeItem(M),ke(),new Error(A);if(!n.ok){const i=await we(n,"Authentication failed.");throw new Error(i)}const o=await n.json(),r=typeof o?.token=="string"?o.token.trim():"";if(!r)throw new Error("API login did not return a token.");return $=r,$}function ke(){$=""}function st(e){return be(`${E}${Ke}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accessCode:e})})}function lt(e,t){return be(`${E}${Ge}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({question:e})})}function be(e,t){const n=new AbortController,o=window.setTimeout(()=>n.abort(),Ye);return fetch(e,{...t,signal:n.signal}).finally(()=>{window.clearTimeout(o)})}function ct(e){return typeof e?.answer!="string"?"":e.answer.trim()||""}async function we(e,t="API request failed."){try{const n=await e.json();if(typeof n?.answer=="string"&&n.answer.trim())return`${e.status} ${e.statusText}: ${n.answer.trim()}`}catch{}return`${e.status} ${e.statusText}: ${t}`}function dt(e){return e?.name==="AbortError"?"Ask Johan API error: request timed out.":`Ask Johan API error: ${e instanceof Error?e.message:String(e)}`}function ut(e,t){return t>=C?!1:e===408||e===429||e>=500}function pt(e){if(!e)return!1;if(e.name==="AbortError")return!0;const t=String(e.message||"");return t.includes("Failed to fetch")||t.includes("NetworkError")}function mt(){if(!E||ie||!ve())return Promise.resolve();ie=!0;const e=new AbortController,t=window.setTimeout(()=>e.abort(),1e4);return fetch(`${E}/health`,{method:"GET",signal:e.signal}).catch(()=>null).finally(()=>{window.clearTimeout(t)})}function ft(e,t){ht();const n=gt(re[t]||re.en),o=++J;let r=0,i=0,a=!1;const s=()=>{if(o!==J)return;const l=n[r];if(!a){if(i+=1,e.placeholder=l.slice(0,i),i>=l.length){a=!0,v=window.setTimeout(s,Ze);return}v=window.setTimeout(s,ze);return}if(i-=1,e.placeholder=l.slice(0,Math.max(i,0)),i<=0){a=!1,r=(r+1)%n.length,v=window.setTimeout(s,et);return}v=window.setTimeout(s,Qe)};s()}function gt(e){const t=[...e];for(let n=t.length-1;n>0;n-=1){const o=Math.floor(Math.random()*(n+1));[t[n],t[o]]=[t[o],t[n]]}return t}function ht(){v&&(window.clearTimeout(v),v=null),J+=1}async function vt(e,t){const n=String(t||""),o=e.offsetHeight;e.style.height=`${o}px`,e.textContent=n,e.classList.toggle("has-content",!!n.trim());const r=n.trim()?e.scrollHeight:0;e.offsetHeight,e.style.height=`${r}px`,await kt(e),e.style.height=n.trim()?"auto":"0px"}function kt(e){return new Promise(t=>{let n=!1;const o=()=>{n||(n=!0,e.removeEventListener("transitionend",r),t())},r=i=>{i.propertyName==="height"&&o()};e.addEventListener("transitionend",r),window.setTimeout(o,tt+80)})}function ae(e){return new Promise(t=>{window.setTimeout(t,e)})}const _={theme:"johanscv.theme",language:"johanscv.language"};let p={theme:localStorage.getItem(_.theme)||"dark",language:localStorage.getItem(_.language)||"en",route:"/"};ye(p);function m(){return p}function z(e){const t=p,n={...p,...e};St(t,n)&&(p=n,wt(t,p)&&bt(),yt(t,p)&&ye(p))}function bt(){localStorage.setItem(_.theme,p.theme),localStorage.setItem(_.language,p.language)}function ye(e){document.documentElement.dataset.theme=e.theme,document.documentElement.classList.toggle("dark",e.theme==="dark")}function wt(e,t){return e.theme!==t.theme||e.language!==t.language}function yt(e,t){return e.theme!==t.theme}function St(e,t){return e.theme!==t.theme||e.language!==t.language||e.route!==t.route}const Se=[{id:"spa-architecture",title:{en:"SPA Architecture Foundation",dk:"SPA Arkitekturgrundlag"},summary:{en:"Designed a lightweight Vanilla JS SPA with explicit routing, transition orchestration, and durable state boundaries.",dk:"Designede en letvægts Vanilla JS SPA med tydelig routing, overgangsorkestrering og robuste state-grænser."},tags:["Vite","Vanilla JS","Routing"]},{id:"design-system",title:{en:"Interaction-Led Design System",dk:"Interaktionsdrevet Designsystem"},summary:{en:"Built a restrained visual language with theme tokens, glass surfaces, motion hierarchy, and responsive rhythm.",dk:"Byggede et afdæmpet visuelt sprog med tematiske tokens, glasflader, motion-hierarki og responsiv rytme."},tags:["Tailwind","Theming","UX Motion"]},{id:"deployment-flow",title:{en:"GitHub Pages Deployment Flow",dk:"GitHub Pages Deploy-flow"},summary:{en:"Configured stable project-page deployment with base-path-safe assets and SPA fallback for deep links.",dk:"Konfigurerede stabil project-pages deployment med base-path-sikre assets og SPA fallback til deep links."},tags:["GitHub Pages","CI-ready","Reliability"]}];function At({t:e}){return`
    <section class="hero section-reveal" id="hero">
      <div class="avatar-wrap">
        <div class="avatar-ring"></div>
        <img class="avatar" src="/johanscv.dk/images/johan-placeholder.jpg" alt="Portrait of Johan" />
      </div>
      <h1 class="hero-name">${e.hero.name}</h1>
      <p class="hero-title">${e.hero.title}</p>
    </section>
  `}const se=[{id:"cv",title:{en:"CV",dk:"CV"},description:{en:"Updated profile and experience summary.",dk:"Opdateret profil og erfaringsoversigt."},url:"/files/johan-niemann-husbjerg-cv.pdf",actionLabel:{en:"Download CV",dk:"Download CV"},actionType:"download",icon:"download"},{id:"linkedin",title:{en:"LinkedIn",dk:"LinkedIn"},description:{en:"Professional profile, education, and work history.",dk:"Professionel profil, uddannelse og arbejdserfaring."},url:"https://www.linkedin.com/in/johan-niemann-h-038906312/",actionLabel:{en:"Go to LinkedIn",dk:"Gå til LinkedIn"},actionType:"external",icon:"linkedin"},{id:"github",title:{en:"GitHub",dk:"GitHub"},description:{en:"Code repositories, projects, and technical work.",dk:"Kode-repositorier, projekter og teknisk arbejde."},url:"https://github.com/johanniemann",actionLabel:{en:"Go to GitHub",dk:"Gå til GitHub"},actionType:"external",icon:"github"},{id:"location",title:{en:"Location",dk:"Lokation"},description:{en:"Where I live in Copenhagen.",dk:"Hvor jeg bor i København."},url:"https://www.google.com/maps/place/Enghavevej+63,+1674+K%C3%B8benhavn/@55.665423,12.5330593,15z/data=!3m1!4b1!4m6!3m5!1s0x4652539dab759293:0xf1e50266a0d1baf1!8m2!3d55.6654113!4d12.5433376!16s%2Fg%2F11nnv8kwnj?entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D",actionLabel:{en:"Open in Maps",dk:"Åbn i Maps"},actionType:"external",icon:"location"}];function le(e,t,n=!1){const o=O(e.title,t),r=O(e.description,t),i=$t(e.url),a=n?'tabindex="-1"':'tabindex="0"',s=n?"file-card file-card-clone":"file-card",l=Et(e,n),c=jt(e.icon),u=O(e.actionLabel,t)||Lt(e.actionType,o,t);return`
    <article class="${s}" ${a}>
      <h3 class="file-title">${o}</h3>
      <p class="file-description">${r}</p>
      <a class="file-action" href="${i}" ${l} aria-label="${u}">
        <span class="file-action-icon" aria-hidden="true">${c}</span>
        <span class="file-action-text">${u}</span>
      </a>
    </article>
  `}function $t(e){return e.startsWith("/")?`/johanscv.dk/${e.slice(1)}`:e}function Et(e,t){const n=[];return e.actionType==="download"?n.push("download"):n.push('target="_blank"','rel="noopener noreferrer"'),t&&n.push('tabindex="-1"'),n.join(" ")}function Lt(e,t,n){return e==="download"?`Download ${t}`:n==="dk"?`Gå til ${t}`:`Open ${t}`}function jt(e){return e==="linkedin"?"in":e==="github"?Tt():e==="location"?Pt():It()}function Tt(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.21.68-.48v-1.7c-2.78.6-3.37-1.17-3.37-1.17-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.52 1.03 1.52 1.03.89 1.52 2.33 1.08 2.9.82.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.41.11 2.66.64.7 1.02 1.59 1.02 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  `}function Pt(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2.25a6.75 6.75 0 0 0-6.75 6.75c0 4.98 6.05 11.86 6.3 12.15a.6.6 0 0 0 .9 0c.25-.29 6.3-7.17 6.3-12.15A6.75 6.75 0 0 0 12 2.25Zm0 9.75a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
      />
    </svg>
  `}function It(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M11.25 3.75a.75.75 0 0 1 1.5 0v9.69l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V3.75Z"/>
      <path d="M4.5 17.25a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1-.75-.75Z"/>
    </svg>
  `}function O(e,t){return typeof e=="string"?e:e&&typeof e=="object"&&(e[t]||e.en||Object.values(e)[0])||""}let w=null,b=!1,y=null,x=null;const Ct=.018,I={interaction:1200,drag:900,wheel:1100};function xt({t:e,language:t}){const n=se.map(r=>le(r,t)).join(""),o=se.map(r=>le(r,t,!0)).join("");return`
    <section class="files-strip section-reveal" id="file-scroller-wrap">
      <h2 class="section-title">${e.fileScroller.title}</h2>
      <div id="file-scroller-viewport" class="file-scroller-viewport" tabindex="0" aria-label="${e.fileScroller.ariaLabel}">
        <div id="file-scroller-track" class="file-scroller-track">
          ${n}
          ${o}
        </div>
      </div>
    </section>
  `}function Mt(){const e=document.querySelector("#file-scroller-viewport"),t=document.querySelector("#file-scroller-track");if(!e||!t)return;_t(),N(),b=!0;const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let o=!1,r=!1,i=null,a=!1,s=0,l=0,c=0,u=t.scrollWidth/2,k=performance.now();const T=()=>{t.style.transform=`translate3d(${-c}px, 0, 0)`},H=d=>{if(!u)return 0;const f=d%u;return f<0?f+u:f},R=d=>{if(!b||n||o)return;const f=d-k;k=d,c=H(c+f*Ct),T(),w=window.requestAnimationFrame(R)},g=()=>{W(),b=!1,N()},h=()=>{W(),!(b||n||o)&&(b=!0,k=performance.now(),w=window.requestAnimationFrame(R))},Q=d=>{if(d.target.closest("a, button, input, textarea, select")){g(),y=window.setTimeout(h,I.interaction);return}r=!0,i=d.pointerId,a=!1,s=d.clientX,l=c,g(),e.setPointerCapture(i)},Z=d=>{if(!r||d.pointerId!==i)return;const f=d.clientX-s;!a&&Math.abs(f)>6&&(a=!0,o=!0,e.classList.add("is-dragging")),o&&(c=H(l-f),T())},P=d=>{!r||d.pointerId!==i||(r=!1,i=null,o=!1,e.classList.remove("is-dragging"),e.hasPointerCapture(d.pointerId)&&e.releasePointerCapture(d.pointerId),y=window.setTimeout(h,a?I.drag:I.interaction))},ee=d=>{g(),c=H(c+d.deltaY*.8+d.deltaX),T(),y=window.setTimeout(h,I.wheel)};e.addEventListener("mouseenter",g),e.addEventListener("mouseleave",h),e.addEventListener("focusin",g),e.addEventListener("focusout",h),e.addEventListener("pointerdown",Q),e.addEventListener("pointermove",Z),e.addEventListener("pointerup",P),e.addEventListener("pointercancel",P),e.addEventListener("wheel",ee,{passive:!0}),x=()=>{e.removeEventListener("mouseenter",g),e.removeEventListener("mouseleave",h),e.removeEventListener("focusin",g),e.removeEventListener("focusout",h),e.removeEventListener("pointerdown",Q),e.removeEventListener("pointermove",Z),e.removeEventListener("pointerup",P),e.removeEventListener("pointercancel",P),e.removeEventListener("wheel",ee)},window.requestAnimationFrame(()=>{u=t.scrollWidth/2,T()}),n||(w=window.requestAnimationFrame(R))}function N(){w&&(window.cancelAnimationFrame(w),w=null)}function W(){y&&(window.clearTimeout(y),y=null)}function _t(){b=!1,x&&(x(),x=null),N(),W()}function Ht({t:e,language:t}){return`
    <main class="page-stack">
      ${At({t:e})}
      <section class="content-section section-reveal" id="projects-preview">
        <h2 class="section-title">${e.projects.previewTitle}</h2>
        <p class="section-body">${e.projects.previewIntro}</p>
        <div class="projects-grid projects-grid-compact">
          ${Se.slice(0,2).map(n=>Dt(n,t)).join("")}
        </div>
        <a class="projects-cta" href="/projects" data-link>${e.projects.cta}</a>
      </section>

      <section class="content-section section-reveal" id="resume-preview">
        <h2 class="section-title">${e.resume.previewTitle}</h2>
        <p class="section-body">${e.resume.previewIntro}</p>
        <a class="projects-cta" href="/resume" data-link>${e.resume.cta}</a>
      </section>

      ${ge({t:e})}
      ${xt({t:e,language:t})}
    </main>
  `}function Rt({language:e}){he(e),Mt()}function Dt(e,t){const n=e.title[t]||e.title.en,o=e.summary[t]||e.summary.en;return`
    <article class="project-card">
      <h3 class="project-title">${n}</h3>
      <p class="project-summary">${o}</p>
    </article>
  `}const Ot=Object.freeze(Object.defineProperty({__proto__:null,mount:Rt,render:Ht},Symbol.toStringTag,{value:"Module"}));function qt({t:e,language:t}){return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="projects">
        <h2 class="section-title">${e.projects.title}</h2>
        <p class="section-body">${e.projects.intro}</p>
      </section>
      <section class="projects-grid section-reveal" aria-label="${e.projects.title}">
        ${Se.map(n=>Ft(n,t)).join("")}
      </section>
    </main>
  `}function Ft(e,t){const n=e.title[t]||e.title.en,o=e.summary[t]||e.summary.en;return`
    <article class="project-card">
      <h3 class="project-title">${n}</h3>
      <p class="project-summary">${o}</p>
      <div class="project-tags">
        ${e.tags.map(r=>`<span class="project-tag">${r}</span>`).join("")}
      </div>
    </article>
  `}const Bt=Object.freeze(Object.defineProperty({__proto__:null,render:qt},Symbol.toStringTag,{value:"Module"})),Vt={education:[{level:"Videregående uddannelse",institution:"Københavns Erhvervsakademi",focus:"Professionsbachelor, IT-arkitektur",period:"August 2024 - Januar 2028"},{level:"Gymnasial uddannelse (STX)",institution:"Nærum Gymnasium",focus:"Samfundsfag/Engelsk A niveau",period:"August 2019 - Juni 2022"},{level:"Folkeskole",institution:"Engelsborgskolen, Kongens Lyngby",focus:"Grundskoleforløb",period:"August 2008 - Juni 2018"}],experience:[{role:"Product Data & Systems Assistant hos Norlys",description:"Arbejdet med digitale e-commerce-løsninger med ansvar for oprettelse, strukturering og vedligeholdelse af produktdata på tværs af databaser, PIM- og CMS-systemer. Fokus på datakvalitet, korrekthed, konsistens samt samarbejde med forretning, leverandører og tekniske teams. Løbende optimering af produkt- og kategorisider med SEO-fokus.",type:"Studentermedhjælper",period:"Februar 2026 - d.d."},{role:"Indkøbs- og salgskonsulent hos Nofipa ApS",description:"Arbejdet med finansielle transaktioner og rådgivning inden for asset-backed lending, herunder værdifastsættelse af aktiver. Udført AML- og KYC-kontroller, due diligence og risikovurderinger samt rådgivning til privat- og erhvervskunder med fokus på compliance og kvalitet. Udarbejdet 1.000+ kontrakter og bidraget til digitalisering af manuelle processer.",type:"Studentermedhjælper",period:"Januar 2025 - d.d."},{role:"Lektiehjælper til folkeskoleelev i matematik og dansk",description:"Erfaring med undervisning, formidling og planlægning af faglige forløb.",type:"Deltid",period:"December 2021 - d.d."},{role:"Pædagogmedhjælper i Børnehuset Klokkeblomsten",description:"Erfaring med børns udvikling, læring og behov i en struktureret hverdagsramme.",type:"Fuldtid",period:"August 2022 - Oktober 2023"}],voluntary:[{role:"Studentermiljørepræsentant (SMR) for IT-arkitekturuddannelsen på EK",description:"Repræsenterer de studerendes interesser i forhold til trivsel og studiemiljø. Indsamler input fra medstuderende og deltager i dialog med undervisere og ledelse om forbedringer af studiehverdagen.",period:"September 2024 - d.d."}],qualifications:{it:["Microsoft Office pakken","CMS- og PIM-systemer","Adobe pakken","Git og GitHub","SQL og NoSQL","Datamodellering og datahåndtering (JSON, CSV, XML m.fl.)","Visualisering af dashboards (Tableau, Excel m.fl.)","UI/UX-design i Compose og Figma","Stærkt kendskab til JavaScript, Python, Kotlin m.fl.","Stærkt kendskab til API-drevet softwarearkitektur","Iterativ udvikling, prototyper og brugertests","Business Modeling Frameworks (BPMN, RCA, SWOT, BMC, AS-IS, TO-BE m.fl.)"],personal:["Ansvarsbevidst - overholder deadlines og følger opgaver til dørs","Lærenem - sætter mig hurtigt ind i nye systemer og arbejdsgange","Struktureret - arbejder metodisk og bevarer overblik","Samarbejdsorienteret - trives i teams og kommunikerer klart","Selvstændig - tager initiativ og kan arbejde uden tæt styring"]}},Jt={education:[{level:"Higher Education",institution:"Copenhagen School of Design and Technology",focus:"Professional Bachelor's Degree, IT Architecture",period:"August 2024 - January 2028"},{level:"Upper Secondary Education (STX)",institution:"Nærum Gymnasium",focus:"Social Sciences / English, A-level",period:"August 2019 - June 2022"},{level:"Primary and Lower Secondary School",institution:"Engelsborgskolen, Kongens Lyngby",focus:"General school program",period:"August 2008 - June 2018"}],experience:[{role:"Product Data & Systems Assistant at Norlys",description:"Worked on digital e-commerce solutions with responsibility for creating, structuring, and maintaining product data across databases, PIM and CMS systems. Focused on data quality, consistency, and coordination with business, suppliers, and technical teams. Continuously optimized product and category pages with SEO focus.",type:"Student Assistant",period:"February 2026 - Present"},{role:"Purchasing and Sales Consultant at Nofipa ApS",description:"Worked with financial transactions and advisory within asset-backed lending, including valuation-based lending. Performed AML/KYC controls, due diligence, and risk assessments, and advised private and business customers with focus on compliance and quality. Prepared 1,000+ contracts and supported digitalization of manual workflows.",type:"Student Assistant",period:"January 2025 - Present"},{role:"Private Tutor in Mathematics and Danish",description:"Experience in teaching, communication, and planning subject-focused sessions.",type:"Part-time",period:"December 2021 - Present"},{role:"Pedagogical Assistant at Børnehuset Klokkeblomsten",description:"Experience with child development, learning needs, and structured care environments.",type:"Full-time",period:"August 2022 - October 2023"}],voluntary:[{role:"Student Environment Representative (SMR) for IT Architecture at EK",description:"Represent students in matters related to well-being and study environment. Collect input from students and participate in dialogue with lecturers and management to improve the study experience.",period:"September 2024 - Present"}],qualifications:{it:["Microsoft Office suite","CMS and PIM systems","Adobe suite","Git and GitHub","SQL and NoSQL","Data modeling and handling (JSON, CSV, XML, etc.)","Dashboard visualization (Tableau, Excel, etc.)","UI/UX design in Compose and Figma","Strong command of JavaScript, Python, Kotlin, and more","Strong command of API-driven software architecture","Iterative development, prototypes, and user testing","Business modeling frameworks (BPMN, RCA, SWOT, BMC, AS-IS, TO-BE, etc.)"],personal:["Responsible - meet deadlines and carry tasks through","Fast learner - quickly adapt to new systems and workflows","Structured - work methodically and maintain overview","Collaborative - thrive in teams and communicate clearly","Independent - take initiative and work without close supervision"]}},ce={dk:Vt,en:Jt};function Nt({t:e,language:t}){const n=ce[t]||ce.dk;return`
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
          ${n.education.map(Wt).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-experience">
        <h3 class="resume-heading">${e.resume.experience}</h3>
        <div class="resume-list">
          ${n.experience.map(Ut).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-voluntary">
        <h3 class="resume-heading">${e.resume.voluntary}</h3>
        <div class="resume-list">
          ${n.voluntary.map(Kt).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-qualifications">
        <h3 class="resume-heading">${e.resume.qualifications}</h3>
        <div class="qual-grid">
          <article class="qual-card">
            <h4 class="qual-title">${e.resume.itSkills}</h4>
            <ul class="qual-list">
              ${n.qualifications.it.map(de).join("")}
            </ul>
          </article>
          <article class="qual-card">
            <h4 class="qual-title">${e.resume.personalQualities}</h4>
            <ul class="qual-list">
              ${n.qualifications.personal.map(de).join("")}
            </ul>
          </article>
        </div>
      </section>
    </main>
  `}function Wt(e){return`
    <article class="resume-item">
      <p class="resume-item-type">${e.level}</p>
      <h4 class="resume-item-title">${e.institution}</h4>
      <p class="resume-item-focus">- ${e.focus}</p>
      <p class="resume-item-period">${e.period}</p>
    </article>
  `}function Ut(e){return`
    <article class="resume-item">
      <h4 class="resume-item-title">${e.role}</h4>
      <p class="resume-item-body">${e.description}</p>
      <p class="resume-item-period"><span class="resume-item-type">${e.type}</span>: ${e.period}</p>
    </article>
  `}function Kt(e){return`
    <article class="resume-item">
      <h4 class="resume-item-title">${e.role}</h4>
      <p class="resume-item-body">${e.description}</p>
      <p class="resume-item-period">${e.period}</p>
    </article>
  `}function de(e){return`<li>${e}</li>`}const Gt=Object.freeze(Object.defineProperty({__proto__:null,render:Nt},Symbol.toStringTag,{value:"Module"}));function Xt({t:e}){return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="contact-intro">
        <h2 class="section-title">${e.contact.title}</h2>
        <p class="section-body">${e.contact.intro}</p>
      </section>

      <section class="contact-stack section-reveal" aria-label="${e.contact.title}">
        ${q({label:e.contact.emailLabel,value:"johan.niemann.husbjerg@gmail.com",action:F({type:"button",icon:zt(),text:e.contact.copyEmail,attrs:'data-copy="johan.niemann.husbjerg@gmail.com"'})})}
        ${q({label:e.contact.phoneLabel,value:"+45 60 47 42 36",action:F({type:"button",icon:Qt(),text:e.contact.copyPhone,attrs:'data-copy="+45 60 47 42 36"'})})}
        ${q({label:e.contact.linkedinLabel,value:"linkedin.com/in/johan-niemann-h-038906312",action:F({type:"link",icon:"in",text:e.contact.connectLinkedin,attrs:'href="https://www.linkedin.com/in/johan-niemann-h-038906312/" target="_blank" rel="noopener noreferrer"'})})}
      </section>
    </main>
  `}function Yt({t:e}){document.querySelectorAll("[data-copy]").forEach(n=>{n.dataset.defaultLabel=n.querySelector(".file-action-text")?.textContent||"",n.addEventListener("click",async()=>{if(n.dataset.busy==="true")return;const o=n.getAttribute("data-copy")||"";!o||!await Zt(o)||await en(n,e.contact.copied)})})}function q({label:e,value:t,action:n}){return`
    <article class="contact-row">
      <div class="contact-meta">
        <h3 class="contact-label">${e}</h3>
        <p class="contact-value">${t}</p>
      </div>
      <div class="contact-action-wrap">
        ${n}
      </div>
    </article>
  `}function F({type:e,icon:t,text:n,attrs:o}){const r=e==="link"?"a":"button";return`
    <${r} class="file-action contact-action" ${e==="button"?'type="button"':""} ${o} aria-label="${n}">
      <span class="file-action-icon" aria-hidden="true">${t}</span>
      <span class="file-action-text">${n}</span>
    </${r}>
  `}function zt(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.75 5.5h14.5A1.25 1.25 0 0 1 20.5 6.75v10.5a1.25 1.25 0 0 1-1.25 1.25H4.75a1.25 1.25 0 0 1-1.25-1.25V6.75A1.25 1.25 0 0 1 4.75 5.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="m4.5 7 7.5 5.8L19.5 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `}function Qt(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.9 3.8h2.8c.4 0 .8.27.9.67l.78 3.15a1 1 0 0 1-.28.96L9.78 10.9a13.2 13.2 0 0 0 3.31 3.31l2.32-1.32a1 1 0 0 1 .96-.28l3.15.78c.4.1.67.49.67.9v2.8a1.9 1.9 0 0 1-2.06 1.9c-2.7-.2-5.3-1.42-7.79-3.66-2.24-2.03-3.7-4.28-4.36-6.76-.29-1.1-.45-2.2-.49-3.3A1.9 1.9 0 0 1 6.9 3.8Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `}async function Zt(e){try{return await navigator.clipboard.writeText(e),!0}catch{const t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();const n=document.execCommand("copy");return document.body.removeChild(t),n}}async function en(e,t){const n=e.querySelector(".file-action-text");if(!n)return;const o=e.dataset.defaultLabel||n.textContent||"",r=180,i=900;e.dataset.busy="true",e.classList.add("is-label-hidden"),await B(r),n.textContent=t,e.classList.remove("is-label-hidden"),await B(i),e.classList.add("is-label-hidden"),await B(r),n.textContent=o,e.classList.remove("is-label-hidden"),e.dataset.busy="false"}function B(e){return new Promise(t=>{window.setTimeout(t,e)})}const tn=Object.freeze(Object.defineProperty({__proto__:null,mount:Yt,render:Xt},Symbol.toStringTag,{value:"Module"}));function nn({t:e,language:t}){return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="playground">
        <h2 class="section-title">${e.playground.title}</h2>
        <p class="section-body">${e.playground.intro}</p>
      </section>

      ${ge({t:e})}

      <section class="content-section section-reveal" id="playground-more">
        <h3 class="section-title">${e.playground.moreToComeTitle}</h3>
        <p class="section-body">${e.playground.moreToComeBody}</p>
      </section>
    </main>
  `}function on({language:e}){he(e)}const rn=Object.freeze(Object.defineProperty({__proto__:null,mount:on,render:nn},Symbol.toStringTag,{value:"Module"}));function an(e){return`<div class="page-transition-enter">${e}</div>`}const ue={"/":Ot,"/projects":Bt,"/resume":Gt,"/contact":tn,"/playground":rn},U="/johanscv.dk/",sn=500,ln={"/files":"/resume"};function Ae(e){const t=e.startsWith("/")?e.slice(1):e;return`${U}${t}`}function pe(e=window.location.pathname){if(!e.startsWith(U))return"/";const t=e.slice(U.length-1)||"/";return t.length>1&&t.endsWith("/")?t.slice(0,-1):t}function cn({mountEl:e,renderFrame:t,pageContext:n,onRouteChange:o}){let r=!1;const i=()=>{const s=pe(),l=ln[s]||s,c=ue[l]||ue["/"],u=n(l);s!==l&&history.replaceState({},"",Ae(l)),e.innerHTML=an(c.render(u)),c.mount&&c.mount(u),o(l),requestAnimationFrame(()=>{const k=e.querySelector(".page-transition-enter");k&&k.classList.add("is-visible")})},a=()=>{if(r)return;r=!0;const s=e.querySelector(".page-transition-enter");if(!s){i(),r=!1;return}s.classList.remove("is-visible"),s.classList.add("is-exiting"),window.setTimeout(()=>{i(),r=!1},sn)};return document.addEventListener("click",s=>{const l=s.target.closest("[data-link]");if(!l)return;const c=l.getAttribute("href");!c||!c.startsWith("/")||(s.preventDefault(),c!==pe()&&dn(c,a))}),window.addEventListener("popstate",a),t(i),{refresh:a}}function dn(e,t){history.pushState({},"",Ae(e)),t()}kn();const un=document.querySelector("#app");un.innerHTML=`
  <div id="welcome-root"></div>
  <div class="site-shell" id="site-shell">
    <div id="nav-root"></div>
    <div id="page-root"></div>
    <div id="footer-root"></div>
  </div>
  <div id="scroll-hint-root"></div>
`;const $e="johanscv.askJohanAccessCode",Ee="johanscv.siteAccessGranted",pn=500,mn=.2,V=document.querySelector("#welcome-root"),fn=document.querySelector("#nav-root"),gn=document.querySelector("#page-root"),hn=document.querySelector("#footer-root"),Le=document.querySelector("#scroll-hint-root");let K=!1,me=!1,G=!1,je=null,fe=!1;yn()?Te():wn();function Te(){G||(G=!0,mt(),je=cn({mountEl:gn,renderFrame:e=>{e(),bn()},pageContext:()=>{const e=m();return{t:j(e.language),language:e.language}},onRouteChange:e=>{z({route:e}),Y(e),vn(),L()}}),Pe(),X(),xe(),$n(),Y(m().route),L())}function Pe(){const e=m(),t=j(e.language);fn.innerHTML=Re({route:e.route,t}),Ie()}function X(){const e=m(),t=j(e.language);hn.innerHTML=Be({t,theme:e.theme,language:e.language}),Oe(()=>{Sn(),X()}),Fe(()=>{An(),Pe(),Y(m().route),X(),xe(),L(),je?.refresh()})}function vn(){const e=document.querySelectorAll(".section-reveal"),t=new IntersectionObserver(n=>{n.forEach(o=>{o.isIntersecting&&(o.target.classList.add("is-visible"),t.unobserve(o.target))})},{threshold:mn});e.forEach((n,o)=>{n.style.transitionDelay=`${Math.min(o*70,240)}ms`,t.observe(n)})}function kn(){const e=new URL(window.location.href),t=e.searchParams.get("p");if(!t)return;const n=decodeURIComponent(t),[o,r]=n.split("&q="),i=r?`?${decodeURIComponent(r)}`:"",a=`${o}${i}${e.hash}`;window.history.replaceState(null,"",a)}function bn(){if(me)return;me=!0;let e=window.scrollY,t=!1;const n=()=>{t||(t=!0,window.requestAnimationFrame(()=>{const o=window.scrollY,r=o-e;o<36||r<-8?K=!1:r>8&&(K=!0),e=o,Ie(),t=!1}))};window.addEventListener("scroll",n,{passive:!0})}function Ie(){const e=document.querySelector("#navbar");e&&e.classList.toggle("nav-hidden",K)}function Y(e){document.querySelectorAll(".nav-link").forEach(n=>{const o=n.getAttribute("href");n.classList.toggle("active",o===e)})}function wn(){const e=m(),t=j(e.language);V.innerHTML=Ve({t}),document.body.classList.add("welcome-active");const n=V.querySelector(".welcome-screen");window.requestAnimationFrame(()=>{n?.classList.add("is-visible")}),Je(o=>Ce(o)?(localStorage.setItem($e,o),localStorage.setItem(Ee,"true"),n?.classList.remove("is-visible"),n?.classList.add("is-exiting"),Te(),window.setTimeout(()=>{V.innerHTML="",document.body.classList.remove("welcome-active")},pn),{ok:!0}):{ok:!1,message:t.welcome.passwordError})}function Ce(e){const t="family-friends-2026".trim();return e?t?e===t:!0:!1}function yn(){const e=localStorage.getItem(Ee)==="true",t=localStorage.getItem($e)?.trim()||"";return e&&Ce(t)}function j(e){return te[e]||te.en}function Sn(){const e=m().theme;z({theme:e==="dark"?"light":"dark"})}function An(){const e=m().language;z({language:e==="en"?"dk":"en"})}function xe(){const e=m(),t=j(e.language),n=Me()?" is-hidden":"";Le.innerHTML=`
    <button id="scroll-hint" class="scroll-hint${n}" type="button" aria-label="${t.scrollHint.label}">
      <span class="scroll-hint-text">${t.scrollHint.label}</span>
      <span class="scroll-hint-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M12 6v12" />
          <path d="m7.5 13.5 4.5 4.5 4.5-4.5" />
        </svg>
      </span>
    </button>
  `}function $n(){fe||(fe=!0,Le.addEventListener("click",e=>{e.target.closest("#scroll-hint")&&window.scrollBy({top:Math.max(window.innerHeight*.92,240),behavior:"smooth"})}),window.addEventListener("scroll",L,{passive:!0}),window.addEventListener("resize",L))}function L(){const e=document.querySelector("#scroll-hint");e&&e.classList.toggle("is-hidden",Me())}function Me(){const e=document.documentElement,t=Math.max(0,e.scrollHeight-window.innerHeight),n=t>24,o=window.scrollY>=t-28;return!G||!n||o}
