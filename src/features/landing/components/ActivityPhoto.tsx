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
    <div className="stage">
      {/* data-tilt: marca para useScrollMotion (solo activo en la home), que
          inclina la imagen según su posición en la pantalla. */}
      <figure className="shot" data-tilt>
        {/* sizes: ancho que ocupa la foto en pantalla. Con eso y el
            srcSet, el navegador decide qué archivo descargar.
            width/height: reservan el lugar antes de que llegue la
            imagen y evitan que la página "salte". */}
        <img
          className="fill photo"
          src={activity.image.src}
          srcSet={activity.image.srcSet}
          sizes="(max-width: 940px) 100vw, 580px"
          alt={activity.image.alt}
          width={400}
          height={500}
          loading={loading}
          decoding="async"
        />
        <figcaption className="float">{activity.name}</figcaption>
      </figure>
    </div>
  );
}
