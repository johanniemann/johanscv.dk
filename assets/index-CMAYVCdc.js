(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const R={nav:{home:"Home",projects:"Projects",files:"Files",quiz:"Quiz"},hero:{name:"Johan Niemann Husbjerg",title:"IT Architecture student shaping precise, human-centered systems."},ask:{title:"Ask Johan",placeholder:"Ask about skills, projects, or architecture...",button:"Answer"},projects:{title:"Projects",intro:"Focused work in architecture, frontend systems, and product execution.",previewTitle:"Selected Work",previewIntro:"A snapshot of practical architecture and frontend execution.",cta:"View all projects"},files:{title:"Files",intro:"Selected documents and references."},quiz:{title:"Architecture Quiz",intro:"Quick challenge to unlock enhanced visual mode."}},U={nav:{home:"Hjem",projects:"Projekter",files:"Filer",quiz:"Quiz"},hero:{name:"Johan Niemann Husbjerg",title:"IT-arkitekturstuderende med fokus pa praecise, menneskelige systemer."},ask:{title:"Sporg Johan",placeholder:"Sporg om kompetencer, projekter eller arkitektur...",button:"Svar"},projects:{title:"Projekter",intro:"Fokuseret arbejde inden for arkitektur, frontend-systemer og produktudforelse.",previewTitle:"Udvalgt Arbejde",previewIntro:"Et udsnit af praktisk arkitektur og frontend-udforelse.",cta:"Se alle projekter"},files:{title:"Filer",intro:"Udvalgte dokumenter og referencer."},quiz:{title:"Arkitektur Quiz",intro:"Kort udfordring der laaser op for forbedret visuel tilstand."}},b={en:R,dk:U};function D(e){const t=e==="dark";return`
    <button id="theme-toggle" class="toggle-pill" type="button" aria-label="Toggle theme">
      <span class="toggle-knob ${t?"translate-x-6":"translate-x-0"}"></span>
      <span class="toggle-label">${t?"Dark":"Light"}</span>
    </button>
  `}function H(e){const t=document.querySelector("#theme-toggle");t&&t.addEventListener("click",e)}function M(e){return`
    <button id="language-toggle" class="lang-pill" type="button" aria-label="Toggle language">
      <span class="lang-indicator ${e==="dk"?"translate-x-8":"translate-x-0"}"></span>
      <span class="lang-option">EN</span>
      <span class="lang-option">DK</span>
    </button>
  `}function N(e){const t=document.querySelector("#language-toggle");t&&t.addEventListener("click",e)}function W({route:e,t,theme:n,language:o}){return`
    <header id="navbar" class="site-nav">
      <a class="brand" href="/" data-link>johanscv.dk</a>
      <nav class="nav-links" aria-label="Primary">
        ${h("/",t.nav.home,e)}
        ${h("/projects",t.nav.projects,e)}
        ${h("/files",t.nav.files,e)}
        ${h("/quiz",t.nav.quiz,e)}
      </nav>
      <div class="nav-controls">
        ${M(o)}
        ${D(n)}
      </div>
    </header>
  `}function h(e,t,n){return`<a class="${n===e?"nav-link active":"nav-link"}" href="${e}" data-link>${t}</a>`}const d={theme:"johanscv.theme",language:"johanscv.language",quizUnlocked:"johanscv.quizUnlocked"},w=new Set;let u={theme:localStorage.getItem(d.theme)||"dark",language:localStorage.getItem(d.language)||"en",quizUnlocked:localStorage.getItem(d.quizUnlocked)==="true",route:"/"};A(u);function v(){return u}function y(e){u={...u,...e},B(),A(u),J()}function Q(e){return w.add(e),()=>w.delete(e)}function J(){w.forEach(e=>e(u))}function B(){localStorage.setItem(d.theme,u.theme),localStorage.setItem(d.language,u.language),localStorage.setItem(d.quizUnlocked,String(u.quizUnlocked))}function A(e){document.documentElement.dataset.theme=e.theme,document.documentElement.classList.toggle("dark",e.theme==="dark"),document.body.classList.toggle("quiz-unlocked",e.quizUnlocked)}const E=[{id:"spa-architecture",title:{en:"SPA Architecture Foundation",dk:"SPA Arkitekturgrundlag"},summary:{en:"Designed a lightweight Vanilla JS SPA with explicit routing, transition orchestration, and durable state boundaries.",dk:"Designede en letvægts Vanilla JS SPA med tydelig routing, overgangsorkestrering og robuste state-graenser."},tags:["Vite","Vanilla JS","Routing"]},{id:"design-system",title:{en:"Interaction-Led Design System",dk:"Interaktionsdrevet Designsystem"},summary:{en:"Built a restrained visual language with theme tokens, glass surfaces, motion hierarchy, and responsive rhythm.",dk:"Byggede et afdaempet visuelt sprog med tematiske tokens, glasflader, motion-hierarki og responsiv rytme."},tags:["Tailwind","Theming","UX Motion"]},{id:"deployment-flow",title:{en:"GitHub Pages Deployment Flow",dk:"GitHub Pages Deploy-flow"},summary:{en:"Configured stable project-page deployment with base-path-safe assets and SPA fallback for deep links.",dk:"Konfigurerede stabil project-pages deployment med base-path-sikre assets og SPA fallback til deep links."},tags:["GitHub Pages","CI-ready","Reliability"]}];function V({t:e}){return`
    <section class="hero section-reveal" id="hero">
      <div class="avatar-wrap">
        <div class="avatar-ring"></div>
        <img class="avatar" src="/WEBSITE/images/johan-placeholder.jpg" alt="Portrait of Johan" />
      </div>
      <h1 class="hero-name">${e.hero.name}</h1>
      <p class="hero-title">${e.hero.title}</p>
    </section>
  `}const G="I focus on architecture thinking, frontend systems, and product-minded delivery.",K="Recent work centers on SPA structure, interaction quality, and maintainable design systems.",Y="I prioritize separation of concerns, explicit state, and measurable performance.",m={skills:G,projects:K,architecture:Y,default:"Great question. In this phase, I can answer on skills, projects, and architecture approach."};function X({t:e}){return`
    <section class="ask-card section-reveal" id="ask-johan">
      <h2 class="section-title">${e.ask.title}</h2>
      <div class="ask-input-wrap">
        <input id="ask-input" class="ask-input" type="text" placeholder="${e.ask.placeholder}" />
        <button id="ask-submit" class="ask-button" type="button">${e.ask.button}</button>
      </div>
      <p id="ask-answer" class="ask-answer"></p>
    </section>
  `}function Z(){const e=document.querySelector("#ask-input"),t=document.querySelector("#ask-submit"),n=document.querySelector("#ask-answer");if(!e||!t||!n)return;const o=async()=>{const r=e.value.trim().toLowerCase();t.disabled=!0;try{n.textContent=await ee(r)}finally{t.disabled=!1}};t.addEventListener("click",o),e.addEventListener("keydown",r=>{r.key==="Enter"&&o()})}async function ee(e){return e?te(e):m.default}function te(e){return e.includes("skill")?m.skills:e.includes("project")?m.projects:e.includes("architect")?m.architecture:m.default}const ne=[{id:"cv",title:"CV",description:"Updated profile and experience summary.",url:"/files/johan-niemann-husbjerg-cv.pdf"},{id:"portfolio",title:"Portfolio",description:"Project snapshots and architecture notes.",url:"/files/johan-portfolio.txt"},{id:"architecture-notes",title:"Architecture Notes",description:"Patterns, tradeoffs, and implementation thinking.",url:"/files/architecture-notes.txt"}];function re(e){const t=oe(e.url);return`
    <article class="file-card" tabindex="0">
      <h3 class="file-title">${e.title}</h3>
      <p class="file-description">${e.description}</p>
      <a class="file-download" href="${t}" download aria-label="Download ${e.title}">↧</a>
    </article>
  `}function oe(e){return e.startsWith("/")?`/WEBSITE/${e.slice(1)}`:e}let p=null,f=!1,k=null;function I(){return`
    <section class="files-strip section-reveal" id="file-scroller-wrap">
      <div id="file-scroller" class="file-scroller">
        ${ne.map(e=>re(e)).join("")}
      </div>
    </section>
  `}function x(){const e=document.querySelector("#file-scroller");if(!e)return;se(),q(),f=!0;let t=performance.now();const n=a=>{if(!f)return;const i=a-t;t=a,e.scrollLeft+=i*.02,e.scrollLeft+e.clientWidth>=e.scrollWidth-1&&(e.scrollLeft=0),p=window.requestAnimationFrame(n)},o=()=>{S(),f=!1,q()},r=()=>{S(),!f&&(f=!0,t=performance.now(),p=window.requestAnimationFrame(n))},s=()=>{o(),k=window.setTimeout(r,1200)};e.addEventListener("mouseenter",o),e.addEventListener("mouseleave",r),e.addEventListener("focusin",o),e.addEventListener("focusout",r),e.addEventListener("pointerdown",s),e.addEventListener("touchstart",s,{passive:!0}),e.addEventListener("wheel",s,{passive:!0}),p=window.requestAnimationFrame(n)}function q(){p&&(window.cancelAnimationFrame(p),p=null)}function S(){k&&(window.clearTimeout(k),k=null)}function se(){S()}function ie({t:e,language:t}){return`
    <main class="page-stack">
      ${V({t:e})}
      <section class="content-section section-reveal" id="projects-preview">
        <h2 class="section-title">${e.projects.previewTitle}</h2>
        <p class="section-body">${e.projects.previewIntro}</p>
        <div class="projects-grid projects-grid-compact">
          ${E.slice(0,2).map(n=>ce(n,t)).join("")}
        </div>
        <a class="projects-cta" href="/projects" data-link>${e.projects.cta}</a>
      </section>
      ${X({t:e})}
      ${I()}
    </main>
  `}function ae(){Z(),x()}function ce(e,t){const n=e.title[t]||e.title.en,o=e.summary[t]||e.summary.en;return`
    <article class="project-card">
      <h3 class="project-title">${n}</h3>
      <p class="project-summary">${o}</p>
    </article>
  `}const le=Object.freeze(Object.defineProperty({__proto__:null,mount:ae,render:ie},Symbol.toStringTag,{value:"Module"}));function ue({t:e,language:t}){return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="projects">
        <h2 class="section-title">${e.projects.title}</h2>
        <p class="section-body">${e.projects.intro}</p>
      </section>
      <section class="projects-grid section-reveal" aria-label="${e.projects.title}">
        ${E.map(n=>de(n,t)).join("")}
      </section>
    </main>
  `}function de(e,t){const n=e.title[t]||e.title.en,o=e.summary[t]||e.summary.en;return`
    <article class="project-card">
      <h3 class="project-title">${n}</h3>
      <p class="project-summary">${o}</p>
      <div class="project-tags">
        ${e.tags.map(r=>`<span class="project-tag">${r}</span>`).join("")}
      </div>
    </article>
  `}const pe=Object.freeze(Object.defineProperty({__proto__:null,render:ue},Symbol.toStringTag,{value:"Module"}));function C({title:e,body:t,id:n}){return`
    <section id="${n}" class="content-section section-reveal">
      <h2 class="section-title">${e}</h2>
      <p class="section-body">${t}</p>
    </section>
  `}function fe({t:e}){return`
    <main class="page-stack">
      ${C({id:"files",title:e.files.title,body:e.files.intro})}
      ${I()}
    </main>
  `}function me(){x()}const ge=Object.freeze(Object.defineProperty({__proto__:null,mount:me,render:fe},Symbol.toStringTag,{value:"Module"})),g=[{id:1,question:"What is the main purpose of a layered architecture?",options:["To separate concerns and reduce coupling","To make all code run faster","To avoid documentation"],answer:0},{id:2,question:"Which metric is most useful for frontend performance perception?",options:["Time to first commit","Largest Contentful Paint","Lines of CSS"],answer:1},{id:3,question:"Why use a state store in a small SPA?",options:["To centralize cross-page UI state","To avoid any event listeners","To remove routing"],answer:0}];function he(){const e=g[0];return`
    <section class="quiz-card section-reveal">
      <div class="quiz-progress"><span id="quiz-progress">1</span>/${g.length}</div>
      <h2 class="quiz-question" id="quiz-question">${e.question}</h2>
      <div class="quiz-options" id="quiz-options">
        ${e.options.map((t,n)=>F(t,n)).join("")}
      </div>
      <p class="quiz-feedback" id="quiz-feedback"></p>
    </section>
  `}function ve(e){let t=0;const n=document.querySelector("#quiz-question"),o=document.querySelector("#quiz-options"),r=document.querySelector("#quiz-progress"),s=document.querySelector("#quiz-feedback");if(!n||!o||!r||!s)return;function a(){const i=g[t];n.textContent=i.question,o.innerHTML=i.options.map((c,l)=>F(c,l)).join(""),r.textContent=String(t+1)}o.addEventListener("click",i=>{const c=i.target.closest("button[data-option]");if(!c)return;const l=g[t],_=Number(c.dataset.option)===l.answer;s.textContent=_?"Correct":"Not quite",window.setTimeout(()=>{if(t+=1,t>=g.length){s.textContent="Quiz completed. Enhanced mode unlocked.",e(),o.innerHTML="";return}s.textContent="",a()},350)}),a()}function F(e,t){return`<button class="quiz-option" type="button" data-option="${t}">${e}</button>`}function ke({t:e}){return`
    <main class="page-stack">
      ${C({id:"quiz-intro",title:e.quiz.title,body:e.quiz.intro})}
      ${he()}
    </main>
  `}function be({onQuizComplete:e}){ve(e)}const ye=Object.freeze(Object.defineProperty({__proto__:null,mount:be,render:ke},Symbol.toStringTag,{value:"Module"}));function we(e){return`<div class="page-transition-enter">${e}</div>`}const z={"/":le,"/projects":pe,"/files":ge,"/quiz":ye},$="/WEBSITE/",Se=500;function $e(e){const t=e.startsWith("/")?e.slice(1):e;return`${$}${t}`}function L(e=window.location.pathname){if(!e.startsWith($))return"/";const t=e.slice($.length-1)||"/";return t.length>1&&t.endsWith("/")?t.slice(0,-1):t}function je({mountEl:e,renderFrame:t,pageContext:n,onRouteChange:o}){let r=!1;const s=()=>{const i=L(),c=z[i]||z["/"];e.innerHTML=we(c.render(n(i))),c.mount&&c.mount(n(i)),o(i),requestAnimationFrame(()=>{const l=e.querySelector(".page-transition-enter");l&&l.classList.add("is-visible")})},a=()=>{if(r)return;r=!0;const i=e.querySelector(".page-transition-enter");if(!i){s(),r=!1;return}i.classList.remove("is-visible"),i.classList.add("is-exiting"),window.setTimeout(()=>{s(),r=!1},Se)};return document.addEventListener("click",i=>{const c=i.target.closest("[data-link]");if(!c)return;const l=c.getAttribute("href");!l||!l.startsWith("/")||(i.preventDefault(),l!==L()&&qe(l,a))}),window.addEventListener("popstate",a),t(s),{refresh:a}}function qe(e,t){history.pushState({},"",$e(e)),t()}Ee();const ze=document.querySelector("#app");ze.innerHTML=`
  <div class="site-shell">
    <div id="nav-root"></div>
    <div id="page-root"></div>
  </div>
`;const Le=document.querySelector("#nav-root"),Te=document.querySelector("#page-root");let j=!1,T=!1;const Pe=je({mountEl:Te,renderFrame:e=>{e(),Ie(),Q(()=>{P()})},pageContext:()=>{const e=v();return{t:b[e.language]||b.en,language:e.language,onQuizComplete:()=>y({quizUnlocked:!0})}},onRouteChange:e=>{y({route:e}),P(),Ae()}});function P(){const e=v(),t=b[e.language]||b.en;Le.innerHTML=W({route:e.route,t,theme:e.theme,language:e.language}),H(()=>{const n=v().theme==="dark"?"light":"dark";y({theme:n})}),N(()=>{const n=v().language==="en"?"dk":"en";y({language:n}),Pe.refresh()}),O()}function Ae(){const e=document.querySelectorAll(".section-reveal"),t=new IntersectionObserver(n=>{n.forEach(o=>{o.isIntersecting&&(o.target.classList.add("is-visible"),t.unobserve(o.target))})},{threshold:.2});e.forEach((n,o)=>{n.style.transitionDelay=`${Math.min(o*70,240)}ms`,t.observe(n)})}function Ee(){const e=new URL(window.location.href),t=e.searchParams.get("p");if(!t)return;const n=decodeURIComponent(t),[o,r]=n.split("&q="),s=r?`?${decodeURIComponent(r)}`:"",a=`${o}${s}${e.hash}`;window.history.replaceState(null,"",a)}function Ie(){if(T)return;T=!0;let e=window.scrollY,t=!1;const n=()=>{t||(t=!0,window.requestAnimationFrame(()=>{const o=window.scrollY,r=o-e;o<36||r<-8?j=!1:r>8&&(j=!0),e=o,O(),t=!1}))};window.addEventListener("scroll",n,{passive:!0})}function O(){const e=document.querySelector("#navbar");e&&e.classList.toggle("nav-hidden",j)}
