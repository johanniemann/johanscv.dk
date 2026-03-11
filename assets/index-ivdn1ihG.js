(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();const an={nav:{home:"Home",projects:"Projects",files:"Resume",playground:"Get to know me",contact:"Contact"},hero:{name:"Johan Niemann Husbjerg",title:"IT Architecture student shaping precise, human-centered systems."},welcome:{title:"Welcome",intro:"This site is a focused overview of my architecture profile, practical experience, and current projects.",point1:"Explore projects and implementation work.",point2:"Review my full Resume / CV structure.",point3:"Use Ask Johan for quick context.",continue:"Continue",loggingIn:"Signing you in...",warmingUp:"Preparing secure access. Please wait a moment.",passwordLabel:"Site access code",passwordPlaceholder:"Enter site code",passwordError:"Invalid access code. Please try again.",passwordRateLimited:"Too many login attempts. Please wait a few minutes and try again.",passwordForbidden:"This site origin is not allowed right now. Please contact Johan.",passwordUnavailable:"Authentication service is temporarily unavailable. Please try again shortly.",passwordColdStart:"Authentication took too long to respond. Please try again.",passwordNetwork:"Could not reach authentication service. Check your connection and try again."},ask:{title:"Ask Johan",placeholder:"Ask about skills, projects, or architecture...",button:"Answer"},projects:{title:"Projects",intro:"Focused work in architecture, frontend systems, and product execution.",previewTitle:"Selected Work",previewIntro:"A snapshot of practical architecture and frontend execution.",cta:"View all projects",readMore:"Read more",backToProjects:"Back to projects",exploreOtherHeading:"Explore my other projects",detailKicker:"Project detail",detailHeading:"About this project",notFoundTitle:"Project not found",notFoundBody:"This project no longer exists or the link is invalid."},files:{title:"Resume",intro:"Education, experience, voluntary work, and qualifications."},fileScroller:{title:"Links and files",ariaLabel:"Links and files carousel"},resume:{previewTitle:"Resume Snapshot",previewIntro:"A structured view of my education, practical experience, and key competencies.",cta:"Open Resume / CV",downloadPdf:"Download Resume as PDF",downloadCertificate:"Download Certificate as PDF",education:"Education",experience:"Work Experience",voluntary:"Voluntary Work",qualifications:"Qualifications",itSkills:"Core IT Skills",personalQualities:"Personal Qualities"},contact:{title:"Contact",intro:"Reach out directly by email, phone, or LinkedIn.",emailLabel:"E-mail",phoneLabel:"Phone",linkedinLabel:"LinkedIn",copyEmail:"Copy e-mail",copyPhone:"Copy phonenumber",connectLinkedin:"Connect on LinkedIn",connectedLinkedin:"Connected",copied:"Copied",updates:{title:"Signup for updates",intro:"Get a short email when I publish a new project, update my Resume, or improve an interactive service.",infoButtonAria:"Open update signup details",infoKicker:"What you'll get",infoTitle:"Choose the updates you want",infoIntro:"Pick one or more topics. I only send an email when something relevant changes on the site.",infoPoints:["Projects: new launches, case studies, or major iterations on the projects page.","Resume: new role, new experience, certifications, or meaningful profile updates.","Interactive services: new features or clear improvements in Ask Johan, GeoJohan, or SpotiJohan.","Your first signup also triggers a short welcome email with a direct unsubscribe link."],infoClose:"Back to site",topicsLabel:"Choose updates",emailAriaLabel:"Email address",placeholder:"email@example.com",button:"Sign up",note:"Unsubscribe any time.",success:"You're signed up for updates.",topics:{projects:"Projects",resume:"Resume",interactive_services:"Interactive services"},topicDescriptions:{projects:"New case study, launch, or major iteration",resume:"New role, skill, certification, or experience",interactive_services:"New Ask Johan, GeoJohan, or SpotiJohan improvements"},errors:{invalidEmail:"Enter a valid email address.",noTopics:"Select at least one update type.",generic:"Unable to sign you up right now. Please try again shortly."}}},playground:{title:"Playground",intro:"Get to know Johan better through interactive services: Ask Johan, GeoJohan, and SpotiJohan.",quizHubTitle:"Service Hub",quizHubIntro:"Choose an experience. GeoJohan is a 3-round location guessing mini game.",cards:{askJohan:{title:"Ask Johan",subtitle:"Profile Q&A • instant answers • architecture context",cta:"Open Ask Johan"},cityQuiz:{title:"City Quiz",subtitle:"Timed city questions • visual clues • score chase",cta:"Coming soon"},geoJohan:{title:"GeoJohan",subtitle:"3 rounds • pan Street View • guess on map",cta:"Play GeoJohan"}},moreToComeTitle:"More To Come",moreToComeBody:"More experiments and interactive prototypes will be added here soon."},geojohan:{title:"GeoJohan",intro:"Pan around Street View, place your guess on the map, and score points across 3 rounds.",roundTitles:{address:"Where in Copenhagen do I live?",work:"Where in Copenhagen do I work?",school:"Where in Copenhagen do I study?"},panoramaAria:"Street View panorama",mapAria:"Guess map",loading:"Loading map and Street View...",loadingRound:"Preparing this round...",progressLabel:"Round",currentTotalLabel:"Current total",roundReady:"Place your guess on the map when ready.",streetViewFallback:"Street View is limited here. You can still guess on the map.",mapHint:"Click map to place your guess",guessPlacedHint:"Guess placed. Submit or move your pin.",guessAction:"Guess",continueAction:"Continue",guessAndContinue:"Guess and continue",submitGuess:"Submit guess",resetGuess:"Reset guess",nextRound:"Next round",finishRound:"Finish",summaryTitle:"GeoJohan results",summaryLocations:{address:{address:"",context:""},work:{address:"",context:""},school:{address:"",context:""}},totalScoreLabel:"Total score",distanceLabel:"Distance",distanceFromGuessLabel:"Distance from your guess",pointsLabel:"Points",playAgain:"Play GeoJohan again",backToQuiz:"Back to quiz",authError:"GeoJohan requires a valid site login.",authErrorHint:"Unlock the site with your access code and try again.",apiError:"GeoJohan could not reach the API right now.",apiErrorHint:"Check that the API is running and VITE_API_BASE_URL points to the correct backend.",missingKey:"GeoJohan maps key is unavailable right now.",missingKeyHint:"Set GEOJOHAN_MAPS_API_KEY in the API environment and restart the API.",loadError:"Google Maps failed to load. Please try again.",loadErrorHint:"Check API key restrictions, billing, and allowed referrers.",demoCoordinatesNote:"Using demo coordinates. Set VITE_GEOJOHAN_ROUND*_... vars in .env.local for your real rounds."},spotifyDashboard:{title:"SpotiJohan",intro:"Explore the music I've listened to the most this week.",tabs:{tracks:"Track",albums:"Album",artists:"Artist"},switchLabel:"Switch Spotify dashboard list",loading:"Loading Spotify dashboard...",refreshData:"Refresh dashboard",errorTitle:"Spotify dashboard unavailable",loadError:"Could not load Spotify dashboard right now. Please try again.",networkError:"Could not reach the API. Check that backend is running and try again.",apiBaseMissing:"VITE_API_BASE_URL is not configured for Spotify dashboard API calls.",invalidPayload:"Spotify dashboard response was invalid.",rateLimited:"Spotify is rate limiting requests. Please wait before retrying.",retryAfter:"Retry after",retryCta:"Retry",lastUpdated:"Updated",autoRefreshNote:"SpotiJohan updates automatically every 10 minutes",weekFallback:"No plays found in the last 7 days, so the latest available recent plays are shown.",emptyTitle:"Waiting for data",emptySlot:"No ranked item available yet.",rankWith:"with",playSingle:"play",playPlural:"plays",previewPlayLabel:"Play 10-second track preview",previewStopLabel:"Stop track preview"},scrollHint:{label:"Scroll for more"},footer:{builtWith:"Built with Vite, Tailwind, and custom JavaScript.",rights:"All rights reserved.",playground:"Get to know me",infoButtonAria:"Open website build information",infoKicker:"Behind the build",infoTitle:"How this site is built",infoIntro:"A quick overview of the live architecture powering johanscv.dk today.",infoPoints:["Frontend: Single-page app built with Vite and modular Vanilla JavaScript, styled with Tailwind + custom CSS.","Core UX: Client-side routing, animated page transitions, and global theme/language state shared across pages.","Feature modules: Ask Johan (AI chat), GeoJohan (Street View game), and SpotiJohan (music dashboard) are isolated in dedicated frontend modules.","Backend: Node.js + Express API on Azure App Service with layered modules for auth, Ask Johan, GeoJohan, and Spotify handlers.","Data + AI flow: Ask Johan calls OpenAI on the server (model via env), while GeoJohan Maps keys and Spotify snapshot data are served from protected API endpoints.","Security baseline: Access-code login -> JWT bearer token, strict CORS allowlist, JSON/body limits, per-IP rate limits, and daily usage caps."],infoClose:"Back to site"}},ln={nav:{home:"Hjem",projects:"Projekter",files:"CV",playground:"Lær mig at kende",contact:"Kontakt"},hero:{name:"Johan Niemann Husbjerg",title:"IT-arkitekturstuderende med fokus på præcise, menneskelige systemer."},welcome:{title:"Velkommen",intro:"Denne side giver et fokuseret overblik over min arkitekturprofil, praktiske erfaring og nuværende projekter.",point1:"Se projekter og konkret implementeringsarbejde.",point2:"Gennemgå mit fulde Resume / CV.",point3:"Brug Ask Johan for hurtig kontekst.",continue:"Fortsæt",loggingIn:"Logger ind...",warmingUp:"Forbereder sikker adgang. Vent et øjeblik.",passwordLabel:"Adgangskode til siden",passwordPlaceholder:"Indtast adgangskode",passwordError:"Ugyldig adgangskode. Prøv igen.",passwordRateLimited:"For mange loginforsøg. Vent et par minutter og prøv igen.",passwordForbidden:"Dette domæne er ikke tilladt lige nu. Kontakt Johan.",passwordUnavailable:"Login-servicen er midlertidigt utilgængelig. Prøv igen om lidt.",passwordColdStart:"Autentificeringen svarede for langsomt. Prøv igen.",passwordNetwork:"Kunne ikke nå login-servicen. Tjek din forbindelse og prøv igen."},ask:{title:"Spørg Johan",placeholder:"Spørg om kompetencer, projekter eller arkitektur...",button:"Svar"},projects:{title:"Projekter",intro:"Fokuseret arbejde inden for arkitektur, frontend-systemer og produktudførelse.",previewTitle:"Udvalgt Arbejde",previewIntro:"Et udsnit af praktisk arkitektur og frontend-udførelse.",cta:"Se alle projekter",readMore:"Læs mere",backToProjects:"Tilbage til projekter",exploreOtherHeading:"Udforsk mine andre projekter",detailKicker:"Projektdetalje",detailHeading:"Om projektet",notFoundTitle:"Projektet blev ikke fundet",notFoundBody:"Projektet findes ikke længere, eller linket er ugyldigt."},files:{title:"CV",intro:"Uddannelse, arbejdserfaring, frivilligt arbejde og kvalifikationer."},fileScroller:{title:"Links og filer",ariaLabel:"Karusel med links og filer"},resume:{previewTitle:"CV overblik",previewIntro:"Et struktureret overblik over uddannelse, praktisk erfaring og væsentlige kompetencer.",cta:"Åbn Resume / CV",downloadPdf:"Download CV som PDF",downloadCertificate:"Download Certifikat som PDF",education:"Uddannelse",experience:"Arbejdserfaring",voluntary:"Frivilligt arbejde",qualifications:"Kvalifikationer",itSkills:"Væsentlige IT-kundskaber",personalQualities:"Personlige kvaliteter"},contact:{title:"Kontakt",intro:"Kontakt mig direkte via e-mail, telefon eller LinkedIn.",emailLabel:"E-mail",phoneLabel:"Telefon",linkedinLabel:"LinkedIn",copyEmail:"Kopiér e-mail",copyPhone:"Kopiér telefonnummer",connectLinkedin:"Forbind på LinkedIn",connectedLinkedin:"Forbundet",copied:"Kopieret",updates:{title:"Tilmeld dig opdateringer",intro:"Få en kort e-mail, når jeg udgiver et nyt projekt, opdaterer mit CV eller forbedrer en interaktiv service.",infoButtonAria:"Åbn detaljer om update signup",infoKicker:"Hvad du får",infoTitle:"Vælg de updates du vil have",infoIntro:"Vælg et eller flere emner. Jeg sender kun en mail, når der er en reel ændring på sitet.",infoPoints:["Projects: nye lanceringer, case studies eller større iterationer på projects-siden.","Resume: ny rolle, ny erfaring, certificeringer eller andre væsentlige profilopdateringer.","Interactive services: nye features eller tydelige forbedringer i Ask Johan, GeoJohan eller SpotiJohan.","Første gang du tilmelder dig, får du også en kort velkomstmail med direkte unsubscribe-link."],infoClose:"Tilbage til sitet",topicsLabel:"Vælg opdateringer",emailAriaLabel:"E-mailadresse",placeholder:"email@example.com",button:"Tilmeld",note:"Du kan altid afmelde dig igen.",success:"Du er nu tilmeldt opdateringer.",topics:{projects:"Projects",resume:"Resume",interactive_services:"Interactive services"},topicDescriptions:{projects:"Nyt case study, lancering eller større iteration",resume:"Ny rolle, kompetence, certificering eller erfaring",interactive_services:"Nye forbedringer i Ask Johan, GeoJohan eller SpotiJohan"},errors:{invalidEmail:"Indtast en gyldig e-mailadresse.",noTopics:"Vælg mindst én type opdatering.",generic:"Det var ikke muligt at tilmelde dig lige nu. Prøv igen om lidt."}}},playground:{title:"Playground",intro:"Lær Johan bedre at kende gennem interaktive services: Spørg Johan, GeoJohan og SpotiJohan.",quizHubTitle:"Servicehub",quizHubIntro:"Vælg en oplevelse. GeoJohan er et 3-runders locationspil.",cards:{askJohan:{title:"Spørg Johan",subtitle:"Profil Q&A • hurtige svar • arkitekturkontekst",cta:"Åbn Spørg Johan"},cityQuiz:{title:"By-quiz",subtitle:"Tidsbaserede byspørgsmål • visuelle hints • jagt på score",cta:"Kommer snart"},geoJohan:{title:"GeoJohan",subtitle:"3 rounds • pan Street View • guess on map",cta:"Spil GeoJohan"}},moreToComeTitle:"Mere På Vej",moreToComeBody:"Flere eksperimenter og interaktive prototyper bliver tilføjet her snart."},geojohan:{title:"GeoJohan",intro:"Panorer i Street View, placér dit gæt på kortet og få point over 3 runder.",roundTitles:{address:"Hvor i København bor jeg?",work:"Hvor i København arbejder jeg?",school:"Hvor i København studerer jeg?"},panoramaAria:"Street View panorama",mapAria:"Gættekort",loading:"Indlæser kort og Street View...",loadingRound:"Forbereder denne runde...",progressLabel:"Runde",currentTotalLabel:"Nuværende total",roundReady:"Placér dit gæt på kortet når du er klar.",streetViewFallback:"Street View er begrænset her. Du kan stadig gætte på kortet.",mapHint:"Klik på kortet for at placere dit gæt",guessPlacedHint:"Gæt placeret. Indsend eller flyt din pin.",guessAction:"Gæt",continueAction:"Fortsæt",guessAndContinue:"Gæt og forsæt",submitGuess:"Indsend gæt",resetGuess:"Nulstil gæt",nextRound:"Næste runde",finishRound:"Afslut",summaryTitle:"GeoJohan resultat",summaryLocations:{address:{address:"",context:""},work:{address:"",context:""},school:{address:"",context:""}},totalScoreLabel:"Samlet score",distanceLabel:"Afstand",distanceFromGuessLabel:"Afstand fra dit gæt",pointsLabel:"Point",playAgain:"Spil GeoJohan igen",backToQuiz:"Tilbage til quiz",authError:"GeoJohan kræver et gyldigt login til siden.",authErrorHint:"Lås siden op med adgangskoden og prøv igen.",apiError:"GeoJohan kunne ikke nå API'et lige nu.",apiErrorHint:"Tjek at API'et kører, og at VITE_API_BASE_URL peger på korrekt backend.",missingKey:"GeoJohan maps key er ikke tilgængelig lige nu.",missingKeyHint:"Sæt GEOJOHAN_MAPS_API_KEY i API-miljøet og genstart API'en.",loadError:"Google Maps kunne ikke indlæses. Prøv igen.",loadErrorHint:"Tjek API key-restriktioner, billing og tilladte domæner.",demoCoordinatesNote:"Demo-koordinater bruges lige nu. Sæt VITE_GEOJOHAN_ROUND*_... i .env.local for rigtige runder."},spotifyDashboard:{title:"SpotiJohan",intro:"Udforsk hvilken musik jeg har lyttet mest til denne uge.",tabs:{tracks:"Sang",albums:"Album",artists:"Artist"},switchLabel:"Skift Spotify dashboard-liste",loading:"Indlæser Spotify dashboard...",refreshData:"Opdater dashboard",errorTitle:"Spotify dashboard utilgængeligt",loadError:"Kunne ikke indlæse Spotify dashboard lige nu. Prøv igen.",networkError:"Kunne ikke nå API'et. Tjek at backend kører og prøv igen.",apiBaseMissing:"VITE_API_BASE_URL er ikke sat til Spotify dashboard API-kald.",invalidPayload:"Spotify dashboard-svaret var ugyldigt.",rateLimited:"Spotify begrænser requests lige nu. Vent lidt før nyt forsøg.",retryAfter:"Prøv igen om",retryCta:"Prøv igen",lastUpdated:"Opdateret",autoRefreshNote:"SpotiJohan opdateres automatisk hvert 10. minut",weekFallback:"Ingen afspilninger fundet i de sidste 7 dage, så seneste tilgængelige afspilninger vises.",emptyTitle:"Afventer data",emptySlot:"Ingen rangering tilgængelig endnu.",rankWith:"med",playSingle:"afspilning",playPlural:"afspilninger",previewPlayLabel:"Afspil 10 sekunders track-preview",previewStopLabel:"Stop track-preview"},scrollHint:{label:"Scroll for mere"},footer:{builtWith:"Bygget med Vite, Tailwind og custom JavaScript.",rights:"Alle rettigheder forbeholdes.",playground:"Lær mig at kende",infoButtonAria:"Åbn information om hvordan websitet er bygget",infoKicker:"Bag kulissen",infoTitle:"Sådan er sitet bygget",infoIntro:"Et hurtigt overblik over den live arkitektur, der driver johanscv.dk i dag.",infoPoints:["Frontend: Single-page app bygget med Vite og modulær Vanilla JavaScript, stylet med Tailwind + custom CSS.","Kerne-UX: Client-side routing, animerede sideovergange og global theme/language-state på tværs af sider.","Feature-moduler: Ask Johan (AI-chat), GeoJohan (Street View-spil) og SpotiJohan (musikdashboard) ligger i adskilte frontend-moduler.","Backend: Node.js + Express API på Azure App Service med lagdelte moduler til auth, Ask Johan, GeoJohan og Spotify-handlers.","Data + AI-flow: Ask Johan kalder OpenAI på serveren (model styres via env), mens GeoJohan Maps-nøgle og Spotify snapshot-data leveres fra beskyttede API-endpoints.","Sikkerhedsgrundlag: Access-code login -> JWT bearer-token, stram CORS-allowlist, JSON/body-grænser, per-IP rate limits og daglige usage caps."],infoClose:"Tilbage til sitet"}},Ge={en:an,dk:ln};function cn({route:e,t}){return`
    <header id="navbar" class="site-nav">
      <div class="nav-main">
        <nav class="nav-links nav-links-primary" aria-label="Primary navigation">
          ${[{path:"/",label:t.nav.home},{path:"/projects",label:t.nav.projects},{path:"/resume",label:t.nav.files},{path:"/contact",label:t.nav.contact,extraClass:"nav-contact-link"}].map(o=>dn(o.path,o.label,e,o.extraClass||"")).join("")}
        </nav>
        <span class="nav-wordmark" aria-hidden="true">JOHANSCV.DK</span>
      </div>
    </header>
  `}function dn(e,t,n,o=""){const r=`nav-link nav-link-${e==="/"?"home":e.slice(1)} ${o}`.trim();return`<a class="${un(e,n)?`${r} active`:r}" href="${e}" data-link>${t}</a>`}function un(e,t){return!e||!t?!1:e==="/"?t==="/":t===e||t.startsWith(`${e}/`)}function pn(e){return`
    <button id="theme-toggle" class="toggle-pill ${e==="dark"?"is-dark":"is-light"}" type="button" aria-label="Toggle theme">
      <span class="toggle-option toggle-option-light">Light</span>
      <span class="toggle-option toggle-option-dark">Dark</span>
      <span class="toggle-knob"></span>
    </button>
  `}function gn(e){const t=document.querySelector("#theme-toggle");t&&t.addEventListener("click",e)}function mn(e){return`
    <button id="language-toggle" class="lang-pill ${e==="dk"?"is-dk":"is-en"}" type="button" aria-label="Toggle language">
      <span class="lang-indicator"></span>
      <span class="lang-option">EN</span>
      <span class="lang-option">DK</span>
    </button>
  `}function fn(e){const t=document.querySelector("#language-toggle");t&&t.addEventListener("click",e)}const Fe="footer-info-modal",At="footer-info-dialog",hn=320,vn=140;function bn({t:e,theme:t,language:n}){const o=new Date().getFullYear();return`
    <footer class="site-footer" aria-label="Footer">
      <div class="footer-top">
        <nav class="footer-links" aria-label="Footer navigation">
          ${[{href:"/",label:e.nav.home},{href:"/projects",label:e.nav.projects},{href:"/resume",label:e.nav.files}].map(r=>`<a class="${r.className||""}" href="${r.href}" data-link>${r.label}</a>`).join("")}
        </nav>
        <div class="footer-controls">
          <a class="footer-playground-link" href="/playground" data-link>${e.footer.playground}</a>
          <div class="footer-toggles">
            ${mn(n)}
            ${pn(t)}
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
            aria-controls="${At}"
            aria-expanded="false"
          >
            ?
          </button>
        </div>
      </div>
    </footer>
  `}function yn(e,t={}){const n=Et(t.overlayRoot),o=document.querySelector("#footer-info-toggle"),i=kn(e,n),r=i?.querySelector("#footer-info-close"),s=i?.querySelector("[data-footer-info-close]");if(!o||!i||!r||!s)return;document.body.classList.remove("footer-info-lock"),document.body.classList.remove("footer-info-open");let a=!1,l=!1,c=null,d=null,g=null;const f=()=>!i.hidden&&i.classList.contains("is-visible"),h=()=>{d&&(i.removeEventListener("transitionend",d),d=null),c&&(window.clearTimeout(c),c=null)},u=()=>{g&&(window.clearTimeout(g),g=null)},p=()=>{h(),u(),l=!1,i.hidden=!0,i.classList.remove("is-visible"),document.body.classList.remove("footer-info-lock"),document.body.classList.remove("footer-info-open"),a&&o.focus({preventScroll:!0}),a=!1},v=b=>{o.setAttribute("aria-expanded",b?"true":"false")},m=()=>{f()||l||(h(),u(),a=!1,i.hidden=!1,i.classList.remove("is-visible"),document.body.classList.add("footer-info-lock"),document.body.classList.add("footer-info-open"),v(!0),window.requestAnimationFrame(()=>{i.classList.add("is-visible"),g=window.setTimeout(()=>{g=null,!(i.hidden||l||!i.classList.contains("is-visible"))&&r.focus({preventScroll:!0})},vn)}))},y=({restoreFocus:b=!1}={})=>{i.hidden||l||(l=!0,h(),u(),a=b,v(!1),i.classList.remove("is-visible"),d=T=>{T.target!==i||T.propertyName!=="opacity"||p()},i.addEventListener("transitionend",d),c=window.setTimeout(p,hn+80))};o.addEventListener("click",()=>{if(f()){y({restoreFocus:!0});return}m()}),r.addEventListener("click",()=>y()),s.addEventListener("click",()=>y()),i.addEventListener("keydown",b=>{b.key==="Escape"&&y({restoreFocus:!0})})}function kn(e,t){if(document.body.classList.remove("footer-info-lock"),document.querySelectorAll(`#${Fe}`).forEach(i=>{i.remove()}),!e?.footer)return null;const n=Et(t),o=document.createElement("div");return o.id=Fe,o.className="footer-info-modal",o.hidden=!0,o.innerHTML=`
    <div class="footer-info-backdrop" data-footer-info-close></div>
    <section
      id="${At}"
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
  `,n.append(o),o}function Et(e=null){if(e instanceof HTMLElement)return e;const t=document.querySelector("#overlay-root");return t instanceof HTMLElement?t:document.body}const wn="I focus on architecture thinking, frontend systems, and product-minded delivery.",Sn="Recent work centers on SPA structure, interaction quality, and maintainable design systems.",An="I prioritize separation of concerns, explicit state, and measurable performance.",G={skills:wn,projects:Sn,architecture:An,default:"In this phase, I can answer on skills, projects, and architecture approach."},U="https://johanscv-api-johu0002-no.azurewebsites.net".replace(/\/$/,""),En="/auth/login",Tn="/api/ask-johan",Tt="johanscv.askJohanAccessCode",pe="Access code is required to use Ask Johan.",Ln="Ask Johan is temporarily unavailable. Please try again in a few seconds.",_n=25e3,te=2,qe=2200,In=42,jn=24,Pn=1200,$n=260,On=520,Be={en:["What is your favorite dish?","When is your birthday?","Where do you live in Copenhagen?","What kind of IT architecture do you want to work with?","What is your strongest technical skill right now?","How do you approach system design decisions?","What have you learned from your current student job?","Which projects best represent your profile?","How do you balance UX quality and performance?","How do you work with data quality in practice?","How can we collaborate on a relevant opportunity?"],dk:["Hvad er din yndlingsret?","Hvornår har du fødselsdag?","Hvor bor du i København?","Hvilken type IT-arkitektur vil du arbejde med?","Hvad er din stærkeste tekniske kompetence lige nu?","Hvordan træffer du arkitektur- og designbeslutninger?","Hvad har du lært i dit nuværende studiejob?","Hvilke projekter repræsenterer dig bedst?","Hvordan balancerer du UX-kvalitet og performance?","Hvordan arbejder du med datakvalitet i praksis?","Hvordan kan vi samarbejde om en relevant mulighed?"]};let N=null,ke=0,Ke=!1,F="";function Lt({t:e}){const[t,n]=Rn(e.ask.title);return`
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
  `}function Rn(e="Ask Johan"){const t=String(e).trim();if(!t)return["Ask","Johan"];const n=t.split(/\s+/);if(n.length===1)return[n[0],""];const o=n.pop();return[n.join(" "),o]}function _t(e="en"){const t=document.querySelector("#ask-input"),n=document.querySelector("#ask-submit"),o=document.querySelector("#ask-answer");if(!t||!n||!o)return;qn(t,e);const i=async()=>{const r=t.value.trim().toLowerCase();n.disabled=!0,n.classList.add("is-loading");try{const s=await Mn(r);await Wn(o,s)}finally{n.disabled=!1,n.classList.remove("is-loading")}};n.addEventListener("click",i),t.addEventListener("keydown",r=>{r.key==="Enter"&&i()})}async function Mn(e){if(!e)return G.default;try{return await Dn(e)}catch(t){return console.warn(Un(t)),Ln}return Nn(e)}function Nn(e){return e.includes("skill")?G.skills:e.includes("project")?G.projects:e.includes("architect")?G.architecture:G.default}function Me(){const e=localStorage.getItem(Tt);return e&&e.trim()?e:""}async function Cn(){if(!U)throw new Error("VITE_API_BASE_URL is not configured.");const e=Me();return It(e)}async function Dn(e){if(!U)throw new Error("VITE_API_BASE_URL is not configured.");const t=Me();let n=null,o=!1;for(let i=1;i<=te;i+=1)try{const r=await It(t,o);o=!1;const s=await Hn(e,r);if(s.status===401){if(jt(),i<te){o=!0;continue}return localStorage.removeItem(Tt),pe}if(!s.ok){const c=await $t(s);if(Jn(s.status,i)){await We(qe);continue}throw new Error(c)}const a=await s.json(),l=Vn(a);if(!l)throw new Error("API returned an empty answer.");return l}catch(r){if(r instanceof Error&&r.message===pe)return pe;if(n=r,i<te&&Gn(r)){await We(qe);continue}throw r}throw n||new Error("API request failed.")}async function It(e,t=!1){if(!t&&F)return F;const n=await xn(e);if(n.status===401)throw jt(),new Error("Temporary public-site login is enabled in the frontend, but not in the API.");if(!n.ok){const r=await $t(n,"Authentication failed.");throw new Error(r)}const o=await n.json(),i=typeof o?.token=="string"?o.token.trim():"";if(!i)throw new Error("API login did not return a token.");return F=i,F}function jt(){F=""}function xn(e){return Pt(`${U}${En}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({accessCode:e})})}function Hn(e,t){return Pt(`${U}${Tn}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({question:e})})}function Pt(e,t){const n=new AbortController,o=window.setTimeout(()=>n.abort(),_n);return fetch(e,{...t,signal:n.signal}).finally(()=>{window.clearTimeout(o)})}function Vn(e){return typeof e?.answer!="string"?"":e.answer.trim()||""}async function $t(e,t="API request failed."){try{const n=await e.json();if(typeof n?.answer=="string"&&n.answer.trim())return`${e.status} ${e.statusText}: ${n.answer.trim()}`}catch{}return`${e.status} ${e.statusText}: ${t}`}function Un(e){return e?.name==="AbortError"?"Ask Johan API error: request timed out.":`Ask Johan API error: ${e instanceof Error?e.message:String(e)}`}function Jn(e,t){return t>=te?!1:e===408||e===429||e>=500}function Gn(e){if(!e)return!1;if(e.name==="AbortError")return!0;const t=String(e.message||"");return t.includes("Failed to fetch")||t.includes("NetworkError")}function Fn(){if(!U||Ke)return Promise.resolve();Me(),Ke=!0;const e=new AbortController,t=window.setTimeout(()=>e.abort(),1e4);return fetch(`${U}/health`,{method:"GET",signal:e.signal}).catch(()=>null).finally(()=>{window.clearTimeout(t)})}function qn(e,t){Kn();const n=Bn(Be[t]||Be.en),o=++ke;let i=0,r=0,s=!1;const a=()=>{if(o!==ke)return;const l=n[i];if(!s){if(r+=1,e.placeholder=l.slice(0,r),r>=l.length){s=!0,N=window.setTimeout(a,Pn);return}N=window.setTimeout(a,In);return}if(r-=1,e.placeholder=l.slice(0,Math.max(r,0)),r<=0){s=!1,i=(i+1)%n.length,N=window.setTimeout(a,$n);return}N=window.setTimeout(a,jn)};a()}function Bn(e){const t=[...e];for(let n=t.length-1;n>0;n-=1){const o=Math.floor(Math.random()*(n+1));[t[n],t[o]]=[t[o],t[n]]}return t}function Kn(){N&&(window.clearTimeout(N),N=null),ke+=1}async function Wn(e,t){const n=String(t||""),o=e.offsetHeight;e.style.height=`${o}px`,e.textContent=n,e.classList.toggle("has-content",!!n.trim());const i=n.trim()?e.scrollHeight:0;e.offsetHeight,e.style.height=`${i}px`,await zn(e),e.style.height=n.trim()?"auto":"0px"}function zn(e){return new Promise(t=>{let n=!1;const o=()=>{n||(n=!0,e.removeEventListener("transitionend",i),t())},i=r=>{r.propertyName==="height"&&o()};e.addEventListener("transitionend",i),window.setTimeout(o,On+80)})}function We(e){return new Promise(t=>{window.setTimeout(t,e)})}const re={theme:"johanscv.theme",language:"johanscv.language"};let _={theme:localStorage.getItem(re.theme)||"dark",language:localStorage.getItem(re.language)||"en",route:"/"};Ot(_);function O(){return _}function Ne(e){const t=_,n={..._,...e};Zn(t,n)&&(_=n,Xn(t,_)&&Yn(),Qn(t,_)&&Ot(_))}function Yn(){localStorage.setItem(re.theme,_.theme),localStorage.setItem(re.language,_.language)}function Ot(e){document.documentElement.dataset.theme=e.theme,document.documentElement.classList.toggle("dark",e.theme==="dark")}function Xn(e,t){return e.theme!==t.theme||e.language!==t.language}function Qn(e,t){return e.theme!==t.theme}function Zn(e,t){return e.theme!==t.theme||e.language!==t.language||e.route!==t.route}const Ce=[{id:"spa-architecture",title:{en:"SPA Architecture Foundation",dk:"SPA Arkitekturgrundlag"},summary:{en:"Designed a lightweight Vanilla JS SPA with explicit routing, transition orchestration, and durable state boundaries.",dk:"Designede en letvægts Vanilla JS SPA med tydelig routing, overgangsorkestrering og robuste state-grænser."},details:{en:["This project established the technical foundation for the website as a lightweight single-page application with clear boundaries between pages, shared UI, and state.","I focused on explicit client-side routing, predictable rendering flow, and clean separation between feature modules so updates can be made quickly without creating side effects.","The result is a maintainable architecture where navigation, page transitions, and component behavior stay consistent as the site grows."],dk:["Dette projekt lagde det tekniske fundament for websitet som en letvægts single-page applikation med tydelige grænser mellem sider, fælles UI og state.","Jeg havde fokus på eksplicit client-side routing, forudsigeligt render-flow og klar opdeling mellem feature-moduler, så ændringer kan laves hurtigt uden uønskede sideeffekter.","Resultatet er en vedligeholdbar arkitektur, hvor navigation, sideovergange og komponentadfærd forbliver konsistent, efterhånden som sitet udvikles."]},tags:["Vite","Vanilla JS","Routing"]},{id:"design-system",title:{en:"Interaction-Led Design System",dk:"Interaktionsdrevet Designsystem"},summary:{en:"Built a restrained visual language with theme tokens, glass surfaces, motion hierarchy, and responsive rhythm.",dk:"Byggede et afdæmpet visuelt sprog med tematiske tokens, glasflader, motion-hierarki og responsiv rytme."},details:{en:["This project defined a consistent UI language across the site, including typography, spacing, cards, controls, and motion behavior.","I implemented shared design tokens and reusable CSS patterns for light and dark themes, so visual decisions remain coherent across pages and features.","The primary outcome is a more intentional interface with better readability, consistent interaction feedback, and smoother responsive behavior on both desktop and mobile."],dk:["Dette projekt definerede et konsistent UI-sprog på tværs af sitet, herunder typografi, spacing, kort, controls og motion-adfærd.","Jeg implementerede fælles design-tokens og genbrugelige CSS-mønstre til light/dark theme, så visuelle beslutninger forbliver sammenhængende på tværs af sider og features.","Det primære resultat er et mere intentionelt interface med bedre læsbarhed, ensartet interaktionsfeedback og mere stabil responsiv adfærd på både desktop og mobil."]},tags:["Tailwind","Theming","UX Motion"]},{id:"deployment-flow",title:{en:"GitHub Pages Deployment Flow",dk:"GitHub Pages Deploy-flow"},summary:{en:"Configured stable project-page deployment with base-path-safe assets and SPA fallback for deep links.",dk:"Konfigurerede stabil project-pages deployment med base-path-sikre assets og SPA fallback til deep links."},details:{en:["This project focused on making deployment reliable for GitHub Pages while preserving the expected SPA navigation behavior.","I aligned build configuration, asset paths, and fallback routing so direct access to nested routes works instead of breaking on refresh or shared links.","The result is a more robust release flow where local development, CI checks, and production hosting behave consistently."],dk:["Dette projekt havde fokus på at gøre deployment stabil på GitHub Pages, samtidig med at den forventede SPA-navigation blev bevaret.","Jeg afstemte build-konfiguration, asset-paths og fallback-routing, så direkte adgang til undersider virker i stedet for at fejle ved refresh eller delte links.","Resultatet er et mere robust release-flow, hvor lokal udvikling, CI-checks og produktion opfører sig konsistent."]},tags:["GitHub Pages","CI-ready","Reliability"]}];function eo({t:e}){return`
    <section class="hero section-reveal" id="hero">
      <div class="avatar-wrap">
        <div class="avatar-ring"></div>
        <img class="avatar" src="/images/johan-placeholder.jpg" alt="Portrait of Johan" />
      </div>
      <h1 class="hero-name">${e.hero.name}</h1>
      <p class="hero-title">${e.hero.title}</p>
    </section>
  `}const ze=[{id:"cv",title:{en:"CV",dk:"CV"},description:{en:"Updated profile and experience summary.",dk:"Opdateret profil og erfaringsoversigt."},url:"/files/johan-niemann-husbjerg-cv.pdf",actionLabel:{en:"Download CV",dk:"Download CV"},actionType:"download",icon:"download"},{id:"linkedin",title:{en:"LinkedIn",dk:"LinkedIn"},description:{en:"Professional profile, education, and work history.",dk:"Professionel profil, uddannelse og arbejdserfaring."},url:"https://www.linkedin.com/in/johan-niemann-h-038906312/",actionLabel:{en:"Go to LinkedIn",dk:"Gå til LinkedIn"},actionType:"external",icon:"linkedin"},{id:"github",title:{en:"GitHub",dk:"GitHub"},description:{en:"Code repositories, projects, and technical work.",dk:"Kode-repositorier, projekter og teknisk arbejde."},url:"https://github.com/johanniemann",actionLabel:{en:"Go to GitHub",dk:"Gå til GitHub"},actionType:"external",icon:"github"},{id:"location",title:{en:"Location",dk:"Lokation"},description:{en:"Where I live in Copenhagen.",dk:"Hvor jeg bor i København."},url:"https://www.google.com/maps/place/Enghavevej+63,+1674+K%C3%B8benhavn/@55.665423,12.5330593,15z/data=!3m1!4b1!4m6!3m5!1s0x4652539dab759293:0xf1e50266a0d1baf1!8m2!3d55.6654113!4d12.5433376!16s%2Fg%2F11nnv8kwnj?entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D",actionLabel:{en:"Open in Maps",dk:"Åbn i Maps"},actionType:"external",icon:"location"}];function Ye(e,t,n=!1){const o=ge(e.title,t),i=ge(e.description,t),r=to(e.url),s=n?'tabindex="-1"':'tabindex="0"',a=n?"file-card file-card-clone":"file-card",l=no(e,n),c=io(e.icon),d=ge(e.actionLabel,t)||oo(e.actionType,o,t);return`
    <article class="${a}" ${s}>
      <h3 class="file-title">${o}</h3>
      <p class="file-description">${i}</p>
      <a class="file-action" href="${r}" ${l} aria-label="${d}">
        <span class="file-action-icon" aria-hidden="true">${c}</span>
        <span class="file-action-text">${d}</span>
      </a>
    </article>
  `}function to(e){return e.startsWith("/")?`/${e.slice(1)}`:e}function no(e,t){const n=[];return e.actionType==="download"?n.push("download"):n.push('target="_blank"','rel="noopener noreferrer"'),t&&n.push('tabindex="-1"'),n.join(" ")}function oo(e,t,n){return e==="download"?`Download ${t}`:n==="dk"?`Gå til ${t}`:`Open ${t}`}function io(e){return e==="linkedin"?"in":e==="github"?ro():e==="location"?so():ao()}function ro(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.21.68-.48v-1.7c-2.78.6-3.37-1.17-3.37-1.17-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.52 1.03 1.52 1.03.89 1.52 2.33 1.08 2.9.82.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.41.11 2.66.64.7 1.02 1.59 1.02 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  `}function so(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2.25a6.75 6.75 0 0 0-6.75 6.75c0 4.98 6.05 11.86 6.3 12.15a.6.6 0 0 0 .9 0c.25-.29 6.3-7.17 6.3-12.15A6.75 6.75 0 0 0 12 2.25Zm0 9.75a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
      />
    </svg>
  `}function ao(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M11.25 3.75a.75.75 0 0 1 1.5 0v9.69l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V3.75Z"/>
      <path d="M4.5 17.25a.75.75 0 0 1 .75-.75h13.5a.75.75 0 0 1 0 1.5H5.25a.75.75 0 0 1-.75-.75Z"/>
    </svg>
  `}function ge(e,t){return typeof e=="string"?e:e&&typeof e=="object"&&(e[t]||e.en||Object.values(e)[0])||""}let H=null,C=!1,V=null,ne=null;const lo=.018,W={interaction:1200,drag:900,wheel:1100};function co({t:e,language:t}){const n=ze.map(i=>Ye(i,t)).join(""),o=ze.map(i=>Ye(i,t,!0)).join("");return`
    <section class="files-strip section-reveal" id="file-scroller-wrap">
      <h2 class="section-title">${e.fileScroller.title}</h2>
      <div id="file-scroller-viewport" class="file-scroller-viewport" tabindex="0" aria-label="${e.fileScroller.ariaLabel}">
        <div id="file-scroller-track" class="file-scroller-track">
          ${n}
          ${o}
        </div>
      </div>
    </section>
  `}function uo(){const e=document.querySelector("#file-scroller-viewport"),t=document.querySelector("#file-scroller-track");if(!e||!t)return;po(),we(),C=!0;const n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;let o=!1,i=!1,r=null,s=!1,a=0,l=0,c=0,d=t.scrollWidth/2,g=performance.now();const f=()=>{t.style.transform=`translate3d(${-c}px, 0, 0)`},h=k=>{if(!d)return 0;const L=k%d;return L<0?L+d:L},u=k=>{if(!C||n||o)return;const L=k-g;g=k,c=h(c+L*lo),f(),H=window.requestAnimationFrame(u)},p=()=>{Se(),C=!1,we()},v=()=>{Se(),!(C||n||o)&&(C=!0,g=performance.now(),H=window.requestAnimationFrame(u))},m=k=>{if(k.target.closest("a, button, input, textarea, select")){p(),V=window.setTimeout(v,W.interaction);return}i=!0,r=k.pointerId,s=!1,a=k.clientX,l=c,p(),e.setPointerCapture(r)},y=k=>{if(!i||k.pointerId!==r)return;const L=k.clientX-a;!s&&Math.abs(L)>6&&(s=!0,o=!0,e.classList.add("is-dragging")),o&&(c=h(l-L),f())},b=k=>{!i||k.pointerId!==r||(i=!1,r=null,o=!1,e.classList.remove("is-dragging"),e.hasPointerCapture(k.pointerId)&&e.releasePointerCapture(k.pointerId),V=window.setTimeout(v,s?W.drag:W.interaction))},T=k=>{p(),c=h(c+k.deltaY*.8+k.deltaX),f(),V=window.setTimeout(v,W.wheel)};e.addEventListener("mouseenter",p),e.addEventListener("mouseleave",v),e.addEventListener("focusin",p),e.addEventListener("focusout",v),e.addEventListener("pointerdown",m),e.addEventListener("pointermove",y),e.addEventListener("pointerup",b),e.addEventListener("pointercancel",b),e.addEventListener("wheel",T,{passive:!0}),ne=()=>{e.removeEventListener("mouseenter",p),e.removeEventListener("mouseleave",v),e.removeEventListener("focusin",p),e.removeEventListener("focusout",v),e.removeEventListener("pointerdown",m),e.removeEventListener("pointermove",y),e.removeEventListener("pointerup",b),e.removeEventListener("pointercancel",b),e.removeEventListener("wheel",T)},window.requestAnimationFrame(()=>{d=t.scrollWidth/2,f()}),n||(H=window.requestAnimationFrame(u))}function we(){H&&(window.cancelAnimationFrame(H),H=null)}function Se(){V&&(window.clearTimeout(V),V=null)}function po(){C=!1,ne&&(ne(),ne=null),we(),Se()}function go({t:e,language:t}){return`
    <main class="page-stack">
      ${eo({t:e})}
      <section class="content-section section-reveal" id="projects-preview">
        <h2 class="section-title">${e.projects.previewTitle}</h2>
        <p class="section-body">${e.projects.previewIntro}</p>
        <div class="projects-grid projects-grid-compact">
          ${Ce.slice(0,2).map(n=>fo(n,t)).join("")}
        </div>
        <a class="projects-cta" href="/projects" data-link>${e.projects.cta}</a>
      </section>

      <section class="content-section section-reveal" id="resume-preview">
        <h2 class="section-title">${e.resume.previewTitle}</h2>
        <p class="section-body">${e.resume.previewIntro}</p>
        <a class="projects-cta" href="/resume" data-link>${e.resume.cta}</a>
      </section>

      ${Lt({t:e})}
      ${co({t:e,language:t})}
    </main>
  `}function mo({language:e}){_t(e),uo()}function fo(e,t){const n=e.title[t]||e.title.en,o=e.summary[t]||e.summary.en;return`
    <article class="project-card">
      <h3 class="project-title">${n}</h3>
      <p class="project-summary">${o}</p>
    </article>
  `}const ho=Object.freeze(Object.defineProperty({__proto__:null,mount:mo,render:go},Symbol.toStringTag,{value:"Module"})),Xe="/projects/";function vo({t:e,language:t,route:n="/projects"}){const o=wo(n);return o?yo({t:e,language:t,projectId:o}):bo({t:e,language:t})}function bo({t:e,language:t}){return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="projects">
        <h2 class="section-title">${e.projects.title}</h2>
        <p class="section-body">${e.projects.intro}</p>
      </section>
      <section class="projects-grid section-reveal" aria-label="${e.projects.title}">
        ${Ce.map(n=>ko(n,t,e)).join("")}
      </section>
    </main>
  `}function yo({t:e,language:t,projectId:n}){const o=Ce.find(a=>a.id===n);if(!o)return`
      <main class="page-stack">
        <section class="content-section section-reveal" id="project-detail-missing">
          <h2 class="section-title">${e.projects.notFoundTitle}</h2>
          <p class="section-body">${e.projects.notFoundBody}</p>
          <a class="projects-cta project-back-link" href="/projects" data-link>${e.projects.backToProjects}</a>
        </section>
      </main>
    `;const i=o.title[t]||o.title.en,r=o.summary[t]||o.summary.en,s=So(o,t,r);return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="project-detail-intro">
        <p class="project-detail-kicker">${e.projects.detailKicker}</p>
        <h2 class="section-title">${i}</h2>
        <p class="section-body">${r}</p>
      </section>

      <section class="project-card project-detail-card section-reveal" aria-label="${i}">
        <h3 class="project-title">${e.projects.detailHeading}</h3>
        <div class="project-detail-body">
          ${s.map(a=>`<p>${a}</p>`).join("")}
        </div>
        <div class="project-tags">
          ${o.tags.map(a=>`<span class="project-tag">${a}</span>`).join("")}
        </div>
      </section>

      <section class="content-section section-reveal" id="project-detail-navigation">
        <h3 class="section-title">${e.projects.exploreOtherHeading}</h3>
        <a class="projects-cta project-back-link" href="/projects" data-link>${e.projects.backToProjects}</a>
      </section>
    </main>
  `}function ko(e,t,n){const o=e.title[t]||e.title.en,i=e.summary[t]||e.summary.en,r=`/projects/${encodeURIComponent(e.id)}`;return`
    <article class="project-card">
      <h3 class="project-title">${o}</h3>
      <p class="project-summary">${i}</p>
      <div class="project-tags">
        ${e.tags.map(s=>`<span class="project-tag">${s}</span>`).join("")}
      </div>
      <a class="projects-cta project-read-more" href="${r}" data-link aria-label="${n.projects.readMore}: ${o}">
        ${n.projects.readMore}
      </a>
    </article>
  `}function wo(e=""){if(!e.startsWith(Xe))return"";const t=e.slice(Xe.length).replace(/\/+$/,"").trim();if(!t)return"";try{return decodeURIComponent(t)}catch{return t}}function So(e,t,n){const o=e.details?.[t]||e.details?.en;return Array.isArray(o)&&o.length>0?o:[n]}const Rt=Object.freeze(Object.defineProperty({__proto__:null,render:vo},Symbol.toStringTag,{value:"Module"})),Ao={education:[{level:"Videregående uddannelse",institution:"Københavns Erhvervsakademi",focus:"Professionsbachelor, IT-arkitektur",period:"August 2024 - Januar 2028"},{level:"Gymnasial uddannelse (STX)",institution:"Nærum Gymnasium",focus:"Samfundsfag/Engelsk A niveau",period:"August 2019 - Juni 2022"},{level:"Folkeskole",institution:"Engelsborgskolen, Kongens Lyngby",focus:"Grundskoleforløb",period:"August 2008 - Juni 2018"}],experience:[{role:"Product Data & Systems Assistant hos Norlys",description:"Jeg har arbejdet med digitale e-commerce-løsninger med ansvar for oprettelse, strukturering og vedligeholdelse af produktdata på tværs af databaser, PIM- og CMS-systemer. Arbejdet har haft fokus på datakvalitet, herunder korrekthed, konsistens og sammenhæng i produktdata. Jeg har samarbejdet tæt med både forretning, leverandører og tekniske teams for at sikre, at ændringer i produkter og indhold bliver korrekt afspejlet i systemerne. Derudover har jeg arbejdet løbende med optimering af produkt- og kategorisider for at forbedre synlighed og brugeroplevelse, herunder SEO.",type:"Studentermedhjælper",period:"Februar 2026 - d.d."},{role:"Indkøbs- og salgskonsulent hos Nofipa ApS (Nordisk Guld, Pantsat.dk m. fl.)",description:"Jeg har arbejdet med finansielle transaktioner og rådgivning inden for asset-backed lending, herunder lån baseret på værdifastsættelse af aktiver. Jeg har udført AML- og KYC-kontroller, kunde due diligence og risikovurderinger i overensstemmelse med gældende regler samt rådgivet privat- og erhvervskunder med fokus på compliance og kvalitet. Arbejdet har været KPI-styret med fokus på effektiv sagsbehandling, kvalitet og omsætning. Her har jeg udarbejdet +1.000 kontrakter heraf belånt og opkøbt aktiver for +10 mio. kr. Derudover har jeg bidraget til en startups digitale udvikling ved at optimere arbejdsgange og digitalisere manuelle processer.",type:"Studentermedhjælper",period:"Januar 2025 - d.d."},{role:"Lektiehjælper til folkeskoleelev i matematik og dansk",description:"Erfaring med undervisning, formidling og planlægning af faglige forløb.",type:"Deltid",period:"December 2021 - d.d."},{role:"Pædagogmedhjælper i Børnehuset Klokkeblomsten",description:"Erfaring med børns udvikling, læring og behov i en struktureret hverdagsramme.",type:"Fuldtid",period:"August 2022 - Oktober 2023"}],voluntary:[{role:"Studentermiljørepræsentant (SMR) for IT-arkitekturuddannelsen på EK",description:"Repræsenterer de studerendes interesser i forhold til trivsel og studiemiljø. Indsamler input fra medstuderende og deltager i dialog med undervisere og ledelse om forbedringer af studiehverdagen.",type:"Deltid",period:"September 2024 - d.d.",certificateFile:"files/smr-frivilligcertifikat-kea.pdf"}],qualifications:{it:["Microsoft Office pakken","CMS- og PIM-systemer","Adobe pakken","Git og GitHub","SQL og NoSQL","Datamodellering og datahåndtering (JSON, CSV, XML m.fl.)","Visualisering af dashboards (Tableau, Excel m.fl.)","UI/UX-design i Compose og Figma","Stærkt kendskab til JavaScript, Python, Kotlin m.fl.","Stærkt kendskab til API-drevet softwarearkitektur","Iterativ udvikling, prototyper og brugertests","Business Modeling Frameworks (BPMN, RCA, SWOT, BMC, AS-IS, TO-BE m.fl.)"],personal:["Ansvarsbevidst - overholder deadlines og følger opgaver til dørs","Lærenem - sætter mig hurtigt ind i nye systemer og arbejdsgange","Struktureret - arbejder metodisk og bevarer overblik","Samarbejdsorienteret - trives i teams og kommunikerer klart","Selvstændig - tager initiativ og kan arbejde uden tæt styring"]}},Eo={education:[{level:"Higher Education",institution:"Copenhagen School of Design and Technology",focus:"Professional Bachelor's Degree, IT Architecture",period:"August 2024 - January 2028"},{level:"Upper Secondary Education (STX)",institution:"Nærum Gymnasium",focus:"Social Sciences / English, A-level",period:"August 2019 - June 2022"},{level:"Primary and Lower Secondary School",institution:"Engelsborgskolen, Kongens Lyngby",focus:"General school program",period:"August 2008 - June 2018"}],experience:[{role:"Product Data & Systems Assistant at Norlys",description:"I have worked with digital e-commerce solutions with responsibility for creating, structuring, and maintaining product data across databases, PIM, and CMS systems. The work has focused on data quality, including correctness, consistency, and coherence in product data. I have collaborated closely with business stakeholders, suppliers, and technical teams to ensure that changes in products and content are accurately reflected in the systems. In addition, I have continuously optimized product and category pages to improve visibility and user experience, including SEO.",type:"Student Assistant",period:"February 2026 - Present"},{role:"Purchasing and Sales Consultant at Nofipa ApS (Nordisk Guld, Pantsat.dk, etc.)",description:"I have worked with financial transactions and advisory within asset-backed lending, including loans based on asset valuation. I have carried out AML and KYC controls, customer due diligence, and risk assessments in accordance with applicable regulations, while advising private and business customers with a focus on compliance and quality. The work has been KPI-driven with focus on efficient case handling, quality, and revenue. I have prepared +1,000 contracts and handled lending and acquisition of assets totaling more than DKK 10 million. In addition, I have contributed to a startup's digital development by optimizing workflows and digitalizing manual processes.",type:"Student Assistant",period:"January 2025 - Present"},{role:"Private Tutor in Mathematics and Danish",description:"Experience in teaching, communication, and planning subject-focused sessions.",type:"Part-time",period:"December 2021 - Present"},{role:"Pedagogical Assistant at Børnehuset Klokkeblomsten",description:"Experience with child development, learning needs, and structured care environments.",type:"Full-time",period:"August 2022 - October 2023"}],voluntary:[{role:"Student Environment Representative (SMR) for IT Architecture at EK",description:"Represent students in matters related to well-being and study environment. Collect input from students and participate in dialogue with lecturers and management to improve the study experience.",type:"Part-time",period:"September 2024 - Present",certificateFile:"files/smr-frivilligcertifikat-kea.pdf"}],qualifications:{it:["Microsoft Office suite","CMS and PIM systems","Adobe suite","Git and GitHub","SQL and NoSQL","Data modeling and handling (JSON, CSV, XML, etc.)","Dashboard visualization (Tableau, Excel, etc.)","UI/UX design in Compose and Figma","Strong command of JavaScript, Python, Kotlin, and more","Strong command of API-driven software architecture","Iterative development, prototypes, and user testing","Business modeling frameworks (BPMN, RCA, SWOT, BMC, AS-IS, TO-BE, etc.)"],personal:["Responsible - meet deadlines and carry tasks through","Fast learner - quickly adapt to new systems and workflows","Structured - work methodically and maintain overview","Collaborative - thrive in teams and communicate clearly","Independent - take initiative and work without close supervision"]}},Qe={dk:Ao,en:Eo};function To({t:e,language:t}){const n=Qe[t]||Qe.dk;return`
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
          ${n.education.map(Lo).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-experience">
        <h3 class="resume-heading">${e.resume.experience}</h3>
        <div class="resume-list">
          ${n.experience.map(_o).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-voluntary">
        <h3 class="resume-heading">${e.resume.voluntary}</h3>
        <div class="resume-list">
          ${n.voluntary.map(i=>Io(i,e)).join("")}
        </div>
      </section>

      <section class="resume-section section-reveal" id="resume-qualifications">
        <h3 class="resume-heading">${e.resume.qualifications}</h3>
        <div class="qual-grid">
          <article class="qual-card">
            <h4 class="qual-title">${e.resume.itSkills}</h4>
            <ul class="qual-list">
              ${n.qualifications.it.map(jo).join("")}
            </ul>
          </article>
          <article class="qual-card">
            <h4 class="qual-title">${e.resume.personalQualities}</h4>
            <ul class="qual-list qual-list-personal">
              ${n.qualifications.personal.map(Po).join("")}
            </ul>
          </article>
        </div>
      </section>
    </main>
  `}function Lo(e){return`
    <article class="resume-item">
      <p class="resume-item-type">${e.level}</p>
      <h4 class="resume-item-title">${e.institution}</h4>
      <p class="resume-item-focus">- ${e.focus}</p>
      <p class="resume-item-period">${e.period}</p>
    </article>
  `}function _o(e){return`
    <article class="resume-item">
      <h4 class="resume-item-title">${e.role}</h4>
      <p class="resume-item-body">${e.description}</p>
      <p class="resume-item-period"><span class="resume-item-type">${e.type}</span>: ${e.period}</p>
    </article>
  `}function Io(e,t){const n=String(e.certificateFile??"").trim(),o=n?`/${n}`:"",i=!!o,r=String(e.type??"").trim(),s=r?`<span class="resume-item-type">${r}</span>: ${e.period}`:e.period;return`
    <article class="resume-item${i?" resume-item-with-action":""}">
      <div class="resume-item-content">
        <h4 class="resume-item-title">${e.role}</h4>
        <p class="resume-item-body">${e.description}</p>
        <p class="resume-item-period">${s}</p>
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
  `}function jo(e){return`<li>${e}</li>`}function Po(e){const{title:t,detail:n}=$o(e);return n?`
    <li class="qual-personal-item">
      <span class="qual-personal-label">${t}</span>
      <span class="qual-personal-detail">${n}</span>
    </li>
  `:`
      <li class="qual-personal-item">
        <span class="qual-personal-label">${t}</span>
      </li>
    `}function $o(e){const t=String(e??"").trim(),n=t.match(/^(.+?)\s+-\s+(.+)$/);return n?{title:n[1],detail:n[2]}:{title:t,detail:""}}const Oo=Object.freeze(Object.defineProperty({__proto__:null,render:To},Symbol.toStringTag,{value:"Module"})),Ze="https://johanscv-api-johu0002-no.azurewebsites.net".replace(/\/$/,""),Ro="/api/updates-signup",Mo=12e3,No=/^[^\s@]+@[^\s@]+\.[^\s@]+$/,Co=["projects","resume","interactive_services"],et="updates-signup-info-modal",Mt="updates-signup-info-dialog",Do=320,xo=140;function Ho({t:e}){const t=Co.map(n=>Uo({key:n,label:e.contact.updates.topics[n]})).join("");return`
    ${Jo()}
    <section class="ask-card updates-signup-card section-reveal" id="updates-signup">
      <div class="updates-signup-copy">
        <h2 class="section-title">${e.contact.updates.title}</h2>
        <p class="section-body updates-signup-intro">${e.contact.updates.intro}</p>
      </div>
      <form id="updates-signup-form" class="updates-signup-form" novalidate>
        <fieldset class="updates-signup-choices" aria-label="${e.contact.updates.topicsLabel}">
          <div class="updates-signup-choice-list">
            ${t}
          </div>
        </fieldset>
        <div class="updates-signup-input-wrap">
          <div class="updates-signup-honeypot-wrap" aria-hidden="true">
            <label for="updates-signup-company">Company</label>
            <input
              id="updates-signup-company"
              class="updates-signup-honeypot"
              name="company"
              type="text"
              tabindex="-1"
              autocomplete="off"
            />
          </div>
          <input
            id="updates-signup-email"
            class="ask-input updates-signup-input"
            name="email"
            type="email"
            inputmode="email"
            autocomplete="email"
            placeholder="${e.contact.updates.placeholder}"
            aria-label="${e.contact.updates.emailAriaLabel}"
          />
          <button id="updates-signup-submit" class="ask-button updates-signup-button" type="submit" aria-label="${e.contact.updates.button}">
            <span class="updates-signup-button-text">${e.contact.updates.button}</span>
            <span class="updates-signup-button-spinner" aria-hidden="true"></span>
          </button>
        </div>
        <div class="updates-signup-meta">
          <p id="updates-signup-error" class="updates-signup-feedback updates-signup-error" aria-live="polite"></p>
          <p id="updates-signup-status" class="updates-signup-feedback updates-signup-status" aria-live="polite"></p>
          <p class="updates-signup-feedback updates-signup-note">
            <button
              id="updates-signup-info-toggle"
              class="footer-info-button updates-signup-info-button"
              type="button"
              aria-label="${e.contact.updates.infoButtonAria}"
              aria-haspopup="dialog"
              aria-controls="${Mt}"
              aria-expanded="false"
            >
              ?
            </button>
            <span class="updates-signup-note-text">${e.contact.updates.note}</span>
          </p>
        </div>
      </form>
    </section>
  `}function Vo({t:e,language:t="en"}){Go(e);const n=document.querySelector("#updates-signup-form"),o=document.querySelector("#updates-signup-email"),i=document.querySelector("#updates-signup-company"),r=document.querySelector("#updates-signup-submit"),s=document.querySelector("#updates-signup-error"),a=document.querySelector("#updates-signup-status"),l=Array.from(document.querySelectorAll('input[name="updates-signup-topic"]'));if(!n||!o||!i||!r||!s||!a||!l.length)return;const c=()=>{s.textContent="",a.textContent=""},d=p=>{s.textContent=p,a.textContent=""},g=p=>{a.textContent=p,s.textContent=""},f=()=>l.filter(p=>p.checked).map(p=>p.value),h=()=>{const p=o.value.trim();return No.test(p)?f().length?"":e.contact.updates.errors.noTopics:e.contact.updates.errors.invalidEmail},u=()=>{(s.textContent||a.textContent)&&c()};o.addEventListener("input",u),l.forEach(p=>{p.addEventListener("change",u)}),n.addEventListener("submit",async p=>{p.preventDefault();const v=h();if(v){d(v);return}r.disabled=!0,r.classList.add("is-loading");try{const m=await qo({email:o.value.trim(),topics:f(),locale:t,source:"contact-page",company:i.value.trim()}),y=await Bo(m);if(!m.ok){d(Ko(y,e.contact.updates.errors.generic));return}g(Wo(y,e.contact.updates.success)),o.value="",i.value="",o.focus()}catch{d(e.contact.updates.errors.generic)}finally{r.disabled=!1,r.classList.remove("is-loading")}})}function Uo({key:e,label:t}){return`
    <label class="updates-signup-choice">
      <input class="updates-signup-choice-input" type="checkbox" name="updates-signup-topic" value="${e}" />
      <span class="file-action contact-action updates-signup-choice-visual">
        <span class="file-action-icon updates-signup-choice-indicator" aria-hidden="true"></span>
        <span class="file-action-text updates-signup-choice-label">${t}</span>
      </span>
    </label>
  `}function Jo(){return`
    <style>
      #updates-signup .updates-signup-intro {
        margin: 0;
      }

      #updates-signup .updates-signup-form {
        gap: 0.55rem;
      }

      #updates-signup .updates-signup-info-button {
        flex: 0 0 auto;
      }

      #updates-signup .updates-signup-choice-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.55rem;
        padding: 0.08rem 0 0.14rem;
        overflow: visible;
      }

      #updates-signup .updates-signup-choice {
        position: relative;
        display: block;
        flex: 0 0 auto;
        cursor: pointer;
        overflow: visible;
      }

      #updates-signup .updates-signup-choice-visual {
        padding-right: 0.72rem;
      }

      #updates-signup .updates-signup-choice-input:focus-visible + .updates-signup-choice-visual {
        outline: none;
        box-shadow: 0 0 0 3px rgba(128, 148, 204, 0.26);
      }

      #updates-signup .updates-signup-choice-label {
        display: block;
        white-space: nowrap;
      }

      #updates-signup .updates-signup-choice-indicator {
        background: transparent;
        border: 1px solid var(--surface-inner-border);
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.18);
      }

      #updates-signup .updates-signup-choice-input:checked + .updates-signup-choice-visual .updates-signup-choice-indicator {
        border-color: transparent;
        background: linear-gradient(120deg, #f3b885, #f9e3b9, #ebb17f, #f3b885);
        background-size: 220% 220%;
        animation: askButtonGradient 20s linear infinite;
        box-shadow: none;
      }

      :root[data-theme='dark'] #updates-signup .updates-signup-choice-visual {
        color: var(--text-primary);
      }

      :root[data-theme='dark'] #updates-signup .updates-signup-choice-indicator {
        box-shadow: inset 0 0 0 2px rgba(11, 18, 34, 0.34);
      }

      :root[data-theme='dark'] #updates-signup .updates-signup-choice-input:checked + .updates-signup-choice-visual .updates-signup-choice-indicator {
        background: linear-gradient(120deg, #5f77db, #8eb6ff, #6b57b9, #5f77db);
        background-size: 220% 220%;
      }

      #updates-signup .updates-signup-meta {
        display: grid;
        gap: 0.3rem;
      }

      #updates-signup .updates-signup-feedback:empty {
        display: none;
      }

      #updates-signup .updates-signup-note {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
      }

      #updates-signup .updates-signup-note-text {
        display: inline;
      }
    </style>
  `}function Go(e,t={}){const n=Nt(t.overlayRoot),o=document.querySelector("#updates-signup-info-toggle"),i=Fo(e,n),r=i?.querySelector("#updates-signup-info-close"),s=i?.querySelector("[data-updates-signup-info-close]");if(!o||!i||!r||!s)return;document.body.classList.remove("footer-info-lock"),document.body.classList.remove("footer-info-open");let a=!1,l=!1,c=null,d=null,g=null;const f=()=>!i.hidden&&i.classList.contains("is-visible"),h=()=>{d&&(i.removeEventListener("transitionend",d),d=null),c&&(window.clearTimeout(c),c=null)},u=()=>{g&&(window.clearTimeout(g),g=null)},p=()=>{h(),u(),l=!1,i.hidden=!0,i.classList.remove("is-visible"),document.body.classList.remove("footer-info-lock"),document.body.classList.remove("footer-info-open"),a&&o.focus({preventScroll:!0}),a=!1},v=b=>{o.setAttribute("aria-expanded",b?"true":"false")},m=()=>{f()||l||(h(),u(),a=!1,i.hidden=!1,i.classList.remove("is-visible"),document.body.classList.add("footer-info-lock"),document.body.classList.add("footer-info-open"),v(!0),window.requestAnimationFrame(()=>{i.classList.add("is-visible"),g=window.setTimeout(()=>{g=null,!(i.hidden||l||!i.classList.contains("is-visible"))&&r.focus({preventScroll:!0})},xo)}))},y=({restoreFocus:b=!1}={})=>{i.hidden||l||(l=!0,h(),u(),a=b,v(!1),i.classList.remove("is-visible"),d=T=>{T.target!==i||T.propertyName!=="opacity"||p()},i.addEventListener("transitionend",d),c=window.setTimeout(p,Do+80))};o.addEventListener("click",()=>{if(f()){y({restoreFocus:!0});return}m()}),r.addEventListener("click",()=>y()),s.addEventListener("click",()=>y()),i.addEventListener("keydown",b=>{b.key==="Escape"&&y({restoreFocus:!0})})}function Fo(e,t){if(document.body.classList.remove("footer-info-lock"),document.querySelectorAll(`#${et}`).forEach(i=>{i.remove()}),!e?.contact?.updates)return null;const n=Nt(t),o=document.createElement("div");return o.id=et,o.className="footer-info-modal updates-signup-info-modal",o.hidden=!0,o.innerHTML=`
    <div class="footer-info-backdrop" data-updates-signup-info-close></div>
    <section
      id="${Mt}"
      class="footer-info-dialog updates-signup-info-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="updates-signup-info-title"
    >
      <p class="footer-info-kicker">${e.contact.updates.infoKicker}</p>
      <h2 id="updates-signup-info-title" class="section-title footer-info-title">${e.contact.updates.infoTitle}</h2>
      <p class="section-body footer-info-intro">${e.contact.updates.infoIntro}</p>
      <ul class="footer-info-list">
        ${e.contact.updates.infoPoints.map(i=>`<li>${i}</li>`).join("")}
      </ul>
      <button id="updates-signup-info-close" class="footer-info-close-button" type="button">
        ${e.contact.updates.infoClose}
      </button>
    </section>
  `,n.append(o),o}function Nt(e=null){if(e instanceof HTMLElement)return e;const t=document.querySelector("#overlay-root");return t instanceof HTMLElement?t:document.body}async function qo(e){if(!Ze)throw new Error("VITE_API_BASE_URL is not configured.");const t=new AbortController,n=window.setTimeout(()=>{t.abort()},Mo);try{return await fetch(`${Ze}${Ro}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e),signal:t.signal})}finally{window.clearTimeout(n)}}async function Bo(e){try{return await e.json()}catch{return null}}function Ko(e,t){return typeof e?.message=="string"&&e.message.trim()?e.message.trim():typeof e?.answer=="string"&&e.answer.trim()?e.answer.trim():t}function Wo(e,t){return typeof e?.message=="string"&&e.message.trim()?e.message.trim():t}function zo({t:e}){return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="contact-intro">
        <h2 class="section-title">${e.contact.title}</h2>
        <p class="section-body">${e.contact.intro}</p>
      </section>

      <section class="contact-stack section-reveal" aria-label="${e.contact.title}">
        ${me({label:e.contact.emailLabel,value:"johan.niemann.husbjerg@gmail.com",action:fe({type:"button",icon:Xo(),text:e.contact.copyEmail,attrs:'data-copy="johan.niemann.husbjerg@gmail.com"'})})}
        ${me({label:e.contact.phoneLabel,value:"+45 60 47 42 36",action:fe({type:"button",icon:Qo(),text:e.contact.copyPhone,attrs:'data-copy="+45 60 47 42 36"'})})}
        ${me({label:e.contact.linkedinLabel,value:"linkedin.com/in/johan-niemann-h-038906312",action:fe({type:"link",icon:"in",text:e.contact.connectLinkedin,attrs:`href="https://www.linkedin.com/in/johan-niemann-h-038906312/" target="_blank" rel="noopener noreferrer" data-feedback-label="${e.contact.connectedLinkedin}"`})})}
      </section>

      ${Ho({t:e})}
    </main>
  `}function Yo({t:e,language:t}){document.querySelectorAll(".contact-action").forEach(r=>{r.dataset.defaultLabel=r.querySelector(".file-action-text")?.textContent||""}),document.querySelectorAll("[data-copy]").forEach(r=>{r.addEventListener("click",async()=>{if(r.dataset.busy==="true")return;const s=r.getAttribute("data-copy")||"";!s||!await Zo(s)||await tt(r,e.contact.copied)})}),document.querySelectorAll("[data-feedback-label]").forEach(r=>{r.addEventListener("click",()=>{if(r.dataset.busy==="true")return;const s=r.getAttribute("data-feedback-label")||"";s&&tt(r,s)})}),Vo({t:e,language:t})}function me({label:e,value:t,action:n}){return`
    <article class="contact-row">
      <div class="contact-meta">
        <h3 class="contact-label">${e}</h3>
        <p class="contact-value">${t}</p>
      </div>
      <div class="contact-action-wrap">
        ${n}
      </div>
    </article>
  `}function fe({type:e,icon:t,text:n,attrs:o}){const i=e==="link"?"a":"button";return`
    <${i} class="file-action contact-action" ${e==="button"?'type="button"':""} ${o} aria-label="${n}">
      <span class="file-action-icon" aria-hidden="true">${t}</span>
      <span class="file-action-text">${n}</span>
    </${i}>
  `}function Xo(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.75 5.5h14.5A1.25 1.25 0 0 1 20.5 6.75v10.5a1.25 1.25 0 0 1-1.25 1.25H4.75a1.25 1.25 0 0 1-1.25-1.25V6.75A1.25 1.25 0 0 1 4.75 5.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="m4.5 7 7.5 5.8L19.5 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `}function Qo(){return`
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.9 3.8h2.8c.4 0 .8.27.9.67l.78 3.15a1 1 0 0 1-.28.96L9.78 10.9a13.2 13.2 0 0 0 3.31 3.31l2.32-1.32a1 1 0 0 1 .96-.28l3.15.78c.4.1.67.49.67.9v2.8a1.9 1.9 0 0 1-2.06 1.9c-2.7-.2-5.3-1.42-7.79-3.66-2.24-2.03-3.7-4.28-4.36-6.76-.29-1.1-.45-2.2-.49-3.3A1.9 1.9 0 0 1 6.9 3.8Z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `}async function Zo(e){try{return await navigator.clipboard.writeText(e),!0}catch{const t=document.createElement("textarea");t.value=e,t.setAttribute("readonly",""),t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();const n=document.execCommand("copy");return document.body.removeChild(t),n}}async function tt(e,t){const n=e.querySelector(".file-action-text");if(!n)return;const o=e.dataset.defaultLabel||n.textContent||"",i=180,r=900,s=220;e.dataset.busy="true";const a=Math.ceil(e.getBoundingClientRect().width),l=ei(e,n,t);e.style.width=`${a}px`,e.classList.add("is-label-hidden"),await z(i),n.textContent=t,nt(e,l),e.classList.remove("is-label-hidden"),await z(r),e.classList.add("is-label-hidden"),await z(i),n.textContent=o,nt(e,a),e.classList.remove("is-label-hidden"),await z(s),e.style.width="",e.dataset.busy="false"}function ei(e,t,n){const o=t.textContent,i=e.style.width;t.textContent=n,e.style.width="auto";const r=Math.ceil(e.getBoundingClientRect().width);return t.textContent=o,e.style.width=i,r}function nt(e,t){window.requestAnimationFrame(()=>{e.style.width=`${t}px`})}function z(e){return new Promise(t=>{window.setTimeout(t,e)})}const ti=Object.freeze(Object.defineProperty({__proto__:null,mount:Yo,render:zo},Symbol.toStringTag,{value:"Module"})),Ct={VITE_GEOJOHAN_ROUND1_TITLE:"Round 1: Address",VITE_GEOJOHAN_ROUND1_PANO_ID:void 0,VITE_GEOJOHAN_ROUND1_PANO_LAT:"55.6655113",VITE_GEOJOHAN_ROUND1_PANO_LNG:"12.5431293",VITE_GEOJOHAN_ROUND1_POV_HEADING:void 0,VITE_GEOJOHAN_ROUND1_POV_PITCH:void 0,VITE_GEOJOHAN_ROUND1_ANSWER_LAT:"55.6654113",VITE_GEOJOHAN_ROUND1_ANSWER_LNG:"12.5433376",VITE_GEOJOHAN_ROUND1_SUMMARY_ADDRESS:"Enghavevej 63, 1674 København",VITE_GEOJOHAN_ROUND1_SUMMARY_CONTEXT_DK:"På Vesterbro tæt på Enghaveplads.",VITE_GEOJOHAN_ROUND1_SUMMARY_CONTEXT_EN:"In Vesterbro, close to Enghave Plads.",VITE_GEOJOHAN_ROUND2_TITLE:"Round 2: Work",VITE_GEOJOHAN_ROUND2_PANO_ID:void 0,VITE_GEOJOHAN_ROUND2_PANO_LAT:"55.6375536",VITE_GEOJOHAN_ROUND2_PANO_LNG:"12.583142",VITE_GEOJOHAN_ROUND2_POV_HEADING:void 0,VITE_GEOJOHAN_ROUND2_POV_PITCH:void 0,VITE_GEOJOHAN_ROUND2_ANSWER_LAT:"55.6371638",VITE_GEOJOHAN_ROUND2_ANSWER_LNG:"12.5830904",VITE_GEOJOHAN_ROUND2_SUMMARY_ADDRESS:"Ørestads Blvd. 45, 2300 København S",VITE_GEOJOHAN_ROUND2_SUMMARY_CONTEXT_DK:"Hos Norlys tæt på Bella Center.",VITE_GEOJOHAN_ROUND2_SUMMARY_CONTEXT_EN:"At Norlys, close to Bella Center.",VITE_GEOJOHAN_ROUND3_TITLE:"Round 3: School",VITE_GEOJOHAN_ROUND3_PANO_ID:void 0,VITE_GEOJOHAN_ROUND3_PANO_LAT:"55.6911753",VITE_GEOJOHAN_ROUND3_PANO_LNG:"12.5545637",VITE_GEOJOHAN_ROUND3_POV_HEADING:void 0,VITE_GEOJOHAN_ROUND3_POV_PITCH:void 0,VITE_GEOJOHAN_ROUND3_ANSWER_LAT:"55.691502",VITE_GEOJOHAN_ROUND3_ANSWER_LNG:"12.554989",VITE_GEOJOHAN_ROUND3_SUMMARY_ADDRESS:"Guldbergsgade 29N, 2200 København",VITE_GEOJOHAN_ROUND3_SUMMARY_CONTEXT_DK:"På EK tæt på Nørrebros Runddel.",VITE_GEOJOHAN_ROUND3_SUMMARY_CONTEXT_EN:"At EK, close to Nørrebros Runddel."};function Dt(e){return String(Ct[e]||"").trim()}function xt(e){const t=Number(Ct[e]);return Number.isFinite(t)?t:null}const ni=[{roundId:"address",title:"Where in Copenhagen do I live?",streetViewPanoId:"",streetViewPov:{heading:34,pitch:5},streetViewLocation:{lat:55.6761,lng:12.5683},answerLocation:{lat:55.6761,lng:12.5683}},{roundId:"work",title:"Where in Copenhagen do I work?",streetViewPanoId:"",streetViewPov:{heading:34,pitch:5},streetViewLocation:{lat:55.6908,lng:12.5443},answerLocation:{lat:55.6908,lng:12.5443}},{roundId:"school",title:"Where in Copenhagen do I study?",streetViewPanoId:"",streetViewPov:{heading:34,pitch:5},streetViewLocation:{lat:55.7024,lng:12.5628},answerLocation:{lat:55.7024,lng:12.5628}}];function oi(){let e=!1;return{rounds:ni.map((n,o)=>{const r=`VITE_GEOJOHAN_ROUND${o+1}`,s=it(`${r}_TITLE`,n.title),a=it(`${r}_PANO_ID`,n.streetViewPanoId||""),l=ot(`${r}_PANO`,n.streetViewLocation),c={heading:se(`${r}_POV_HEADING`,n.streetViewPov?.heading??34),pitch:se(`${r}_POV_PITCH`,n.streetViewPov?.pitch??5)},d=ot(`${r}_ANSWER`,n.answerLocation),g=Y(`${r}_PANO_LAT`)&&Y(`${r}_PANO_LNG`)&&Y(`${r}_ANSWER_LAT`)&&Y(`${r}_ANSWER_LNG`);return g||(e=!0),{...n,title:s,streetViewPanoId:a,streetViewLocation:l,streetViewPov:c,answerLocation:d,hasCustomCoordinates:g}}),usingFallbackCoordinates:e}}function ot(e,t){return{lat:se(`${e}_LAT`,t.lat),lng:se(`${e}_LNG`,t.lng)}}function Y(e){return xt(e)!==null}function se(e,t){const n=xt(e);return n===null?t:n}function it(e,t){return Dt(e)||t}const ii={lat:55.6761,lng:12.5683},rt={lat:55.6761,lng:12.5683},I=[{km:0,points:5e3},{km:1,points:4700},{km:5,points:3900},{km:25,points:2500},{km:100,points:1200},{km:500,points:450},{km:2e4,points:250}],ri=1500,Ht=[120,420,780],st={heading:34,pitch:5},si=320,ae="https://johanscv-api-johu0002-no.azurewebsites.net".replace(/\/$/,""),ai="/api/geojohan/maps-key",Ae={address:{glyph:"🏠"},work:{glyph:"💼"},school:{glyph:"🎓"}};let J=null,at=0;const li=560,A={AUTH:"GEOJOHAN_AUTH_FAILED",MAPS_KEY_UNAVAILABLE:"GEOJOHAN_MAPS_KEY_UNAVAILABLE",MAPS_KEY_REQUEST_FAILED:"GEOJOHAN_MAPS_KEY_REQUEST_FAILED",MAPS_SCRIPT_LOAD_FAILED:"GEOJOHAN_MAPS_SCRIPT_LOAD_FAILED"};function ci({t:e}){return`
    <main class="page-stack">
      ${De({t:e})}
    </main>
  `}function De({t:e}){return`
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
  `}function Vt({t:e,language:t="en"}){const n=document.querySelector("#geojohan-root");if(!n)return;const o=++at,i=oi(),r=pi();if(!r)return;const s={roundIndex:0,phase:"loading",guessLatLng:null,totalScore:0,roundResults:[],rounds:i.rounds,maps:null,map:null,panorama:null,streetViewService:null,guessMarker:null,answerMarker:null,guessLine:null,mapClickListener:null,viewportTimers:[],summaryTransitionTimer:null},a=()=>o===at&&n.isConnected;r.guessBtn.addEventListener("click",()=>{a()&&fi(s,r,e)}),r.continueBtn.addEventListener("click",()=>{a()&&hi(s,r,e,t)}),r.replayBtn.addEventListener("click",()=>{a()&&bi(s,r,e)}),i.usingFallbackCoordinates&&(r.configNote.textContent=e.geojohan.demoCoordinatesNote),di().then(l=>ji(l)).then(async l=>{a()&&(s.maps=l,s.streetViewService=new l.StreetViewService,await xe(s,r,e))}).catch(l=>{if(!a())return;const{message:c,hint:d}=ui(l,e);r.feedback.textContent=d?`${c} ${d}`:c,K(r,"hidden"),console.warn("GeoJohan initialization failed:",l?.code||l?.message||l)})}async function di(){if(!ae)throw $(A.MAPS_KEY_REQUEST_FAILED,"VITE_API_BASE_URL is not configured.");let e="";try{e=await Cn()}catch(i){const r=i instanceof Error?i.message:"Unable to authenticate GeoJohan maps request.",s=/access code is required/i.test(r);throw $(s?A.AUTH:A.MAPS_KEY_REQUEST_FAILED,r)}let t;try{t=await fetch(`${ae}${ai}`,{headers:{Authorization:`Bearer ${e}`}})}catch(i){throw $(A.MAPS_KEY_REQUEST_FAILED,i instanceof Error?i.message:"GeoJohan maps key request failed.")}if(!t.ok)throw t.status===401?$(A.AUTH,"GeoJohan maps key request requires valid authentication."):t.status===503?$(A.MAPS_KEY_UNAVAILABLE,"GeoJohan maps key is unavailable in the API response."):$(A.MAPS_KEY_REQUEST_FAILED,`GeoJohan maps key request failed (${t.status}).`);const n=await t.json(),o=typeof n?.mapsApiKey=="string"?n.mapsApiKey.trim():"";if(!o)throw $(A.MAPS_KEY_UNAVAILABLE,"GeoJohan maps key is missing in response.");return o}function $(e,t){const n=new Error(t);return n.code=e,n}function ui(e,t){return e?.code===A.AUTH?{message:t.geojohan.authError||t.geojohan.loadError,hint:t.geojohan.authErrorHint||""}:e?.code===A.MAPS_KEY_UNAVAILABLE?{message:t.geojohan.missingKey,hint:t.geojohan.missingKeyHint||""}:e?.code===A.MAPS_KEY_REQUEST_FAILED?{message:t.geojohan.apiError||t.geojohan.loadError,hint:t.geojohan.apiErrorHint||""}:{message:ae?t.geojohan.loadError:t.geojohan.missingKey,hint:ae?t.geojohan.loadErrorHint||"":t.geojohan.missingKeyHint||""}}function pi(){const e=document.querySelector("#geojohan-root"),t=document.querySelector("#geojohan-shell"),n=document.querySelector("#geojohan-progress"),o=document.querySelector("#geojohan-round-title"),i=document.querySelector("#geojohan-running-score"),r=document.querySelector("#geojohan-config-note"),s=document.querySelector("#geojohan-panorama"),a=document.querySelector(".geojohan-stage"),l=document.querySelector("#geojohan-map"),c=document.querySelector("#geojohan-feedback"),d=document.querySelector("#geojohan-guess"),g=document.querySelector("#geojohan-continue"),f=document.querySelector("#geojohan-summary"),h=document.querySelector("#geojohan-total"),u=document.querySelector("#geojohan-summary-list"),p=document.querySelector("#geojohan-replay");return!e||!t||!n||!o||!i||!r||!s||!a||!l||!c||!d||!g||!f||!h||!u||!p?null:{root:e,shell:t,progress:n,roundTitle:o,runningScore:i,configNote:r,panoramaEl:s,stageEl:a,mapEl:l,feedback:c,guessBtn:d,continueBtn:g,summary:f,total:h,summaryList:u,replayBtn:p}}async function xe(e,t,n){const o=e.rounds[e.roundIndex],i=t.shell.classList.contains("is-reviewing-result");Ve(e),Ue(e),e.phase="loading",e.guessLatLng=null,t.root.classList.remove("is-finishing-results","is-results-view"),t.shell.classList.remove("is-finishing-summary"),t.shell.classList.remove("is-finished"),He(t,!1),t.summary.classList.remove("is-visible"),t.progress.textContent=`${n.geojohan.progressLabel} ${e.roundIndex+1}/${e.rounds.length}`,t.roundTitle.textContent=Ee(o,n),t.runningScore.textContent=`${n.geojohan.currentTotalLabel}: ${e.totalScore}`,t.feedback.textContent=n.geojohan.loadingRound,K(t,"hidden"),await Li(t,i);const r=await gi(e,t,o);e.phase="guessing",t.feedback.textContent=r?n.geojohan.roundReady:n.geojohan.streetViewFallback,Ut(e,o)}async function gi(e,t,n){const o=e.maps,i=n.answerLocation||ii,r=String(n.streetViewPanoId||"").trim(),s=_i(n.streetViewPov);e.map?(e.map.setCenter(i),e.map.setZoom(11)):e.map=new o.Map(t.mapEl,{center:i,zoom:11,disableDefaultUI:!0,gestureHandling:"greedy"}),e.mapClickListener&&(e.mapClickListener.remove(),e.mapClickListener=null),e.mapClickListener=e.map.addListener("click",d=>{e.phase==="guessing"&&(e.guessLatLng={lat:d.latLng.lat(),lng:d.latLng.lng()},e.guessMarker?(e.guessMarker.setPosition(e.guessLatLng),e.guessMarker.setMap(e.map)):e.guessMarker=new o.Marker({map:e.map,position:e.guessLatLng}),K(t,"guess"))});const a=r?null:await Ei(e,n.streetViewLocation),l=a?.position||n.streetViewLocation||rt;e.panorama&&e.panorama.setVisible(!1),t.panoramaEl.innerHTML="",e.panorama=new o.StreetViewPanorama(t.panoramaEl,{...r?{pano:r}:{},position:l,pov:s,zoom:1,disableDefaultUI:!0,addressControl:!1,fullscreenControl:!1,keyboardShortcuts:!1,clickToGo:!1,linksControl:!1,showRoadLabels:!1}),Ii(e,l),e.panorama.setPov(s),e.panorama.setVisible(!0);let c=!1;return e.panorama.addListener("status_changed",()=>{if(c||!e.panorama)return;const d=e.panorama.getStatus?.();(d===o.StreetViewStatus.ZERO_RESULTS||d===o.StreetViewStatus.UNKNOWN_ERROR)&&(c=!0,e.panorama.setPosition(rt))}),Ti(e,l,r),mi(e),!!(r||a)}function mi(e){e.guessMarker&&e.guessMarker.setMap(null),e.answerMarker&&e.answerMarker.setMap(null),e.guessLine&&e.guessLine.setMap(null),e.guessMarker=null,e.answerMarker=null,e.guessLine=null}function fi(e,t,n){if(e.phase!=="guessing"||!e.guessLatLng)return;const o=e.rounds[e.roundIndex],i=Jt(e.guessLatLng,o.answerLocation),r=Ai(i);e.phase="submitted",e.totalScore+=r,e.roundResults[e.roundIndex]={roundId:o.roundId,title:Ee(o,n),distanceKm:i,points:r},t.feedback.textContent=`${n.geojohan.distanceLabel}: ${Gt(i)} · ${n.geojohan.pointsLabel}: ${r}`,t.runningScore.textContent=`${n.geojohan.currentTotalLabel}: ${e.totalScore}`,K(t,"continue"),He(t,!0);const s=e.maps,a=Si(s,o.roundId);e.answerMarker=new s.Marker({map:e.map,position:o.answerLocation,title:Ee(o,n),icon:a.icon}),e.guessLine=new s.Polyline({map:e.map,path:[e.guessLatLng,o.answerLocation],strokeOpacity:.9,strokeWeight:3});const l=new s.LatLngBounds;l.extend(e.guessLatLng),l.extend(o.answerLocation),e.map.fitBounds(l,60),Ue(e),Ut(e,o)}function hi(e,t,n,o){if(e.phase==="submitted"){if(e.roundIndex>=e.rounds.length-1){vi(e,t,n,o);return}e.roundIndex+=1,xe(e,t,n)}}function vi(e,t,n,o){Ve(e),Ue(e),e.phase="finished",K(t,"hidden"),He(t,!1);const i=e.rounds.length*I[0].points,r=n.geojohan.distanceFromGuessLabel||n.geojohan.distanceLabel;t.total.textContent=`${n.geojohan.totalScoreLabel}: ${e.totalScore}/${i}`,t.summaryList.innerHTML=e.roundResults.map(s=>{const a=yi(s.roundId,o,n),l=wi(s.roundId);return`
        <article class="project-card geojohan-summary-item">
          <h4 class="project-title">${l?`${l} `:""}${s.title}</h4>
          ${a?.address?`<p class="project-summary geojohan-summary-address">${a.address}</p>`:""}
          ${a?.context?`<p class="project-summary geojohan-summary-context">${a.context}</p>`:""}
          <p class="project-summary">${r}: ${Gt(s.distanceKm)}</p>
          <p class="project-summary">${n.geojohan.pointsLabel}: ${s.points}</p>
        </article>
      `}).join(""),t.root.classList.add("is-finishing-results"),t.shell.classList.add("is-finishing-summary"),e.summaryTransitionTimer=window.setTimeout(()=>{t.root.classList.remove("is-finishing-results"),t.root.classList.add("is-results-view"),t.shell.classList.remove("is-finishing-summary"),t.shell.classList.add("is-finished"),t.summary.classList.add("is-visible"),e.summaryTransitionTimer=null},si)}function bi(e,t,n){Ve(e),e.roundIndex=0,e.phase="loading",e.guessLatLng=null,e.totalScore=0,e.roundResults=[],xe(e,t,n)}function K(e,t){const n=t==="guess",o=t==="continue";e.guessBtn.classList.toggle("is-visible",n),e.guessBtn.classList.toggle("is-hidden",!n),e.guessBtn.disabled=!n,e.continueBtn.classList.toggle("is-visible",o),e.continueBtn.classList.toggle("is-hidden",!o),e.continueBtn.disabled=!o}function He(e,t){e.shell.classList.toggle("is-reviewing-result",t)}function Ee(e,t){return t?.geojohan?.roundTitles?.[e.roundId]||e.title}function yi(e,t,n){const o=ki(e);if(!o)return n?.geojohan?.summaryLocations?.[e]||null;const i=`VITE_GEOJOHAN_ROUND${o}_SUMMARY`,r=lt(`${i}_ADDRESS`),s=t==="dk"?`${i}_CONTEXT_DK`:`${i}_CONTEXT_EN`,a=lt(s),l=n?.geojohan?.summaryLocations?.[e]||null;return!r&&!a?l:{address:r||l?.address||"",context:a||l?.context||""}}function ki(e){return e==="address"?1:e==="work"?2:e==="school"?3:null}function wi(e){return Ae[e]?.glyph||""}function lt(e){return Dt(e)}function Si(e,t){const n=Ae[t]||Ae.address,o=64,i=o/2,s=`
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
  `;return{icon:{url:`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s)}`,scaledSize:new e.Size(o,o),anchor:new e.Point(i,i)}}}function Ve(e){e.summaryTransitionTimer&&(window.clearTimeout(e.summaryTransitionTimer),e.summaryTransitionTimer=null)}function Ut(e,t){e.maps&&Ht.forEach(n=>{const o=window.setTimeout(()=>{if(e.map)if(e.maps.event.trigger(e.map,"resize"),e.phase==="submitted"&&e.guessLatLng&&t?.answerLocation){const i=new e.maps.LatLngBounds;i.extend(e.guessLatLng),i.extend(t.answerLocation),e.map.fitBounds(i,60)}else t?.answerLocation&&e.map.setCenter(t.answerLocation);e.panorama&&e.maps.event.trigger(e.panorama,"resize")},n);e.viewportTimers.push(o)})}function Ai(e){if(e<=.025||e<=I[0].km)return I[0].points;for(let t=1;t<I.length;t+=1){const n=I[t-1],o=I[t];if(e<=o.km){const i=(e-n.km)/(o.km-n.km),r=n.points+(o.points-n.points)*i;return Math.round(r)}}return I[I.length-1].points}function Jt(e,t){const o=X(t.lat-e.lat),i=X(t.lng-e.lng),r=X(e.lat),s=X(t.lat),a=Math.sin(o/2)**2+Math.cos(r)*Math.cos(s)*Math.sin(i/2)**2;return 6371*(2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)))}function X(e){return e*Math.PI/180}function Gt(e){return e<1?`${(e*1e3).toFixed(0)} m`:`${e.toFixed(1)} km`}async function Ei(e,t){if(!e.streetViewService||!e.maps)return{position:t,fromService:!1};const n=e.maps,o=await ct(e,t,n.StreetViewSource.OUTDOOR);if(o)return o;const i=await ct(e,t,n.StreetViewSource.DEFAULT);return i||null}async function ct(e,t,n){let o=null;try{o=await e.streetViewService.getPanorama({location:t,radius:ri,preference:e.maps.StreetViewPreference.NEAREST,source:n})}catch{return null}const i=o?.data?.location?.latLng;return i?{position:{lat:i.lat(),lng:i.lng()},fromService:!0}:null}function Ti(e,t,n=""){!e.maps||!e.panorama||Ht.forEach(o=>{const i=window.setTimeout(()=>{!e.panorama||!e.maps||(e.panorama.setVisible(!0),n?e.panorama.setPano(n):t&&e.panorama.setPosition(t),e.maps.event.trigger(e.panorama,"resize"))},o);e.viewportTimers.push(i)})}function Ue(e){e.viewportTimers.length&&(e.viewportTimers.forEach(t=>{window.clearTimeout(t)}),e.viewportTimers=[])}function Li(e,t){return t?new Promise(n=>{let o=!1;const i=()=>{o||(o=!0,e.stageEl.removeEventListener("transitionend",r),n())},r=s=>{s.target===e.stageEl&&i()};e.stageEl.addEventListener("transitionend",r),window.setTimeout(i,li)}):Promise.resolve()}function _i(e){const t=Number(e?.heading),n=Number(e?.pitch);return{heading:Number.isFinite(t)?t:st.heading,pitch:Number.isFinite(n)?n:st.pitch}}function Ii(e,t){if(!e.panorama)return;const n=e.panorama,o=dt(t);if(!o)return;let i=!1;n.addListener("position_changed",()=>{if(i)return;const r=n.getPosition?.(),s=dt(r);s&&(Jt(s,o)*1e3<.5||(i=!0,n.setPosition(o),window.setTimeout(()=>{i=!1},0)))})}function dt(e){if(!e)return null;const t=typeof e.lat=="function"?e.lat():Number(e.lat),n=typeof e.lng=="function"?e.lng():Number(e.lng);return!Number.isFinite(t)||!Number.isFinite(n)?null:{lat:t,lng:n}}function ji(e){return window.google?.maps?Promise.resolve(window.google.maps):J||(J=new Promise((t,n)=>{const o=`__geojohanMapsReady${Date.now()}`;window[o]=()=>{delete window[o],t(window.google.maps)};const i=document.createElement("script");i.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(e)}&callback=${o}&v=weekly`,i.async=!0,i.defer=!0,i.onerror=()=>{delete window[o],J=null,n($(A.MAPS_SCRIPT_LOAD_FAILED,"Google Maps failed to load"))},document.head.appendChild(i)}),J)}const Pi=Object.freeze(Object.defineProperty({__proto__:null,mount:Vt,render:ci,renderGeoJohanSection:De},Symbol.toStringTag,{value:"Module"})),ut="https://johanscv-api-johu0002-no.azurewebsites.net".replace(/\/$/,""),$i="/api/music-dashboard/snapshot",Oi=2e4,Ri=600*1e3,Mi=or(void 0),Ni=10*1e3,de=["tracks","albums","artists"],Ci=6,Di=6,xi=3600,Hi=12e3,Vi=38,Ui=2,R=3e3,Ji=140;let oe=0,D=null,ie=0,q=null,Te="";const Je=new WeakMap,le=new Set;let Q=null;function Gi({t:e}){return`
    <section class="content-section section-reveal spotify-dashboard" id="spotify-dashboard-root" aria-live="polite">
      <header class="spotify-dashboard-header">
        <h3 class="section-title">${e.spotifyDashboard.title}</h3>
        <p class="section-body spotify-dashboard-intro">${e.spotifyDashboard.intro}</p>
      </header>
      <div class="spotify-dashboard-shell" id="spotify-dashboard-shell"></div>
    </section>
  `}function Fi({t:e}){const t=document.querySelector("#spotify-dashboard-root"),n=document.querySelector("#spotify-dashboard-shell");if(!t||!n)return;Q?.(),Ft(),j();let o=!1,i=0,r=null;const s={t:e,status:"loading",activeView:"tracks",snapshot:null,lists:{tracks:[],albums:[],artists:[]},message:"",retryAfterSeconds:0},a=()=>{o||(o=!0,i&&(window.clearTimeout(i),i=0),window.removeEventListener("resize",l),r&&(r.disconnect(),r=null),Q===a&&(Q=null))},l=()=>{if(!o){if(!t.isConnected||!n.isConnected){a();return}i&&window.clearTimeout(i),i=window.setTimeout(()=>{if(i=0,!(o||s.status!=="ready")){if(!t.isConnected||!n.isConnected){a();return}qt(n)}},Ji)}};Q=a,n.addEventListener("click",c=>{const d=c.target.closest("button[data-action]");if(!d)return;const g=d.dataset.action;if(g==="retry-snapshot"){Le(s,n,{refresh:!1});return}if(g==="set-view"){const f=String(d.dataset.view||"");de.includes(f)&&(j(),s.activeView=f,M(s,n));return}g==="toggle-preview"&&Qi(d)}),window.addEventListener("resize",l,{passive:!0}),typeof ResizeObserver<"u"&&(r=new ResizeObserver(()=>{l()}),r.observe(t),r.observe(n)),Le(s,n,{refresh:!1}),qi(s,n,t,a)}function qi(e,t,n,o=()=>{}){oe=window.setInterval(()=>{if(!n.isConnected||!t.isConnected){Ft(),j(),o();return}Le(e,t,{refresh:!0,suppressLoading:!0})},Mi)}function Ft(){oe&&(window.clearInterval(oe),oe=0)}async function Le(e,t,{refresh:n=!1,suppressLoading:o=!1}){const i=!!e.snapshot&&e.status==="ready",r=o&&i;if(r||(e.status="loading",e.message="",e.retryAfterSeconds=0,M(e,t)),!ut){if(r)return;e.status="error",e.message=e.t.spotifyDashboard.apiBaseMissing,M(e,t);return}const a=`${ut}${$i}${n?"?refresh=true":""}`;let l;try{l=await tr(a,{method:"GET"})}catch{if(r)return;e.status="error",e.message=e.t.spotifyDashboard.networkError,M(e,t);return}const c=await nr(l);if(l.status===429){if(r)return;e.status="error",e.retryAfterSeconds=Number(c?.retryAfterSeconds||0),e.message=pt(c?.message,e.t.spotifyDashboard.rateLimited),M(e,t);return}if(!l.ok){if(r)return;e.status="error",e.message=pt(c?.message,e.t.spotifyDashboard.loadError),M(e,t);return}try{const d=Zi(c);e.snapshot=d,e.lists=d.lists,de.includes(e.activeView)||(e.activeView="tracks"),e.status="ready"}catch{if(r)return;e.status="error",e.message=e.t.spotifyDashboard.invalidPayload}M(e,t)}function M(e,t){if(Xi(),j(),e.status==="loading"){t.innerHTML=`
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
    `;return}t.innerHTML=Bi(e),qt(t)}function Bi(e){const t=Array.isArray(e.lists[e.activeView])?e.lists[e.activeView]:[],n=zi(t,e.t),o=er(e.snapshot?.snapshotTimestamp),i=`${e.t.spotifyDashboard.lastUpdated}: ${o} - ${e.t.spotifyDashboard.autoRefreshNote}`,r=e.snapshot?.periodFallbackUsed?`<p class="spotify-dashboard-status">${e.t.spotifyDashboard.weekFallback}</p>`:"";return`
    <div class="spotify-dashboard-ready">
      <div class="spotify-dashboard-controls">
        <div class="spotify-dashboard-tabs" role="tablist" aria-label="${e.t.spotifyDashboard.switchLabel}">
          ${Ki(e.activeView,e.t)}
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
  `}function Ki(e,t){const n={tracks:t.spotifyDashboard.tabs.tracks,albums:t.spotifyDashboard.tabs.albums,artists:t.spotifyDashboard.tabs.artists};return`
    <div class="spotify-dashboard-view-toggle is-${e}">
      <span class="spotify-dashboard-view-indicator" aria-hidden="true"></span>
      ${de.map(o=>Wi(o,e,n)).join("")}
    </div>
  `}function Wi(e,t,n){const o=e===t;return`
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
  `}function zi(e,t){const n=[];for(let o=0;o<Ci;o+=1){const i=e[o];if(!i){n.push(`
        <article class="project-card spotify-dashboard-card is-placeholder">
          <div class="spotify-dashboard-image spotify-dashboard-image-placeholder" aria-hidden="true"></div>
          <h4 class="project-title">${t.spotifyDashboard.emptyTitle}</h4>
          <p class="project-summary">${t.spotifyDashboard.emptySlot}</p>
        </article>
      `);continue}const r=E(i.title),s=E(i.subtitle),a=Number(i.playCount||0),l=String(i.previewUrl||"").trim(),c=!!l,d=`${a} ${a===1?t.spotifyDashboard.playSingle:t.spotifyDashboard.playPlural}`,g=`#${o+1} ${t.spotifyDashboard.rankWith} ${d}`,f=i.imageUrl?`<img class="spotify-dashboard-image" src="${E(i.imageUrl)}" alt="${r}" loading="lazy" />`:'<div class="spotify-dashboard-image spotify-dashboard-image-placeholder" aria-hidden="true"></div>',h=c?`
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
        ${f}
        ${h}
      </div>
    `,p=i.spotifyUrl?`
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
          <h4 class="project-title spotify-dashboard-card-title">${p}</h4>
          <div class="spotify-dashboard-card-meta">
            <p class="project-summary spotify-dashboard-card-subtitle">
              <span class="spotify-dashboard-marquee">
                <span class="spotify-dashboard-marquee-track">${s}</span>
              </span>
            </p>
            <p class="spotify-dashboard-rank-line">${E(g)}</p>
          </div>
        </div>
      </article>
    `)}return n}function qt(e){const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches;e.querySelectorAll(".spotify-dashboard-marquee").forEach(o=>{const i=o.querySelector(".spotify-dashboard-marquee-track");if(!i)return;Bt(i),o.classList.remove("is-overflowing"),o.classList.remove("is-moving");const r=Math.ceil(i.scrollWidth-o.clientWidth);if(r<=Di||t)return;const a=Math.min(Hi,Math.max(xi,Math.round(r/Vi*1e3)))*Ui;Yi(o,i,r,a)&&o.classList.add("is-overflowing")})}function Yi(e,t,n,o){if(typeof t.animate!="function")return!1;const i=o*2+R*2,r=R/i,s=(R+o)/i,a=(R+o+R)/i,l=t.animate([{transform:"translateX(0)",offset:0},{transform:"translateX(0)",offset:r},{transform:`translateX(-${n}px)`,offset:s},{transform:`translateX(-${n}px)`,offset:a},{transform:"translateX(0)",offset:1}],{duration:i,easing:"linear",iterations:Number.POSITIVE_INFINITY,fill:"both"}),c=R,d=c+o,g=d+R,f=i,h={marqueeEl:e,trackEl:t,animation:l,rafId:0},u=()=>{if(!t.isConnected||!e.isConnected){Bt(t);return}const v=(Number(l.currentTime||0)%i+i)%i,m=v>c&&v<d||v>g&&v<f;e.classList.toggle("is-moving",m),h.rafId=window.requestAnimationFrame(u)};return Je.set(t,h),le.add(h),u(),!0}function Bt(e){const t=Je.get(e);t&&Kt(t)}function Xi(){if(!le.size)return;[...le].forEach(t=>{Kt(t)})}function Kt(e){e&&(e.rafId&&(window.cancelAnimationFrame(e.rafId),e.rafId=0),e.animation?.cancel(),e.marqueeEl?.classList.remove("is-moving"),e.trackEl.style.transform="",Je.delete(e.trackEl),le.delete(e))}async function Qi(e){const t=String(e.dataset.previewUrl||"").trim(),n=String(e.dataset.previewCardId||"").trim();if(!t||!n)return;if(D&&Te===n){j();return}j();const o=new Audio(t);D=o,Te=n,q=e,Wt(e,!0),o.addEventListener("ended",()=>{j()},{once:!0});try{await o.play()}catch{j();return}ie=window.setTimeout(()=>{j()},Ni)}function j(){ie&&(window.clearTimeout(ie),ie=0),D&&(D.pause(),D.currentTime=0,D=null),q&&q.isConnected&&Wt(q,!1),q=null,Te=""}function Wt(e,t){const n=String(e.dataset.labelPlay||"Play preview"),o=String(e.dataset.labelStop||"Stop preview");e.classList.toggle("is-playing",t),e.setAttribute("aria-pressed",String(t)),e.setAttribute("aria-label",t?o:n)}function Zi(e){if(!e||typeof e!="object")throw new Error("Snapshot payload is invalid.");const t=e.lists;if(!t||typeof t!="object")throw new Error("Snapshot payload is missing lists.");for(const n of de)if(!Array.isArray(t[n]))throw new Error(`Snapshot payload is missing ${n} list.`);return{snapshotTimestamp:e.snapshotTimestamp,periodFallbackUsed:!!e.periodFallbackUsed,lists:{tracks:t.tracks,albums:t.albums,artists:t.artists}}}function pt(e,t){return String(e||"").trim()||t}function er(e){const t=String(e||"").trim();if(!t)return"N/A";const n=new Date(t);return Number.isNaN(n.getTime())?"N/A":new Intl.DateTimeFormat(void 0,{dateStyle:"medium",timeStyle:"short"}).format(n)}async function tr(e,t){const n=new AbortController,o=window.setTimeout(()=>n.abort(),Oi);try{return await fetch(e,{...t,signal:n.signal})}finally{window.clearTimeout(o)}}async function nr(e){try{return await e.json()}catch{return null}}function E(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function or(e){const t=Number(e);return!Number.isFinite(t)||t<1e4?Ri:Math.floor(t)}function ir({t:e}){return`
    <main class="page-stack">
      <section class="content-section section-reveal" id="playground">
        <h2 class="section-title">${e.playground.title}</h2>
        <p class="section-body">${e.playground.intro}</p>
      </section>

      ${Lt({t:e})}
      ${De({t:e})}
      ${Gi({t:e})}

      <section class="content-section section-reveal" id="playground-more">
        <h3 class="section-title">${e.playground.moreToComeTitle}</h3>
        <p class="section-body">${e.playground.moreToComeBody}</p>
      </section>
    </main>
  `}function rr({language:e,t}){_t(e),Vt({t}),Fi({t})}const gt=Object.freeze(Object.defineProperty({__proto__:null,mount:rr,render:ir},Symbol.toStringTag,{value:"Module"}));function sr(e){return`<div class="page-transition-enter">${e}</div>`}const he={"/":ho,"/projects":Rt,"/resume":Oo,"/contact":ti,"/playground":gt,"/quiz":gt,"/quiz/geojohan":Pi},_e="/",ar=500,mt="/projects/",lr={"/files":"/resume"};function zt(e){const t=e.startsWith("/")?e.slice(1):e;return`${_e}${t}`}function ft(e=window.location.pathname){if(!e.startsWith(_e))return"/";const t=e.slice(_e.length-1)||"/";return t.length>1&&t.endsWith("/")?t.slice(0,-1):t}function cr({mountEl:e,renderFrame:t,pageContext:n,onRouteChange:o}){let i=!1;const r=()=>{const a=ft(),l=lr[a]||a,c=ur(l),d=n(l);a!==l&&history.replaceState({},"",zt(l)),e.innerHTML=sr(c.render(d)),c.mount&&c.mount(d),o(l),requestAnimationFrame(()=>{const g=e.querySelector(".page-transition-enter");g&&g.classList.add("is-visible")})},s=()=>{if(i)return;i=!0;const a=e.querySelector(".page-transition-enter");if(!a){r(),i=!1;return}a.classList.remove("is-visible"),a.classList.add("is-exiting"),window.setTimeout(()=>{r(),i=!1},ar)};return document.addEventListener("click",a=>{const l=a.target.closest("[data-link]");if(!l)return;const c=l.getAttribute("href");!c||!c.startsWith("/")||(a.preventDefault(),c!==ft()&&dr(c,s))}),window.addEventListener("popstate",s),t(r),{refresh:s}}function dr(e,t){history.pushState({},"",zt(e)),t()}function ur(e){return he[e]?he[e]:e.startsWith(mt)&&e.length>mt.length?Rt:he["/"]}Lr();const pr=document.querySelector("#app");pr.innerHTML=`
  <div id="welcome-root"></div>
  <div class="site-shell" id="site-shell">
    <div id="nav-root"></div>
    <div id="page-root"></div>
    <div id="footer-root"></div>
  </div>
  <div id="overlay-root" class="overlay-root"></div>
  <div id="scroll-hint-root"></div>
`;const gr="johanscv.siteAccessGranted",mr=.2,fr=620,hr=10,ht=340,vr=120,br=140,yr="button-light-host",ve="is-button-lit",kr=[".welcome-button",".scroll-hint",".nav-link",".toggle-pill",".lang-pill",".footer-links a",".footer-playground-link",".footer-info-button",".spotify-dashboard-view-toggle",".spotify-dashboard-preview-button",".projects-cta",".ask-button",".updates-signup-choice",".updates-signup-button",".file-action"].join(", ");document.querySelector("#welcome-root");const wr=document.querySelector("#nav-root"),Yt=document.querySelector("#page-root"),w=document.querySelector("#footer-root"),Sr=document.querySelector("#overlay-root"),Xt=document.querySelector("#scroll-hint-root");let Ie=!1,vt=!1,bt=!1,je=!1,Qt=null,yt=!1,be=null,Z=0,Pe=null,kt=null,P=null,ce=window.innerWidth,$e=!1,wt=!1,S=null,ee=0;Cr();Ar();async function Ar(){{localStorage.setItem(gr,"true"),Er();return}}function Er(){je||(je=!0,Fn(),Qt=cr({mountEl:Yt,renderFrame:e=>{e(),_r()},pageContext:e=>{const t=O();return{t:ue(t.language),language:t.language,route:e}},onRouteChange:e=>{Ne({route:e}),Re(e),Tr(),B()}}),Zt(),Ir(),Oe(),Pr(),on(),Nr(),Re(O().route),B())}function Zt(){const e=O(),t=ue(e.language);wr.innerHTML=cn({route:e.route,t}),en(),tn()}function Oe(){window.clearTimeout(Pe),x();const e=w.getBoundingClientRect().top;Number.isFinite(e)&&(P=e);const t=O(),n=ue(t.language);w.innerHTML=bn({t:n,theme:t.theme,language:t.language}),gn(()=>{Rr(),Oe()}),fn(()=>{Mr(),Zt(),Re(O().route),Oe(),on(),B(),Qt?.refresh()}),yn(n,{overlayRoot:Sr}),nn()}function Tr(){const e=document.querySelectorAll(".section-reveal"),t=new IntersectionObserver(n=>{n.forEach(o=>{o.isIntersecting&&(o.target.classList.add("is-visible"),t.unobserve(o.target))})},{threshold:mr});e.forEach((n,o)=>{n.style.transitionDelay=`${Math.min(o*70,240)}ms`,t.observe(n)})}function Lr(){const e=new URL(window.location.href),t=e.searchParams.get("p");if(!t)return;const n=decodeURIComponent(t),[o,i]=n.split("&q="),r=i?`?${decodeURIComponent(i)}`:"",s=`${o}${r}${e.hash}`;window.history.replaceState(null,"",s)}function _r(){if(vt)return;vt=!0;let e=window.scrollY,t=!1;const n=()=>{t||(t=!0,window.requestAnimationFrame(()=>{const o=window.scrollY,i=o-e;o<36||i<-8?Ie=!1:i>8&&(Ie=!0),e=o,en(),t=!1}))};window.addEventListener("scroll",n,{passive:!0})}function en(){const e=document.querySelector("#navbar");e&&e.classList.toggle("nav-hidden",Ie)}function Ir(){bt||(bt=!0,window.addEventListener("resize",()=>{window.requestAnimationFrame(tn)},{passive:!0}))}function tn(){const e=document.querySelector("#navbar .nav-main"),t=e?.querySelector(".nav-links-primary"),n=e?.querySelector(".nav-wordmark");if(!(t instanceof HTMLElement)||!(n instanceof HTMLElement))return;if(n.classList.remove("is-hidden"),window.innerWidth<=fr){n.classList.add("is-hidden");return}const o=t.querySelectorAll(".nav-link"),i=o.length?o[0].offsetTop:t.offsetTop,r=Array.from(o).some(c=>c.offsetTop>i+1),s=t.getBoundingClientRect(),a=n.getBoundingClientRect(),l=r||s.right+hr>=a.left;n.classList.toggle("is-hidden",l)}function Re(e){document.querySelectorAll(".nav-link").forEach(n=>{const o=n.getAttribute("href");n.classList.toggle("active",jr(o,e))})}function jr(e,t){return!e||!t?!1:e==="/"?t==="/":t===e||t.startsWith(`${e}/`)}function Pr(){be||typeof ResizeObserver>"u"||(P=w.getBoundingClientRect().top,ce=window.innerWidth,be=new ResizeObserver(()=>{nn()}),be.observe(Yt),window.addEventListener("resize",$r,{passive:!0}))}function $r(){$e=!0,window.clearTimeout(kt),x(),ce=window.innerWidth;const e=w.getBoundingClientRect().top;Number.isFinite(e)&&(P=e),kt=window.setTimeout(()=>{$e=!1;const t=w.getBoundingClientRect().top;Number.isFinite(t)&&(P=t)},br)}function nn(){Z&&window.cancelAnimationFrame(Z),Z=window.requestAnimationFrame(()=>{Z=0,Or()})}function Or(){const e=w.getBoundingClientRect().top;if(!Number.isFinite(e))return;if(window.innerWidth!==ce||$e){ce=window.innerWidth,P=e,x();return}if(P===null){P=e;return}const t=P-e;if(P=e,Math.abs(t)<1){x();return}if(Math.abs(t)>vr){x();return}window.clearTimeout(Pe),w.style.transition="none",w.style.transform=`translateY(${t}px)`,w.style.willChange="transform",w.offsetHeight,window.requestAnimationFrame(()=>{w.style.transition=`transform ${ht}ms var(--ease-standard)`,w.style.transform="translateY(0)",Pe=window.setTimeout(x,ht+50)})}function x(){w.style.transition="",w.style.transform="",w.style.willChange=""}function ue(e){return Ge[e]||Ge.en}function Rr(){const e=O().theme;Ne({theme:e==="dark"?"light":"dark"})}function Mr(){const e=O().language;Ne({language:e==="en"?"dk":"en"})}function on(){const e=O(),t=ue(e.language),n=rn()?" is-hidden":"";Xt.innerHTML=`
    <button id="scroll-hint" class="scroll-hint${n}" type="button" aria-label="${t.scrollHint.label}">
      <span class="scroll-hint-text">${t.scrollHint.label}</span>
      <span class="scroll-hint-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M12 6v12" />
          <path d="m7.5 13.5 4.5 4.5 4.5-4.5" />
        </svg>
      </span>
    </button>
  `}function Nr(){yt||(yt=!0,Xt.addEventListener("click",e=>{e.target.closest("#scroll-hint")&&window.scrollBy({top:Math.max(window.innerHeight*.92,240),behavior:"smooth"})}),window.addEventListener("scroll",B,{passive:!0}),window.addEventListener("resize",B))}function B(){const e=document.querySelector("#scroll-hint");e&&e.classList.toggle("is-hidden",rn())}function rn(){const e=document.documentElement,t=Math.max(0,e.scrollHeight-window.innerHeight),n=t>24,o=window.scrollY>=t-28;return!je||!n||o}function Cr(){if(wt)return;wt=!0;const e=window.matchMedia("(prefers-reduced-motion: reduce)"),t=window.matchMedia("(pointer: fine)"),n=window.matchMedia("(hover: hover)");let o=!1,i=window.innerWidth/2,r=window.innerHeight/2;const s=()=>{ee&&(window.clearTimeout(ee),ee=0)},a=({immediate:u=!1}={})=>{s();const p=()=>{ee=0,S instanceof HTMLElement&&S.classList.remove(ve),S=null};{p();return}},l=(u,p,v)=>{if(!(u instanceof HTMLElement)||!document.documentElement.contains(u))return!1;const m=u.getBoundingClientRect();if(!Number.isFinite(m.width)||!Number.isFinite(m.height)||m.width<2||m.height<2)return!1;const y=Math.min(Math.max(p-m.left,0),m.width),b=Math.min(Math.max(v-m.top,0),m.height),T=m.width>0?y/m.width:.5,k=m.height>0?b/m.height:.5,L=Math.min(y,m.width-y,b,m.height-b),sn=.56+Math.max(0,Math.min(1,L/Math.max(Math.min(m.width,m.height)*.5,1)))*.44;return u.style.setProperty("--button-light-x",`${y}px`),u.style.setProperty("--button-light-y",`${b}px`),u.style.setProperty("--button-light-tilt-x",`${((.5-k)*6).toFixed(2)}deg`),u.style.setProperty("--button-light-tilt-y",`${((T-.5)*6).toFixed(2)}deg`),u.style.setProperty("--button-light-intensity",sn.toFixed(3)),!0},c=u=>{u instanceof HTMLElement&&S!==u&&(S instanceof HTMLElement&&S.classList.remove(ve),S=u,S.classList.add(yr),S.classList.add(ve))},d=()=>{o=!e.matches&&t.matches&&n.matches,o||a({immediate:!0})},g=u=>{if(!o)return;i=u.clientX,r=u.clientY;const p=St(u.target);if(!(p instanceof HTMLElement)){a({immediate:!0});return}s(),c(p),l(p,i,r)||a({immediate:!0})},f=()=>{o&&S instanceof HTMLElement&&(l(S,i,r)||a({immediate:!0}))},h=u=>{if(!o||!(S instanceof HTMLElement)||!(u.target instanceof Element)||!S.contains(u.target))return;const p=St(u.relatedTarget);if(p!==S){if(p instanceof HTMLElement){i=u.clientX,r=u.clientY,s(),c(p),l(p,i,r)||a({immediate:!0});return}a({immediate:!0})}};window.addEventListener("pointermove",g,{passive:!0}),window.addEventListener("pointerout",h,!0),window.addEventListener("scroll",f,{passive:!0}),window.addEventListener("resize",f),document.documentElement.addEventListener("mouseleave",()=>a({immediate:!0})),window.addEventListener("blur",()=>a({immediate:!0})),ye(e,d),ye(t,d),ye(n,d),d()}function ye(e,t){if(typeof e.addEventListener=="function"){e.addEventListener("change",t);return}typeof e.addListener=="function"&&e.addListener(t)}function St(e){if(!(e instanceof Element))return null;const t=e.closest(kr);return!(t instanceof HTMLElement)||t.matches(":disabled")||t.getAttribute("aria-disabled")==="true"?null:t}
