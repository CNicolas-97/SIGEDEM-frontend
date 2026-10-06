import { useEffect, useRef, useState } from 'react';
import backgroundImage from '@/assets/landing/hero-background.webp';
import maskImage from '@/assets/landing/hero-mask.png';
import {
  FRAGMENT_SHADER,
  VERTEX_SHADER,
  getFraming,
} from '@/features/landing/components/heroScene.shaders.ts';
import { cn } from '@/shared/lib/cn.ts';

// QUÉ ES: la escena animada de fondo del hero, dibujada con WebGL2.
// NIVEL: pieza EXTRA de aprendizaje (WebGL2/GLSL), independiente de los
// conceptos de React que pide el TP. Se puede borrar y la página sigue
// funcionando: el hero tiene un color de fondo propio.
// DÓNDE SE USA: dentro de Hero.
// LO QUE SÍ ES DE REACT:
// - useRef: nos da acceso al <canvas> real del DOM.
// - useEffect: arranca la animación cuando el canvas ya está en pantalla, y
//   su función de limpieza (el "return") la frena al salir de la página.
// Si el navegador no tiene WebGL2, el canvas se oculta y queda el fondo liso.

// Compila un shader. Si falla, avisa en consola (no rompe la página).
function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
  }
  return shader;
}

// Crea una textura vacía (1 píxel transparente) en la "unidad" indicada y
// carga la imagen de forma asíncrona. Devuelve la textura y la imagen para
// poder liberarlas en la limpieza.
function loadTexture(gl: WebGL2RenderingContext, url: string, unit: number) {
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 0, 0])
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const image = new Image();
  image.onload = () => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  };
  image.src = url;
  return { texture, image };
}

// Grados de inclinación del celular para recorrer la imagen de punta a punta.
const TILT_RANGE_DEG = 30;

export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Si la persona ya deslizó o giró el celular, el aviso "deslizá" se va.
  const [hasPanned, setHasPanned] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) {
      canvas.hidden = true;
      return;
    }
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // --- Programa: vertex + fragment shader enlazados ---
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      FRAGMENT_SHADER
    );
    const program = gl.createProgram();
    if (vertexShader) gl.attachShader(program, vertexShader);
    if (fragmentShader) gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // --- Geometría: un triángulo gigante que cubre toda la pantalla ---
    const vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const positionLocation = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // --- Uniforms: valores que JavaScript le pasa al shader en cada cuadro ---
    const uniforms = {
      resolution: gl.getUniformLocation(program, 'uRes'),
      mouse: gl.getUniformLocation(program, 'uMouse'),
      time: gl.getUniformLocation(program, 'uTime'),
      scroll: gl.getUniformLocation(program, 'uScroll'),
      pan: gl.getUniformLocation(program, 'uPan'),
    };
    gl.uniform1i(gl.getUniformLocation(program, 'tFondo'), 0);
    gl.uniform1i(gl.getUniformLocation(program, 'tMask'), 1);

    const background = loadTexture(gl, backgroundImage, 0);
    const mask = loadTexture(gl, maskImage, 1);

    // --- Estado de la animación ---
    const mouse = { x: 0, y: 0 };
    const mouseTarget = { x: 0, y: 0 };
    let scroll = 0;
    let isVisible = true;
    let frameId = 0;
    const startTime = performance.now();

    // Último tamaño enviado al shader. Es propio de ESTE montaje: en desarrollo
    // StrictMode monta el efecto dos veces sobre el mismo canvas, y si
    // comparáramos contra canvas.width (que ya quedó con el tamaño correcto)
    // el programa nuevo nunca recibiría uRes y se vería negro.
    let lastWidth = 0;
    let lastHeight = 0;

    // --- Recorrer la imagen en celular ---
    // Cuando la pantalla es más angosta que la ilustración, se ve solo una
    // parte. La persona puede deslizar con el dedo o girar el celular para
    // ver el resto. pan es cuánto se corre el centro (en fracción del ancho
    // de la imagen); dragPan lo pone el dedo y tiltPan, el giroscopio.
    let pan = 0;
    let dragPan = 0;
    let tiltPan = 0;
    let dragStartX: number | null = null;
    let dragStartPan = 0;
    let tiltBase: number | null = null;
    const section = canvas.closest('section');

    // Límites del corrimiento para la proporción actual del canvas.
    function panLimits() {
      const framing = getFraming(
        (canvas?.clientWidth ?? 1) / (canvas?.clientHeight ?? 1)
      );
      return {
        ...framing,
        low: framing.min - framing.focus,
        high: framing.max - framing.focus,
      };
    }
    function clampPan(value: number) {
      const { low, high } = panLimits();
      return Math.min(high, Math.max(low, value));
    }

    // Solo el dedo (o lápiz): el mouse ya mueve la escena con el parallax.
    function handlePointerDown(event: PointerEvent) {
      if (event.pointerType === 'mouse') return;
      dragStartX = event.clientX;
      dragStartPan = dragPan;
    }
    function handlePointerMove(event: PointerEvent) {
      if (dragStartX === null || !canvas) return;
      // Deslizar a la derecha trae lo que está a la izquierda, como al
      // arrastrar una foto: la imagen sigue al dedo.
      const { w } = panLimits();
      const dx = (event.clientX - dragStartX) / canvas.clientWidth;
      // Se limita el total (dedo + giro) y el dedo se queda con su parte.
      dragPan = clampPan(dragStartPan + tiltPan - dx * w) - tiltPan;
      if (Math.abs(dx) > 0.02) setHasPanned(true);
    }
    function handlePointerEnd() {
      dragStartX = null;
    }

    // Giroscopio: gamma es la inclinación a izquierda/derecha, en grados.
    // La primera lectura es "derecho"; desde ahí, ±TILT_RANGE_DEG recorre
    // la imagen de punta a punta.
    function handleOrientation(event: DeviceOrientationEvent) {
      if (event.gamma === null) return;
      tiltBase ??= event.gamma;
      const { low, high } = panLimits();
      const ratio = Math.min(
        1,
        Math.max(-1, (event.gamma - tiltBase) / TILT_RANGE_DEG)
      );
      tiltPan = ratio * ((high - low) / 2);
      if (Math.abs(ratio) > 0.15) setHasPanned(true);
    }
    // En iPhone el giroscopio pide permiso con un cartel del sistema
    // (requestPermission); ahí no lo usamos y queda solo el dedo. Con
    // "reducir movimiento" tampoco: mover el celular no tiene que mover la
    // pantalla.
    const canUseTilt =
      'DeviceOrientationEvent' in window &&
      !('requestPermission' in DeviceOrientationEvent) &&
      !reduceMotion;

    // Ajusta el tamaño interno del canvas al tamaño en pantalla.
    function resize() {
      if (!canvas || !gl) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.round(canvas.clientWidth * pixelRatio);
      const height = Math.round(canvas.clientHeight * pixelRatio);
      if (lastWidth !== width || lastHeight !== height) {
        lastWidth = width;
        lastHeight = height;
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        gl.uniform2f(uniforms.resolution, width, height);
      }
    }

    function handleMouseMove(event: MouseEvent) {
      mouseTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.y = (event.clientY / window.innerHeight) * 2 - 1;
    }

    function handleScroll() {
      scroll = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      // Si el hero ya no se ve, no hace falta dibujar.
      isVisible = window.scrollY < window.innerHeight * 1.05;
    }

    // Se llama unas 60 veces por segundo con requestAnimationFrame.
    function drawFrame(now: number) {
      frameId = requestAnimationFrame(drawFrame);
      if (!isVisible || !gl) return;
      resize();
      // El mouse llega "con inercia": se acerca de a poco al valor real.
      mouse.x += (mouseTarget.x - mouse.x) * 0.045;
      mouse.y += (mouseTarget.y - mouse.y) * 0.045;
      gl.uniform2f(uniforms.mouse, mouse.x, mouse.y);
      gl.uniform1f(uniforms.time, reduceMotion ? 0 : (now - startTime) / 1000);
      gl.uniform1f(uniforms.scroll, scroll);
      // El corrimiento también llega con inercia.
      pan += (clampPan(dragPan + tiltPan) - pan) * 0.12;
      gl.uniform1f(uniforms.pan, pan);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    section?.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });
    window.addEventListener('pointerup', handlePointerEnd);
    window.addEventListener('pointercancel', handlePointerEnd);
    if (canUseTilt) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    resize();
    frameId = requestAnimationFrame(drawFrame);

    // LIMPIEZA: React la ejecuta al desmontar el componente (por ejemplo, al
    // cambiar de página). Sin esto, la animación y los listeners seguirían
    // corriendo en segundo plano y gastando memoria.
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      section?.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
      window.removeEventListener('deviceorientation', handleOrientation);
      // Si una imagen termina de cargar después de limpiar, que no haga nada.
      background.image.onload = null;
      mask.image.onload = null;
      gl.deleteTexture(background.texture);
      gl.deleteTexture(mask.texture);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      // No usamos loseContext(): en desarrollo StrictMode monta el efecto dos
      // veces sobre el MISMO canvas y el segundo montaje necesita el contexto.
    };
  }, []);

  // aria-hidden: es decoración, no aporta información a un lector de pantalla.
  // Ocupa todo su contenedor: en Hero, el hero entero.
  // El aviso solo se ve en celular (hasta 860px) y se va al primer uso.
  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-1 block size-full"
        aria-hidden="true"
      />
      <p
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-[118px] z-1 mx-auto w-fit rounded-full bg-ink/70 px-3.5 py-1.5 text-[13px] font-semibold text-cream backdrop-blur-[4px] transition-opacity duration-600 tablet:hidden',
          hasPanned && 'opacity-0'
        )}
        aria-hidden="true"
      >
        ↔ Deslizá para ver todo el complejo
      </p>
    </>
  );
}
