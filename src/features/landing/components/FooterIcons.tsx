// QUÉ ES: íconos de línea del footer, dibujados como SVG (sin librerías).
// NIVEL: componentes presentacionales mínimos.
// DÓNDE SE USA: en SiteFooter.
// Todos usan stroke="currentColor": toman el color del texto que los rodea.

type IconProps = {
  className?: string;
};

// Atributos comunes a todos los íconos. aria-hidden: son decorativos, el
// texto de al lado ya dice lo mismo.
const SVG_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export function ClockIcon({ className }: IconProps) {
  return (
    <svg className={className} {...SVG_PROPS}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg className={className} {...SVG_PROPS}>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg className={className} {...SVG_PROPS}>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function CopyIcon({ className }: IconProps) {
  return (
    <svg className={className} {...SVG_PROPS}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a1 1 0 0 1 1-1h9" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} {...SVG_PROPS}>
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg className={className} {...SVG_PROPS}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
