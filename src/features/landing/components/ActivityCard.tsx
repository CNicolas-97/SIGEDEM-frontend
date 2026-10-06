import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { CSSProperties, PointerEvent } from 'react';
import { Button } from '@/shared/ui/Button.tsx';
import type { Activity } from '@/features/landing/model/activities.ts';
import {
  formatSchedule,
  getOpeningStatus,
} from '@/features/landing/model/schedule.ts';
import { cn } from '@/shared/lib/cn.ts';

// QUÉ ES: el carnet de socio de una actividad. El frente es la credencial
// (foto + datos de ejemplo) y el dorso muestra el horario de hoy, si está
// abierto y el link a la página de la actividad.
// NIVEL: componente presentacional. El único estado que guarda es de la
// interfaz: si el carnet está dado vuelta y la fecha al abrir la página.
// DÓNDE SE USA: en ActivitySection (home). La página de detalle sigue usando
// ActivityPhoto.
// CÓMO FUNCIONA: las dos caras están apiladas; la de atrás arranca girada
// 180°. Al dar vuelta, el contenedor (.carnet-inner, en landing.css) gira
// 180° y queda adelante la otra cara. La cara que no se ve lleva "inert":
// no recibe foco ni clicks y los lectores de pantalla la ignoran.
// Con el mouse se da vuelta al pasar por encima; con dedo o teclado, con el
// botón (click, Enter o Espacio).

type ActivityCardProps = {
  activity: Activity;
};

// Los tamaños usan "cqw" (1 % del ancho del carnet, ver @container abajo):
// el texto crece con el carnet y no queda una tira vacía en pantallas anchas.
// max(9px, ...) evita que en el celular quede ilegible.
// Etiqueta chiquita en mayúsculas de cada dato del carnet.
const FIELD_LABEL_CLASSES =
  'block text-[length:max(11px,2.3cqw)] font-semibold opacity-70';
const FIELD_VALUE_CLASSES =
  'block font-display text-[length:max(15px,3.9cqw)] leading-tight text-balance';
const TINY_UPPER_CLASSES =
  'text-[length:max(9px,2cqw)] font-semibold tracking-[0.1em] uppercase';
// Marcas de la regla del día en el dorso.
const DAY_MARKS = [0, 6, 12, 18, 24];
// Anillo de foco que sigue las esquinas redondeadas del carnet.
const FOCUS_CLASSES =
  'focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent';

export function ActivityCard({ activity }: ActivityCardProps) {
  const [flipped, setFlipped] = useState(false);
  // La fecha al abrir la página, igual que el tablero "Hoy" y el footer.
  const [now] = useState(() => new Date());
  // Hora con decimales (14:30 = 14.5) para ubicar la rayita de "ahora".
  const nowHour = now.getHours() + now.getMinutes() / 60;
  const status = getOpeningStatus(activity.schedule, now.getHours());
  const { memberCard } = activity;
  const { colors } = memberCard;
  // Botones de cada cara: al dar vuelta con click o teclado, el foco pasa a
  // la otra cara (la que quedó oculta se vuelve inert y lo perdería).
  const frontButtonRef = useRef<HTMLButtonElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);

  // flushSync aplica el cambio en el momento, así la cara nueva ya no es
  // inert cuando le pasamos el foco.
  function showBack() {
    flushSync(() => setFlipped(true));
    backButtonRef.current?.focus({ preventScroll: true });
  }
  function showFront() {
    flushSync(() => setFlipped(false));
    frontButtonRef.current?.focus({ preventScroll: true });
  }

  // Solo el mouse da vuelta el carnet al pasar: en el celular el "hover" se
  // dispara al tocar y pelearía con el click del botón.
  function handlePointerEnter(event: PointerEvent) {
    if (event.pointerType === 'mouse') setFlipped(true);
  }
  function handlePointerLeave(event: PointerEvent) {
    if (event.pointerType === 'mouse') setFlipped(false);
  }

  // El acento de ESTA actividad queda fijo en el carnet (franja, botón y
  // foco), aunque el resto de la página ya haya cambiado de sección.
  const cardStyle = { '--accent': activity.theme.accent } as CSSProperties;

  return (
    // @container: los hijos miden su texto en "cqw" respecto de este ancho.
    <div
      className="@container perspective-[1250px]"
      style={cardStyle}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* data-tilt + shot-tilt: la misma inclinación con el scroll que tenía
          la foto (useScrollMotion + landing.css). */}
      <div
        className="shot-tilt relative aspect-[4/5] transform-3d will-change-transform"
        data-tilt
      >
        <div className="carnet-inner size-full" data-flipped={flipped}>
          {/* ---------- FRENTE ---------- */}
          <div
            className="carnet-face flex flex-col overflow-hidden rounded-[26px] bg-cream text-ink shadow-[0_50px_100px] shadow-black/50"
            inert={flipped}
          >
            <div className="relative min-h-0 flex-1 bg-abyss">
              <img
                className="absolute inset-0 size-full object-cover brightness-[1.06] saturate-[1.2]"
                src={activity.image.src}
                srcSet={activity.image.srcSet}
                sizes="(max-width: 940px) 100vw, 580px"
                alt={activity.image.alt}
                width={400}
                height={500}
                loading="lazy"
                decoding="async"
              />
              {/* Etiqueta tipo sticker con el nombre, en el color "pop". */}
              <p
                className="absolute bottom-[max(14px,4cqw)] left-[max(14px,4cqw)] -rotate-2 rounded-xl px-[max(12px,3cqw)] py-[max(6px,1.6cqw)] font-display text-[length:max(28px,8.5cqw)] leading-none shadow-[0_10px_24px] shadow-black/30"
                style={{
                  backgroundColor: colors.pop,
                  color: colors.popText,
                }}
              >
                {activity.name}
              </p>
              <span
                className="absolute top-4 right-4 rounded-full bg-cream/90 px-3 py-1 text-[12px] font-semibold text-ink"
                aria-hidden="true"
              >
                Ver horario de hoy ↻
              </span>
            </div>

            {/* Franja con los datos de socio: degradé de los dos tonos de
                la instalación (ver MemberCardColors). */}
            <div
              className="flex flex-none flex-col gap-[max(10px,2.6cqw)] px-[max(16px,4.5cqw)] pt-[max(10px,3cqw)] pb-[max(10px,2.6cqw)]"
              style={{
                backgroundImage: `linear-gradient(120deg, ${colors.from}, ${colors.to})`,
              }}
            >
              <p className="flex items-center justify-between gap-3 text-[length:max(11px,2.3cqw)] font-bold">
                <span className="truncate">Complejo Municipal Teniente Ledesma</span>
                <span className="flex-none rounded-full bg-ink/12 px-2 py-0.5 font-semibold">
                  Ejemplo
                </span>
              </p>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-[max(6px,1.8cqw)]">
                <div className="min-w-0">
                  <dt className={FIELD_LABEL_CLASSES}>Socio N.º</dt>
                  <dd className={cn(FIELD_VALUE_CLASSES, 'tabular-nums')}>
                    {memberCard.memberNumber}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className={FIELD_LABEL_CLASSES}>Categoría</dt>
                  <dd className={FIELD_VALUE_CLASSES}>{memberCard.category}</dd>
                </div>
                <div className="min-w-0">
                  <dt className={FIELD_LABEL_CLASSES}>Instalación</dt>
                  <dd className={FIELD_VALUE_CLASSES}>{memberCard.facility}</dd>
                </div>
                <div className="min-w-0">
                  <dt className={FIELD_LABEL_CLASSES}>Vence</dt>
                  <dd className={cn(FIELD_VALUE_CLASSES, 'tabular-nums')}>
                    {memberCard.validUntil}
                  </dd>
                </div>
              </dl>
            </div>

            {/* El botón tapa todo el frente: un click/toque en cualquier
                parte da vuelta el carnet. Va aparte del contenido para que
                el lector de pantalla lea igual la foto y los datos. */}
            <button
              type="button"
              ref={frontButtonRef}
              aria-pressed={flipped}
              aria-label={`Ver horarios de hoy de ${activity.name}`}
              onClick={showBack}
              className={cn(
                'absolute inset-0 cursor-pointer rounded-[26px]',
                FOCUS_CLASSES
              )}
            />
          </div>

          {/* ---------- DORSO ---------- */}
          <div
            className="carnet-face carnet-back flex flex-col overflow-hidden rounded-[26px] bg-cream p-[max(20px,6cqw)] text-ink shadow-[0_50px_100px] shadow-black/50"
            inert={!flipped}
          >
            <p className={TINY_UPPER_CLASSES}>
              Complejo Municipal Teniente Ledesma
            </p>
            <span
              className="mt-2 block h-1.5 rounded-full"
              style={{
                backgroundImage: `linear-gradient(90deg, ${colors.from}, ${colors.to}, ${colors.pop})`,
              }}
              aria-hidden="true"
            />
            <h3 className="mt-[max(14px,4cqw)] text-[length:max(30px,10cqw)]">
              {activity.name}
            </h3>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <p>
                <span className="block text-[length:max(11px,2.2cqw)] font-semibold tracking-[0.12em] uppercase opacity-65">
                  Hoy
                </span>
                <span className="font-display text-[length:max(22px,7cqw)] leading-none tabular-nums">
                  {formatSchedule(activity.schedule)}
                </span>
              </p>
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-3 py-1 text-[length:max(13px,2.6cqw)] font-semibold text-white',
                  status.isOpen ? 'bg-open' : 'bg-closed'
                )}
              >
                <span className="size-2 rounded-full bg-white" />
                {status.label}
              </span>
            </div>

            {/* Regla del día (0 a 24 h): la franja de color es el horario y
                la rayita, la hora actual. Es decorativa: el horario ya está
                escrito arriba, por eso aria-hidden. */}
            <div className="mt-[max(18px,5cqw)]" aria-hidden="true">
              <div className="relative h-[max(10px,2cqw)] rounded-full bg-ink/10">
                <span
                  className="absolute inset-y-0 rounded-full bg-accent"
                  style={{
                    left: `${(activity.schedule.opensAt / 24) * 100}%`,
                    width: `${((activity.schedule.closesAt - activity.schedule.opensAt) / 24) * 100}%`,
                  }}
                />
                <span
                  className="absolute -inset-y-1 w-0.5 rounded-full bg-ink"
                  style={{ left: `${(nowHour / 24) * 100}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[length:max(10px,1.9cqw)] tabular-nums opacity-65">
                {DAY_MARKS.map((mark) => (
                  <span key={mark}>{mark} h</span>
                ))}
              </div>
            </div>

            {/* Lo que hay que saber de la actividad: en la home no aparece
                en otro lado (las cifras ya están al costado del carnet). */}
            <ul className="mt-[max(18px,6cqw)] grid grid-cols-2 gap-x-[max(14px,4cqw)] gap-y-[max(10px,3cqw)] border-t border-ink/15 pt-[max(12px,3cqw)]">
              {activity.highlights.slice(0, 4).map((highlight) => (
                <li key={highlight.title} className="min-w-0">
                  <span className="block text-[length:max(14px,3cqw)] leading-tight font-bold">
                    {highlight.title}
                  </span>
                  {/* La descripción solo entra cuando el carnet es ancho. */}
                  <span className="mt-1 hidden text-[length:max(12px,2.4cqw)] leading-snug opacity-75 @md:block">
                    {highlight.description}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-[max(16px,5cqw)]">
              <Button to={`/actividades/${activity.slug}`} className="py-2.5">
                {activity.ctaLabel}
              </Button>
              <button
                type="button"
                ref={backButtonRef}
                onClick={showFront}
                className={cn(
                  'cursor-pointer rounded-full px-4 py-2.5 text-[14px] font-semibold inset-ring-[1.5px] inset-ring-ink/40 transition-colors duration-200 hover:bg-ink/6',
                  FOCUS_CLASSES
                )}
              >
                Volver al carnet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
