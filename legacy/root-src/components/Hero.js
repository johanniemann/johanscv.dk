export function Hero({ t }) {
  return `
    <section class="hero section-reveal" id="hero">
      <div class="avatar-wrap">
        <div class="avatar-ring"></div>
        <img class="avatar" src="/images/johan-placeholder.jpg" alt="Portrait of Johan" />
      </div>
      <h1 class="hero-name">${t.hero.name}</h1>
      <p class="hero-title">${t.hero.title}</p>
    </section>
  `
}
