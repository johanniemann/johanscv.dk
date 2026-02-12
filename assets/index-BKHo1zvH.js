(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();const F={nav:{home:"Home",projects:"Projects",files:"Files",quiz:"Quiz"},hero:{name:"Johan Mannhus Bjerg",title:"IT Architecture student shaping precise, human-centered systems."},ask:{title:"Ask Johan",placeholder:"Ask about skills, projects, or architecture...",button:"Answer"},projects:{title:"Projects",intro:"Focused work in architecture, frontend systems, and product execution."},files:{title:"Files",intro:"Selected documents and references."},quiz:{title:"Architecture Quiz",intro:"Quick challenge to unlock enhanced visual mode."}},O={nav:{home:"Hjem",projects:"Projekter",files:"Filer",quiz:"Quiz"},hero:{name:"Johan Mannhus Bjerg",title:"IT-arkitekturstuderende med fokus pa praecise, menneskelige systemer."},ask:{title:"Sporg Johan",placeholder:"Sporg om kompetencer, projekter eller arkitektur...",button:"Svar"},projects:{title:"Projekter",intro:"Fokuseret arbejde inden for arkitektur, frontend-systemer og produktudforelse."},files:{title:"Filer",intro:"Udvalgte dokumenter og referencer."},quiz:{title:"Arkitektur Quiz",intro:"Kort udfordring der laaser op for forbedret visuel tilstand."}},b={en:F,dk:O};function _(e){const t=e==="dark";return`
    <button id="theme-toggle" class="toggle-pill" type="button" aria-label="Toggle theme">
      <span class="toggle-knob ${t?"translate-x-6":"translate-x-0"}"></span>
      <span class="toggle-label">${t?"Dark":"Light"}</span>
    </button>
  `}function M(e){const t=document.querySelector("#theme-toggle");t&&t.addEventListener("click",e)}function R(e){return`
    <button id="language-toggle" class="lang-pill" type="button" aria-label="Toggle language">
      <span class="lang-indicator ${e==="dk"?"translate-x-8":"translate-x-0"}"></span>
      <span class="lang-option">EN</span>
      <span class="lang-option">DK</span>
    </button>
  `}function U(e){const t=document.querySelector("#language-toggle");t&&t.addEventListener("click",e)}function N({route:e,t,theme:o,language:r}){return`
    <header id="navbar" class="site-nav">
      <a class="brand" href="/" data-link>johanscv.dk</a>
      <nav class="nav-links" aria-label="Primary">
        ${g("/",t.nav.home,e)}
        ${g("/projects",t.nav.projects,e)}
        ${g("/files",t.nav.files,e)}
        ${g("/quiz",t.nav.quiz,e)}
      </nav>
      <div class="nav-controls">
        ${R(r)}
        ${_(o)}
      </div>
    </header>
  `}function g(e,t,o){return`<a class="${o===e?"nav-link active":"nav-link"}" href="${e}" data-link>${t}</a>`}const d={theme:"johanscv.theme",language:"johanscv.language",quizUnlocked:"johanscv.quizUnlocked"},y=new Set;let u={theme:localStorage.getItem(d.theme)||"dark",language:localStorage.getItem(d.language)||"en",quizUnlocked:localStorage.getItem(d.quizUnlocked)==="true",route:"/"};E(u);function v(){return u}function q(e){u={...u,...e},H(),E(u),D()}function Q(e){return y.add(e),()=>y.delete(e)}function D(){y.forEach(e=>e(u))}function H(){localStorage.setItem(d.theme,u.theme),localStorage.setItem(d.language,u.language),localStorage.setItem(d.quizUnlocked,String(u.quizUnlocked))}function E(e){document.documentElement.dataset.theme=e.theme,document.documentElement.classList.toggle("dark",e.theme==="dark"),document.body.classList.toggle("quiz-unlocked",e.quizUnlocked)}function W({t:e}){return`
    <section class="hero section-reveal" id="hero">
      <div class="avatar-wrap">
        <div class="avatar-ring"></div>
        <img class="avatar" src="/images/johan-placeholder.jpg" alt="Portrait of Johan" />
      </div>
      <h1 class="hero-name">${e.hero.name}</h1>
      <p class="hero-title">${e.hero.title}</p>
    </section>
  `}const J="I focus on architecture thinking, frontend systems, and product-minded delivery.",B="Recent work centers on SPA structure, interaction quality, and maintainable design systems.",Y="I prioritize separation of concerns, explicit state, and measurable performance.",h={skills:J,projects:B,architecture:Y,default:"Great question. In this phase, I can answer on skills, projects, and architecture approach."};function K({t:e}){return`
    <section class="ask-card section-reveal" id="ask-johan">
      <h2 class="section-title">${e.ask.title}</h2>
      <div class="ask-input-wrap">
        <input id="ask-input" class="ask-input" type="text" placeholder="${e.ask.placeholder}" />
        <button id="ask-submit" class="ask-button" type="button">${e.ask.button}</button>
      </div>
      <p id="ask-answer" class="ask-answer"></p>
    </section>
  `}function V(){const e=document.querySelector("#ask-input"),t=document.querySelector("#ask-submit"),o=document.querySelector("#ask-answer");if(!e||!t||!o)return;const r=()=>{const n=e.value.trim().toLowerCase();if(n.includes("skill")){o.textContent=h.skills;return}if(n.includes("project")){o.textContent=h.projects;return}if(n.includes("architect")){o.textContent=h.architecture;return}o.textContent=h.default};t.addEventListener("click",r),e.addEventListener("keydown",n=>{n.key==="Enter"&&r()})}const G=[{id:"cv",title:"CV",description:"Updated profile and experience summary.",url:"/files/johan-cv.pdf"},{id:"portfolio",title:"Portfolio",description:"Project snapshots and architecture notes.",url:"/files/johan-portfolio.pdf"},{id:"architecture-notes",title:"Architecture Notes",description:"Patterns, tradeoffs, and implementation thinking.",url:"/files/architecture-notes.pdf"}];function X(e){return`
    <article class="file-card" tabindex="0">
      <h3 class="file-title">${e.title}</h3>
      <p class="file-description">${e.description}</p>
      <a class="file-download" href="${e.url}" download aria-label="Download ${e.title}">↧</a>
    </article>
  `}let f=null,p=!1,k=null;function P(){return`
    <section class="files-strip section-reveal" id="file-scroller-wrap">
      <div id="file-scroller" class="file-scroller">
        ${G.map(e=>X(e)).join("")}
      </div>
    </section>
  `}function A(){const e=document.querySelector("#file-scroller");if(!e)return;Z(),j(),p=!0;let t=performance.now();const o=a=>{if(!p)return;const s=a-t;t=a,e.scrollLeft+=s*.02,e.scrollLeft+e.clientWidth>=e.scrollWidth-1&&(e.scrollLeft=0),f=window.requestAnimationFrame(o)},r=()=>{w(),p=!1,j()},n=()=>{w(),!p&&(p=!0,t=performance.now(),f=window.requestAnimationFrame(o))},i=()=>{r(),k=window.setTimeout(n,1200)};e.addEventListener("mouseenter",r),e.addEventListener("mouseleave",n),e.addEventListener("focusin",r),e.addEventListener("focusout",n),e.addEventListener("pointerdown",i),e.addEventListener("touchstart",i,{passive:!0}),e.addEventListener("wheel",i,{passive:!0}),f=window.requestAnimationFrame(o)}function j(){f&&(window.cancelAnimationFrame(f),f=null)}function w(){k&&(window.clearTimeout(k),k=null)}function Z(){w()}function ee({t:e}){return`
    <main class="page-stack">
      ${W({t:e})}
      ${K({t:e})}
      ${P()}
    </main>
  `}function te(){V(),A()}const ne=Object.freeze(Object.defineProperty({__proto__:null,mount:te,render:ee},Symbol.toStringTag,{value:"Module"}));function z({title:e,body:t,id:o}){return`
    <section id="${o}" class="content-section section-reveal">
      <h2 class="section-title">${e}</h2>
      <p class="section-body">${t}</p>
    </section>
  `}function oe({t:e}){return`
    <main class="page-stack">
      ${z({id:"projects",title:e.projects.title,body:e.projects.intro})}
    </main>
  `}const re=Object.freeze(Object.defineProperty({__proto__:null,render:oe},Symbol.toStringTag,{value:"Module"}));function ie({t:e}){return`
    <main class="page-stack">
      ${z({id:"files",title:e.files.title,body:e.files.intro})}
      ${P()}
    </main>
  `}function se(){A()}const ae=Object.freeze(Object.defineProperty({__proto__:null,mount:se,render:ie},Symbol.toStringTag,{value:"Module"})),m=[{id:1,question:"What is the main purpose of a layered architecture?",options:["To separate concerns and reduce coupling","To make all code run faster","To avoid documentation"],answer:0},{id:2,question:"Which metric is most useful for frontend performance perception?",options:["Time to first commit","Largest Contentful Paint","Lines of CSS"],answer:1},{id:3,question:"Why use a state store in a small SPA?",options:["To centralize cross-page UI state","To avoid any event listeners","To remove routing"],answer:0}];function ce(){const e=m[0];return`
    <section class="quiz-card section-reveal">
      <div class="quiz-progress"><span id="quiz-progress">1</span>/${m.length}</div>
      <h2 class="quiz-question" id="quiz-question">${e.question}</h2>
      <div class="quiz-options" id="quiz-options">
        ${e.options.map((t,o)=>x(t,o)).join("")}
      </div>
      <p class="quiz-feedback" id="quiz-feedback"></p>
    </section>
  `}function le(e){let t=0;const o=document.querySelector("#quiz-question"),r=document.querySelector("#quiz-options"),n=document.querySelector("#quiz-progress"),i=document.querySelector("#quiz-feedback");if(!o||!r||!n||!i)return;function a(){const s=m[t];o.textContent=s.question,r.innerHTML=s.options.map((c,l)=>x(c,l)).join(""),n.textContent=String(t+1)}r.addEventListener("click",s=>{const c=s.target.closest("button[data-option]");if(!c)return;const l=m[t],I=Number(c.dataset.option)===l.answer;i.textContent=I?"Correct":"Not quite",window.setTimeout(()=>{if(t+=1,t>=m.length){i.textContent="Quiz completed. Enhanced mode unlocked.",e(),r.innerHTML="";return}i.textContent="",a()},350)}),a()}function x(e,t){return`<button class="quiz-option" type="button" data-option="${t}">${e}</button>`}function ue({t:e}){return`
    <main class="page-stack">
      ${z({id:"quiz-intro",title:e.quiz.title,body:e.quiz.intro})}
      ${ce()}
    </main>
  `}function de({onQuizComplete:e}){le(e)}const fe=Object.freeze(Object.defineProperty({__proto__:null,mount:de,render:ue},Symbol.toStringTag,{value:"Module"}));function pe(e){return`<div class="page-transition-enter">${e}</div>`}const L={"/":ne,"/projects":re,"/files":ae,"/quiz":fe},S="/johanscv/",me=500;function ge(e){const t=e.startsWith("/")?e.slice(1):e;return`${S}${t}`}function he(e=window.location.pathname){if(!e.startsWith(S))return"/";const t=e.slice(S.length-1)||"/";return t.length>1&&t.endsWith("/")?t.slice(0,-1):t}function ve({mountEl:e,renderFrame:t,pageContext:o,onRouteChange:r}){let n=!1;const i=()=>{const s=he(),c=L[s]||L["/"];r(s),e.innerHTML=pe(c.render(o(s))),c.mount&&c.mount(o(s)),requestAnimationFrame(()=>{const l=e.querySelector(".page-transition-enter");l&&l.classList.add("is-visible")})},a=()=>{if(n)return;n=!0;const s=e.querySelector(".page-transition-enter");if(!s){i(),n=!1;return}s.classList.remove("is-visible"),s.classList.add("is-exiting"),window.setTimeout(()=>{i(),n=!1},me)};document.addEventListener("click",s=>{const c=s.target.closest("[data-link]");if(!c)return;const l=c.getAttribute("href");!l||!l.startsWith("/")||(s.preventDefault(),ke(l,a))}),window.addEventListener("popstate",a),t(i)}function ke(e,t){history.pushState({},"",ge(e)),t()}Se();const be=document.querySelector("#app");be.innerHTML=`
  <div class="site-shell">
    <div id="nav-root"></div>
    <div id="page-root"></div>
  </div>
`;const qe=document.querySelector("#nav-root"),ye=document.querySelector("#page-root");let $=!1;ve({mountEl:ye,renderFrame:e=>{e(),$e(),Q(()=>{T()})},pageContext:()=>{const e=v();return{t:b[e.language]||b.en,onQuizComplete:()=>q({quizUnlocked:!0})}},onRouteChange:e=>{q({route:e}),T(),we()}});function T(){const e=v(),t=b[e.language]||b.en;qe.innerHTML=N({route:e.route,t,theme:e.theme,language:e.language}),M(()=>{const o=v().theme==="dark"?"light":"dark";q({theme:o})}),U(()=>{const o=v().language==="en"?"dk":"en";q({language:o}),window.dispatchEvent(new PopStateEvent("popstate"))}),C()}function we(){const e=document.querySelectorAll(".section-reveal"),t=new IntersectionObserver(o=>{o.forEach(r=>{r.isIntersecting&&(r.target.classList.add("is-visible"),t.unobserve(r.target))})},{threshold:.2});e.forEach((o,r)=>{o.style.transitionDelay=`${Math.min(r*70,240)}ms`,t.observe(o)})}function Se(){const e=new URL(window.location.href),t=e.searchParams.get("p");if(!t)return;const o=decodeURIComponent(t),[r,n]=o.split("&q="),i=n?`?${decodeURIComponent(n)}`:"",a=`${r}${i}${e.hash}`;window.history.replaceState(null,"",a)}function $e(){let e=window.scrollY,t=!1;const o=()=>{t||(t=!0,window.requestAnimationFrame(()=>{const r=window.scrollY,n=r-e;r<36||n<-8?$=!1:n>8&&($=!0),e=r,C(),t=!1}))};window.addEventListener("scroll",o,{passive:!0})}function C(){const e=document.querySelector("#navbar");e&&e.classList.toggle("nav-hidden",$)}
