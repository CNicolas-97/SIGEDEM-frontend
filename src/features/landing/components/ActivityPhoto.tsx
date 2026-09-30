import type { Activity } from '@/features/landing/model/activities.ts';

// QUÉ ES: la foto de una actividad, con su nombre encima.
// NIVEL: componente presentacional.
// DÓNDE SE USA: en ActivitySection (home) y en ActivityDetail (página de
// detalle). Se escribe una vez y se reutiliza cambiando las props.

type ActivityPhotoProps = {
  activity: Activity;
  // "lazy": la foto se baja recién cuando está por aparecer (home, más abajo).
  // "eager": se baja enseguida (detalle, donde la foto se ve al entrar).
  loading: 'lazy' | 'eager';
};

export function ActivityPhoto({ activity, loading }: ActivityPhotoProps) {
  return (
    <div className="perspective-[1250px]">
      {/* data-tilt: marca para useScrollMotion (solo activo en la home), que
          inclina la imagen según su posición en la pantalla. La inclinación
          la calcula la clase shot-tilt (landing.css) con esas variables. */}
      <figure
        className="shot-tilt relative aspect-[4/5] overflow-hidden rounded-[26px] bg-abyss shadow-[0_50px_100px] shadow-black/50 transform-3d will-change-transform"
        data-tilt
      >
        {/* sizes: ancho que ocupa la foto en pantalla. Con eso y el
            srcSet, el navegador decide qué archivo descargar.
            width/height: reservan el lugar antes de que llegue la
            imagen y evitan que la página "salte". */}
        <img
          className="absolute inset-0 size-full object-cover"
          src={activity.image.src}
          srcSet={activity.image.srcSet}
          sizes="(max-width: 940px) 100vw, 580px"
          alt={activity.image.alt}
          width={400}
          height={500}
          loading={loading}
          decoding="async"
        />
        {/* La foto cubre toda la tarjeta sin deformarse (object-cover recorta
            lo que sobra); el nombre flota adelante (translate-z). */}
        <figcaption className="absolute bottom-6 left-6.5 translate-z-[60px] font-display text-[length:clamp(30px,4.6vw,52px)] leading-[0.9] text-shadow-[0_12px_30px] text-shadow-black/45">
          {activity.name}
        </figcaption>
      </figure>
    </div>
  );
}
