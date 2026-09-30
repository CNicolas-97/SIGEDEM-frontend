import { cn } from '@/shared/lib/cn.ts';

// QUÉ ES: la marca de SIGEDEM: tres arcos de colores + el nombre.
// NIVEL: componente presentacional.
// DÓNDE SE USA: en SiteHeader (girando) y en SiteFooter (quieta).

type BrandMarkProps = {
  // Valor por defecto true: si no se pasa la prop, el anillo gira.
  spinning?: boolean;
  // Tamaño del nombre: "md" en el header, "lg" en el footer.
  size?: 'md' | 'lg';
};

// Un color por actividad: natación, fútbol y vóley.
const RING_COLORS = ['#2BD4D9', '#8CE05B', '#FFB23F'];

export function BrandMark({ spinning = true, size = 'md' }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-[11px]">
      {/* aria-hidden: es decorativo, el nombre ya está escrito al lado. */}
      <svg
        className={cn('size-[30px] flex-none', spinning && 'animate-spin-slow')}
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        {/* Cada arco es el mismo círculo punteado, rotado 0°, 120° y 240°. */}
        {RING_COLORS.map((color, index) => (
          <circle
            key={color}
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="26 68"
            transform={`rotate(${index * 120} 20 20)`}
          />
        ))}
      </svg>
      <span
        className={cn(
          'font-display leading-[0.94] tracking-[0.01em]',
          size === 'lg' ? 'text-[27px]' : 'text-[19px]'
        )}
      >
        SIGEDEM
      </span>
    </div>
  );
}
