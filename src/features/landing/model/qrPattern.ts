// QUÉ ES: genera el dibujo "tipo QR" del carnet. Es decorativo: no se puede
// escanear.
// NIVEL: model — función pura, sin JSX.
// CÓMO FUNCIONA: recorre una grilla de 29×29 casillas y decide cuáles pintar.
// - Las tres esquinas llevan el cuadrado típico de un QR.
// - El resto se elige con números "pseudoaleatorios" a partir de una semilla
//   fija: siempre sale el mismo dibujo, en cada render y en cada visita.

export const QR_SIZE = 29;

export type QrCell = {
  x: number;
  y: number;
};

// ¿La casilla (x, y) cae dentro de una de las tres esquinas de 8×8?
function isInCorner(x: number, y: number): boolean {
  const far = QR_SIZE - 8;
  return (x < 8 && y < 8) || (x >= far && y < 8) || (x < 8 && y >= far);
}

// Dentro de una esquina: borde del cuadrado o bloque del centro.
function isCornerMark(x: number, y: number): boolean {
  const isBorder = x % 7 === 0 || y % 7 === 0;
  const isCenter = x > 1 && x < 6 && y > 1 && y < 6;
  return isBorder || isCenter;
}

export function buildQrCells(seed = 11): QrCell[] {
  let current = seed;
  // Generador congruencial lineal: la misma fórmula clásica de rand() en C.
  function nextRandom(): number {
    current = (current * 1103515245 + 12345) % 2147483648;
    return current / 2147483648;
  }

  const cells: QrCell[] = [];
  for (let y = 0; y < QR_SIZE; y++) {
    for (let x = 0; x < QR_SIZE; x++) {
      const filled = isInCorner(x, y)
        ? isCornerMark(x, y)
        : nextRandom() > 0.53;
      if (filled) cells.push({ x, y });
    }
  }
  return cells;
}
