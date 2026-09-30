import { useEffect, useRef } from 'react';
import backgroundImage from '@/assets/landing/hero-background.webp';
import waterImage from '@/assets/landing/hero-water.webp';
import {
  FRAGMENT_SHADER,
  VERTEX_SHADER,
} from '@/features/landing/components/heroScene.shaders.ts';

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

export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    };
    gl.uniform1i(gl.getUniformLocation(program, 'tFondo'), 0);
    gl.uniform1i(gl.getUniformLocation(program, 'tAgua'), 1);

    const background = loadTexture(gl, backgroundImage, 0);
    const water = loadTexture(gl, waterImage, 1);

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
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    resize();
    frameId = requestAnimationFrame(drawFrame);

    // LIMPIEZA: React la ejecuta al desmontar el componente (por ejemplo, al
    // cambiar de página). Sin esto, la animación y los listeners seguirían
    // corriendo en segundo plano y gastando memoria.
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      // Si una imagen termina de cargar después de limpiar, que no haga nada.
      background.image.onload = null;
      water.image.onload = null;
      gl.deleteTexture(background.texture);
      gl.deleteTexture(water.texture);
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
  // Hasta 860px de ancho el canvas termina donde empieza el tablero "Hoy".
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-1 block size-full max-tablet:bottom-[238px] max-tablet:h-[calc(100%-238px)]"
      aria-hidden="true"
    />
  );
}
