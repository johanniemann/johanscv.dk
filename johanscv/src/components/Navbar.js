export function Navbar({ route, t }) {
  const links = [
    { path: '/', label: t.nav.home },
    { path: '/projects', label: t.nav.projects },
    { path: '/resume', label: t.nav.files }
  ]

  return `
    <header id="navbar" class="site-nav">
      <div class="nav-right">
        <nav class="nav-links" aria-label="Primary">
          ${links.map((link) => navLink(link.path, link.label, route)).join('')}
        </nav>
        ${navLink('/contact', t.nav.contact, route, 'nav-contact-link')}
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
