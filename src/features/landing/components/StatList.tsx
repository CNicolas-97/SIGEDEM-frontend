import type { Stat } from '@/features/landing/model/activities.ts';

// QUÉ ES: lista de datos destacados de una actividad (número + título + detalle).
// NIVEL: componente presentacional.
// DÓNDE SE USA: dentro de ActivitySection.

type StatListProps = {
  stats: Stat[];
};

export function StatList({ stats }: StatListProps) {
  return (
    <ul className="facts">
      {stats.map((stat) => (
        <li key={stat.label}>
          <span className="stat-n">{stat.value}</span>
          <span>
            <b>{stat.label}</b>
            <small>{stat.detail}</small>
          </span>
        </li>
      ))}
    </ul>
  );
}
