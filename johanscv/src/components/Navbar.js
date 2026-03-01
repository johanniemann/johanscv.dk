export function Navbar({ route, t }) {
  const links = [
    { path: '/', label: t.nav.home },
    { path: '/projects', label: t.nav.projects },
    { path: '/resume', label: t.nav.files },
    { path: '/contact', label: t.nav.contact, extraClass: 'nav-contact-link' }
  ]

  return `
    <header id="navbar" class="site-nav">
      <div class="nav-main">
        <nav class="nav-links nav-links-primary" aria-label="Primary navigation">
          ${links.map((link) => navLink(link.path, link.label, route, link.extraClass || '')).join('')}
        </nav>
        <span class="nav-wordmark" aria-hidden="true">JOHANSCV.DK</span>
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
