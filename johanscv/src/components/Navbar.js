export function Navbar({ route, t }) {
  return `
    <header id="navbar" class="site-nav">
      <a class="brand" href="/" data-link>johanscv.dk</a>
      <nav class="nav-links" aria-label="Primary">
        ${navLink('/', t.nav.home, route)}
        ${navLink('/projects', t.nav.projects, route)}
        ${navLink('/resume', t.nav.files, route)}
        ${navLink('/quiz', t.nav.quiz, route)}
      </nav>
    </header>
  `
}

function navLink(path, label, currentRoute) {
  const key = path === '/' ? 'home' : path.slice(1)
  const active = currentRoute === path ? `nav-link nav-link-${key} active` : `nav-link nav-link-${key}`
  return `<a class="${active}" href="${path}" data-link>${label}</a>`
}
