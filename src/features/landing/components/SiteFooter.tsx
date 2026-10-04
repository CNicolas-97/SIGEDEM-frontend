import { useState } from 'react';
import { Link } from 'react-router';
import { CopyPhoneButton } from '@/features/landing/components/CopyPhoneButton.tsx';
import {
  ArrowIcon,
  ClockIcon,
  PhoneIcon,
  PinIcon,
} from '@/features/landing/components/FooterIcons.tsx';
import { LedesmaWordmark } from '@/features/landing/components/LedesmaWordmark.tsx';
import type { Activity } from '@/features/landing/model/activities.ts';
import type { ContactInfo } from '@/features/landing/model/navigation.ts';
import {
  formatSchedule,
  getOpeningStatus,
} from '@/features/landing/model/schedule.ts';
import { cn } from '@/shared/lib/cn.ts';

// QUÉ ES: pie de página del sitio público.
// NIVEL: componente presentacional — recibe las actividades y el contacto
// por props; lo único que guarda es la hora en que se abrió la página.
// DÓNDE SE USA: en PublicLayout, así aparece en todas las páginas públicas.

type SiteFooterProps = {
  activities: Activity[];
  contact: ContactInfo;
};

// Título de cada columna.
const HEADING_CLASSES =
  'mb-4 font-body text-[12px] font-semibold tracking-[0.14em] uppercase opacity-55';
// Puntito de estado: celeste del logo si está abierto, gris si no.
const DOT_CLASSES = 'size-2 flex-none rounded-full';

export function SiteFooter({ activities, contact }: SiteFooterProps) {
  // La fecha al abrir la página, igual que el tablero "Hoy" del hero.
  const [now] = useState(() => new Date());
  const hour = now.getHours();
  // getDay(): 0 = domingo. La ventanilla no abre los domingos.
  const windowStatus =
    now.getDay() === 0
      ? { isOpen: false, label: 'Cerrado hoy' }
      : getOpeningStatus(contact.windowSchedule, hour);

  return (
    // <footer>: etiqueta semántica para el cierre de la página.
    <footer className="relative z-1 bg-ink px-6.5 pt-[70px] pb-10">
      <div className="mx-auto grid max-w-page grid-cols-[1fr] gap-12 min-[768px]:grid-cols-[1.2fr_1fr_1.2fr]">
        <div>
          <LedesmaWordmark />
          <p className="mt-5 max-w-[30ch] text-[14.5px] opacity-60">
            Complejo Deportivo Municipal Teniente Ledesma. Natatorio, fútbol y
            vóley con un solo carnet.
          </p>
        </div>

        <nav aria-label="Actividades">
          <h4 className={HEADING_CLASSES}>Actividades</h4>
          <ul>
            {/* Cada actividad muestra si está abierta ahora y su horario.
                group: al pasar el mouse por el link aparece la flecha. */}
            {activities.map((activity) => {
              const status = getOpeningStatus(activity.schedule, hour);
              return (
                <li key={activity.slug}>
                  <Link
                    to={`/actividades/${activity.slug}`}
                    className="group -mx-3 flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-white/6"
                  >
                    <span>
                      <span className="block text-[16px] font-semibold">
                        {activity.name}
                      </span>
                      <span className="mt-0.5 flex items-center gap-2 text-[13px] opacity-60">
                        <span
                          className={cn(
                            DOT_CLASSES,
                            status.isOpen ? 'bg-brand-sky' : 'bg-white/35'
                          )}
                        />
                        {status.label} · {formatSchedule(activity.schedule)}
                      </span>
                    </span>
                    <ArrowIcon className="size-4 -translate-x-1.5 opacity-0 transition-[translate,opacity] duration-200 group-hover:translate-x-0 group-hover:opacity-80" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div>
          <h4 className={HEADING_CLASSES}>Contacto</h4>
          <ul className="flex flex-col gap-5 text-[15px]">
            <li className="flex gap-3">
              <ClockIcon className="mt-0.5 size-5 flex-none opacity-60" />
              <div>
                <p>Ventanilla: {formatSchedule(contact.windowSchedule)}</p>
                <p className="mt-0.5 flex items-center gap-2 text-[13px] opacity-60">
                  <span
                    className={cn(
                      DOT_CLASSES,
                      windowStatus.isOpen ? 'bg-brand-sky' : 'bg-white/35'
                    )}
                  />
                  {contact.windowDays} · {windowStatus.label}
                </p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <PhoneIcon className="size-5 flex-none opacity-60" />
              {/* tel: en el celular abre directamente el marcador. */}
              <a
                href={`tel:${contact.phone.replace(/\D/g, '')}`}
                className="tabular-nums hover:underline"
              >
                {contact.phone}
              </a>
              <CopyPhoneButton phone={contact.phone} />
            </li>
            <li className="flex gap-3">
              <PinIcon className="mt-0.5 size-5 flex-none opacity-60" />
              <div>
                <p className="max-w-[28ch]">{contact.address}</p>
                {/* Link externo: se abre en otra pestaña. rel="noreferrer"
                    evita que la otra página controle esta. */}
                <a
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-1.5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-sky"
                >
                  Cómo llegar
                  <ArrowIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-page items-center justify-between gap-6 border-t border-white/12 pt-5">
        <p className="text-[11.5px] opacity-40">
          Ícono de credencial diseñado por Magnific (Flaticon). Ilustración de
          la pileta de{' '}
          <a
            href="https://storyset.com/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:opacity-100"
          >
            Storyset
          </a>
          .
        </p>
        {/* behavior "smooth": sube con animación en vez de saltar. */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group inline-flex flex-none cursor-pointer items-center gap-2 text-[13.5px] font-semibold opacity-75 transition-opacity duration-200 hover:opacity-100"
        >
          Volver arriba
          <span className="grid size-8 place-items-center rounded-full bg-white/8 transition-[translate,background-color] duration-200 group-hover:-translate-y-0.5 group-hover:bg-white/14">
            <ArrowIcon className="size-4 -rotate-90" />
          </span>
        </button>
      </div>
    </footer>
  );
}
