// QUÉ ES: la marca escrita del complejo: "Complejo Municipal / LEDESMA" con
// tres trazos de los colores del logo debajo.
// NIVEL: componente presentacional.
// DÓNDE SE USA: en SiteFooter.
// Es texto real (no una imagen): se lee sobre el fondo oscuro del footer,
// queda nítido en cualquier pantalla y lo leen los lectores de pantalla.

export function LedesmaWordmark() {
  return (
    <div className="w-fit">
      <p className="text-[12px] font-semibold tracking-[0.14em] uppercase opacity-85">
        Complejo Municipal
      </p>
      <p className="text-[44px] leading-[1.05] font-bold tracking-[-0.01em]">
        LEDESMA
      </p>
      {/* Trazos decorativos: línea azul larga, celeste corta y un punto. */}
      <div className="mt-2 flex items-center gap-2" aria-hidden="true">
        <span className="h-[5px] flex-1 rounded-full bg-brand-blue" />
        <span className="h-[5px] w-[46px] rounded-full bg-brand-sky" />
        <span className="size-[5px] rounded-full bg-brand-sun" />
      </div>
    </div>
  );
}
