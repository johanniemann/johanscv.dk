(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();const _={nav:{home:"Home",projects:"Projects",files:"Files",quiz:"Quiz"},hero:{name:"Johan Niemann Husbjerg",title:"IT Architecture student shaping precise, human-centered systems."},ask:{title:"Ask Johan",placeholder:"Ask about skills, projects, or architecture...",button:"Answer"},projects:{title:"Projects",intro:"Focused work in architecture, frontend systems, and product execution."},files:{title:"Files",intro:"Selected documents and references."},quiz:{title:"Architecture Quiz",intro:"Quick challenge to unlock enhanced visual mode."}},N={nav:{home:"Hjem",projects:"Projekter",files:"Filer",quiz:"Quiz"},hero:{name:"Johan Niemann Husbjerg",title:"IT-arkitekturstuderende med fokus pa praecise, menneskelige systemer."},ask:{title:"Sporg Johan",placeholder:"Sporg om kompetencer, projekter eller arkitektur...",button:"Svar"},projects:{title:"Projekter",intro:"Fokuseret arbejde inden for arkitektur, frontend-systemer og produktudforelse."},files:{title:"Filer",intro:"Udvalgte dokumenter og referencer."},quiz:{title:"Arkitektur Quiz",intro:"Kort udfordring der laaser op for forbedret visuel tilstand."}},b={en:_,dk:N};function R(e){const t=e==="dark";return`
    <button id="theme-toggle" class="toggle-pill" type="button" aria-label="Toggle theme">
      <span class="toggle-knob ${t?"translate-x-6":"translate-x-0"}"></span>
      <span class="toggle-label">${t?"Dark":"Light"}</span>
    </button>
  `}function U(e){const t=document.querySelector("#theme-toggle");t&&t.addEventListener("click",e)}function M(e){return`
    <button id="language-toggle" class="lang-pill" type="button" aria-label="Toggle language">
      <span class="lang-indicator ${e==="dk"?"translate-x-8":"translate-x-0"}"></span>
      <span class="lang-option">EN</span>
      <span class="lang-option">DK</span>
    </button>
  `}function W(e){const t=document.querySelector("#language-toggle");t&&t.addEventListener("click",e)}function H({route:e,t,theme:o,language:r}){return`
    <header id="navbar" class="site-nav">
      <a class="brand" href="/" data-link>johanscv.dk</a>
      <nav class="nav-links" aria-label="Primary">
        ${h("/",t.nav.home,e)}
        ${h("/projects",t.nav.projects,e)}
        ${h("/files",t.nav.files,e)}
        ${h("/quiz",t.nav.quiz,e)}
      </nav>
      <div class="nav-controls">
        ${M(r)}
        ${R(o)}
      </div>
    </header>
  `}function h(e,t,o){return`<a class="${o===e?"nav-link active":"nav-link"}" href="${e}" data-link>${t}</a>`}const d={theme:"johanscv.theme",language:"johanscv.language",quizUnlocked:"johanscv.quizUnlocked"},q=new Set;let u={theme:localStorage.getItem(d.theme)||"dark",language:localStorage.getItem(d.language)||"en",quizUnlocked:localStorage.getItem(d.quizUnlocked)==="true",route:"/"};A(u);function v(){return u}function y(e){u={...u,...e},J(),A(u),D()}function Q(e){return q.add(e),()=>q.delete(e)}function D(){q.forEach(e=>e(u))}function J(){localStorage.setItem(d.theme,u.theme),localStorage.setItem(d.language,u.language),localStorage.setItem(d.quizUnlocked,String(u.quizUnlocked))}function A(e){document.documentElement.dataset.theme=e.theme,document.documentElement.classList.toggle("dark",e.theme==="dark"),document.body.classList.toggle("quiz-unlocked",e.quizUnlocked)}function B({t:e}){return`
    <section class="hero section-reveal" id="hero">
      <div class="avatar-wrap">
        <div class="avatar-ring"></div>
        <img class="avatar" src="/WEBSITE/images/johan-placeholder.svg" alt="Portrait of Johan" />
      </div>
      <h1 class="hero-name">${e.hero.name}</h1>
      <p class="hero-title">${e.hero.title}</p>
    </section>
  `}const Y="I focus on architecture thinking, frontend systems, and product-minded delivery.",K="Recent work centers on SPA structure, interaction quality, and maintainable design systems.",V="I prioritize separation of concerns, explicit state, and measurable performance.",m={skills:Y,projects:K,architecture:V,default:"Great question. In this phase, I can answer on skills, projects, and architecture approach."};function G({t:e}){return`
    <section class="ask-card section-reveal" id="ask-johan">
      <h2 class="section-title">${e.ask.title}</h2>
      <div class="ask-input-wrap">
        <input id="ask-input" class="ask-input" type="text" placeholder="${e.ask.placeholder}" />
        <button id="ask-submit" class="ask-button" type="button">${e.ask.button}</button>
      </div>
      <p id="ask-answer" class="ask-answer"></p>
    </section>
  `}function X(){const e=document.querySelector("#ask-input"),t=document.querySelector("#ask-submit"),o=document.querySelector("#ask-answer");if(!e||!t||!o)return;const r=async()=>{const n=e.value.trim().toLowerCase();t.disabled=!0;try{o.textContent=await Z(n)}finally{t.disabled=!1}};t.addEventListener("click",r),e.addEventListener("keydown",n=>{n.key==="Enter"&&r()})}async function Z(e){return e?ee(e):m.default}function ee(e){return e.includes("skill")?m.skills:e.includes("project")?m.projects:e.includes("architect")?m.architecture:m.default}const te=[{id:"cv",title:"CV",description:"Updated profile and experience summary.",url:"/files/johan-niemann-husbjerg-cv.pdf"},{id:"portfolio",title:"Portfolio",description:"Project snapshots and architecture notes.",url:"/files/johan-portfolio.txt"},{id:"architecture-notes",title:"Architecture Notes",description:"Patterns, tradeoffs, and implementation thinking.",url:"/files/architecture-notes.txt"}];function ne(e){const t=oe(e.url);return`
    <article class="file-card" tabindex="0">
      <h3 class="file-title">${e.title}</h3>
      <p class="file-description">${e.description}</p>
      <a class="file-download" href="${t}" download aria-label="Download ${e.title}">↧</a>
    </article>
  `}function oe(e){return e.startsWith("/")?`/WEBSITE/${e.slice(1)}`:e}let f=null,p=!1,k=null;function I(){return`
    <section class="files-strip section-reveal" id="file-scroller-wrap">
      <div id="file-scroller" class="file-scroller">
        ${te.map(e=>ne(e)).join("")}
      </div>
    </section>
  `}function x(){const e=document.querySelector("#file-scroller");if(!e)return;re(),j(),p=!0;let t=performance.now();const o=a=>{if(!p)return;const s=a-t;t=a,e.scrollLeft+=s*.02,e.scrollLeft+e.clientWidth>=e.scrollWidth-1&&(e.scrollLeft=0),f=window.requestAnimationFrame(o)},r=()=>{w(),p=!1,j()},n=()=>{w(),!p&&(p=!0,t=performance.now(),f=window.requestAnimationFrame(o))},i=()=>{r(),k=window.setTimeout(n,1200)};e.addEventListener("mouseenter",r),e.addEventListener("mouseleave",n),e.addEventListener("focusin",r),e.addEventListener("focusout",n),e.addEventListener("pointerdown",i),e.addEventListener("touchstart",i,{passive:!0}),e.addEventListener("wheel",i,{passive:!0}),f=window.requestAnimationFrame(o)}function j(){f&&(window.cancelAnimationFrame(f),f=null)}function w(){k&&(window.clearTimeout(k),k=null)}function re(){w()}function ie({t:e}){return`
    <main class="page-stack">
      ${B({t:e})}
      ${G({t:e})}
      ${I()}
    </main>
  `}function se(){X(),x()}const ae=Object.freeze(Object.defineProperty({__proto__:null,mount:se,render:ie},Symbol.toStringTag,{value:"Module"}));function z({title:e,body:t,id:o}){return`
    <section id="${o}" class="content-section section-reveal">
      <h2 class="section-title">${e}</h2>
      <p class="section-body">${t}</p>
    </section>
  `}function ce({t:e}){return`
    <main class="page-stack">
      ${z({id:"projects",title:e.projects.title,body:e.projects.intro})}
    </main>
  `}const le=Object.freeze(Object.defineProperty({__proto__:null,render:ce},Symbol.toStringTag,{value:"Module"}));function ue({t:e}){return`
    <main class="page-stack">
      ${z({id:"files",title:e.files.title,body:e.files.intro})}
      ${I()}
    </main>
  `}function de(){x()}const fe=Object.freeze(Object.defineProperty({__proto__:null,mount:de,render:ue},Symbol.toStringTag,{value:"Module"})),g=[{id:1,question:"What is the main purpose of a layered architecture?",options:["To separate concerns and reduce coupling","To make all code run faster","To avoid documentation"],answer:0},{id:2,question:"Which metric is most useful for frontend performance perception?",options:["Time to first commit","Largest Contentful Paint","Lines of CSS"],answer:1},{id:3,question:"Why use a state store in a small SPA?",options:["To centralize cross-page UI state","To avoid any event listeners","To remove routing"],answer:0}];function pe(){const e=g[0];return`
    <section class="quiz-card section-reveal">
      <div class="quiz-progress"><span id="quiz-progress">1</span>/${g.length}</div>
      <h2 class="quiz-question" id="quiz-question">${e.question}</h2>
      <div class="quiz-options" id="quiz-options">
        ${e.options.map((t,o)=>C(t,o)).join("")}
      </div>
      <p class="quiz-feedback" id="quiz-feedback"></p>
    </section>
  `}function me(e){let t=0;const o=document.querySelector("#quiz-question"),r=document.querySelector("#quiz-options"),n=document.querySelector("#quiz-progress"),i=document.querySelector("#quiz-feedback");if(!o||!r||!n||!i)return;function a(){const s=g[t];o.textContent=s.question,r.innerHTML=s.options.map((c,l)=>C(c,l)).join(""),n.textContent=String(t+1)}r.addEventListener("click",s=>{const c=s.target.closest("button[data-option]");if(!c)return;const l=g[t],O=Number(c.dataset.option)===l.answer;i.textContent=O?"Correct":"Not quite",window.setTimeout(()=>{if(t+=1,t>=g.length){i.textContent="Quiz completed. Enhanced mode unlocked.",e(),r.innerHTML="";return}i.textContent="",a()},350)}),a()}function C(e,t){return`<button class="quiz-option" type="button" data-option="${t}">${e}</button>`}function ge({t:e}){return`
    <main class="page-stack">
      ${z({id:"quiz-intro",title:e.quiz.title,body:e.quiz.intro})}
      ${pe()}
    </main>
  `}function he({onQuizComplete:e}){me(e)}const ve=Object.freeze(Object.defineProperty({__proto__:null,mount:he,render:ge},Symbol.toStringTag,{value:"Module"}));function ke(e){return`<div class="page-transition-enter">${e}</div>`}const L={"/":ae,"/projects":le,"/files":fe,"/quiz":ve},S="/WEBSITE/",be=500;function ye(e){const t=e.startsWith("/")?e.slice(1):e;return`${S}${t}`}function T(e=window.location.pathname){if(!e.startsWith(S))return"/";const t=e.slice(S.length-1)||"/";return t.length>1&&t.endsWith("/")?t.slice(0,-1):t}function qe({mountEl:e,renderFrame:t,pageContext:o,onRouteChange:r}){let n=!1;const i=()=>{const s=T(),c=L[s]||L["/"];r(s),e.innerHTML=ke(c.render(o(s))),c.mount&&c.mount(o(s)),requestAnimationFrame(()=>{const l=e.querySelector(".page-transition-enter");l&&l.classList.add("is-visible")})},a=()=>{if(n)return;n=!0;const s=e.querySelector(".page-transition-enter");if(!s){i(),n=!1;return}s.classList.remove("is-visible"),s.classList.add("is-exiting"),window.setTimeout(()=>{i(),n=!1},be)};return document.addEventListener("click",s=>{const c=s.target.closest("[data-link]");if(!c)return;const l=c.getAttribute("href");!l||!l.startsWith("/")||(s.preventDefault(),l!==T()&&we(l,a))}),window.addEventListener("popstate",a),t(i),{refresh:a}}function we(e,t){history.pushState({},"",ye(e)),t()}Te();const Se=document.querySelector("#app");Se.innerHTML=`
  <div class="site-shell">
    <div id="nav-root"></div>
    <div id="page-root"></div>
  </div>
`;const $e=document.querySelector("#nav-root"),ze=document.querySelector("#page-root");let $=!1,E=!1;const je=qe({mountEl:ze,renderFrame:e=>{e(),Ee(),Q(()=>{P()})},pageContext:()=>{const e=v();return{t:b[e.language]||b.en,onQuizComplete:()=>y({quizUnlocked:!0})}},onRouteChange:e=>{y({route:e}),P(),Le()}});function P(){const e=v(),t=b[e.language]||b.en;$e.innerHTML=H({route:e.route,t,theme:e.theme,language:e.language}),U(()=>{const o=v().theme==="dark"?"light":"dark";y({theme:o})}),W(()=>{const o=v().language==="en"?"dk":"en";y({language:o}),je.refresh()}),F()}function Le(){const e=document.querySelectorAll(".section-reveal"),t=new IntersectionObserver(o=>{o.forEach(r=>{r.isIntersecting&&(r.target.classList.add("is-visible"),t.unobserve(r.target))})},{threshold:.2});e.forEach((o,r)=>{o.style.transitionDelay=`${Math.min(r*70,240)}ms`,t.observe(o)})}function Te(){const e=new URL(window.location.href),t=e.searchParams.get("p");if(!t)return;const o=decodeURIComponent(t),[r,n]=o.split("&q="),i=n?`?${decodeURIComponent(n)}`:"",a=`${r}${i}${e.hash}`;window.history.replaceState(null,"",a)}function Ee(){if(E)return;E=!0;let e=window.scrollY,t=!1;const o=()=>{t||(t=!0,window.requestAnimationFrame(()=>{const r=window.scrollY,n=r-e;r<36||n<-8?$=!1:n>8&&($=!0),e=r,F(),t=!1}))};window.addEventListener("scroll",o,{passive:!0})}function F(){const e=document.querySelector("#navbar");e&&e.classList.toggle("nav-hidden",$)}
