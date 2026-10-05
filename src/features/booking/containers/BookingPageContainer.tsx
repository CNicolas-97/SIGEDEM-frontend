import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { parseDateInput } from '@/shared/lib/dateInput.ts';
import { Seo } from '@/shared/ui/Seo.tsx';
import { useSectionTheme } from '@/features/landing/hooks/useSectionTheme.ts';
import { formatToday } from '@/features/landing/model/schedule.ts';
import { noGlowPageSections } from '@/features/landing/model/sectionTheme.ts';
import { formatPrice } from '@/features/plans/model/plans.ts';
import { BookingForm } from '@/features/booking/components/BookingForm.tsx';
import { BookingSuccess } from '@/features/booking/components/BookingSuccess.tsx';
import { BookingSummary } from '@/features/booking/components/BookingSummary.tsx';
import {
  courtOptions,
  createEmptyBooking,
  findCourt,
  findInitialCourtId,
  formatSlot,
  getBookingDateRange,
  getDateError,
  getPrice,
  getSlots,
  validateBooking,
  type BookingErrors,
  type BookingTextField,
  type BookingForm as BookingFormValues,
} from '@/features/booking/model/booking.ts';

// QUÉ ES: la página para alquilar una cancha (/alquilar-cancha).
// NIVEL: container (página) — guarda en el estado lo que se va eligiendo,
// calcula los turnos libres, valida al enviar y elige qué mostrar: el
// formulario o el mensaje de "listo".
// DE DÓNDE SALE LA CANCHA: el botón "Alquilar cancha" de fútbol y de vóley
// manda ?deporte=futbol (o voley) y el formulario arranca con esa cancha.
export function BookingPageContainer() {
  const [searchParams] = useSearchParams();

  // La hora de referencia se toma una vez, al abrir la página: así la
  // grilla no cambia sola mientras la persona completa el formulario.
  const [now] = useState(() => new Date());
  const [form, setForm] = useState<BookingFormValues>(() =>
    createEmptyBooking(
      findInitialCourtId(
        searchParams.get('cancha'),
        searchParams.get('deporte')
      )
    )
  );
  const [errors, setErrors] = useState<BookingErrors>({});
  const [isSent, setIsSent] = useState(false);

  useSectionTheme(noGlowPageSections);

  // Datos derivados del estado: se recalculan en cada render.
  const court = findCourt(form.courtId);
  // Si el día está fuera de rango, se avisa apenas se elige, sin esperar al
  // envío. Mientras tanto, la grilla de horarios no se muestra.
  const dateError = form.date ? getDateError(form.date, now) : undefined;
  const isSlotPickerReady = Boolean(court && form.date && !dateError);
  const slots =
    court && isSlotPickerReady ? getSlots(court, form.date, now) : [];
  const { min, max } = getBookingDateRange(now);
  const dateLabel = form.date ? formatToday(parseDateInput(form.date)) : '';
  const slotLabel = form.hour ? formatSlot(Number(form.hour)) : '';

  // Borra el error de un campo apenas la persona lo cambia.
  function clearError(field: keyof BookingFormValues) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleTextChange(field: BookingTextField, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Si cambia la cancha o el día, el horario elegido puede no existir o
      // estar ocupado: se borra para que vuelva a elegir.
      if (field === 'courtId' || field === 'date') next.hour = '';
      return next;
    });
    clearError(field);
  }

  function handleMemberChange(isMember: boolean) {
    setForm((prev) => ({ ...prev, isMember }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateBooking(form, new Date());
    setErrors(found);

    // Si hay errores, se enfoca el primero (cada campo tiene como id el
    // nombre de su dato; la grilla de horarios es "hour").
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    // ACÁ VA LA BASE DE DATOS: cuando esté la API, en este punto se manda
    // "form" con fetch (método POST). La API tiene que revisar que el turno
    // siga libre, porque otra persona pudo reservarlo recién. Por ahora solo
    // se muestra que salió bien.
    setIsSent(true);
    window.scrollTo(0, 0);
  }

  function handleReset() {
    setForm(createEmptyBooking());
    setErrors({});
    setIsSent(false);
  }

  return (
    <>
      <Seo
        title="Alquilá una cancha"
        path="/alquilar-cancha"
        description="Reservá una cancha de fútbol 5, fútbol 11 o vóley en el Complejo Teniente Ledesma: elegí el día y el horario, y pagás en la ventanilla al llegar."
      />
      {/* El padding de arriba deja espacio para el header fijo. */}
      <main className="mx-auto max-w-page px-6.5 pt-[calc(130px+env(safe-area-inset-top,0px))] pb-[110px]">
        <section id="contenido" className="mb-10">
          <h1 className="mb-[18px] text-[length:clamp(40px,6vw,72px)]">
            Alquilá una cancha
          </h1>
          <p className="max-w-[52ch] text-[18px] opacity-80">
            Elegí la cancha, el día y el horario. El turno queda a tu nombre y
            pagás en la ventanilla al llegar.
          </p>
        </section>

        {isSent && court ? (
          <BookingSuccess
            firstName={form.fullName.trim().split(' ')[0]}
            courtName={court.name}
            dateLabel={dateLabel}
            slotLabel={slotLabel}
            priceLabel={formatPrice(getPrice(court, form.isMember))}
            isMember={form.isMember}
            onReset={handleReset}
          />
        ) : (
          // Formulario a la izquierda y el resumen a la derecha desde 941px.
          <div className="grid items-start gap-10 laptop:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <BookingForm
              values={form}
              // El error del día se muestra al instante; los demás, al enviar.
              errors={{ ...errors, date: errors.date ?? dateError }}
              courtOptions={courtOptions}
              slots={slots}
              isSlotPickerReady={isSlotPickerReady}
              minDate={min}
              maxDate={max}
              onTextChange={handleTextChange}
              onMemberChange={handleMemberChange}
              onSubmit={handleSubmit}
            />
            <BookingSummary
              court={court}
              dateLabel={dateLabel}
              slotLabel={slotLabel}
              isMember={form.isMember}
            />
          </div>
        )}
      </main>
    </>
  );
}
