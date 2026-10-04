import type { MembershipCardData } from '@/features/landing/model/membership.ts';
import { buildQrCells, QR_SIZE } from '@/features/landing/model/qrPattern.ts';

// QUÉ ES: el carnet de socio que aparece al costado del hero.
// NIVEL: componente presentacional.
// DÓNDE SE USA: dentro de Hero.

type MembershipCardProps = {
  card: MembershipCardData;
};

// Se calcula una sola vez, al cargar el archivo: el dibujo nunca cambia.
const qrCells = buildQrCells();

export function MembershipCard({ card }: MembershipCardProps) {
  return (
    // hero-pass (landing.css): se mueve con el scroll. Desde 1081px de ancho.
    <div className="hero-pass absolute top-1/2 right-[clamp(20px,4vw,64px)] z-3 w-[clamp(150px,14vw,196px)] perspective-[800px] will-change-transform max-desktop:hidden">
      {/* Carnet inclinado en 3D, con sombra y un borde fino (ring). */}
      <div className="relative -rotate-5 rotate-y-13 rounded-2xl bg-linear-155/srgb from-pass-light to-pass-dark p-3.5 text-forest shadow-[0_26px_50px_-18px] shadow-forest/55 ring-1 ring-forest/14">
        <div className="flex items-center justify-between font-display text-[11px] tracking-[0.04em]">
          <span>SIGEDEM</span>
          <span>{card.year}</span>
        </div>
        <div className="mt-2.5 mb-[9px] aspect-square rounded-[9px] bg-forest p-[9px]">
          <svg
            className="block size-full"
            viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
            shapeRendering="crispEdges"
            aria-hidden="true"
          >
            <rect width={QR_SIZE} height={QR_SIZE} fill="#23392F" />
            <g fill="#EDE7D6">
              {/* Un cuadradito de 1×1 por cada casilla pintada. */}
              {qrCells.map((cell) => (
                <rect
                  key={`${cell.x}-${cell.y}`}
                  x={cell.x}
                  y={cell.y}
                  width="1"
                  height="1"
                />
              ))}
            </g>
          </svg>
        </div>
        <div className="text-[12.5px] leading-[1.15] font-extrabold">
          {card.holderName}
        </div>
        <div className="mt-0.5 text-[9.5px] font-bold opacity-68">
          {card.plan} · Vence {card.expiresOn}
        </div>
      </div>
    </div>
  );
}
