import { Button } from '@/shared/ui/Button.tsx';
import { Seo } from '@/shared/ui/Seo.tsx';
import { useSectionTheme } from '@/features/landing/hooks/useSectionTheme.ts';
import { noGlowPageSections } from '@/features/landing/model/sectionTheme.ts';
import { useAuth } from '@/features/auth/hooks/useAuth.ts';

// QUÉ ES: la página privada del socio (/mi-cuenta).
// NIVEL: container (página). Solo se ve con sesión: en App.tsx está dentro
// de RequireAuth, que manda a /login si no hay nadie logueado.
// MÁS ADELANTE: acá van el estado del abono, las reservas de cancha, etc.,
// pedidos al backend con el token de la sesión.
export function AccountPageContainer() {
  const { user, logout } = useAuth();

  useSectionTheme(noGlowPageSections);

  // RequireAuth ya garantiza que hay usuario; esto solo conforma a TypeScript.
  if (!user) return null;

  return (
    <>
      <Seo
        title="Mi cuenta"
        path="/mi-cuenta"
        description="Tus datos de socio del Complejo Teniente Ledesma."
        noIndex
      />
      <main className="mx-auto max-w-page px-6.5 pt-[calc(130px+env(safe-area-inset-top,0px))] pb-[110px]">
        <section id="contenido" className="grid gap-6">
          <h1 className="text-[length:clamp(40px,6vw,72px)]">
            Hola, {user.name}
          </h1>
          <dl className="grid max-w-[460px] gap-1 rounded-[22px] border border-white/14 bg-white/6 p-6 text-[17px] backdrop-blur-[6px]">
            <dt className="text-[14px] opacity-60">Email</dt>
            <dd>{user.email}</dd>
          </dl>
          <Button
            variant="secondary"
            onClick={logout}
            className="justify-self-start"
          >
            Cerrar sesión
          </Button>
        </section>
      </main>
    </>
  );
}
