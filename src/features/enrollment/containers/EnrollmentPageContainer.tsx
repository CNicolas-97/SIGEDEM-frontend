import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { Seo } from '@/shared/ui/Seo.tsx';
import { useSectionTheme } from '@/features/landing/hooks/useSectionTheme.ts';
import { footerContact } from '@/features/landing/model/navigation.ts';
import { formatSchedule } from '@/features/landing/model/schedule.ts';
import { defaultPageSections } from '@/features/landing/model/sectionTheme.ts';
import { plans } from '@/features/plans/model/plans.ts';
import { EnrollmentForm } from '@/features/enrollment/components/EnrollmentForm.tsx';
import { EnrollmentSuccess } from '@/features/enrollment/components/EnrollmentSuccess.tsx';
import { PlanSummary } from '@/features/enrollment/components/PlanSummary.tsx';
import {
  activityOptions,
  createEmptyEnrollment,
  findPlanId,
  getWindowChecklist,
  planOptions,
  toDateInputValue,
  validateEnrollment,
  type EnrollmentErrors,
  type EnrollmentField,
  type EnrollmentForm as EnrollmentFormValues,
} from '@/features/enrollment/model/enrollment.ts';

// QUÉ ES: la página de inscripción (/inscripcion).
// NIVEL: container (página) — guarda en el estado lo que se va escribiendo,
// lo valida al enviar y elige qué mostrar: el formulario o el mensaje de
// "listo". Los componentes de components/ solo dibujan.
// DE DÓNDE SALE EL PLAN: si se llega desde "Quiero este plan", la URL trae
// ?plan=familiar y el formulario arranca con ese plan elegido.
export function EnrollmentPageContainer() {
  const [searchParams] = useSearchParams();

  // Estado 1: los valores de todos los campos, en un solo objeto. Se pasa
  // una función a useState para que el valor inicial se calcule una sola
  // vez, al montar la página.
  const [form, setForm] = useState<EnrollmentFormValues>(() =>
    createEmptyEnrollment(findPlanId(searchParams.get('plan')))
  );
  // Estado 2: los errores de la última validación.
  const [errors, setErrors] = useState<EnrollmentErrors>({});
  // Estado 3: si ya se envió bien (muestra el mensaje en vez del formulario).
  const [isSent, setIsSent] = useState(false);

  useSectionTheme(defaultPageSections);

  // Datos derivados: se recalculan en cada render a partir del estado, así
  // que no hace falta guardarlos aparte.
  const selectedPlan = plans.find((plan) => plan.id === form.planId);
  const today = new Date();

  function handleFieldChange(field: EnrollmentField, value: string) {
    // "...prev" copia el objeto anterior y [field] pisa solo el campo que
    // cambió. Nunca se modifica el estado directamente: se crea uno nuevo.
    setForm((prev) => ({ ...prev, [field]: value }));
    // Si ese campo tenía un error, se borra apenas la persona lo corrige.
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Sin esto, el navegador recargaría la página al enviar el formulario.
    event.preventDefault();

    const found = validateEnrollment(form, new Date());
    setErrors(found);

    // Si hay errores, se enfoca el primer campo con problemas (cada campo
    // tiene como id el nombre de su dato: "dni", "email"...).
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    // ACÁ VA LA BASE DE DATOS: cuando esté la API, en este punto se manda
    // "form" con fetch (método POST) y se espera la respuesta antes de
    // mostrar el mensaje. Por ahora solo se muestra que salió bien.
    setIsSent(true);
    window.scrollTo(0, 0);
  }

  function handleReset() {
    setForm(createEmptyEnrollment());
    setErrors({});
    setIsSent(false);
  }

  return (
    <>
      <Seo
        title="Inscripción"
        path="/inscripcion"
        description="Inscribite al abono del Complejo Teniente Ledesma: completá tus datos, elegí el plan y terminá el trámite en la ventanilla con tu DNI."
      />
      {/* El padding de arriba deja espacio para el header fijo. */}
      <main className="mx-auto max-w-page px-6.5 pt-[calc(130px+env(safe-area-inset-top,0px))] pb-[110px]">
        {/* id="contenido": el bloque que toma los colores de la página. */}
        <section id="contenido" className="mb-10">
          <h1 className="mb-[18px] text-[length:clamp(40px,6vw,72px)]">
            Inscripción
          </h1>
          <p className="max-w-[52ch] text-[18px] opacity-80">
            Completá tus datos y elegí el plan. Después pasás por la ventanilla
            con tu DNI y te llevás el carnet.
          </p>
        </section>

        {/* Renderizado condicional: según isSent se ve una cosa u otra. */}
        {isSent ? (
          <EnrollmentSuccess
            firstName={form.firstName.trim()}
            planName={selectedPlan?.name ?? ''}
            windowHours={`${footerContact.windowDays.toLowerCase()}, de ${formatSchedule(footerContact.windowSchedule)}`}
            checklist={getWindowChecklist(form, today)}
            onReset={handleReset}
          />
        ) : (
          // Formulario a la izquierda y el plan a la derecha desde 941px.
          <div className="grid items-start gap-10 laptop:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <EnrollmentForm
              values={form}
              errors={errors}
              planOptions={planOptions}
              activityOptions={activityOptions}
              maxBirthDate={toDateInputValue(today)}
              onFieldChange={handleFieldChange}
              onSubmit={handleSubmit}
            />
            <PlanSummary plan={selectedPlan} />
          </div>
        )}
      </main>
    </>
  );
}
