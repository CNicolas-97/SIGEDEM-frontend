import { Footer } from './Footer.jsx';
import { Header } from './Header.jsx';

// Esqueleto: estructura común a todas las páginas (header, contenido, footer).
export function Layout({ links, children }) {
  return (
    <>
      <Header links={links} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
