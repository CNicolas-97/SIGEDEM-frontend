import { useEffect, useState } from 'react';
import {
  CheckIcon,
  CopyIcon,
} from '@/features/landing/components/FooterIcons.tsx';
import { cn } from '@/shared/lib/cn.ts';

// QUÉ ES: botón chico que copia el teléfono al portapapeles y avisa "Copiado".
// NIVEL: componente con estado propio (useState).
// DÓNDE SE USA: en SiteFooter, al lado del teléfono.
// CÓMO FUNCIONA: "copied" arranca en false. Al copiar pasa a true y el botón
// cambia de ícono y de texto; un useEffect lo vuelve a false a los 2 segundos.

type CopyPhoneButtonProps = {
  phone: string;
};

export function CopyPhoneButton({ phone }: CopyPhoneButtonProps) {
  const [copied, setCopied] = useState(false);

  // Se ejecuta cada vez que cambia "copied". Si está en true, programa la
  // vuelta a false; la función que devuelve cancela el temporizador si el
  // componente desaparece antes (o si se vuelve a copiar).
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
    } catch {
      // Sin permiso para el portapapeles: no mostramos "Copiado".
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-semibold transition-colors duration-200',
        copied
          ? 'bg-brand-sky/20 text-brand-sky'
          : 'bg-white/8 text-white/75 hover:bg-white/14 hover:text-white'
      )}
    >
      {copied ? (
        <CheckIcon className="size-3.5" />
      ) : (
        <CopyIcon className="size-3.5" />
      )}
      {/* aria-live: el lector de pantalla anuncia el cambio a "Copiado". */}
      <span aria-live="polite">{copied ? 'Copiado' : 'Copiar'}</span>
    </button>
  );
}
