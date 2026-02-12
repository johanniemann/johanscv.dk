export function Hero({ t }) {
  const avatarPath = `${import.meta.env.BASE_URL}images/johan-placeholder.jpg`

  return `
    <section class="hero section-reveal" id="hero">
      <div class="avatar-wrap">
        <div class="avatar-ring"></div>
        <img class="avatar" src="${avatarPath}" alt="Portrait of Johan" />
      </div>
      <h1 class="hero-name">${t.hero.name}</h1>
      <p class="hero-title">${t.hero.title}</p>
    </section>
  `
}
