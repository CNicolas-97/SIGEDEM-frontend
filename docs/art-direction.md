# Dirección de arte — SIGEDEM

Fuente de verdad: la ilustración del complejo (relevamiento) que usa el hero.
Todo lo nuevo se compara contra ese dibujo: si parece de otro sitio, no va.

```
Tono: cálido, de barrio, vivo
Movimiento distintivo: "la card es el carnet". Cada actividad es una credencial
  del complejo (foto + datos simulados de socio). Al pasar el mouse o tocarla
  se da vuelta y muestra el horario de hoy y si está abierto.
Tipografía: Archivo Black (display) / Public Sans (cuerpo) / ratio 1.333
Color: dominante crema #F3EFE4 y tinta #071A26 / un acento por instalación,
  sacado de la ilustración: pileta #2FA7B4, arena #D9B77A, pasto #5E8C3A /
  neutros: sand #EFEADC, pool-muted #3D5566. Porqué: son los colores reales
  del complejo dibujado; el acento ocupa como máximo el 10% de cada card.
Espacio: base 4px, densidad cómoda
Movimiento: 600ms cubic-bezier(0.22, 1, 0.36, 1) para todo (giro del carnet,
  cifras que cuentan, líneas de cancha que se dibujan). Se apaga con
  prefers-reduced-motion.
Rechazado: fondo casi negro con un acento neón por sección (lo que había);
  fotos de banco de deporte profesional; QR en el carnet (pedido explícito:
  solo foto y datos).
```

## Carnet: datos simulados

Frente: foto, nombre de la actividad, "Socio N.º", categoría, instalación y
vencimiento. Dorso: horario de hoy, estado abierto/cerrado y botón a la
página de la actividad. Los datos son de ejemplo y se marcan como tales.

## Footer en dos tonos

Franja superior crema/arena con el llamado a sacar el carnet y el horario de
la ventanilla; debajo, bloque tinta con actividades y contacto.
