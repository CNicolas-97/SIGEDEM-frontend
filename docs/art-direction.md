# Dirección de arte — SIGEDEM

Fuente de verdad: la ilustración del complejo (relevamiento) que usa el hero.
Todo lo nuevo se compara contra ese dibujo: si parece de otro sitio, no va.

```
Tono: cálido, de barrio, vivo
Movimiento distintivo: tarjetas de actividad que se dan vuelta. El frente
  muestra la foto, el nombre en una etiqueta tipo sticker y una franja con la
  instalación y el horario de hoy; al pasar el mouse o tocarla se da vuelta y
  muestra el horario en detalle, lo que hay que saber y el link a la actividad.
Tipografía: Archivo Black (display) / Public Sans (cuerpo) / ratio 1.333
Color: tres colores por actividad, sacados de la ilustración: un degradé de
  dos tonos de la instalación (franja de la tarjeta) y un color "pop" para la
  etiqueta del nombre. Pileta: turquesa → celeste + amarillo sol. Fútbol:
  lima → pasto + naranja. Vóley: arena → naranja + azul del logo. El fondo de
  cada sección también mezcla dos tonos oscuros en diagonal.
Espacio: base 4px, densidad cómoda
Movimiento: 600ms cubic-bezier(0.22, 1, 0.36, 1) para todo (giro de la
  tarjeta, cifras que cuentan, líneas de cancha que se dibujan). Se apaga con
  prefers-reduced-motion.
Rechazado: fondo casi negro con un acento neón por sección (lo que había);
  un carnet por actividad (el complejo tiene un solo carnet para todo);
  QR en las tarjetas; franja crema arriba del footer.
```
