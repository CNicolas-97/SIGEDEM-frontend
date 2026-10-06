import futbolLarge from '@/assets/landing/activities/futbol-botin-pelota-375w.webp';
import natacionLarge from '@/assets/landing/activities/natacion-nadador-crol-589w.webp';
import natacionSmall from '@/assets/landing/activities/natacion-nadador-crol-400w.webp';
import voleyLarge from '@/assets/landing/activities/voley-armado-en-la-red-720w.webp';
import voleySmall from '@/assets/landing/activities/voley-armado-en-la-red-400w.webp';
import type { SectionTheme } from '@/features/landing/model/sectionTheme.ts';

// QUÉ ES: las actividades del complejo (natación, fútbol y vóley).
// NIVEL: model — datos y tipos, sin JSX.
// DÓNDE SE USA: la home las recorre con map() para armar una ActivitySection
// por cada una y la fila de horarios del hero. La página
// /actividades/:slug busca acá la actividad cuyo "slug" coincide con la URL.

// Unión de strings: el slug solo puede ser uno de estos tres valores.
export type ActivitySlug = 'natacion' | 'futbol' | 'voley';

// Un dato destacado: número grande + título + detalle.
export type Stat = {
  value: string;
  label: string;
  detail: string;
};

// Información extra que se muestra en la página de detalle.
export type Highlight = {
  title: string;
  description: string;
};

// Horario del día, en horas enteras (7 = 7:00, 21 = 21:00).
export type Schedule = {
  opensAt: number;
  closesAt: number;
};

// Datos del frente del carnet. Son de EJEMPLO (no hay socios reales todavía):
// el carnet los muestra con la aclaración "Datos de ejemplo".
export type MemberCard = {
  memberNumber: string;
  category: string;
  facility: string;
  validUntil: string;
};

export type Activity = {
  slug: ActivitySlug;
  // Nombre corto: se ve sobre la imagen y en el tablero de horarios.
  name: string;
  title: string;
  description: string;
  stats: Stat[];
  // Lista de información extra (solo en la página de detalle).
  highlights: Highlight[];
  ctaLabel: string;
  schedule: Schedule;
  // Colores de la sección (ver sectionTheme.ts).
  theme: SectionTheme;
  image: ActivityImage;
  // Carnet de ejemplo que se ve en la home (ver ActivityCard).
  memberCard: MemberCard;
};

// Foto de la tarjeta. Cada foto está exportada en WebP y en dos anchos:
// - src: la versión grande, la que usan los navegadores sin srcSet.
// - srcSet: la lista de versiones con su ancho real ("400w" = 400 píxeles).
//   El navegador elige la más chica que alcance para el tamaño en pantalla:
//   en el celular baja la de 400 y no gasta datos en la grande.
// - alt: descripción para lectores de pantalla y para el SEO.
export type ActivityImage = {
  src: string;
  srcSet: string;
  alt: string;
};

export const activities: Activity[] = [
  {
    slug: 'natacion',
    name: 'Natatorio',
    title: 'La pileta abre todo el año',
    description:
      'Pileta semiolímpica climatizada de seis andariveles, con turnos de nado libre y escuela de natación por nivel. La cubierta funciona también en invierno.',
    stats: [
      {
        value: '6',
        label: 'Andariveles',
        detail:
          'Tres para nado libre y tres para las comisiones de la escuela.',
      },
      {
        value: '28°',
        label: 'Agua climatizada',
        detail: 'Temperatura constante de marzo a diciembre.',
      },
      {
        value: '45′',
        label: 'Turnos',
        detail: 'Reservás desde la app y el molinete te deja pasar con el QR.',
      },
    ],
    highlights: [
      {
        title: 'Escuela por nivel',
        description:
          'Comisiones de iniciación, perfeccionamiento y adultos, de lunes a viernes.',
      },
      {
        title: 'Nado libre',
        description:
          'Turnos de 45 minutos que reservás desde la app, con cupo por andarivel.',
      },
      {
        title: 'Apto médico',
        description:
          'Se pide para entrar a la pileta. Lo cargás en la ventanilla del complejo.',
      },
      {
        title: 'Qué traer',
        description:
          'Gorra, antiparras, ojotas y toallón. Hay vestuarios con duchas.',
      },
    ],
    ctaLabel: 'Ver el natatorio',
    schedule: { opensAt: 7, closesAt: 21 },
    theme: {
      // Agua de la pileta: verde azulado profundo con el acento "pileta".
      // #0B3540 (y no más claro) para que el acento como texto pase 4,5:1.
      bg: '#0B3540',
      accent: '#2FA7B4',
      glowA: '#4FC3C9',
    },
    memberCard: {
      memberNumber: 'N.º 04127',
      category: 'Socio familiar',
      facility: 'Pileta semiolímpica',
      validUntil: 'Vence 03/2027',
    },
    image: {
      src: natacionLarge,
      srcSet: `${natacionSmall} 400w, ${natacionLarge} 589w`,
      alt: 'Nadador con gorra y antiparras nadando crol en un andarivel de la pileta',
    },
  },
  {
    slug: 'futbol',
    name: 'Fútbol',
    title: 'Canchas para jugar el finde',
    description:
      'Dos canchas de once con césped mantenido y cuatro de fútbol cinco iluminadas. Reservás por hora o entrás a la liga interna del complejo.',
    stats: [
      {
        value: '6',
        label: 'Canchas',
        detail: 'Dos de once y cuatro de fútbol cinco con iluminación LED.',
      },
      {
        value: '22',
        label: 'Equipos en la liga',
        detail: 'Categorías libre, veteranos y femenino.',
      },
      {
        value: '23h',
        label: 'Último turno',
        detail:
          'Las canchas iluminadas se reservan hasta las once de la noche.',
      },
    ],
    highlights: [
      {
        title: 'Reserva por hora',
        description:
          'Elegís cancha y horario desde la app; el turno queda a tu nombre.',
      },
      {
        title: 'Liga interna',
        description:
          'Torneo anual con fecha los fines de semana. Se anotan equipos completos.',
      },
      {
        title: 'Escuelita infantil',
        description: 'Para chicos de 6 a 12 años, sábados a la mañana.',
      },
    ],
    ctaLabel: 'Ver las canchas',
    schedule: { opensAt: 9, closesAt: 23 },
    theme: {
      // Pasto de la cancha: verde oscuro con un acento de pasto más claro.
      bg: '#1E3518',
      accent: '#8DBA5A',
      glowA: '#5E8C3A',
    },
    memberCard: {
      memberNumber: 'N.º 02318',
      category: 'Socio adulto',
      facility: 'Cancha de once',
      validUntil: 'Vence 12/2026',
    },
    image: {
      src: futbolLarge,
      srcSet: `${futbolLarge} 375w`,
      alt: 'Jugador con botines amarillos a punto de patear una pelota sobre el césped',
    },
  },
  {
    slug: 'voley',
    name: 'Vóley',
    title: 'Bajo techo y sobre la arena',
    description:
      'Dos canchas cubiertas con piso flotante para las comisiones formativas, y tres de vóley playa que abren de octubre a marzo.',
    stats: [
      {
        value: '5',
        label: 'Canchas',
        detail: 'Dos cubiertas con piso flotante y tres de arena.',
      },
      {
        value: '4',
        label: 'Categorías',
        detail:
          'Mini, sub 14, sub 18 y adultos, con entrenadores del complejo.',
      },
      {
        value: '2×',
        label: 'Por semana',
        detail: 'Cada comisión entrena martes y jueves.',
      },
    ],
    highlights: [
      {
        title: 'Comisiones formativas',
        description:
          'Martes y jueves, separadas por categoría y con entrenadores del complejo.',
      },
      {
        title: 'Vóley playa',
        description:
          'Tres canchas de arena que abren de octubre a marzo, con turnos libres.',
      },
      {
        title: 'Torneos',
        description:
          'Encuentros con otros clubes de la provincia durante la temporada.',
      },
    ],
    ctaLabel: 'Ver las comisiones',
    schedule: { opensAt: 16, closesAt: 22 },
    theme: {
      // Tierra y arena del vóley playa: marrón profundo con acento "arena".
      bg: '#4A2B16',
      accent: '#D9B77A',
      glowA: '#A8703A',
    },
    memberCard: {
      memberNumber: 'N.º 05764',
      category: 'Socio juvenil',
      facility: 'Cancha cubierta',
      validUntil: 'Vence 06/2027',
    },
    image: {
      src: voleyLarge,
      srcSet: `${voleySmall} 400w, ${voleyLarge} 720w`,
      alt: 'Jugadora de vóley saltando para armar la pelota junto a la red',
    },
  },
];
