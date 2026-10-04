import type { Stat } from '@/features/landing/model/activities.ts';

// QUÉ ES: lista de datos destacados de una actividad (número + título + detalle).
// NIVEL: componente presentacional.
// DÓNDE SE USA: dentro de ActivitySection.

type StatListProps = {
  stats: Stat[];
};

export function StatList({ stats }: StatListProps) {
  return (
    <ul className="mb-[34px] grid">
      {stats.map((stat) => (
        <li
          key={stat.label}
          className="grid grid-cols-[auto_1fr] items-baseline gap-[18px] border-t border-white/18 py-[15px] last:border-b"
        >
          <span className="min-w-[2.6ch] font-display text-[27px] leading-[0.94] tracking-[-0.02em] text-accent">
            {stat.value}
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
