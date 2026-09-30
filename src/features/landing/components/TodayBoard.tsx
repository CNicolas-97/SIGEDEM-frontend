import type { Activity } from '@/features/landing/model/activities.ts';
import {
  formatSchedule,
  formatToday,
  getOpeningStatus,
} from '@/features/landing/model/schedule.ts';

// QUÉ ES: la franja "Hoy" al pie del hero: fecha y si cada actividad está
// abierta en este momento.
// NIVEL: componente presentacional. No lee el reloj por su cuenta: recibe la
// fecha por props ("now"), así el resultado depende solo de sus props.
// DÓNDE SE USA: dentro de Hero.

type TodayBoardProps = {
  activities: Activity[];
  now: Date;
};

export function TodayBoard({ activities, now }: TodayBoardProps) {
  const hour = now.getHours();
  // Si al menos una actividad está abierta, el complejo figura abierto.
  const isComplexOpen = activities.some(
    (activity) => getOpeningStatus(activity.schedule, hour).isOpen
  );

  return (
    <div className="board">
      <div className="d">
        <b>Hoy</b>
        <span>{formatToday(now)}</span>
        <i className={isComplexOpen ? 'on' : 'off'}>
          {isComplexOpen ? 'Complejo abierto' : 'Complejo cerrado'}
        </i>
      </div>
      {activities.map((activity) => {
        const status = getOpeningStatus(activity.schedule, hour);
        return (
          <div key={activity.slug}>
            <b>{activity.name}</b>
            <span>{formatSchedule(activity.schedule)}</span>
            <i className={status.isOpen ? 'on' : 'off'}>{status.label}</i>
          </div>
        );
      })}
    </div>
  );
}
