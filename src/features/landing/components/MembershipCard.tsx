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
    <div className="pass">
      <div className="pass-body">
        <div className="t">
          <span>SIGEDEM</span>
          <span>{card.year}</span>
        </div>
        <div className="qr">
          <svg
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
        <div className="nm">{card.holderName}</div>
        <div className="mt">
          {card.plan} · Vence {card.expiresOn}
        </div>
      </div>
    </div>
  );
}
