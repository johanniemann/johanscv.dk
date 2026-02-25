export function Navbar({ route, t }) {
  const leftLinks = [
    { path: '/', label: t.nav.home },
    { path: '/projects', label: t.nav.projects },
    { path: '/resume', label: t.nav.files }
  ]

  const rightLinks = [
    { path: '/playground', label: t.nav.playground },
    { path: '/contact', label: t.nav.contact, extraClass: 'nav-contact-link' }
  ]

  return `
    <header id="navbar" class="site-nav">
      <div class="nav-main">
        <nav class="nav-links nav-links-left" aria-label="Primary left">
          ${leftLinks.map((link) => navLink(link.path, link.label, route)).join('')}
        </nav>
        <nav class="nav-links nav-links-right" aria-label="Primary right">
          ${rightLinks.map((link) => navLink(link.path, link.label, route, link.extraClass || '')).join('')}
        </nav>
      </div>
    </header>
  `
}

function navLink(path, label, currentRoute, extraClass = '') {
  const key = path === '/' ? 'home' : path.slice(1)
  const baseClass = `nav-link nav-link-${key} ${extraClass}`.trim()
  const active = isNavActiveRoute(path, currentRoute) ? `${baseClass} active` : baseClass
  return `<a class="${active}" href="${path}" data-link>${label}</a>`
}

function isNavActiveRoute(linkPath, currentRoute) {
  if (!linkPath || !currentRoute) return false
  if (linkPath === '/') return currentRoute === '/'
  return currentRoute === linkPath || currentRoute.startsWith(`${linkPath}/`)
}
