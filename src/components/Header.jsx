// Esqueleto: encabezado del sitio con la navegación principal.
// Los links pasarán a <Link> de React Router cuando se incorpore.
export function Header({ links = [] }) {
  return (
    <header>
      <nav aria-label="Navegación principal">
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
