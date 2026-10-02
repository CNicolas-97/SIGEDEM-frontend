// QUÉ ES: la marca de SIGEDEM: el logo del complejo (vela, base y sol) + el
// nombre.
// NIVEL: componente presentacional.
// DÓNDE SE USA: en SiteHeader. El footer usa LedesmaWordmark.

export function BrandMark() {
  return (
    <div className="flex items-center gap-[11px]">
      {/* aria-hidden: es decorativo, el nombre ya está escrito al lado.
          Formas copiadas del diseño de Figma (logo.jpeg). */}
      <svg
        className="h-[34px] w-auto flex-none"
        viewBox="70 36 110 152"
        aria-hidden="true"
      >
        {/* Vela azul. */}
        <path
          className="fill-brand-blue"
          d="M91 38C108 52 121 72 119 92C118 110 112 130 111 152H82C72 130 72 100 78 78C81 62 85 48 91 38Z"
        />
        {/* Sol amarillo. */}
        <circle className="fill-brand-sun" cx="146.5" cy="112.5" r="19.5" />
        {/* Base celeste: va al final para quedar encima de la vela. */}
        <path
          className="fill-brand-sky"
          d="M83 150L177 151C160 165 125 182 96 186C90 176 86 162 83 150Z"
        />
      </svg>
      <span className="font-display text-[19px] leading-[0.94] tracking-[0.01em]">
        SIGEDEM
      </span>
    </div>
  );
}
