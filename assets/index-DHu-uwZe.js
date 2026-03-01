(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();const hn={nav:{home:"Home",projects:"Projects",files:"Resume",playground:"Get to know me",contact:"Contact"},hero:{name:"Johan Niemann Husbjerg",title:"IT Architecture student shaping precise, human-centered systems."},welcome:{title:"Welcome",intro:"This site is a focused overview of my architecture profile, practical experience, and current projects.",point1:"Explore projects and implementation work.",point2:"Review my full Resume / CV structure.",point3:"Use Ask Johan for quick context.",continue:"Continue",loggingIn:"Signing you in...",warmingUp:"Please wait while Johan is waking up. Give him ~ 20 seconds.",warmingUpAutoContinue:"Pro-tip: you can change between EN/DK mode at the bottom of the site",passwordLabel:"Site access code",passwordPlaceholder:"Enter site code",passwordError:"Invalid access code. Please try again.",passwordRateLimited:"Too many login attempts. Please wait a few minutes and try again.",passwordForbidden:"This site origin is not allowed right now. Please contact Johan.",passwordUnavailable:"Authentication service is temporarily unavailable. Please try again shortly.",passwordColdStart:"The service may still be waking up. Please wait a little and try again.",passwordNetwork:"Could not reach authentication service. Check your connection and try again."},ask:{title:"Ask Johan",placeholder:"Ask about skills, projects, or architecture...",button:"Answer"},projects:{title:"Projects",intro:"Focused work in architecture, frontend systems, and product execution.",previewTitle:"Selected Work",previewIntro:"A snapshot of practical architecture and frontend execution.",cta:"View all projects",readMore:"Read more",backToProjects:"Back to projects",exploreOtherHeading:"Explore my other projects",detailKicker:"Project detail",detailHeading:"About this project",notFoundTitle:"Project not found",notFoundBody:"This project no longer exists or the link is invalid."},files:{title:"Resume",intro:"Education, experience, voluntary work, and qualifications."},fileScroller:{title:"Links and files",ariaLabel:"Links and files carousel"},resume:{previewTitle:"Resume Snapshot",previewIntro:"A structured view of my education, practical experience, and key competencies.",cta:"Open Resume / CV",downloadPdf:"Download Resume as PDF",downloadCertificate:"Download Certificate as PDF",education:"Education",experience:"Work Experience",voluntary:"Voluntary Work",qualifications:"Qualifications",itSkills:"Core IT Skills",personalQualities:"Personal Qualities"},contact:{title:"Contact",intro:"Reach out directly by email, phone, or LinkedIn.",emailLabel:"E-mail",phoneLabel:"Phone",linkedinLabel:"LinkedIn",copyEmail:"Copy e-mail",copyPhone:"Copy phonenumber",connectLinkedin:"Connect on LinkedIn",connectedLinkedin:"Connected",copied:"Copied"},playground:{title:"Playground",intro:"Get to know Johan better through interactive services: Ask Johan, GeoJohan, and SpotiJohan.",quizHubTitle:"Service Hub",quizHubIntro:"Choose an experience. GeoJohan is a 3-round location guessing mini game.",cards:{askJohan:{title:"Ask Johan",subtitle:"Profile Q&A • instant answers • architecture context",cta:"Open Ask Johan"},cityQuiz:{title:"City Quiz",subtitle:"Timed city questions • visual clues • score chase",cta:"Coming soon"},geoJohan:{title:"GeoJohan",subtitle:"3 rounds • pan Street View • guess on map",cta:"Play GeoJohan"}},moreToComeTitle:"More To Come",moreToComeBody:"More experiments and interactive prototypes will be added here soon."},geojohan:{title:"GeoJohan",intro:"Pan around Street View, place your guess on the map, and score points across 3 rounds.",roundTitles:{address:"Where in Copenhagen do I live?",work:"Where in Copenhagen do I work?",school:"Where in Copenhagen do I study?"},panoramaAria:"Street View panorama",mapAria:"Guess map",loading:"Loading map and Street View...",loadingRound:"Preparing this round...",progressLabel:"Round",currentTotalLabel:"Current total",roundReady:"Place your guess on the map when ready.",streetViewFallback:"Street View is limited here. You can still guess on the map.",mapHint:"Click map to place your guess",guessPlacedHint:"Guess placed. Submit or move your pin.",guessAction:"Guess",continueAction:"Continue",guessAndContinue:"Guess and continue",submitGuess:"Submit guess",resetGuess:"Reset guess",nextRound:"Next round",finishRound:"Finish",summaryTitle:"GeoJohan results",summaryLocations:{address:{address:"",context:""},work:{address:"",context:""},school:{address:"",context:""}},totalScoreLabel:"Total score",distanceLabel:"Distance",distanceFromGuessLabel:"Distance from your guess",pointsLabel:"Points",playAgain:"Play GeoJohan again",backToQuiz:"Back to quiz",authError:"GeoJohan requires a valid site login.",authErrorHint:"Unlock the site with your access code and try again.",apiError:"GeoJohan could not reach the API right now.",apiErrorHint:"Check that the API is running and VITE_API_BASE_URL points to the correct backend.",missingKey:"GeoJohan maps key is unavailable right now.",missingKeyHint:"Set GEOJOHAN_MAPS_API_KEY in the API environment and restart the API.",loadError:"Google Maps failed to load. Please try again.",loadErrorHint:"Check API key restrictions, billing, and allowed referrers.",demoCoordinatesNote:"Using demo coordinates. Set VITE_GEOJOHAN_ROUND*_... vars in .env.local for your real rounds."},spotifyDashboard:{title:"SpotiJohan",intro:"Explore the music I've listened to the most this week.",tabs:{tracks:"Track",albums:"Album",artists:"Artist"},switchLabel:"Switch Spotify dashboard list",loading:"Loading Spotify dashboard...",refreshData:"Refresh dashboard",errorTitle:"Spotify dashboard unavailable",loadError:"Could not load Spotify dashboard right now. Please try again.",networkError:"Could not reach the API. Check that backend is running and try again.",apiBaseMissing:"VITE_API_BASE_URL is not configured for Spotify dashboard API calls.",invalidPayload:"Spotify dashboard response was invalid.",rateLimited:"Spotify is rate limiting requests. Please wait before retrying.",retryAfter:"Retry after",retryCta:"Retry",lastUpdated:"Updated",autoRefreshNote:"SpotiJohan updates automatically every 10 minutes",weekFallback:"No plays found in the last 7 days, so the latest available recent plays are shown.",emptyTitle:"Waiting for data",emptySlot:"No ranked item available yet.",rankWith:"with",playSingle:"play",playPlural:"plays",previewPlayLabel:"Play 10-second track preview",previewStopLabel:"Stop track preview"},scrollHint:{label:"Scroll for more"},footer:{builtWith:"Built with Vite, Tailwind, and custom JavaScript.",rights:"All rights reserved.",playground:"Get to know me",infoButtonAria:"Open website build information",infoKicker:"Behind the build",infoTitle:"How this site is built",infoIntro:"A quick overview of the live architecture powering johanscv.dk today.",infoPoints:["Frontend: Single-page app built with Vite and modular Vanilla JavaScript, styled with Tailwind + custom CSS.","Core UX: Client-side routing, animated page transitions, and global theme/language state shared across pages.","Feature modules: Ask Johan (AI chat), GeoJohan (Street View game), and SpotiJohan (music dashboard) are isolated in dedicated frontend modules.","Backend: Node.js + Express API on Render with layered modules for auth, Ask Johan, GeoJohan, and Spotify handlers.","Data + AI flow: Ask Johan calls OpenAI on the server (model via env), while GeoJohan Maps keys and Spotify snapshot data are served from protected API endpoints.","Security baseline: Access-code login -> JWT bearer token, strict CORS allowlist, JSON/body limits, per-IP rate limits, and daily usage caps."],infoClose:"Back to site"}},vn={nav:{home:"Hjem",projects:"Projekter",files:"CV",playground:"Lær mig at kende",contact:"Kontakt"},hero:{name:"Johan Niemann Husbjerg",title:"IT-arkitekturstuderende med fokus på præcise, menneskelige systemer."},welcome:{title:"Velkommen",intro:"Denne side giver et fokuseret overblik over min arkitekturprofil, praktiske erfaring og nuværende projekter.",point1:"Se projekter og konkret implementeringsarbejde.",point2:"Gennemgå mit fulde Resume / CV.",point3:"Brug Ask Johan for hurtig kontekst.",continue:"Fortsæt",loggingIn:"Logger ind...",warmingUp:"Vent mens Johan vågner op. Giv ham ~ 20 sekunder.",warmingUpAutoContinue:"Pro-tip: du kan skifte mellem EN/DK mode nederst på siden",passwordLabel:"Adgangskode til siden",passwordPlaceholder:"Indtast adgangskode",passwordError:"Ugyldig adgangskode. Prøv igen.",passwordRateLimited:"For mange loginforsøg. Vent et par minutter og prøv igen.",passwordForbidden:"Dette domæne er ikke tilladt lige nu. Kontakt Johan.",passwordUnavailable:"Login-servicen er midlertidigt utilgængelig. Prøv igen om lidt.",passwordColdStart:"Servicen kan stadig være ved at vågne. Vent lidt og prøv igen.",passwordNetwork:"Kunne ikke nå login-servicen. Tjek din forbindelse og prøv igen."},ask:{title:"Spørg Johan",placeholder:"Spørg om kompetencer, projekter eller arkitektur...",button:"Svar"},projects:{title:"Projekter",intro:"Fokuseret arbejde inden for arkitektur, frontend-systemer og produktudførelse.",previewTitle:"Udvalgt Arbejde",previewIntro:"Et udsnit af praktisk arkitektur og frontend-udførelse.",cta:"Se alle projekter",readMore:"Læs mere",backToProjects:"Tilbage til projekter",exploreOtherHeading:"Udforsk mine andre projekter",detailKicker:"Projektdetalje",detailHeading:"Om projektet",notFoundTitle:"Projektet blev ikke fundet",notFoundBody:"Projektet findes ikke længere, eller linket er ugyldigt."},files:{title:"CV",intro:"Uddannelse, arbejdserfaring, frivilligt arbejde og kvalifikationer."},fileScroller:{title:"Links og filer",ariaLabel:"Karusel med links og filer"},resume:{previewTitle:"CV overblik",previewIntro:"Et struktureret overblik over uddannelse, praktisk erfaring og væsentlige kompetencer.",cta:"Åbn Resume / CV",downloadPdf:"Download CV som PDF",downloadCertificate:"Download Certifikat som PDF",education:"Uddannelse",experience:"Arbejdserfaring",voluntary:"Frivilligt arbejde",qualifications:"Kvalifikationer",itSkills:"Væsentlige IT-kundskaber",personalQualities:"Personlige kvaliteter"},contact:{title:"Kontakt",intro:"Kontakt mig direkte via e-mail, telefon eller LinkedIn.",emailLabel:"E-mail",phoneLabel:"Telefon",linkedinLabel:"LinkedIn",copyEmail:"Kopiér e-mail",copyPhone:"Kopiér telefonnummer",connectLinkedin:"Forbind på LinkedIn",connectedLinkedin:"Forbundet",copied:"Kopieret"},playground:{title:"Playground",intro:"Lær Johan bedre at kende gennem interaktive services: Spørg Johan, GeoJohan og SpotiJohan.",quizHubTitle:"Servicehub",quizHubIntro:"Vælg en oplevelse. GeoJohan er et 3-runders locationspil.",cards:{askJohan:{title:"Spørg Johan",subtitle:"Profil Q&A • hurtige svar • arkitekturkontekst",cta:"Åbn Spørg Johan"},cityQuiz:{title:"By-quiz",subtitle:"Tidsbaserede byspørgsmål • visuelle hints • jagt på score",cta:"Kommer snart"},geoJohan:{title:"GeoJohan",subtitle:"3 rounds • pan Street View • guess on map",cta:"Spil GeoJohan"}},moreToComeTitle:"Mere På Vej",moreToComeBody:"Flere eksperimenter og interaktive prototyper bliver tilføjet her snart."},geojohan:{title:"GeoJohan",intro:"Panorer i Street View, placér dit gæt på kortet og få point over 3 runder.",roundTitles:{address:"Hvor i København bor jeg?",work:"Hvor i København arbejder jeg?",school:"Hvor i København studerer jeg?"},panoramaAria:"Street View panorama",mapAria:"Gættekort",loading:"Indlæser kort og Street View...",loadingRound:"Forbereder denne runde...",progressLabel:"Runde",currentTotalLabel:"Nuværende total",roundReady:"Placér dit gæt på kortet når du er klar.",streetViewFallback:"Street View er begrænset her. Du kan stadig gætte på kortet.",mapHint:"Klik på kortet for at placere dit gæt",guessPlacedHint:"Gæt placeret. Indsend eller flyt din pin.",guessAction:"Gæt",continueAction:"Fortsæt",guessAndContinue:"Gæt og forsæt",submitGuess:"Indsend gæt",resetGuess:"Nulstil gæt",nextRound:"Næste runde",finishRound:"Afslut",summaryTitle:"GeoJohan resultat",summaryLocations:{address:{address:"",context:""},work:{address:"",context:""},school:{address:"",context:""}},totalScoreLabel:"Samlet score",distanceLabel:"Afstand",distanceFromGuessLabel:"Afstand fra dit gæt",pointsLabel:"Point",playAgain:"Spil GeoJohan igen",backToQuiz:"Tilbage til quiz",authError:"GeoJohan kræver et gyldigt login til siden.",authErrorHint:"Lås siden op med adgangskoden og prøv igen.",apiError:"GeoJohan kunne ikke nå API'et lige nu.",apiErrorHint:"Tjek at API'et kører, og at VITE_API_BASE_URL peger på korrekt backend.",missingKey:"GeoJohan maps key er ikke tilgængelig lige nu.",missingKeyHint:"Sæt GEOJOHAN_MAPS_API_KEY i API-miljøet og genstart API'en.",loadError:"Google Maps kunne ikke indlæses. Prøv igen.",loadErrorHint:"Tjek API key-restriktioner, billing og tilladte domæner.",demoCoordinatesNote:"Demo-koordinater bruges lige nu. Sæt VITE_GEOJOHAN_ROUND*_... i .env.local for rigtige runder."},spotifyDashboard:{title:"SpotiJohan",intro:"Udforsk hvilken musik jeg har lyttet mest til denne uge.",tabs:{tracks:"Sang",albums:"Album",artists:"Artist"},switchLabel:"Skift Spotify dashboard-liste",loading:"Indlæser Spotify dashboard...",refreshData:"Opdater dashboard",errorTitle:"Spotify dashboard utilgængeligt",loadError:"Kunne ikke indlæse Spotify dashboard lige nu. Prøv igen.",networkError:"Kunne ikke nå API'et. Tjek at backend kører og prøv igen.",apiBaseMissing:"VITE_API_BASE_URL er ikke sat til Spotify dashboard API-kald.",invalidPayload:"Spotify dashboard-svaret var ugyldigt.",rateLimited:"Spotify begrænser requests lige nu. Vent lidt før nyt forsøg.",retryAfter:"Prøv igen om",retryCta:"Prøv igen",lastUpdated:"Opdateret",autoRefreshNote:"SpotiJohan opdateres automatisk hvert 10. minut",weekFallback:"Ingen afspilninger fundet i de sidste 7 dage, så seneste tilgængelige afspilninger vises.",emptyTitle:"Afventer data",emptySlot:"Ingen rangering tilgængelig endnu.",rankWith:"med",playSingle:"afspilning",playPlural:"afspilninger",previewPlayLabel:"Afspil 10 sekunders track-preview",previewStopLabel:"Stop track-preview"},scrollHint:{label:"Scroll for mere"},footer:{builtWith:"Bygget med Vite, Tailwind og custom JavaScript.",rights:"Alle rettigheder forbeholdes.",playground:"Lær mig at kende",infoButtonAria:"Åbn information om hvordan websitet er bygget",infoKicker:"Bag kulissen",infoTitle:"Sådan er sitet bygget",infoIntro:"Et hurtigt overblik over den live arkitektur, der driver johanscv.dk i dag.",infoPoints:["Frontend: Single-page app bygget med Vite og modulær Vanilla JavaScript, stylet med Tailwind + custom CSS.","Kerne-UX: Client-side routing, animerede sideovergange og global theme/language-state på tværs af sider.","Feature-moduler: Ask Johan (AI-chat), GeoJohan (Street View-spil) og SpotiJohan (musikdashboard) ligger i adskilte frontend-moduler.","Backend: Node.js + Express API på Render med lagdelte moduler til auth, Ask Johan, GeoJohan og Spotify-handlers.","Data + AI-flow: Ask Johan kalder OpenAI på serveren (model styres via env), mens GeoJohan Maps-nøgle og Spotify snapshot-data leveres fra beskyttede API-endpoints.","Sikkerhedsgrundlag: Access-code login -> JWT bearer-token, stram CORS-allowlist, JSON/body-grænser, per-IP rate limits og daglige usage caps."],infoClose:"Tilbage til sitet"}},We={en:hn,dk:vn};function wn({route:e,t}){return`
    <header id="navbar" class="site-nav">
      <div class="nav-main">
        <nav class="nav-links nav-links-primary" aria-label="Primary navigation">
          ${[{path:"/",label:t.nav.home},{path:"/projects",label:t.nav.projects},{path:"/resume",label:t.nav.files},{path:"/contact",label:t.nav.contact,extraClass:"nav-contact-link"}].map(o=>bn(o.path,o.label,e,o.extraClass||"")).join("")}
        </nav>
        <span class="nav-wordmark" aria-hidden="true">JOHANSCV.DK</span>
      </div>
    </header>
  `}function bn(e,t,n,o=""){const r=`nav-link nav-link-${e==="/"?"home":e.slice(1)} ${o}`.trim();return`<a class="${yn(e,n)?`${r} active`:r}" href="${e}" data-link>${t}</a>`}function yn(e,t){return!e||!t?!1:e==="/"?t==="/":t===e||t.startsWith(`${e}/`)}function kn(e){return`
    <button id="theme-toggle" class="toggle-pill ${e==="dark"?"is-dark":"is-light"}" type="button" aria-label="Toggle theme">
      <span class="toggle-option toggle-option-light">Light</span>
      <span class="toggle-option toggle-option-dark">Dark</span>
      <span class="toggle-knob"></span>
    </button>
  `}function Sn(e){const t=document.querySelector("#theme-toggle");t&&t.addEventListener("click",e)}function An(e){return`
    <button id="language-toggle" class="lang-pill ${e==="dk"?"is-dk":"is-en"}" type="button" aria-label="Toggle language">
      <span class="lang-indicator"></span>
      <span class="lang-option">EN</span>
      <span class="lang-option">DK</span>
    </button>
  `}function En(e){const t=document.querySelector("#language-toggle");t&&t.addEventListener("click",e)}const Ke="footer-info-modal",It="footer-info-dialog",Tn=320,Ln=140;function _n({t:e,theme:t,language:n}){const o=new Date().getFullYear();return`
    <footer class="site-footer" aria-label="Footer">
      <div class="footer-top">
        <nav class="footer-links" aria-label="Footer navigation">
          ${[{href:"/",label:e.nav.home},{href:"/projects",label:e.nav.projects},{href:"/resume",label:e.nav.files}].map(r=>`<a class="${r.className||""}" href="${r.href}" data-link>${r.label}</a>`).join("")}
        </nav>
        <div class="footer-controls">
          <a class="footer-playground-link" href="/playground" data-link>${e.footer.playground}</a>
          <div class="footer-toggles">
            ${An(n)}
            ${kn(t)}
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">&copy; ${o} Johan Niemann Husbjerg. ${e.footer.rights}</p>
        <div class="footer-built-wrap">
          <p class="footer-built">${e.footer.builtWith}</p>
          <button
            id="footer-info-toggle"
            class="footer-info-button"
            type="button"
            aria-label="${e.footer.infoButtonAria}"
            aria-haspopup="dialog"
            aria-controls="${It}"
            aria-expanded="false"
          >
            ?
          </button>
        </div>
      </div>
    </footer>
  `}function In(e,t={}){const n=jt(t.overlayRoot),o=document.querySelector("#footer-info-toggle"),i=jn(e,n),r=i?.querySelector("#footer-info-close"),a=i?.querySelector("[data-footer-info-close]");if(!o||!i||!r||!a)return;document.body.classList.remove("footer-info-lock"),document.body.classList.remove("footer-info-open");let s=!1,l=!1,d=null,c=null,p=null;const g=()=>!i.hidden&&i.classList.contains("is-visible"),v=()=>{c&&(i.removeEventListener("transitionend",c),c=null),d&&(window.clearTimeout(d),d=null)},u=()=>{p&&(window.clearTimeout(p),p=null)},m=()=>{v(),u(),l=!1,i.hidden=!0,i.classList.remove("is-visible"),document.body.classList.remove("footer-info-lock"),document.body.classList.remove("footer-info-open"),s&&o.focus({preventScroll:!0}),s=!1},w=b=>{o.setAttribute("aria-expanded",b?"true":"false")},f=()=>{g()||l||(v(),u(),s=!1,i.hidden=!1,i.classList.remove("is-visible"),document.body.classList.add("footer-info-lock"),document.body.classList.add("footer-info-open"),w(!0),window.requestAnimationFrame(()=>{i.classList.add("is-visible"),p=window.setTimeout(()=>{p=null,!(i.hidden||l||!i.classList.contains("is-visible"))&&r.focus({preventScroll:!0})},Ln)}))},S=({restoreFocus:b=!1}={})=>{i.hidden||l||(l=!0,v(),u(),s=b,w(!1),i.classList.remove("is-visible"),c=O=>{O.target!==i||O.propertyName!=="opacity"||m()},i.addEventListener("transitionend",c),d=window.setTimeout(m,Tn+80))};o.addEventListener("click",()=>{if(g()){S({restoreFocus:!0});return}f()}),r.addEventListener("click",()=>S()),a.addEventListener("click",()=>S()),i.addEventListener("keydown",b=>{b.key==="Escape"&&S({restoreFocus:!0})})}function jn(e,t){if(document.body.classList.remove("footer-info-lock"),document.querySelectorAll(`#${Ke}`).forEach(i=>{i.remove()}),!e?.footer)return null;const n=jt(t),o=document.createElement("div");return o.id=Ke,o.className="footer-info-modal",o.hidden=!0,o.innerHTML=`
    <div class="footer-info-backdrop" data-footer-info-close></div>
    <section
      id="${It}"
      class="footer-info-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="footer-info-title"
    >
      <p class="footer-info-kicker">${e.footer.infoKicker}</p>
      <h2 id="footer-info-title" class="section-title footer-info-title">${e.footer.infoTitle}</h2>
      <p class="section-body footer-info-intro">${e.footer.infoIntro}</p>
      <ul class="footer-info-list">
        ${e.footer.infoPoints.map(i=>`<li>${i}</li>`).join("")}
      </ul>
      <button id="footer-info-close" class="footer-info-close-button" type="button">
        ${e.footer.infoClose}
      </button>
    </section>
  `,n.append(o),o}function jt(e=null){if(e instanceof HTMLElement)return e;const t=document.querySelector("#overlay-root");return t instanceof HTMLElement?t:document.body}function Pn({t:e}){return`
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
          <div class="welcome-input-row">
            <input
              id="welcome-access-code"
              class="welcome-input welcome-input-with-button"
              type="password"
              autocomplete="current-password"
              placeholder="${e.welcome.passwordPlaceholder}"
            />
            <button id="welcome-continue" class="ask-button welcome-continue-button" type="button" aria-label="${e.welcome.continue}">
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
          <p id="welcome-error" class="welcome-error" aria-live="polite"></p>
          <p id="welcome-status" class="welcome-status" aria-live="polite"></p>
        </div>
      </div>
    </section>
  `}function $n({t:e}){return`
    <section class="welcome-screen" aria-label="Service warmup">
      <div class="welcome-panel">
        <p class="welcome-kicker">johanscv.dk</p>
        <h1 class="welcome-title">${e.welcome.title}</h1>
        <p class="welcome-intro">${e.welcome.warmingUp}</p>
        <p class="welcome-status welcome-status-static has-message">${e.welcome.warmingUpAutoContinue||""}</p>
        <div class="welcome-warmup-row" aria-hidden="true">
          <span class="welcome-warmup-spinner"></span>
        </div>
      </div>
    </section>
  `}function On(e,{t,apiMode:n=!1}={}){const o=document.querySelector("#welcome-continue"),i=document.querySelector("#welcome-access-code"),r=document.querySelector("#welcome-error"),a=document.querySelector("#welcome-status");if(!o||!i)return;const s=(c="")=>{a&&(a.textContent=c,a.classList.toggle("has-message",!!String(c).trim()))},l=c=>{o.disabled=c,i.disabled=c,o.classList.toggle("is-loading",c),o.setAttribute("aria-busy",c?"true":"false")},d=async()=>{if(o.disabled)return;r&&(r.textContent=""),l(!0),s(t?.welcome?.loggingIn||"");let c=null;n&&(c=window.setTimeout(()=>{s(t?.welcome?.warmingUp||"")},1200));let p=null;try{p=await e(i.value.trim())}finally{c&&window.clearTimeout(c),l(!1)}if(p?.ok){r&&(r.textContent=""),s("");return}r&&(r.textContent=p?.message||""),s(""),i.focus(),i.select()};o.addEventListener("click",d),i.addEventListener("keydown",c=>{c.key==="Enter"&&d()})}const Mn="I focus on architecture thinking, frontend systems, and product-minded delivery.",Rn="Recent work centers on SPA structure, interaction quality, and maintainable design systems.",Cn="I prioritize separation of concerns, explicit state, and measurable performance.",B={skills:Mn,projects:Rn,architecture:Cn,default:"In this phase, I can answer on skills, projects, and architecture approach."},G="https://ask-johan-api.onrender.com".replace(/\/$/,""),Nn="/auth/login",Dn="/api/ask-johan",Ne="johanscv.askJohanAccessCode",D="Access code is required to use Ask Johan.",Hn="Ask Johan is waking up on Render free hosting. Please try again in 10-20 seconds.",xn=25e3,re=2,ze=2200,Vn=42,Un=24,Gn=1200,Jn=260,Fn=520,Ye={en:["What is your favorite dish?","When is your birthday?","Where do you live in Copenhagen?","What kind of IT architecture do you want to work with?","What is your strongest technical skill right now?","How do you approach system design decisions?","What have you learned from your current student job?","Which projects best represent your profile?","How do you balance UX quality and performance?","How do you work with data quality in practice?","How can we collaborate on a relevant opportunity?"],dk:["Hvad er din yndlingsret?","Hvornår har du fødselsdag?","Hvor bor du i København?","Hvilken type IT-arkitektur vil du arbejde med?","Hvad er din stærkeste tekniske kompetence lige nu?","Hvordan træffer du arkitektur- og designbeslutninger?","Hvad har du lært i dit nuværende studiejob?","Hvilke projekter repræsenterer dig bedst?","Hvordan balancerer du UX-kvalitet og performance?","Hvordan arbejder du med datakvalitet i praksis?","Hvordan kan vi samarbejde om en relevant mulighed?"]};let C=null,Se=0,Xe=!1,W="";function Pt({t:e}){const[t,n]=qn(e.ask.title);return`
    <section class="ask-card section-reveal" id="ask-johan">
      <h2 class="section-title ask-title">
        <span>${t}</span>
        <span class="ask-title-johan">
          <span class="ask-title-johan-text">${n}</span>
          <span class="ask-title-ai-icon-png" style="--ai-icon-url: url('/images/ai-icon.png')" aria-hidden="true"></span>
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
  `}function qn(e="Ask Johan"){const t=String(e).trim();if(!t)return["Ask","Johan"];const n=t.split(/\s+/);if(n.length===1)return[n[0],""];const o=n.pop();return[n.join(" "),o]}function $t(e="en"){const t=document.querySelector("#ask-input"),n=document.querySelector("#ask-submit"),o=document.querySelector("#ask-answer");if(!t||!n||!o)return;oo(t,e);const i=async()=>{const r=t.value.trim().toLowerCase();n.disabled=!0,n.classList.add("is-loading");try{const a=await Bn(r);await ao(o,a)}finally{n.disabled=!1,n.classList.remove("is-loading")}};n.addEventListener("click",i),t.addEventListener("keydown",r=>{r.key==="Enter"&&i()})}async function Bn(e){if(!e)return B.default;try{return await zn(e)}catch(t){return console.warn(Zn(t)),Hn}return Wn(e)}function Wn(e){return e.includes("skill")?B.skills:e.includes("project")?B.projects:e.includes("architect")?B.architecture:B.default}function De(){const e=localStorage.getItem(Ne);return e&&e.trim()?e:""}async function Kn(){if(!G)throw new Error("VITE_API_BASE_URL is not configured.");const e=De();if(!e)throw new Error(D);return Ot(e)}async function zn(e){if(!G)throw new Error("VITE_API_BASE_URL is not configured.");const t=De();if(!t)return D;let n=null,o=!1;for(let i=1;i<=re;i+=1)try{const r=await Ot(t,o);o=!1;const a=await Xn(e,r);if(a.status===401){if(Mt(),i<re){o=!0;continue}return localStorage.removeItem(Ne),D}if(!a.ok){const d=await Ct(a);if(eo(a.status,i)){await Qe(ze);continue}throw new Error(d)}const s=await a.json(),l=Qn(s);if(!l)throw new Error("API returned an empty answer.");return l}catch(r){if(r instanceof Error&&r.message===D)return D;if(n=r,i<re&&to(r)){await Qe(ze);continue}throw r}throw n||new Error("API request failed.")}async function Ot(e,t=!1){if(!t&&W)return W;const n=await Yn(e);if(n.status===401)throw localStorage.removeItem(Ne),Mt(),new Error(D);if(!n.ok){const r=await Ct(n,"Authentication failed.");throw new Error(r)}const o=await n.json(),i=typeof o?.token=="string"?o.token.trim():"";if(!i)throw new Error("API login did not return a token.");return W=i,W}function Mt(){W=""}function Yn(e){return Rt(`${G}${Nn}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accessCode:e})})}function Xn(e,t){return Rt(`${G}${Dn}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({question:e})})}function Rt(e,t){const n=new AbortController,o=window.setTimeout(()=>n.abort(),xn);return fetch(e,{...t,signal:n.signal}).finally(()=>{window.clearTimeout(o)})}function Qn(e){return typeof e?.answer!="string"?"":e.answer.trim()||""}async function Ct(e,t="API request failed."){try{const n=await e.json();if(typeof n?.answer=="string"&&n.answer.trim())return`${e.status} ${e.statusText}: ${n.answer.trim()}`}catch{}return`${e.status} ${e.statusText}: ${t}`}function Zn(e){return e?.name==="AbortError"?"Ask Johan API error: request timed out.":`Ask Johan API error: ${e instanceof Error?e.message:String(e)}`}function eo(e,t){return t>=re?!1:e===408||e===429||e>=500}function to(e){if(!e)return!1;if(e.name==="AbortError")return!0;const t=String(e.message||"");return t.includes("Failed to fetch")||t.includes("NetworkError")}function no(){if(!G||Xe||!De())return Promise.resolve();Xe=!0;const e=new AbortController,t=window.setTimeout(()=>e.abort(),1e4);return fetch(`${G}/health`,{method:"GET",signal:e.signal}).catch(()=>null).finally(()=>{window.clearTimeout(t)})}function oo(e,t){ro();const n=io(Ye[t]||Ye.en),o=++Se;let i=0,r=0,a=!1;const s=()=>{if(o!==Se)return;const l=n[i];if(!a){if(r+=1,e.placeholder=l.slice(0,r),r>=l.length){a=!0,C=window.setTimeout(s,Gn);return}C=window.setTimeout(s,Vn);return}if(r-=1,e.placeholder=l.slice(0,Math.max(r,0)),r<=0){a=!1,i=(i+1)%n.length,C=window.setTimeout(s,Jn);return}C=window.setTimeout(s,Un)};s()}function io(e){const t=[...e];for(let n=t.length-1;n>0;n-=1){const o=Math.floor(Math.random()*(n+1));[t[n],t[o]]=[t[o],t[n]]}return t}function ro(){C&&(window.clearTimeout(C),C=null),Se+=1}async function ao(e,t){const n=String(t||""),o=e.offsetHeight;e.style.height=`${o}px`,e.textContent=n,e.classList.toggle("has-content",!!n.trim());const i=n.trim()?e.scrollHeight:0;e.offsetHeight,e.style.height=`${i}px`,await so(e),e.style.height=n.trim()?"auto":"0px"}function so(e){return new Promise(t=>{let n=!1;const o=()=>{n||(n=!0,e.removeEventListener("transitionend",i),t())},i=r=>{r.propertyName==="height"&&o()};e.addEventListener("transitionend",i),window.setTimeout(o,Fn+80)})}function Qe(e){return new Promise(t=>{window.setTimeout(t,e)})}const ce={theme:"johanscv.theme",language:"johanscv.language"};let L={theme:localStorage.getItem(ce.theme)||"dark",language:localStorage.getItem(ce.language)||"en",route:"/"};Nt(L);function _(){return L}function He(e){const t=L,n={...L,...e};po(t,n)&&(L=n,co(t,L)&&lo(),uo(t,L)&&Nt(L))}function lo(){localStorage.setItem(ce.theme,L.theme),localStorage.setItem(ce.language,L.language)}function Nt(e){document.documentElement.dataset.theme=e.theme,document.documentElement.classList.toggle("dark",e.theme==="dark")}function co(e,t){return e.theme!==t.theme||e.language!==t.language}function uo(e,t){return e.theme!==t.theme}function po(e,t){return e.theme!==t.theme||e.language!==t.language||e.route!==t.route}const xe=[{id:"spa-architecture",title:{en:"SPA Architecture Foundation",dk:"SPA Arkitekturgrundlag"},summary:{en:"Designed a lightweight Vanilla JS SPA with explicit routing, transition orchestration, and durable state boundaries.",dk:"Designede en letvægts Vanilla JS SPA med tydelig routing, overgangsorkestrering og robuste state-grænser."},details:{en:["This project established the technical foundation for the website as a lightweight single-page application with clear boundaries between pages, shared UI, and state.","I focused on explicit client-side routing, predictable rendering flow, and clean separation between feature modules so updates can be made quickly without creating side effects.","The result is a maintainable architecture where navigation, page transitions, and component behavior stay consistent as the site grows."],dk:["Dette projekt lagde det tekniske fundament for websitet som en letvægts single-page applikation med tydelige grænser mellem sider, fælles UI og state.","Jeg havde fokus på eksplicit client-side routing, forudsigeligt render-flow og klar opdeling mellem feature-moduler, så ændringer kan laves hurtigt uden uønskede sideeffekter.","Resultatet er en vedligeholdbar arkitektur, hvor navigation, sideovergange og komponentadfærd forbliver konsistent, efterhånden som sitet udvikles."]},tags:["Vite","Vanilla JS","Routing"]},{id:"design-system",title:{en:"Interaction-Led Design System",dk:"Interaktionsdrevet Designsystem"},summary:{en:"Built a restrained visual language with theme tokens, glass surfaces, motion hierarchy, and responsive rhythm.",dk:"Byggede et afdæmpet visuelt sprog med tematiske tokens, glasflader, motion-hierarki og responsiv rytme."},details:{en:["This project defined a consistent UI language across the site, including typography, spacing, cards, controls, and motion behavior.","I implemented shared design tokens and reusable CSS patterns for light and dark themes, so visual decisions remain coherent across pages and features.","The primary outcome is a more intentional interface with better readability, consistent interaction feedback, and smoother responsive behavior on both desktop and mobile."],dk:["Dette projekt definerede et konsistent UI-sprog på tværs af sitet, herunder typografi, spacing, kort, controls og motion-adfærd.","Jeg implementerede fælles design-tokens og genbrugelige CSS-mønstre til light/dark theme, så visuelle beslutninger forbliver sammenhængende på tværs af sider og features.","Det primære resultat er et mere intentionelt interface med bedre læsbarhed, ensartet interaktionsfeedback og mere stabil responsiv adfærd på både desktop og mobil."]},tags:["Tailwind","Theming","UX Motion"]},{id:"deployment-flow",title:{en:"GitHub Pages Deployment Flow",dk:"GitHub Pages Deploy-flow"},summary:{en:"Configured stable project-page deployment with base-path-safe assets and SPA fallback for deep links.",dk:"Konfigurerede stabil project-pages deployment med base-path-sikre assets og SPA fallback til deep links."},details:{en:["This project focused on making deployment reliable for GitHub Pages while preserving the expected SPA navigation behavior.","I aligned build configuration, asset paths, and fallback routing so direct access to nested routes works instead of breaking on refresh or shared links.","The result is a more robust release flow where local development, CI checks, and production hosting behave consistently."],dk:["Dette projekt havde fokus på at gøre deployment stabil på GitHub Pages, samtidig med at den forventede SPA-navigation blev bevaret.","Jeg afstemte build-konfiguration, asset-paths og fallback-routing, så direkte adgang til undersider virker i stedet for at fejle ved refresh eller delte links.","Resultatet er et mere robust release-flow, hvor lokal udvikling, CI-checks og produktion opfører sig konsistent."]},tags:["GitHub Pages","CI-ready","Reliability"]}];function mo({t:e}){return`
    <section class="hero section-reveal" id="hero">
      <div class="avatar-wrap">
        <div class="avatar-ring"></div>
        <img class="avatar" src="/images/johan-placeholder.jpg" alt="Portrait of Johan" />
      </div>
      <h1 class="hero-name">${e.hero.name}</h1>
      <p class="hero-title">${e.hero.title}</p>
    </section>
  `}const Ze=[{id:"cv",title:{en:"CV",dk:"CV"},description:{en:"Updated profile and experience summary.",dk:"Opdateret profil og erfaringsoversigt."},url:"/files/johan-niemann-husbjerg-cv.pdf",actionLabel:{en:"Download CV",dk:"Download CV"},actionType:"download",icon:"download"},{id:"linkedin",title:{en:"LinkedIn",dk:"LinkedIn"},description:{en:"Professional profile, education, and work history.",dk:"Professionel profil, uddannelse og arbejdserfaring."},url:"https://www.linkedin.com/in/johan-niemann-h-038906312/",actionLabel:{en:"Go to LinkedIn",dk:"Gå til LinkedIn"},actionType:"external",icon:"linkedin"},{id:"github",title:{en:"GitHub",dk:"GitHub"},description:{en:"Code repositories, projects, and technical work.",dk:"Kode-repositorier, projekter og teknisk arbejde."},url:"https://github.com/johanniemann",actionLabel:{en:"Go to GitHub",dk:"Gå til GitHub"},actionType:"external",icon:"github"},{id:"location",title:{en:"Location",dk:"Lokation"},description:{en:"Where I live in Copenhagen.",dk:"Hvor jeg bor i København."},url:"https://www.google.com/maps/place/Enghavevej+63,+1674+K%C3%B8benhavn/@55.665423,12.5330593,15z/data=!3m1!4b1!4m6!3m5!1s0x4652539dab759293:0xf1e50266a0d1baf1!8m2!3d55.6654113!4d12.5433376!16s%2Fg%2F11nnv8kwnj?entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D",actionLabel:{en:"Open in Maps",dk:"Åbn i Maps"},actionType:"external",icon:"location"}];function et(e,t,n=!1){const o=ge(e.title,t),i=ge(e.description,t),r=fo(e.url),a=n?'tabindex="-1"':'tabindex="0"',s=n?"file-card file-card-clone":"file-card",l=go(e,n),d=vo(e.icon),c=ge(e.actionLabel,t)||ho(e.actionType,o,t);return`
    <article class="${s}" ${a}>
      <h3 class="file-title">${o}</h3>
      <p class="file-description">${i}</p>
      <a class="file-action" href="${r}" ${l} aria-label="${c}">
        <span class="file-action-icon" aria-hidden="true">${d}</span>
        <span class="file-action-text">${c}</span>
      </a>
    </article>
  `}function fo(e){return e.startsWith("/")?`/${e.slice(1)}`:e}function go(e,t){const n=[];return e.actionType==="download"?n.push("download"):n.push('target="_blank"','rel="noopener noreferrer"'),t&&n.push('tabindex="-1"'),n.join(" ")}function ho(e,t,n){return e==="download"?`Download ${t}`:n==="dk"?`Gå til ${t}`:`Open ${t}`}function vo(e){return e==="linkedin"?"in":e==="github"?wo():e==="location"?bo():yo()}function wo(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.21.68-.48v-1.7c-2.78.6-3.37-1.17-3.37-1.17-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.52 1.03 1.52 1.03.89 1.52 2.33 1.08 2.9.82.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.41.11 2.66.64.7 1.02 1.59 1.02 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  `}function bo(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2.25a6.75 6.75 0 0 0-6.75 6.75c0 4.98 6.05 11.86 6.3 12.15a.6.6 0 0 0 .9 0c.25-.29 6.3-7.17 6.3-12.15A6.75 6.75 0 0 0 12 2.25Zm0 9.75a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
      />
    </svg>
  `}function yo(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M11.25 3.75a.75.75 0 0 1 1.5 0v9.69l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V3.75Z"/>
      <path d="M4.5 17.25a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1-.75-.75Z"/>
    </svg>
  `}function ge(e,t){return typeof e=="string"?e:e&&typeof e=="object"&&(e[t]||e.en||Object.values(e)[0])||""}let V=null,N=!1,U=null,ae=null;const ko=.018,Q={interaction:1200,drag:900,wheel:1100};function So({t:e,language:t}){const n=Ze.map(i=>et(i,t)).join(""),o=Ze.map(i=>et(i,t,!0)).join("");return`
    <section class="files-strip section-reveal" id="file-scroller-wrap">
      <h2 class="section-title">${e.fileScroller.title}</h2>
      <div id="file-scroller-viewport" class="file-scroller-viewport" tabindex="0" aria-label="${e.fileScroller.ariaLabel}">
        <div id="file-scroller-track" class="file-scroller-track">
          ${n}
          ${o}
        </div>
      </div>
    </section>
  `}function Ao(){const e=document.querySelector("#file-scroller-viewport"),t=document.querySelector("#file-scroller-track");if(!e||!t)return;Eo(),Ae(),N=!0;const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let o=!1,i=!1,r=null,a=!1,s=0,l=0,d=0,c=t.scrollWidth/2,p=performance.now();const g=()=>{t.style.transform=`translate3d(${-d}px, 0, 0)`},v=h=>{if(!c)return 0;const T=h%c;return T<0?T+c:T},u=h=>{if(!N||n||o)return;const T=h-p;p=h,d=v(d+T*ko),g(),V=window.requestAnimationFrame(u)},m=()=>{Ee(),N=!1,Ae()},w=()=>{Ee(),!(N||n||o)&&(N=!0,p=performance.now(),V=window.requestAnimationFrame(u))},f=h=>{if(h.target.closest("a, button, input, textarea, select")){m(),U=window.setTimeout(w,Q.interaction);return}i=!0,r=h.pointerId,a=!1,s=h.clientX,l=d,m(),e.setPointerCapture(r)},S=h=>{if(!i||h.pointerId!==r)return;const T=h.clientX-s;!a&&Math.abs(T)>6&&(a=!0,o=!0,e.classList.add("is-dragging")),o&&(d=v(l-T),g())},b=h=>{!i||h.pointerId!==r||(i=!1,r=null,o=!1,e.classList.remove("is-dragging"),e.hasPointerCapture(h.pointerId)&&e.releasePointerCapture(h.pointerId),U=window.setTimeout(w,a?Q.drag:Q.interaction))},O=h=>{m(),d=v(d+h.deltaY*.8+h.deltaX),g(),U=window.setTimeout(w,Q.wheel)};e.addEventListener("mouseenter",m),e.addEventListener("mouseleave",w),e.addEventListener("focusin",m),e.addEventListener("focusout",w),e.addEventListener("pointerdown",f),e.addEventListener("pointermove",S),e.addEventListener("pointerup",b),e.addEventListener("pointercancel",b),e.addEventListener("wheel",O,{passive:!0}),ae=()=>{e.removeEventListener("mouseenter",m),e.removeEventListener("mouseleave",w),e.removeEventListener("focusin",m),e.removeEventListener("focusout",w),e.removeEventListener("pointerdown",f),e.removeEventListener("pointermove",S),e.removeEventListener("pointerup",b),e.removeEventListener("pointercancel",b),e.removeEventListener("wheel",O)},window.requestAnimationFrame(()=>{c=t.scrollWidth/2,g()}),n||(V=window.requestAnimationFrame(u))}function Ae(){V&&(window.cancelAnimationFrame(V),V=null)}function Ee(){U&&(window.clearTimeout(U),U=null)}function Eo(){N=!1,ae&&(ae(),ae=null),Ae(),Ee()}function To({t:e,language:t}){return`
    <main class="page-stack">
      ${mo({t:e})}
      <section class="content-section section-reveal" id="projects-preview">
        <h2 class="section-title">${e.projects.previewTitle}</h2>
        <p class="section-body">${e.projects.previewIntro}</p>
        <div class="projects-grid projects-grid-compact">
          ${xe.slice(0,2).map(n=>_o(n,t)).join("")}
        </div>
        <a class="projects-cta" href="/projects" data-link>${e.projects.cta}</a>
      </section>

      <section class="content-section section-reveal" id="resume-preview">
        <h2 class="section-title">${e.resume.previewTitle}</h2>
        <p class="section-body">${e.resume.previewIntro}</p>
        <a class="projects-cta" href="/resume" data-link>${e.resume.cta}</a>
      </section>

      ${Pt({t:e})}
      ${So({t:e,language:t})}
    </main>
  `}function Lo({language:e}){$t(e),Ao()}function _o(e,t){const n=e.title[t]||e.title.en,o=e.summary[t]||e.summary.en;return`
    <article class="project-card">
      <h3 class="project-title">${n}</h3>
      <p class="project-summary">${o}</p>
    </article>
  `}const Io=Object.freeze(Object.defineProperty({__proto__:null,mount:Lo,render:To},Symbol.toStringTag,{value:"Module"})),tt="/projects/";function jo({t:e,language:t,route:n="/projects"}){const o=Mo(n);return o?$o({t:e,language:t,projectId:o}):Po({t:e,language:t})}function Po({t:e,language:t}){return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="projects">
        <h2 class="section-title">${e.projects.title}</h2>
        <p class="section-body">${e.projects.intro}</p>
      </section>
      <section class="projects-grid section-reveal" aria-label="${e.projects.title}">
        ${xe.map(n=>Oo(n,t,e)).join("")}
      </section>
    </main>
  `}function $o({t:e,language:t,projectId:n}){const o=xe.find(s=>s.id===n);if(!o)return`
      <main class="page-stack">
        <section class="content-section section-reveal" id="project-detail-missing">
          <h2 class="section-title">${e.projects.notFoundTitle}</h2>
          <p class="section-body">${e.projects.notFoundBody}</p>
          <a class="projects-cta project-back-link" href="/projects" data-link>${e.projects.backToProjects}</a>
        </section>
      </main>
    `;const i=o.title[t]||o.title.en,r=o.summary[t]||o.summary.en,a=Ro(o,t,r);return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="project-detail-intro">
        <p class="project-detail-kicker">${e.projects.detailKicker}</p>
        <h2 class="section-title">${i}</h2>
        <p class="section-body">${r}</p>
      </section>

      <section class="project-card project-detail-card section-reveal" aria-label="${i}">
        <h3 class="project-title">${e.projects.detailHeading}</h3>
        <div class="project-detail-body">
          ${a.map(s=>`<p>${s}</p>`).join("")}
        </div>
        <div class="project-tags">
          ${o.tags.map(s=>`<span class="project-tag">${s}</span>`).join("")}
        </div>
      </section>

      <section class="content-section section-reveal" id="project-detail-navigation">
        <h3 class="section-title">${e.projects.exploreOtherHeading}</h3>
        <a class="projects-cta project-back-link" href="/projects" data-link>${e.projects.backToProjects}</a>
      </section>
    </main>
  `}function Oo(e,t,n){const o=e.title[t]||e.title.en,i=e.summary[t]||e.summary.en,r=`/projects/${encodeURIComponent(e.id)}`;return`
    <article class="project-card">
      <h3 class="project-title">${o}</h3>
      <p class="project-summary">${i}</p>
      <div class="project-tags">
        ${e.tags.map(a=>`<span class="project-tag">${a}</span>`).join("")}
      </div>
      <a class="projects-cta project-read-more" href="${r}" data-link aria-label="${n.projects.readMore}: ${o}">
        ${n.projects.readMore}
      </a>
    </article>
  `}function Mo(e=""){if(!e.startsWith(tt))return"";const t=e.slice(tt.length).replace(/\/+$/,"").trim();if(!t)return"";try{return decodeURIComponent(t)}catch{return t}}function Ro(e,t,n){const o=e.details?.[t]||e.details?.en;return Array.isArray(o)&&o.length>0?o:[n]}const Dt=Object.freeze(Object.defineProperty({__proto__:null,render:jo},Symbol.toStringTag,{value:"Module"})),Co={education:[{level:"Videregående uddannelse",institution:"Københavns Erhvervsakademi",focus:"Professionsbachelor, IT-arkitektur",period:"August 2024 - Januar 2028"},{level:"Gymnasial uddannelse (STX)",institution:"Nærum Gymnasium",focus:"Samfundsfag/Engelsk A niveau",period:"August 2019 - Juni 2022"},{level:"Folkeskole",institution:"Engelsborgskolen, Kongens Lyngby",focus:"Grundskoleforløb",period:"August 2008 - Juni 2018"}],experience:[{role:"Product Data & Systems Assistant hos Norlys",description:"Jeg har arbejdet med digitale e-commerce-løsninger med ansvar for oprettelse, strukturering og vedligeholdelse af produktdata på tværs af databaser, PIM- og CMS-systemer. Arbejdet har haft fokus på datakvalitet, herunder korrekthed, konsistens og sammenhæng i produktdata. Jeg har samarbejdet tæt med både forretning, leverandører og tekniske teams for at sikre, at ændringer i produkter og indhold bliver korrekt afspejlet i systemerne. Derudover har jeg arbejdet løbende med optimering af produkt- og kategorisider for at forbedre synlighed og brugeroplevelse, herunder SEO.",type:"Studentermedhjælper",period:"Februar 2026 - d.d."},{role:"Indkøbs- og salgskonsulent hos Nofipa ApS (Nordisk Guld, Pantsat.dk m. fl.)",description:"Jeg har arbejdet med finansielle transaktioner og rådgivning inden for asset-backed lending, herunder lån baseret på værdifastsættelse af aktiver. Jeg har udført AML- og KYC-kontroller, kunde due diligence og risikovurderinger i overensstemmelse med gældende regler samt rådgivet privat- og erhvervskunder med fokus på compliance og kvalitet. Arbejdet har været KPI-styret med fokus på effektiv sagsbehandling, kvalitet og omsætning. Her har jeg udarbejdet +1.000 kontrakter heraf belånt og opkøbt aktiver for +10 mio. kr. Derudover har jeg bidraget til en startups digitale udvikling ved at optimere arbejdsgange og digitalisere manuelle processer.",type:"Studentermedhjælper",period:"Januar 2025 - d.d."},{role:"Lektiehjælper til folkeskoleelev i matematik og dansk",description:"Erfaring med undervisning, formidling og planlægning af faglige forløb.",type:"Deltid",period:"December 2021 - d.d."},{role:"Pædagogmedhjælper i Børnehuset Klokkeblomsten",description:"Erfaring med børns udvikling, læring og behov i en struktureret hverdagsramme.",type:"Fuldtid",period:"August 2022 - Oktober 2023"}],voluntary:[{role:"Studentermiljørepræsentant (SMR) for IT-arkitekturuddannelsen på EK",description:"Repræsenterer de studerendes interesser i forhold til trivsel og studiemiljø. Indsamler input fra medstuderende og deltager i dialog med undervisere og ledelse om forbedringer af studiehverdagen.",period:"September 2024 - d.d.",certificateFile:"files/smr-frivilligcertifikat-kea.pdf"}],qualifications:{it:["Microsoft Office pakken","CMS- og PIM-systemer","Adobe pakken","Git og GitHub","SQL og NoSQL","Datamodellering og datahåndtering (JSON, CSV, XML m.fl.)","Visualisering af dashboards (Tableau, Excel m.fl.)","UI/UX-design i Compose og Figma","Stærkt kendskab til JavaScript, Python, Kotlin m.fl.","Stærkt kendskab til API-drevet softwarearkitektur","Iterativ udvikling, prototyper og brugertests","Business Modeling Frameworks (BPMN, RCA, SWOT, BMC, AS-IS, TO-BE m.fl.)"],personal:["Ansvarsbevidst - overholder deadlines og følger opgaver til dørs","Lærenem - sætter mig hurtigt ind i nye systemer og arbejdsgange","Struktureret - arbejder metodisk og bevarer overblik","Samarbejdsorienteret - trives i teams og kommunikerer klart","Selvstændig - tager initiativ og kan arbejde uden tæt styring"]}},No={education:[{level:"Higher Education",institution:"Copenhagen School of Design and Technology",focus:"Professional Bachelor's Degree, IT Architecture",period:"August 2024 - January 2028"},{level:"Upper Secondary Education (STX)",institution:"Nærum Gymnasium",focus:"Social Sciences / English, A-level",period:"August 2019 - June 2022"},{level:"Primary and Lower Secondary School",institution:"Engelsborgskolen, Kongens Lyngby",focus:"General school program",period:"August 2008 - June 2018"}],experience:[{role:"Product Data & Systems Assistant at Norlys",description:"I have worked with digital e-commerce solutions with responsibility for creating, structuring, and maintaining product data across databases, PIM, and CMS systems. The work has focused on data quality, including correctness, consistency, and coherence in product data. I have collaborated closely with business stakeholders, suppliers, and technical teams to ensure that changes in products and content are accurately reflected in the systems. In addition, I have continuously optimized product and category pages to improve visibility and user experience, including SEO.",type:"Student Assistant",period:"February 2026 - Present"},{role:"Purchasing and Sales Consultant at Nofipa ApS (Nordisk Guld, Pantsat.dk, etc.)",description:"I have worked with financial transactions and advisory within asset-backed lending, including loans based on asset valuation. I have carried out AML and KYC controls, customer due diligence, and risk assessments in accordance with applicable regulations, while advising private and business customers with a focus on compliance and quality. The work has been KPI-driven with focus on efficient case handling, quality, and revenue. I have prepared +1,000 contracts and handled lending and acquisition of assets totaling more than DKK 10 million. In addition, I have contributed to a startup's digital development by optimizing workflows and digitalizing manual processes.",type:"Student Assistant",period:"January 2025 - Present"},{role:"Private Tutor in Mathematics and Danish",description:"Experience in teaching, communication, and planning subject-focused sessions.",type:"Part-time",period:"December 2021 - Present"},{role:"Pedagogical Assistant at Børnehuset Klokkeblomsten",description:"Experience with child development, learning needs, and structured care environments.",type:"Full-time",period:"August 2022 - October 2023"}],voluntary:[{role:"Student Environment Representative (SMR) for IT Architecture at EK",description:"Represent students in matters related to well-being and study environment. Collect input from students and participate in dialogue with lecturers and management to improve the study experience.",period:"September 2024 - Present",certificateFile:"files/smr-frivilligcertifikat-kea.pdf"}],qualifications:{it:["Microsoft Office suite","CMS and PIM systems","Adobe suite","Git and GitHub","SQL and NoSQL","Data modeling and handling (JSON, CSV, XML, etc.)","Dashboard visualization (Tableau, Excel, etc.)","UI/UX design in Compose and Figma","Strong command of JavaScript, Python, Kotlin, and more","Strong command of API-driven software architecture","Iterative development, prototypes, and user testing","Business modeling frameworks (BPMN, RCA, SWOT, BMC, AS-IS, TO-BE, etc.)"],personal:["Responsible - meet deadlines and carry tasks through","Fast learner - quickly adapt to new systems and workflows","Structured - work methodically and maintain overview","Collaborative - thrive in teams and communicate clearly","Independent - take initiative and work without close supervision"]}},nt={dk:Co,en:No};function Do({t:e,language:t}){const n=nt[t]||nt.dk;return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="resume-intro">
        <div class="resume-intro-head">
          <div>
            <h2 class="section-title">${e.files.title}</h2>
            <p class="section-body">${e.files.intro}</p>
          </div>
          <a class="file-action resume-download-action" href="/files/johan-niemann-husbjerg-cv.pdf" download aria-label="${e.resume.downloadPdf}">
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
          ${n.education.map(Ho).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-experience">
        <h3 class="resume-heading">${e.resume.experience}</h3>
        <div class="resume-list">
          ${n.experience.map(xo).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-voluntary">
        <h3 class="resume-heading">${e.resume.voluntary}</h3>
        <div class="resume-list">
          ${n.voluntary.map(i=>Vo(i,e)).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-qualifications">
        <h3 class="resume-heading">${e.resume.qualifications}</h3>
        <div class="qual-grid">
          <article class="qual-card">
            <h4 class="qual-title">${e.resume.itSkills}</h4>
            <ul class="qual-list">
              ${n.qualifications.it.map(Uo).join("")}
            </ul>
          </article>
          <article class="qual-card">
            <h4 class="qual-title">${e.resume.personalQualities}</h4>
            <ul class="qual-list qual-list-personal">
              ${n.qualifications.personal.map(Go).join("")}
            </ul>
          </article>
        </div>
      </section>
    </main>
  `}function Ho(e){return`
    <article class="resume-item">
      <p class="resume-item-type">${e.level}</p>
      <h4 class="resume-item-title">${e.institution}</h4>
      <p class="resume-item-focus">- ${e.focus}</p>
      <p class="resume-item-period">${e.period}</p>
    </article>
  `}function xo(e){return`
    <article class="resume-item">
      <h4 class="resume-item-title">${e.role}</h4>
      <p class="resume-item-body">${e.description}</p>
      <p class="resume-item-period"><span class="resume-item-type">${e.type}</span>: ${e.period}</p>
    </article>
  `}function Vo(e,t){const n=String(e.certificateFile??"").trim(),o=n?`/${n}`:"",i=!!o;return`
    <article class="resume-item${i?" resume-item-with-action":""}">
      <div class="resume-item-content">
        <h4 class="resume-item-title">${e.role}</h4>
        <p class="resume-item-body">${e.description}</p>
        <p class="resume-item-period">${e.period}</p>
      </div>
      ${i?`
        <a class="file-action resume-item-action" href="${o}" download aria-label="${t.resume.downloadCertificate}">
          <span class="file-action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M11.25 3.75a.75.75 0 0 1 1.5 0v9.69l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V3.75Z"/>
              <path d="M4.5 17.25a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1-.75-.75Z"/>
            </svg>
          </span>
          <span class="file-action-text">${t.resume.downloadCertificate}</span>
        </a>`:""}
    </article>
  `}function Uo(e){return`<li>${e}</li>`}function Go(e){const{title:t,detail:n}=Jo(e);return n?`
    <li class="qual-personal-item">
      <span class="qual-personal-label">${t}</span>
      <span class="qual-personal-detail">${n}</span>
    </li>
  `:`
      <li class="qual-personal-item">
        <span class="qual-personal-label">${t}</span>
      </li>
    `}function Jo(e){const t=String(e??"").trim(),n=t.match(/^(.+?)\s+-\s+(.+)$/);return n?{title:n[1],detail:n[2]}:{title:t,detail:""}}const Fo=Object.freeze(Object.defineProperty({__proto__:null,render:Do},Symbol.toStringTag,{value:"Module"}));function qo({t:e}){return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="contact-intro">
        <h2 class="section-title">${e.contact.title}</h2>
        <p class="section-body">${e.contact.intro}</p>
      </section>

      <section class="contact-stack section-reveal" aria-label="${e.contact.title}">
        ${he({label:e.contact.emailLabel,value:"johan.niemann.husbjerg@gmail.com",action:ve({type:"button",icon:Wo(),text:e.contact.copyEmail,attrs:'data-copy="johan.niemann.husbjerg@gmail.com"'})})}
        ${he({label:e.contact.phoneLabel,value:"+45 60 47 42 36",action:ve({type:"button",icon:Ko(),text:e.contact.copyPhone,attrs:'data-copy="+45 60 47 42 36"'})})}
        ${he({label:e.contact.linkedinLabel,value:"linkedin.com/in/johan-niemann-h-038906312",action:ve({type:"link",icon:"in",text:e.contact.connectLinkedin,attrs:`href="https://www.linkedin.com/in/johan-niemann-h-038906312/" target="_blank" rel="noopener noreferrer" data-feedback-label="${e.contact.connectedLinkedin}"`})})}
      </section>
    </main>
  `}function Bo({t:e}){document.querySelectorAll(".contact-action").forEach(i=>{i.dataset.defaultLabel=i.querySelector(".file-action-text")?.textContent||""}),document.querySelectorAll("[data-copy]").forEach(i=>{i.addEventListener("click",async()=>{if(i.dataset.busy==="true")return;const r=i.getAttribute("data-copy")||"";!r||!await zo(r)||await ot(i,e.contact.copied)})}),document.querySelectorAll("[data-feedback-label]").forEach(i=>{i.addEventListener("click",()=>{if(i.dataset.busy==="true")return;const r=i.getAttribute("data-feedback-label")||"";r&&ot(i,r)})})}function he({label:e,value:t,action:n}){return`
    <article class="contact-row">
      <div class="contact-meta">
        <h3 class="contact-label">${e}</h3>
        <p class="contact-value">${t}</p>
      </div>
      <div class="contact-action-wrap">
        ${n}
      </div>
    </article>
  `}function ve({type:e,icon:t,text:n,attrs:o}){const i=e==="link"?"a":"button";return`
    <${i} class="file-action contact-action" ${e==="button"?'type="button"':""} ${o} aria-label="${n}">
      <span class="file-action-icon" aria-hidden="true">${t}</span>
      <span class="file-action-text">${n}</span>
    </${i}>
  `}function Wo(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.75 5.5h14.5A1.25 1.25 0 0 1 20.5 6.75v10.5a1.25 1.25 0 0 1-1.25 1.25H4.75a1.25 1.25 0 0 1-1.25-1.25V6.75A1.25 1.25 0 0 1 4.75 5.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="m4.5 7 7.5 5.8L19.5 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `}function Ko(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.9 3.8h2.8c.4 0 .8.27.9.67l.78 3.15a1 1 0 0 1-.28.96L9.78 10.9a13.2 13.2 0 0 0 3.31 3.31l2.32-1.32a1 1 0 0 1 .96-.28l3.15.78c.4.1.67.49.67.9v2.8a1.9 1.9 0 0 1-2.06 1.9c-2.7-.2-5.3-1.42-7.79-3.66-2.24-2.03-3.7-4.28-4.36-6.76-.29-1.1-.45-2.2-.49-3.3A1.9 1.9 0 0 1 6.9 3.8Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `}async function zo(e){try{return await navigator.clipboard.writeText(e),!0}catch{const t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();const n=document.execCommand("copy");return document.body.removeChild(t),n}}async function ot(e,t){const n=e.querySelector(".file-action-text");if(!n)return;const o=e.dataset.defaultLabel||n.textContent||"",i=180,r=900,a=220;e.dataset.busy="true";const s=Math.ceil(e.getBoundingClientRect().width),l=Yo(e,n,t);e.style.width=`${s}px`,e.classList.add("is-label-hidden"),await Z(i),n.textContent=t,it(e,l),e.classList.remove("is-label-hidden"),await Z(r),e.classList.add("is-label-hidden"),await Z(i),n.textContent=o,it(e,s),e.classList.remove("is-label-hidden"),await Z(a),e.style.width="",e.dataset.busy="false"}function Yo(e,t,n){const o=t.textContent,i=e.style.width;t.textContent=n,e.style.width="auto";const r=Math.ceil(e.getBoundingClientRect().width);return t.textContent=o,e.style.width=i,r}function it(e,t){window.requestAnimationFrame(()=>{e.style.width=`${t}px`})}function Z(e){return new Promise(t=>{window.setTimeout(t,e)})}const Xo=Object.freeze(Object.defineProperty({__proto__:null,mount:Bo,render:qo},Symbol.toStringTag,{value:"Module"})),Ht={VITE_GEOJOHAN_ROUND1_TITLE:"Round 1: Address",VITE_GEOJOHAN_ROUND1_PANO_ID:void 0,VITE_GEOJOHAN_ROUND1_PANO_LAT:"55.6655113",VITE_GEOJOHAN_ROUND1_PANO_LNG:"12.5431293",VITE_GEOJOHAN_ROUND1_POV_HEADING:void 0,VITE_GEOJOHAN_ROUND1_POV_PITCH:void 0,VITE_GEOJOHAN_ROUND1_ANSWER_LAT:"55.6654113",VITE_GEOJOHAN_ROUND1_ANSWER_LNG:"12.5433376",VITE_GEOJOHAN_ROUND1_SUMMARY_ADDRESS:"Enghavevej 63, 1674 København",VITE_GEOJOHAN_ROUND1_SUMMARY_CONTEXT_DK:"På Vesterbro tæt på Enghaveplads.",VITE_GEOJOHAN_ROUND1_SUMMARY_CONTEXT_EN:"In Vesterbro, close to Enghave Plads.",VITE_GEOJOHAN_ROUND2_TITLE:"Round 2: Work",VITE_GEOJOHAN_ROUND2_PANO_ID:void 0,VITE_GEOJOHAN_ROUND2_PANO_LAT:"55.6375536",VITE_GEOJOHAN_ROUND2_PANO_LNG:"12.583142",VITE_GEOJOHAN_ROUND2_POV_HEADING:void 0,VITE_GEOJOHAN_ROUND2_POV_PITCH:void 0,VITE_GEOJOHAN_ROUND2_ANSWER_LAT:"55.6371638",VITE_GEOJOHAN_ROUND2_ANSWER_LNG:"12.5830904",VITE_GEOJOHAN_ROUND2_SUMMARY_ADDRESS:"Ørestads Blvd. 45, 2300 København S",VITE_GEOJOHAN_ROUND2_SUMMARY_CONTEXT_DK:"Hos Norlys tæt på Bella Center.",VITE_GEOJOHAN_ROUND2_SUMMARY_CONTEXT_EN:"At Norlys, close to Bella Center.",VITE_GEOJOHAN_ROUND3_TITLE:"Round 3: School",VITE_GEOJOHAN_ROUND3_PANO_ID:void 0,VITE_GEOJOHAN_ROUND3_PANO_LAT:"55.6911753",VITE_GEOJOHAN_ROUND3_PANO_LNG:"12.5545637",VITE_GEOJOHAN_ROUND3_POV_HEADING:void 0,VITE_GEOJOHAN_ROUND3_POV_PITCH:void 0,VITE_GEOJOHAN_ROUND3_ANSWER_LAT:"55.691502",VITE_GEOJOHAN_ROUND3_ANSWER_LNG:"12.554989",VITE_GEOJOHAN_ROUND3_SUMMARY_ADDRESS:"Guldbergsgade 29N, 2200 København",VITE_GEOJOHAN_ROUND3_SUMMARY_CONTEXT_DK:"På EK tæt på Nørrebros Runddel.",VITE_GEOJOHAN_ROUND3_SUMMARY_CONTEXT_EN:"At EK, close to Nørrebros Runddel."};function xt(e){return String(Ht[e]||"").trim()}function Vt(e){const t=Number(Ht[e]);return Number.isFinite(t)?t:null}const Qo=[{roundId:"address",title:"Where in Copenhagen do I live?",streetViewPanoId:"",streetViewPov:{heading:34,pitch:5},streetViewLocation:{lat:55.6761,lng:12.5683},answerLocation:{lat:55.6761,lng:12.5683}},{roundId:"work",title:"Where in Copenhagen do I work?",streetViewPanoId:"",streetViewPov:{heading:34,pitch:5},streetViewLocation:{lat:55.6908,lng:12.5443},answerLocation:{lat:55.6908,lng:12.5443}},{roundId:"school",title:"Where in Copenhagen do I study?",streetViewPanoId:"",streetViewPov:{heading:34,pitch:5},streetViewLocation:{lat:55.7024,lng:12.5628},answerLocation:{lat:55.7024,lng:12.5628}}];function Zo(){let e=!1;return{rounds:Qo.map((n,o)=>{const r=`VITE_GEOJOHAN_ROUND${o+1}`,a=at(`${r}_TITLE`,n.title),s=at(`${r}_PANO_ID`,n.streetViewPanoId||""),l=rt(`${r}_PANO`,n.streetViewLocation),d={heading:de(`${r}_POV_HEADING`,n.streetViewPov?.heading??34),pitch:de(`${r}_POV_PITCH`,n.streetViewPov?.pitch??5)},c=rt(`${r}_ANSWER`,n.answerLocation),p=ee(`${r}_PANO_LAT`)&&ee(`${r}_PANO_LNG`)&&ee(`${r}_ANSWER_LAT`)&&ee(`${r}_ANSWER_LNG`);return p||(e=!0),{...n,title:a,streetViewPanoId:s,streetViewLocation:l,streetViewPov:d,answerLocation:c,hasCustomCoordinates:p}}),usingFallbackCoordinates:e}}function rt(e,t){return{lat:de(`${e}_LAT`,t.lat),lng:de(`${e}_LNG`,t.lng)}}function ee(e){return Vt(e)!==null}function de(e,t){const n=Vt(e);return n===null?t:n}function at(e,t){return xt(e)||t}const ei={lat:55.6761,lng:12.5683},st={lat:55.6761,lng:12.5683},I=[{km:0,points:5e3},{km:1,points:4700},{km:5,points:3900},{km:25,points:2500},{km:100,points:1200},{km:500,points:450},{km:2e4,points:250}],ti=1500,Ut=[120,420,780],lt={heading:34,pitch:5},ni=320,ue="https://ask-johan-api.onrender.com".replace(/\/$/,""),oi="/api/geojohan/maps-key",Te={address:{glyph:"🏠"},work:{glyph:"💼"},school:{glyph:"🎓"}};let q=null,ct=0;const ii=560,A={AUTH:"GEOJOHAN_AUTH_FAILED",MAPS_KEY_UNAVAILABLE:"GEOJOHAN_MAPS_KEY_UNAVAILABLE",MAPS_KEY_REQUEST_FAILED:"GEOJOHAN_MAPS_KEY_REQUEST_FAILED",MAPS_SCRIPT_LOAD_FAILED:"GEOJOHAN_MAPS_SCRIPT_LOAD_FAILED"};function ri({t:e}){return`
    <main class="page-stack">
      ${Ve({t:e})}
    </main>
  `}function Ve({t:e}){return`
    <section class="content-section section-reveal geojohan-page" id="geojohan-root">
      <div class="geojohan-page-header">
        <h2 class="section-title geojohan-page-title">${e.geojohan.title}</h2>
        <p class="section-body geojohan-page-intro">${e.geojohan.intro}</p>
      </div>

      <div class="geojohan-shell" id="geojohan-shell">
        <header class="geojohan-header">
          <h3 class="section-title geojohan-round-title" id="geojohan-round-title"></h3>
          <p class="geojohan-progress" id="geojohan-progress"></p>
          <p class="geojohan-config-note" id="geojohan-config-note"></p>
        </header>

        <div class="geojohan-stage">
          <div class="geojohan-panorama" id="geojohan-panorama" aria-label="${e.geojohan.panoramaAria}"></div>
          <div class="geojohan-map-panel">
            <div class="geojohan-map" id="geojohan-map" aria-label="${e.geojohan.mapAria}"></div>
            <div class="geojohan-map-actions">
              <button class="projects-cta geojohan-primary-action is-hidden" id="geojohan-guess" type="button" disabled>
                ${e.geojohan.guessAction}
              </button>
              <button class="projects-cta geojohan-primary-action is-hidden" id="geojohan-continue" type="button" disabled>
                ${e.geojohan.continueAction}
              </button>
            </div>
          </div>
        </div>

        <div class="geojohan-status-row">
          <p class="geojohan-feedback" id="geojohan-feedback">${e.geojohan.loading}</p>
          <p class="geojohan-running-score" id="geojohan-running-score"></p>
        </div>

        <section class="geojohan-summary" id="geojohan-summary" aria-live="polite">
          <h3 class="section-title">${e.geojohan.summaryTitle}</h3>
          <div class="geojohan-summary-list" id="geojohan-summary-list"></div>
          <p class="section-body geojohan-total" id="geojohan-total"></p>
          <div class="geojohan-actions">
            <button class="projects-cta" id="geojohan-replay" type="button">${e.geojohan.playAgain}</button>
          </div>
        </section>
      </div>
    </section>
  `}function Gt({t:e,language:t="en"}){const n=document.querySelector("#geojohan-root");if(!n)return;const o=++ct,i=Zo(),r=li();if(!r)return;const a={roundIndex:0,phase:"loading",guessLatLng:null,totalScore:0,roundResults:[],rounds:i.rounds,maps:null,map:null,panorama:null,streetViewService:null,guessMarker:null,answerMarker:null,guessLine:null,mapClickListener:null,viewportTimers:[],summaryTransitionTimer:null},s=()=>o===ct&&n.isConnected;r.guessBtn.addEventListener("click",()=>{s()&&ui(a,r,e)}),r.continueBtn.addEventListener("click",()=>{s()&&pi(a,r,e,t)}),r.replayBtn.addEventListener("click",()=>{s()&&fi(a,r,e)}),i.usingFallbackCoordinates&&(r.configNote.textContent=e.geojohan.demoCoordinatesNote),ai().then(l=>Ti(l)).then(async l=>{s()&&(a.maps=l,a.streetViewService=new l.StreetViewService,await Ue(a,r,e))}).catch(l=>{if(!s())return;const{message:d,hint:c}=si(l,e);r.feedback.textContent=c?`${d} ${c}`:d,Y(r,"hidden"),console.warn("GeoJohan initialization failed:",l?.code||l?.message||l)})}async function ai(){if(!ue)throw $(A.MAPS_KEY_REQUEST_FAILED,"VITE_API_BASE_URL is not configured.");let e="";try{e=await Kn()}catch(i){const r=i instanceof Error?i.message:"Unable to authenticate GeoJohan maps request.",a=/access code is required/i.test(r);throw $(a?A.AUTH:A.MAPS_KEY_REQUEST_FAILED,r)}let t;try{t=await fetch(`${ue}${oi}`,{headers:{Authorization:`Bearer ${e}`}})}catch(i){throw $(A.MAPS_KEY_REQUEST_FAILED,i instanceof Error?i.message:"GeoJohan maps key request failed.")}if(!t.ok)throw t.status===401?$(A.AUTH,"GeoJohan maps key request requires valid authentication."):t.status===503?$(A.MAPS_KEY_UNAVAILABLE,"GeoJohan maps key is unavailable in the API response."):$(A.MAPS_KEY_REQUEST_FAILED,`GeoJohan maps key request failed (${t.status}).`);const n=await t.json(),o=typeof n?.mapsApiKey=="string"?n.mapsApiKey.trim():"";if(!o)throw $(A.MAPS_KEY_UNAVAILABLE,"GeoJohan maps key is missing in response.");return o}function $(e,t){const n=new Error(t);return n.code=e,n}function si(e,t){return e?.code===A.AUTH?{message:t.geojohan.authError||t.geojohan.loadError,hint:t.geojohan.authErrorHint||""}:e?.code===A.MAPS_KEY_UNAVAILABLE?{message:t.geojohan.missingKey,hint:t.geojohan.missingKeyHint||""}:e?.code===A.MAPS_KEY_REQUEST_FAILED?{message:t.geojohan.apiError||t.geojohan.loadError,hint:t.geojohan.apiErrorHint||""}:{message:ue?t.geojohan.loadError:t.geojohan.missingKey,hint:ue?t.geojohan.loadErrorHint||"":t.geojohan.missingKeyHint||""}}function li(){const e=document.querySelector("#geojohan-root"),t=document.querySelector("#geojohan-shell"),n=document.querySelector("#geojohan-progress"),o=document.querySelector("#geojohan-round-title"),i=document.querySelector("#geojohan-running-score"),r=document.querySelector("#geojohan-config-note"),a=document.querySelector("#geojohan-panorama"),s=document.querySelector(".geojohan-stage"),l=document.querySelector("#geojohan-map"),d=document.querySelector("#geojohan-feedback"),c=document.querySelector("#geojohan-guess"),p=document.querySelector("#geojohan-continue"),g=document.querySelector("#geojohan-summary"),v=document.querySelector("#geojohan-total"),u=document.querySelector("#geojohan-summary-list"),m=document.querySelector("#geojohan-replay");return!e||!t||!n||!o||!i||!r||!a||!s||!l||!d||!c||!p||!g||!v||!u||!m?null:{root:e,shell:t,progress:n,roundTitle:o,runningScore:i,configNote:r,panoramaEl:a,stageEl:s,mapEl:l,feedback:d,guessBtn:c,continueBtn:p,summary:g,total:v,summaryList:u,replayBtn:m}}async function Ue(e,t,n){const o=e.rounds[e.roundIndex],i=t.shell.classList.contains("is-reviewing-result");Je(e),Fe(e),e.phase="loading",e.guessLatLng=null,t.root.classList.remove("is-finishing-results","is-results-view"),t.shell.classList.remove("is-finishing-summary"),t.shell.classList.remove("is-finished"),Ge(t,!1),t.summary.classList.remove("is-visible"),t.progress.textContent=`${n.geojohan.progressLabel} ${e.roundIndex+1}/${e.rounds.length}`,t.roundTitle.textContent=Le(o,n),t.runningScore.textContent=`${n.geojohan.currentTotalLabel}: ${e.totalScore}`,t.feedback.textContent=n.geojohan.loadingRound,Y(t,"hidden"),await Si(t,i);const r=await ci(e,t,o);e.phase="guessing",t.feedback.textContent=r?n.geojohan.roundReady:n.geojohan.streetViewFallback,Jt(e,o)}async function ci(e,t,n){const o=e.maps,i=n.answerLocation||ei,r=String(n.streetViewPanoId||"").trim(),a=Ai(n.streetViewPov);e.map?(e.map.setCenter(i),e.map.setZoom(11)):e.map=new o.Map(t.mapEl,{center:i,zoom:11,disableDefaultUI:!0,gestureHandling:"greedy"}),e.mapClickListener&&(e.mapClickListener.remove(),e.mapClickListener=null),e.mapClickListener=e.map.addListener("click",c=>{e.phase==="guessing"&&(e.guessLatLng={lat:c.latLng.lat(),lng:c.latLng.lng()},e.guessMarker?(e.guessMarker.setPosition(e.guessLatLng),e.guessMarker.setMap(e.map)):e.guessMarker=new o.Marker({map:e.map,position:e.guessLatLng}),Y(t,"guess"))});const s=r?null:await yi(e,n.streetViewLocation),l=s?.position||n.streetViewLocation||st;e.panorama&&e.panorama.setVisible(!1),t.panoramaEl.innerHTML="",e.panorama=new o.StreetViewPanorama(t.panoramaEl,{...r?{pano:r}:{},position:l,pov:a,zoom:1,disableDefaultUI:!0,addressControl:!1,fullscreenControl:!1,keyboardShortcuts:!1,clickToGo:!1,linksControl:!1,showRoadLabels:!1}),Ei(e,l),e.panorama.setPov(a),e.panorama.setVisible(!0);let d=!1;return e.panorama.addListener("status_changed",()=>{if(d||!e.panorama)return;const c=e.panorama.getStatus?.();(c===o.StreetViewStatus.ZERO_RESULTS||c===o.StreetViewStatus.UNKNOWN_ERROR)&&(d=!0,e.panorama.setPosition(st))}),ki(e,l,r),di(e),!!(r||s)}function di(e){e.guessMarker&&e.guessMarker.setMap(null),e.answerMarker&&e.answerMarker.setMap(null),e.guessLine&&e.guessLine.setMap(null),e.guessMarker=null,e.answerMarker=null,e.guessLine=null}function ui(e,t,n){if(e.phase!=="guessing"||!e.guessLatLng)return;const o=e.rounds[e.roundIndex],i=Ft(e.guessLatLng,o.answerLocation),r=bi(i);e.phase="submitted",e.totalScore+=r,e.roundResults[e.roundIndex]={roundId:o.roundId,title:Le(o,n),distanceKm:i,points:r},t.feedback.textContent=`${n.geojohan.distanceLabel}: ${qt(i)} · ${n.geojohan.pointsLabel}: ${r}`,t.runningScore.textContent=`${n.geojohan.currentTotalLabel}: ${e.totalScore}`,Y(t,"continue"),Ge(t,!0);const a=e.maps,s=wi(a,o.roundId);e.answerMarker=new a.Marker({map:e.map,position:o.answerLocation,title:Le(o,n),icon:s.icon}),e.guessLine=new a.Polyline({map:e.map,path:[e.guessLatLng,o.answerLocation],strokeOpacity:.9,strokeWeight:3});const l=new a.LatLngBounds;l.extend(e.guessLatLng),l.extend(o.answerLocation),e.map.fitBounds(l,60),Fe(e),Jt(e,o)}function pi(e,t,n,o){if(e.phase==="submitted"){if(e.roundIndex>=e.rounds.length-1){mi(e,t,n,o);return}e.roundIndex+=1,Ue(e,t,n)}}function mi(e,t,n,o){Je(e),Fe(e),e.phase="finished",Y(t,"hidden"),Ge(t,!1);const i=e.rounds.length*I[0].points,r=n.geojohan.distanceFromGuessLabel||n.geojohan.distanceLabel;t.total.textContent=`${n.geojohan.totalScoreLabel}: ${e.totalScore}/${i}`,t.summaryList.innerHTML=e.roundResults.map(a=>{const s=gi(a.roundId,o,n),l=vi(a.roundId);return`
        <article class="project-card geojohan-summary-item">
          <h4 class="project-title">${l?`${l} `:""}${a.title}</h4>
          ${s?.address?`<p class="project-summary geojohan-summary-address">${s.address}</p>`:""}
          ${s?.context?`<p class="project-summary geojohan-summary-context">${s.context}</p>`:""}
          <p class="project-summary">${r}: ${qt(a.distanceKm)}</p>
          <p class="project-summary">${n.geojohan.pointsLabel}: ${a.points}</p>
        </article>
      `}).join(""),t.root.classList.add("is-finishing-results"),t.shell.classList.add("is-finishing-summary"),e.summaryTransitionTimer=window.setTimeout(()=>{t.root.classList.remove("is-finishing-results"),t.root.classList.add("is-results-view"),t.shell.classList.remove("is-finishing-summary"),t.shell.classList.add("is-finished"),t.summary.classList.add("is-visible"),e.summaryTransitionTimer=null},ni)}function fi(e,t,n){Je(e),e.roundIndex=0,e.phase="loading",e.guessLatLng=null,e.totalScore=0,e.roundResults=[],Ue(e,t,n)}function Y(e,t){const n=t==="guess",o=t==="continue";e.guessBtn.classList.toggle("is-visible",n),e.guessBtn.classList.toggle("is-hidden",!n),e.guessBtn.disabled=!n,e.continueBtn.classList.toggle("is-visible",o),e.continueBtn.classList.toggle("is-hidden",!o),e.continueBtn.disabled=!o}function Ge(e,t){e.shell.classList.toggle("is-reviewing-result",t)}function Le(e,t){return t?.geojohan?.roundTitles?.[e.roundId]||e.title}function gi(e,t,n){const o=hi(e);if(!o)return n?.geojohan?.summaryLocations?.[e]||null;const i=`VITE_GEOJOHAN_ROUND${o}_SUMMARY`,r=dt(`${i}_ADDRESS`),a=t==="dk"?`${i}_CONTEXT_DK`:`${i}_CONTEXT_EN`,s=dt(a),l=n?.geojohan?.summaryLocations?.[e]||null;return!r&&!s?l:{address:r||l?.address||"",context:s||l?.context||""}}function hi(e){return e==="address"?1:e==="work"?2:e==="school"?3:null}function vi(e){return Te[e]?.glyph||""}function dt(e){return xt(e)}function wi(e,t){const n=Te[t]||Te.address,o=64,i=o/2,a=`
    <svg xmlns="http://www.w3.org/2000/svg" width="${o}" height="${o}" viewBox="0 0 ${o} ${o}">
      <defs>
        <filter id="emoji-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="rgba(8,12,24,0.45)"/>
        </filter>
      </defs>
      <text
        x="${i}"
        y="${i}"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="42"
        filter="url(#emoji-shadow)"
      >${n.glyph}</text>
    </svg>
  `;return{icon:{url:`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(a)}`,scaledSize:new e.Size(o,o),anchor:new e.Point(i,i)}}}function Je(e){e.summaryTransitionTimer&&(window.clearTimeout(e.summaryTransitionTimer),e.summaryTransitionTimer=null)}function Jt(e,t){e.maps&&Ut.forEach(n=>{const o=window.setTimeout(()=>{if(e.map)if(e.maps.event.trigger(e.map,"resize"),e.phase==="submitted"&&e.guessLatLng&&t?.answerLocation){const i=new e.maps.LatLngBounds;i.extend(e.guessLatLng),i.extend(t.answerLocation),e.map.fitBounds(i,60)}else t?.answerLocation&&e.map.setCenter(t.answerLocation);e.panorama&&e.maps.event.trigger(e.panorama,"resize")},n);e.viewportTimers.push(o)})}function bi(e){if(e<=.025||e<=I[0].km)return I[0].points;for(let t=1;t<I.length;t+=1){const n=I[t-1],o=I[t];if(e<=o.km){const i=(e-n.km)/(o.km-n.km),r=n.points+(o.points-n.points)*i;return Math.round(r)}}return I[I.length-1].points}function Ft(e,t){const o=te(t.lat-e.lat),i=te(t.lng-e.lng),r=te(e.lat),a=te(t.lat),s=Math.sin(o/2)**2+Math.cos(r)*Math.cos(a)*Math.sin(i/2)**2;return 6371*(2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s)))}function te(e){return e*Math.PI/180}function qt(e){return e<1?`${(e*1e3).toFixed(0)} m`:`${e.toFixed(1)} km`}async function yi(e,t){if(!e.streetViewService||!e.maps)return{position:t,fromService:!1};const n=e.maps,o=await ut(e,t,n.StreetViewSource.OUTDOOR);if(o)return o;const i=await ut(e,t,n.StreetViewSource.DEFAULT);return i||null}async function ut(e,t,n){let o=null;try{o=await e.streetViewService.getPanorama({location:t,radius:ti,preference:e.maps.StreetViewPreference.NEAREST,source:n})}catch{return null}const i=o?.data?.location?.latLng;return i?{position:{lat:i.lat(),lng:i.lng()},fromService:!0}:null}function ki(e,t,n=""){!e.maps||!e.panorama||Ut.forEach(o=>{const i=window.setTimeout(()=>{!e.panorama||!e.maps||(e.panorama.setVisible(!0),n?e.panorama.setPano(n):t&&e.panorama.setPosition(t),e.maps.event.trigger(e.panorama,"resize"))},o);e.viewportTimers.push(i)})}function Fe(e){e.viewportTimers.length&&(e.viewportTimers.forEach(t=>{window.clearTimeout(t)}),e.viewportTimers=[])}function Si(e,t){return t?new Promise(n=>{let o=!1;const i=()=>{o||(o=!0,e.stageEl.removeEventListener("transitionend",r),n())},r=a=>{a.target===e.stageEl&&i()};e.stageEl.addEventListener("transitionend",r),window.setTimeout(i,ii)}):Promise.resolve()}function Ai(e){const t=Number(e?.heading),n=Number(e?.pitch);return{heading:Number.isFinite(t)?t:lt.heading,pitch:Number.isFinite(n)?n:lt.pitch}}function Ei(e,t){if(!e.panorama)return;const n=e.panorama,o=pt(t);if(!o)return;let i=!1;n.addListener("position_changed",()=>{if(i)return;const r=n.getPosition?.(),a=pt(r);a&&(Ft(a,o)*1e3<.5||(i=!0,n.setPosition(o),window.setTimeout(()=>{i=!1},0)))})}function pt(e){if(!e)return null;const t=typeof e.lat=="function"?e.lat():Number(e.lat),n=typeof e.lng=="function"?e.lng():Number(e.lng);return!Number.isFinite(t)||!Number.isFinite(n)?null:{lat:t,lng:n}}function Ti(e){return window.google?.maps?Promise.resolve(window.google.maps):q||(q=new Promise((t,n)=>{const o=`__geojohanMapsReady${Date.now()}`;window[o]=()=>{delete window[o],t(window.google.maps)};const i=document.createElement("script");i.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(e)}&callback=${o}&v=weekly`,i.async=!0,i.defer=!0,i.onerror=()=>{delete window[o],q=null,n($(A.MAPS_SCRIPT_LOAD_FAILED,"Google Maps failed to load"))},document.head.appendChild(i)}),q)}const Li=Object.freeze(Object.defineProperty({__proto__:null,mount:Gt,render:ri,renderGeoJohanSection:Ve},Symbol.toStringTag,{value:"Module"})),mt="https://ask-johan-api.onrender.com".replace(/\/$/,""),_i="/api/music-dashboard/snapshot",Ii=2e4,ji=600*1e3,Pi=Zi(void 0),$i=10*1e3,fe=["tracks","albums","artists"],Oi=6,Mi=6,Ri=3600,Ci=12e3,Ni=38,Di=2,M=3e3,Hi=140;let se=0,H=null,le=0,K=null,_e="";const qe=new WeakMap,pe=new Set;let ne=null;function xi({t:e}){return`
    <section class="content-section section-reveal spotify-dashboard" id="spotify-dashboard-root" aria-live="polite">
      <header class="spotify-dashboard-header">
        <h3 class="section-title">${e.spotifyDashboard.title}</h3>
        <p class="section-body spotify-dashboard-intro">${e.spotifyDashboard.intro}</p>
      </header>
      <div class="spotify-dashboard-shell" id="spotify-dashboard-shell"></div>
    </section>
  `}function Vi({t:e}){const t=document.querySelector("#spotify-dashboard-root"),n=document.querySelector("#spotify-dashboard-shell");if(!t||!n)return;ne?.(),Bt(),j();let o=!1,i=0,r=null;const a={t:e,status:"loading",activeView:"tracks",snapshot:null,lists:{tracks:[],albums:[],artists:[]},message:"",retryAfterSeconds:0},s=()=>{o||(o=!0,i&&(window.clearTimeout(i),i=0),window.removeEventListener("resize",l),r&&(r.disconnect(),r=null),ne===s&&(ne=null))},l=()=>{if(!o){if(!t.isConnected||!n.isConnected){s();return}i&&window.clearTimeout(i),i=window.setTimeout(()=>{if(i=0,!(o||a.status!=="ready")){if(!t.isConnected||!n.isConnected){s();return}Wt(n)}},Hi)}};ne=s,n.addEventListener("click",d=>{const c=d.target.closest("button[data-action]");if(!c)return;const p=c.dataset.action;if(p==="retry-snapshot"){Ie(a,n,{refresh:!1});return}if(p==="set-view"){const g=String(c.dataset.view||"");fe.includes(g)&&(j(),a.activeView=g,R(a,n));return}p==="toggle-preview"&&Ki(c)}),window.addEventListener("resize",l,{passive:!0}),typeof ResizeObserver<"u"&&(r=new ResizeObserver(()=>{l()}),r.observe(t),r.observe(n)),Ie(a,n,{refresh:!1}),Ui(a,n,t,s)}function Ui(e,t,n,o=()=>{}){se=window.setInterval(()=>{if(!n.isConnected||!t.isConnected){Bt(),j(),o();return}Ie(e,t,{refresh:!0,suppressLoading:!0})},Pi)}function Bt(){se&&(window.clearInterval(se),se=0)}async function Ie(e,t,{refresh:n=!1,suppressLoading:o=!1}){const i=!!e.snapshot&&e.status==="ready",r=o&&i;if(r||(e.status="loading",e.message="",e.retryAfterSeconds=0,R(e,t)),!mt){if(r)return;e.status="error",e.message=e.t.spotifyDashboard.apiBaseMissing,R(e,t);return}const s=`${mt}${_i}${n?"?refresh=true":""}`;let l;try{l=await Xi(s,{method:"GET"})}catch{if(r)return;e.status="error",e.message=e.t.spotifyDashboard.networkError,R(e,t);return}const d=await Qi(l);if(l.status===429){if(r)return;e.status="error",e.retryAfterSeconds=Number(d?.retryAfterSeconds||0),e.message=ft(d?.message,e.t.spotifyDashboard.rateLimited),R(e,t);return}if(!l.ok){if(r)return;e.status="error",e.message=ft(d?.message,e.t.spotifyDashboard.loadError),R(e,t);return}try{const c=zi(d);e.snapshot=c,e.lists=c.lists,fe.includes(e.activeView)||(e.activeView="tracks"),e.status="ready"}catch{if(r)return;e.status="error",e.message=e.t.spotifyDashboard.invalidPayload}R(e,t)}function R(e,t){if(Wi(),j(),e.status==="loading"){t.innerHTML=`
      <article class="spotify-dashboard-state-card">
        <p class="spotify-dashboard-status">${e.t.spotifyDashboard.loading}</p>
      </article>
    `;return}if(e.status==="error"){const n=e.retryAfterSeconds>0?`<p class="spotify-dashboard-status">${e.t.spotifyDashboard.retryAfter}: ${e.retryAfterSeconds}s</p>`:"";t.innerHTML=`
      <article class="spotify-dashboard-state-card">
        <h4 class="section-title spotify-dashboard-state-title">${e.t.spotifyDashboard.errorTitle}</h4>
        <p class="section-body spotify-dashboard-state-body">${E(e.message||e.t.spotifyDashboard.loadError)}</p>
        ${n}
        <div class="spotify-dashboard-actions">
          <button class="projects-cta" type="button" data-action="retry-snapshot">${e.t.spotifyDashboard.retryCta}</button>
        </div>
      </article>
    `;return}t.innerHTML=Gi(e),Wt(t)}function Gi(e){const t=Array.isArray(e.lists[e.activeView])?e.lists[e.activeView]:[],n=qi(t,e.t),o=Yi(e.snapshot?.snapshotTimestamp),i=`${e.t.spotifyDashboard.lastUpdated}: ${o} - ${e.t.spotifyDashboard.autoRefreshNote}`,r=e.snapshot?.periodFallbackUsed?`<p class="spotify-dashboard-status">${e.t.spotifyDashboard.weekFallback}</p>`:"";return`
    <div class="spotify-dashboard-ready">
      <div class="spotify-dashboard-controls">
        <div class="spotify-dashboard-tabs" role="tablist" aria-label="${e.t.spotifyDashboard.switchLabel}">
          ${Ji(e.activeView,e.t)}
        </div>
      </div>

      <div class="spotify-dashboard-grid">
        ${n.join("")}
      </div>

      <div class="spotify-dashboard-footer">
        <div class="spotify-dashboard-meta">
          <p class="spotify-dashboard-updated">${i}</p>
          ${r}
        </div>
      </div>
    </div>
  `}function Ji(e,t){const n={tracks:t.spotifyDashboard.tabs.tracks,albums:t.spotifyDashboard.tabs.albums,artists:t.spotifyDashboard.tabs.artists};return`
    <div class="spotify-dashboard-view-toggle is-${e}">
      <span class="spotify-dashboard-view-indicator" aria-hidden="true"></span>
      ${fe.map(o=>Fi(o,e,n)).join("")}
    </div>
  `}function Fi(e,t,n){const o=e===t;return`
    <button
      class="spotify-dashboard-view-option${o?" is-active":""}"
      type="button"
      role="tab"
      aria-selected="${o}"
      data-action="set-view"
      data-view="${e}"
    >
      ${n[e]}
    </button>
  `}function qi(e,t){const n=[];for(let o=0;o<Oi;o+=1){const i=e[o];if(!i){n.push(`
        <article class="project-card spotify-dashboard-card is-placeholder">
          <div class="spotify-dashboard-image spotify-dashboard-image-placeholder" aria-hidden="true"></div>
          <h4 class="project-title">${t.spotifyDashboard.emptyTitle}</h4>
          <p class="project-summary">${t.spotifyDashboard.emptySlot}</p>
        </article>
      `);continue}const r=E(i.title),a=E(i.subtitle),s=Number(i.playCount||0),l=String(i.previewUrl||"").trim(),d=!!l,c=`${s} ${s===1?t.spotifyDashboard.playSingle:t.spotifyDashboard.playPlural}`,p=`#${o+1} ${t.spotifyDashboard.rankWith} ${c}`,g=i.imageUrl?`<img class="spotify-dashboard-image" src="${E(i.imageUrl)}" alt="${r}" loading="lazy" />`:'<div class="spotify-dashboard-image spotify-dashboard-image-placeholder" aria-hidden="true"></div>',v=d?`
          <button
            class="spotify-dashboard-preview-button"
            type="button"
            data-action="toggle-preview"
            data-preview-url="${E(l)}"
            data-preview-card-id="${E(String(i.id||`${o}`))}"
            data-label-play="${E(t.spotifyDashboard.previewPlayLabel)}"
            data-label-stop="${E(t.spotifyDashboard.previewStopLabel)}"
            aria-label="${E(t.spotifyDashboard.previewPlayLabel)}"
            aria-pressed="false"
          >
            <span class="spotify-dashboard-preview-icon" aria-hidden="true"></span>
          </button>
        `:"",u=`
      <div class="spotify-dashboard-media">
        ${g}
        ${v}
      </div>
    `,m=i.spotifyUrl?`
          <a class="spotify-dashboard-link spotify-dashboard-marquee" href="${E(i.spotifyUrl)}" target="_blank" rel="noopener noreferrer">
            <span class="spotify-dashboard-marquee-track">${r}</span>
          </a>
        `:`
          <span class="spotify-dashboard-marquee">
            <span class="spotify-dashboard-marquee-track">${r}</span>
          </span>
        `;n.push(`
      <article class="project-card spotify-dashboard-card">
        ${u}
        <div class="spotify-dashboard-card-body">
          <h4 class="project-title spotify-dashboard-card-title">${m}</h4>
          <div class="spotify-dashboard-card-meta">
            <p class="project-summary spotify-dashboard-card-subtitle">
              <span class="spotify-dashboard-marquee">
                <span class="spotify-dashboard-marquee-track">${a}</span>
              </span>
            </p>
            <p class="spotify-dashboard-rank-line">${E(p)}</p>
          </div>
        </div>
      </article>
    `)}return n}function Wt(e){const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;e.querySelectorAll(".spotify-dashboard-marquee").forEach(o=>{const i=o.querySelector(".spotify-dashboard-marquee-track");if(!i)return;Kt(i),o.classList.remove("is-overflowing"),o.classList.remove("is-moving");const r=Math.ceil(i.scrollWidth-o.clientWidth);if(r<=Mi||t)return;const s=Math.min(Ci,Math.max(Ri,Math.round(r/Ni*1e3)))*Di;Bi(o,i,r,s)&&o.classList.add("is-overflowing")})}function Bi(e,t,n,o){if(typeof t.animate!="function")return!1;const i=o*2+M*2,r=M/i,a=(M+o)/i,s=(M+o+M)/i,l=t.animate([{transform:"translateX(0)",offset:0},{transform:"translateX(0)",offset:r},{transform:`translateX(-${n}px)`,offset:a},{transform:`translateX(-${n}px)`,offset:s},{transform:"translateX(0)",offset:1}],{duration:i,easing:"linear",iterations:Number.POSITIVE_INFINITY,fill:"both"}),d=M,c=d+o,p=c+M,g=i,v={marqueeEl:e,trackEl:t,animation:l,rafId:0},u=()=>{if(!t.isConnected||!e.isConnected){Kt(t);return}const w=(Number(l.currentTime||0)%i+i)%i,f=w>d&&w<c||w>p&&w<g;e.classList.toggle("is-moving",f),v.rafId=window.requestAnimationFrame(u)};return qe.set(t,v),pe.add(v),u(),!0}function Kt(e){const t=qe.get(e);t&&zt(t)}function Wi(){if(!pe.size)return;[...pe].forEach(t=>{zt(t)})}function zt(e){e&&(e.rafId&&(window.cancelAnimationFrame(e.rafId),e.rafId=0),e.animation?.cancel(),e.marqueeEl?.classList.remove("is-moving"),e.trackEl.style.transform="",qe.delete(e.trackEl),pe.delete(e))}async function Ki(e){const t=String(e.dataset.previewUrl||"").trim(),n=String(e.dataset.previewCardId||"").trim();if(!t||!n)return;if(H&&_e===n){j();return}j();const o=new Audio(t);H=o,_e=n,K=e,Yt(e,!0),o.addEventListener("ended",()=>{j()},{once:!0});try{await o.play()}catch{j();return}le=window.setTimeout(()=>{j()},$i)}function j(){le&&(window.clearTimeout(le),le=0),H&&(H.pause(),H.currentTime=0,H=null),K&&K.isConnected&&Yt(K,!1),K=null,_e=""}function Yt(e,t){const n=String(e.dataset.labelPlay||"Play preview"),o=String(e.dataset.labelStop||"Stop preview");e.classList.toggle("is-playing",t),e.setAttribute("aria-pressed",String(t)),e.setAttribute("aria-label",t?o:n)}function zi(e){if(!e||typeof e!="object")throw new Error("Snapshot payload is invalid.");const t=e.lists;if(!t||typeof t!="object")throw new Error("Snapshot payload is missing lists.");for(const n of fe)if(!Array.isArray(t[n]))throw new Error(`Snapshot payload is missing ${n} list.`);return{snapshotTimestamp:e.snapshotTimestamp,periodFallbackUsed:!!e.periodFallbackUsed,lists:{tracks:t.tracks,albums:t.albums,artists:t.artists}}}function ft(e,t){return String(e||"").trim()||t}function Yi(e){const t=String(e||"").trim();if(!t)return"N/A";const n=new Date(t);return Number.isNaN(n.getTime())?"N/A":new Intl.DateTimeFormat(void 0,{dateStyle:"medium",timeStyle:"short"}).format(n)}async function Xi(e,t){const n=new AbortController,o=window.setTimeout(()=>n.abort(),Ii);try{return await fetch(e,{...t,signal:n.signal})}finally{window.clearTimeout(o)}}async function Qi(e){try{return await e.json()}catch{return null}}function E(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Zi(e){const t=Number(e);return!Number.isFinite(t)||t<1e4?ji:Math.floor(t)}function er({t:e}){return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="playground">
        <h2 class="section-title">${e.playground.title}</h2>
        <p class="section-body">${e.playground.intro}</p>
      </section>

      ${Pt({t:e})}
      ${Ve({t:e})}
      ${xi({t:e})}

      <section class="content-section section-reveal" id="playground-more">
        <h3 class="section-title">${e.playground.moreToComeTitle}</h3>
        <p class="section-body">${e.playground.moreToComeBody}</p>
      </section>
    </main>
  `}function tr({language:e,t}){$t(e),Gt({t}),Vi({t})}const gt=Object.freeze(Object.defineProperty({__proto__:null,mount:tr,render:er},Symbol.toStringTag,{value:"Module"}));function nr(e){return`<div class="page-transition-enter">${e}</div>`}const we={"/":Io,"/projects":Dt,"/resume":Fo,"/contact":Xo,"/playground":gt,"/quiz":gt,"/quiz/geojohan":Li},je="/",or=500,ht="/projects/",ir={"/files":"/resume"};function Xt(e){const t=e.startsWith("/")?e.slice(1):e;return`${je}${t}`}function vt(e=window.location.pathname){if(!e.startsWith(je))return"/";const t=e.slice(je.length-1)||"/";return t.length>1&&t.endsWith("/")?t.slice(0,-1):t}function rr({mountEl:e,renderFrame:t,pageContext:n,onRouteChange:o}){let i=!1;const r=()=>{const s=vt(),l=ir[s]||s,d=sr(l),c=n(l);s!==l&&history.replaceState({},"",Xt(l)),e.innerHTML=nr(d.render(c)),d.mount&&d.mount(c),o(l),requestAnimationFrame(()=>{const p=e.querySelector(".page-transition-enter");p&&p.classList.add("is-visible")})},a=()=>{if(i)return;i=!0;const s=e.querySelector(".page-transition-enter");if(!s){r(),i=!1;return}s.classList.remove("is-visible"),s.classList.add("is-exiting"),window.setTimeout(()=>{r(),i=!1},or)};return document.addEventListener("click",s=>{const l=s.target.closest("[data-link]");if(!l)return;const d=l.getAttribute("href");!d||!d.startsWith("/")||(s.preventDefault(),d!==vt()&&ar(d,a))}),window.addEventListener("popstate",a),t(r),{refresh:a}}function ar(e,t){history.pushState({},"",Xt(e)),t()}function sr(e){return we[e]?we[e]:e.startsWith(ht)&&e.length>ht.length?Dt:we["/"]}$r();const lr=document.querySelector("#app");lr.innerHTML=`
  <div id="welcome-root"></div>
  <div class="site-shell" id="site-shell">
    <div id="nav-root"></div>
    <div id="page-root"></div>
    <div id="footer-root"></div>
  </div>
  <div id="overlay-root" class="overlay-root"></div>
  <div id="scroll-hint-root"></div>
`;const Be="johanscv.askJohanAccessCode",Qt="johanscv.siteAccessGranted",X="https://ask-johan-api.onrender.com".replace(/\/$/,""),cr="/auth/login",dr=1e4,wt=75e3,ur=1200,pr=9e3,bt=25e3,mr=1200,fr=500,gr=.2,hr=620,vr=10,yt=340,wr=120,br=140,yr="button-light-host",be="is-button-lit",kr=[".welcome-button",".scroll-hint",".nav-link",".toggle-pill",".lang-pill",".footer-links a",".footer-playground-link",".footer-info-button",".spotify-dashboard-preview-button",".projects-cta",".ask-button",".file-action"].join(", "),J=document.querySelector("#welcome-root"),Sr=document.querySelector("#nav-root"),Zt=document.querySelector("#page-root"),y=document.querySelector("#footer-root"),Ar=document.querySelector("#overlay-root"),en=document.querySelector("#scroll-hint-root");let Pe=!1,kt=!1,St=!1,$e=!1,tn=null,At=!1,ye=null,oe=0,Oe=null,Et=null,P=null,me=window.innerWidth,Me=!1,Tt=!1,k=null,ie=0;Jr();Er();async function Er(){const e=X?Tr():null;if(await xr()){on(),nn(e);return}e&&await Lr(),Hr()}function Tr(){const e=_(),t=F(e.language);J.innerHTML=$n({t}),document.body.classList.add("welcome-active");const n=J.querySelector(".welcome-screen");return window.requestAnimationFrame(()=>{n?.classList.add("is-visible")}),n}function nn(e=J.querySelector(".welcome-screen")){if(!e){Lt();return}e.classList.remove("is-visible"),e.classList.add("is-exiting"),window.setTimeout(Lt,fr)}function Lt(){J.innerHTML="",document.body.classList.remove("welcome-active")}async function Lr(){dn()||await _r()}async function _r(){const e=Date.now();let t=null;for(;Date.now()-e<bt;){const n=await jr();if(Ir(n))return n;t=n;const o=Date.now()-e,i=bt-o;if(i<=0)break;await mn(Math.min(mr,i))}return t||{ok:!1,status:0,reason:"timeout"}}function Ir(e){const t=Number(e?.status||0);return!!e?.ok||t>0&&t<500}async function jr(){try{const e=await fn(`${X}/health`,{method:"GET"},pr);return{ok:e.ok,status:e.status}}catch(e){return{ok:!1,status:0,reason:e?.name==="AbortError"?"timeout":"network"}}}function on(){$e||($e=!0,no(),tn=rr({mountEl:Zt,renderFrame:e=>{e(),Or()},pageContext:e=>{const t=_();return{t:F(t.language),language:t.language,route:e}},onRouteChange:e=>{He({route:e}),Ce(e),Pr(),z()}}),rn(),Mr(),Re(),Cr(),un(),Gr(),Ce(_().route),z())}function rn(){const e=_(),t=F(e.language);Sr.innerHTML=wn({route:e.route,t}),an(),sn()}function Re(){window.clearTimeout(Oe),x();const e=y.getBoundingClientRect().top;Number.isFinite(e)&&(P=e);const t=_(),n=F(t.language);y.innerHTML=_n({t:n,theme:t.theme,language:t.language}),Sn(()=>{Vr(),Re()}),En(()=>{Ur(),rn(),Ce(_().route),Re(),un(),z(),tn?.refresh()}),In(n,{overlayRoot:Ar}),ln()}function Pr(){const e=document.querySelectorAll(".section-reveal"),t=new IntersectionObserver(n=>{n.forEach(o=>{o.isIntersecting&&(o.target.classList.add("is-visible"),t.unobserve(o.target))})},{threshold:gr});e.forEach((n,o)=>{n.style.transitionDelay=`${Math.min(o*70,240)}ms`,t.observe(n)})}function $r(){const e=new URL(window.location.href),t=e.searchParams.get("p");if(!t)return;const n=decodeURIComponent(t),[o,i]=n.split("&q="),r=i?`?${decodeURIComponent(i)}`:"",a=`${o}${r}${e.hash}`;window.history.replaceState(null,"",a)}function Or(){if(kt)return;kt=!0;let e=window.scrollY,t=!1;const n=()=>{t||(t=!0,window.requestAnimationFrame(()=>{const o=window.scrollY,i=o-e;o<36||i<-8?Pe=!1:i>8&&(Pe=!0),e=o,an(),t=!1}))};window.addEventListener("scroll",n,{passive:!0})}function an(){const e=document.querySelector("#navbar");e&&e.classList.toggle("nav-hidden",Pe)}function Mr(){St||(St=!0,window.addEventListener("resize",()=>{window.requestAnimationFrame(sn)},{passive:!0}))}function sn(){const e=document.querySelector("#navbar .nav-main"),t=e?.querySelector(".nav-links-primary"),n=e?.querySelector(".nav-wordmark");if(!(t instanceof HTMLElement)||!(n instanceof HTMLElement))return;if(n.classList.remove("is-hidden"),window.innerWidth<=hr){n.classList.add("is-hidden");return}const o=t.querySelectorAll(".nav-link"),i=o.length?o[0].offsetTop:t.offsetTop,r=Array.from(o).some(d=>d.offsetTop>i+1),a=t.getBoundingClientRect(),s=n.getBoundingClientRect(),l=r||a.right+vr>=s.left;n.classList.toggle("is-hidden",l)}function Ce(e){document.querySelectorAll(".nav-link").forEach(n=>{const o=n.getAttribute("href");n.classList.toggle("active",Rr(o,e))})}function Rr(e,t){return!e||!t?!1:e==="/"?t==="/":t===e||t.startsWith(`${e}/`)}function Cr(){ye||typeof ResizeObserver>"u"||(P=y.getBoundingClientRect().top,me=window.innerWidth,ye=new ResizeObserver(()=>{ln()}),ye.observe(Zt),window.addEventListener("resize",Nr,{passive:!0}))}function Nr(){Me=!0,window.clearTimeout(Et),x(),me=window.innerWidth;const e=y.getBoundingClientRect().top;Number.isFinite(e)&&(P=e),Et=window.setTimeout(()=>{Me=!1;const t=y.getBoundingClientRect().top;Number.isFinite(t)&&(P=t)},br)}function ln(){oe&&window.cancelAnimationFrame(oe),oe=window.requestAnimationFrame(()=>{oe=0,Dr()})}function Dr(){const e=y.getBoundingClientRect().top;if(!Number.isFinite(e))return;if(window.innerWidth!==me||Me){me=window.innerWidth,P=e,x();return}if(P===null){P=e;return}const t=P-e;if(P=e,Math.abs(t)<1){x();return}if(Math.abs(t)>wr){x();return}window.clearTimeout(Oe),y.style.transition="none",y.style.transform=`translateY(${t}px)`,y.style.willChange="transform",y.offsetHeight,window.requestAnimationFrame(()=>{y.style.transition=`transform ${yt}ms var(--ease-standard)`,y.style.transform="translateY(0)",Oe=window.setTimeout(x,yt+50)})}function x(){y.style.transition="",y.style.transform="",y.style.willChange=""}function Hr(){const e=_(),t=F(e.language);J.innerHTML=Pn({t}),document.body.classList.add("welcome-active");const n=J.querySelector(".welcome-screen");window.requestAnimationFrame(()=>{n?.classList.add("is-visible")}),On(async o=>{const i=await cn(o);return i?.ok?(localStorage.setItem(Be,o),localStorage.setItem(Qt,"true"),on(),nn(n),{ok:!0}):{ok:!1,message:Wr(t,i)}},{t,apiMode:!!X})}async function cn(e){return e?X?Fr(e):{ok:!0,status:200}:{ok:!1,status:400}}async function xr(){if(!dn())return!1;const e=localStorage.getItem(Be)?.trim()||"";return!!(await cn(e))?.ok}function dn(){const e=localStorage.getItem(Qt)==="true",t=localStorage.getItem(Be)?.trim()||"";return e&&!!t}function F(e){return We[e]||We.en}function Vr(){const e=_().theme;He({theme:e==="dark"?"light":"dark"})}function Ur(){const e=_().language;He({language:e==="en"?"dk":"en"})}function un(){const e=_(),t=F(e.language),n=pn()?" is-hidden":"";en.innerHTML=`
    <button id="scroll-hint" class="scroll-hint${n}" type="button" aria-label="${t.scrollHint.label}">
      <span class="scroll-hint-text">${t.scrollHint.label}</span>
      <span class="scroll-hint-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M12 6v12" />
          <path d="m7.5 13.5 4.5 4.5 4.5-4.5" />
        </svg>
      </span>
    </button>
  `}function Gr(){At||(At=!0,en.addEventListener("click",e=>{e.target.closest("#scroll-hint")&&window.scrollBy({top:Math.max(window.innerHeight*.92,240),behavior:"smooth"})}),window.addEventListener("scroll",z,{passive:!0}),window.addEventListener("resize",z))}function z(){const e=document.querySelector("#scroll-hint");e&&e.classList.toggle("is-hidden",pn())}function pn(){const e=document.documentElement,t=Math.max(0,e.scrollHeight-window.innerHeight),n=t>24,o=window.scrollY>=t-28;return!$e||!n||o}function Jr(){if(Tt)return;Tt=!0;const e=window.matchMedia("(prefers-reduced-motion: reduce)"),t=window.matchMedia("(pointer: fine)"),n=window.matchMedia("(hover: hover)");let o=!1,i=window.innerWidth/2,r=window.innerHeight/2;const a=()=>{ie&&(window.clearTimeout(ie),ie=0)},s=({immediate:u=!1}={})=>{a();const m=()=>{ie=0,k instanceof HTMLElement&&k.classList.remove(be),k=null};{m();return}},l=(u,m,w)=>{if(!(u instanceof HTMLElement)||!document.documentElement.contains(u))return!1;const f=u.getBoundingClientRect();if(!Number.isFinite(f.width)||!Number.isFinite(f.height)||f.width<2||f.height<2)return!1;const S=Math.min(Math.max(m-f.left,0),f.width),b=Math.min(Math.max(w-f.top,0),f.height),O=f.width>0?S/f.width:.5,h=f.height>0?b/f.height:.5,T=Math.min(S,f.width-S,b,f.height-b),gn=.56+Math.max(0,Math.min(1,T/Math.max(Math.min(f.width,f.height)*.5,1)))*.44;return u.style.setProperty("--button-light-x",`${S}px`),u.style.setProperty("--button-light-y",`${b}px`),u.style.setProperty("--button-light-tilt-x",`${((.5-h)*6).toFixed(2)}deg`),u.style.setProperty("--button-light-tilt-y",`${((O-.5)*6).toFixed(2)}deg`),u.style.setProperty("--button-light-intensity",gn.toFixed(3)),!0},d=u=>{u instanceof HTMLElement&&k!==u&&(k instanceof HTMLElement&&k.classList.remove(be),k=u,k.classList.add(yr),k.classList.add(be))},c=()=>{o=!e.matches&&t.matches&&n.matches,o||s({immediate:!0})},p=u=>{if(!o)return;i=u.clientX,r=u.clientY;const m=_t(u.target);if(!(m instanceof HTMLElement)){s({immediate:!0});return}a(),d(m),l(m,i,r)||s({immediate:!0})},g=()=>{o&&k instanceof HTMLElement&&(l(k,i,r)||s({immediate:!0}))},v=u=>{if(!o||!(k instanceof HTMLElement)||!(u.target instanceof Element)||!k.contains(u.target))return;const m=_t(u.relatedTarget);if(m!==k){if(m instanceof HTMLElement){i=u.clientX,r=u.clientY,a(),d(m),l(m,i,r)||s({immediate:!0});return}s({immediate:!0})}};window.addEventListener("pointermove",p,{passive:!0}),window.addEventListener("pointerout",v,!0),window.addEventListener("scroll",g,{passive:!0}),window.addEventListener("resize",g),document.documentElement.addEventListener("mouseleave",()=>s({immediate:!0})),window.addEventListener("blur",()=>s({immediate:!0})),ke(e,c),ke(t,c),ke(n,c),c()}function ke(e,t){if(typeof e.addEventListener=="function"){e.addEventListener("change",t);return}typeof e.addListener=="function"&&e.addListener(t)}function _t(e){if(!(e instanceof Element))return null;const t=e.closest(kr);return!(t instanceof HTMLElement)||t.matches(":disabled")||t.getAttribute("aria-disabled")==="true"?null:t}async function Fr(e){const t=Date.now();let n=null;for(;Date.now()-t<wt;){const o=await qr(e);if(!Br(o))return o;n=o;const i=Date.now()-t,r=wt-i;if(r<=0)break;await mn(Math.min(ur,r))}return n||{ok:!1,status:0,reason:"timeout"}}async function qr(e){try{const t=await fn(`${X}${cr}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accessCode:e})}),n=await Kr(t);return{ok:t.ok,status:t.status,answer:typeof n?.answer=="string"?n.answer.trim():""}}catch(t){return{ok:!1,status:0,reason:t?.name==="AbortError"?"timeout":"network"}}}function Br(e){const t=Number(e?.status||0);return t===0||t>=500}function mn(e){return new Promise(t=>{window.setTimeout(t,e)})}function Wr(e,t){const n=Number(t?.status||0);return n===0&&t?.reason==="timeout"?e.welcome.passwordColdStart||e.welcome.passwordNetwork||e.welcome.passwordError:n===401||n===400?e.welcome.passwordError:n===429?e.welcome.passwordRateLimited||e.welcome.passwordError:n===403?e.welcome.passwordForbidden||e.welcome.passwordError:n>=500?e.welcome.passwordUnavailable||e.welcome.passwordError:n===0&&e.welcome.passwordNetwork||e.welcome.passwordError}function fn(e,t,n=dr){const o=new AbortController,i=window.setTimeout(()=>o.abort(),n);return fetch(e,{...t,signal:o.signal}).finally(()=>{window.clearTimeout(i)})}async function Kr(e){try{return await e.json()}catch{return null}}
