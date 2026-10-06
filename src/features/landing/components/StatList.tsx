import { useEffect, useState } from 'react';
import type { Stat } from '@/features/landing/model/activities.ts';
import { useInView } from '@/features/landing/hooks/useInView.ts';

// QUÉ ES: lista de datos destacados de una actividad (número + título + detalle).
// NIVEL: componente presentacional.
// DÓNDE SE USA: dentro de ActivitySection.
// MOVIMIENTO: cuando la lista aparece en pantalla, cada número cuenta desde 0
// hasta su valor en 600ms ("28°" pasa por "0°", "14°"...). El lector de
// pantalla recibe directamente el valor final.

type StatListProps = {
  stats: Stat[];
};

// Misma duración y curva que el resto del sitio (--ease-carnet en index.css).
const COUNT_DURATION = 600;
function easeOut(t: number) {
  // Aproximación de cubic-bezier(0.22, 1, 0.36, 1): arranca rápido y frena.
  return 1 - Math.pow(1 - t, 4);
}

// Separa "28°" en { prefix: '', target: 28, suffix: '°' }. Si el valor no
// tiene número, se muestra tal cual.
function parseValue(value: string) {
  const match = /^(\D*)(\d+)(.*)$/.exec(value);
  if (!match) return null;
  return { prefix: match[1], target: Number(match[2]), suffix: match[3] };
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

type CountUpProps = {
  value: string;
  active: boolean;
};

function CountUp({ value, active }: CountUpProps) {
  const parts = parseValue(value);
  // Avance de la animación, de 0 a 1. Con menos movimiento arranca en 1.
  const [progress, setProgress] = useState(() =>
    prefersReducedMotion() ? 1 : 0
  );

  useEffect(() => {
    // Con menos movimiento ya arrancó en el valor final: no hay cuenta.
    if (!active || prefersReducedMotion()) return;
    let frameId = 0;
    const start = performance.now();
    function tick(time: number) {
      const t = Math.min(1, (time - start) / COUNT_DURATION);
      setProgress(easeOut(t));
      if (t < 1) frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [active]);

  if (!parts) return value;
  const current = Math.round(parts.target * progress);
  return (
    <>
      {/* Lo que se ve, animado: los lectores de pantalla lo ignoran. */}
      <span aria-hidden="true">
        {parts.prefix}
        {current}
        {parts.suffix}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}

export function StatList({ stats }: StatListProps) {
  const [listRef, inView] = useInView<HTMLUListElement>();

  return (
    <ul ref={listRef} className="mb-[34px] grid">
      {stats.map((stat) => (
        // before: línea de acento que se dibuja sobre el borde al pasar el
        // mouse por la fila (misma duración y curva que el carnet).
        <li
          key={stat.label}
          className="relative grid grid-cols-[auto_1fr] items-baseline gap-[18px] border-t border-white/18 py-[15px] before:absolute before:inset-x-0 before:-top-px before:h-0.5 before:origin-left before:scale-x-0 before:bg-accent before:transition-transform before:duration-600 before:ease-carnet last:border-b hover:before:scale-x-100"
        >
          <span className="min-w-[2.6ch] font-display text-[27px] leading-[0.94] tracking-[-0.02em] text-accent tabular-nums">
            <CountUp value={stat.value} active={inView} />
          </span>
          <span>
            <b className="block font-semibold">{stat.label}</b>
            <small className="text-[14.5px] leading-[1.45] opacity-72">
              {stat.detail}
            </small>
          </span>
        </li>
      ))}
    </ul>
  );
}
