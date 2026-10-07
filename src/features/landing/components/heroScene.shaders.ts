// QUÉ ES: el código GLSL (el lenguaje de la placa de video) de la escena del
// hero. Son strings que WebGL compila en tiempo de ejecución.
// NIVEL: pieza extra de aprendizaje (WebGL2/GLSL), independiente de los
// conceptos de React del TP. La usa solo HeroScene.tsx.
// POR QUÉ SEPARADO: así HeroScene queda legible y enfocado en el ciclo de
// vida de React (montar, animar, limpiar).

// Vertex shader: dibuja un triángulo que tapa toda la pantalla y le pasa al
// fragment shader la coordenada "uv" (0 a 1) de cada punto.
export const VERTEX_SHADER = `#version 300 es
in vec2 p; out vec2 uv;
void main(){ uv = p*0.5+0.5; gl_Position = vec4(p,0.,1.); }`;

// Fragment shader: calcula el color de cada píxel. Parte de una sola
// ilustración y la anima con una máscara pintada (R = árboles, G = pasto):
// viento en la vegetación, agua en la pileta, niebla, luz y grano.
// Proporción de la ilustración (2000 × 1116) y punto donde se centra el
// recorte en celular (la pileta). HeroScene.tsx los usa también para saber
// cuánto se puede deslizar la vista.
export const IMAGE_ASPECT = 1.792;
export const FOCUS_X = 0.36;

// Centro del recorte en pantallas más angostas que la imagen. Devuelve el
// ancho visible (w, de 0 a 1), el centro por defecto (focus) y los límites
// para no pasarse del borde (min, max). Misma cuenta que encuadre() en GLSL.
export function getFraming(aspect: number) {
  const w = Math.min(1, aspect / IMAGE_ASPECT);
  const t = Math.min(1, Math.max(0, (w - 0.55) / 0.3));
  const smooth = t * t * (3 - 2 * t);
  const focus = FOCUS_X + (0.5 - FOCUS_X) * smooth;
  return { w, focus, min: w / 2, max: 1 - w / 2 };
}

export const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec2 uv; out vec4 color;
uniform sampler2D tFondo, tMask;
uniform vec2 uRes, uMouse;
uniform float uTime, uScroll, uPan;

const vec3 CREMA = vec3(0.937,0.918,0.863);
const float ASPECT_IMG = ${IMAGE_ASPECT};

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

/* recorte tipo cover: la imagen siempre llena el canvas. apaisado: recorta
   arriba y abajo; más angosto: recorta los costados. En celular además
   corre el centro hacia la izquierda, donde está la pileta (FOCO_X), sin
   pasarse del borde de la imagen. uPan: lo que el usuario deslizó o giró
   el celular (lo limita HeroScene.tsx). */
const float FOCO_X = ${FOCUS_X};
vec2 encuadre(vec2 uv, float esc){
  float ar = uRes.x/uRes.y;
  if (ar >= ASPECT_IMG){
    vec2 s = vec2(1.0, ASPECT_IMG/ar);
    return (uv - 0.5)*s/esc + 0.5;
  }
  float w = ar/ASPECT_IMG;
  /* compu (w cerca de 1): centrado. celular (w chico): corrido al foco. */
  float foco = mix(FOCO_X, 0.5, smoothstep(0.55, 0.85, w));
  float cx = clamp(foco + uPan, w*0.5, 1.0 - w*0.5);
  return vec2((uv.x - 0.5)*w/esc + cx, (uv.y - 0.5)/esc + 0.5);
}

void main(){
  float t = uTime;
  float esc = 1.0 + uScroll*0.09;
  vec2 base = encuadre(vec2(uv.x, 1.0-uv.y), esc);

  /* --- ruido que mueve todo --- */
  float n1 = fbm(base*3.4 + vec2(t*0.055, t*0.028));
  float n2 = fbm(base*7.0 - vec2(t*0.09, t*0.04));

  /* imagen única: un poco de zoom para que el parallax no muestre bordes */
  vec2 q = (base - 0.5)*0.955 + 0.5 + uMouse*0.010 + vec2(0.0, uScroll*0.014);
  vec3 crudo = texture(tFondo, clamp(q, 0.0, 1.0)).rgb;
  /* máscara de pileta: zona abajo-izquierda y color turquesa */
  float mAgua = smoothstep(0.03, 0.14, crudo.b - crudo.r) * step(crudo.r, crudo.g)
              * smoothstep(0.52, 0.60, q.y) * smoothstep(0.56, 0.44, q.x);
  /* viento con máscara pintada: R = árboles/arbustos (más arriba, más se hamacan), G = pasto */
  vec2 mk = texture(tMask, clamp(q, 0.0, 1.0)).rg;
  float rafaga = 0.55 + 0.45*sin(t*0.5 + q.x*2.5);
  vec2 viento = vec2(sin(t*1.5 + q.x*9.0) + 0.45*sin(t*3.1 + q.x*23.0 + q.y*17.0), 0.0)
                * 0.0055 * rafaga * mk.r
              + vec2(sin(q.x*60.0 + q.y*40.0 + t*2.4)*0.0023, 0.0) * mk.g * smoothstep(0.80, 0.86, q.y);
  vec2 d = (vec2(n1, n2) - 0.5) * 0.0016
         + vec2(sin(q.y*60.0 + t*1.25)*0.0022 + (n2-0.5)*0.006, (n1-0.5)*0.004) * mAgua + viento;
  vec3 c = texture(tFondo, clamp(q + d, 0.0, 1.0)).rgb;

  /* cáusticas: bandas cruzadas que se mueven sobre el agua */
  float ca = fbm(q*vec2(9.0,16.0) + vec2(t*0.20, -t*0.13));
  float cb = fbm(q*vec2(13.0,20.0) - vec2(t*0.16, t*0.10));
  c += pow(1.0 - abs(ca-cb)*2.4, 5.0) * 0.16 * mAgua;

  /* pasto: franjas de luz que barren + briznas dibujadas que se inclinan */
  float ola = smoothstep(0.40, 0.75, fbm(vec2(q.x*6.0 - t*0.8, q.y*18.0 + t*0.12)));
  float bz = noise(vec2(q.x*380.0 + sin(t*2.2 + q.x*14.0 + q.y*9.0)*1.4 + ola*1.5, q.y*55.0));
  bz = smoothstep(0.55, 0.95, bz);
  c = mix(c, c*1.22 + vec3(0.05,0.06,0.0), mk.g * ola * 0.55);
  c = mix(c, c*0.80, mk.g * (1.0-ola) * 0.25);
  c += mk.g * bz * (0.4 + 0.6*ola) * vec3(0.032,0.040,0.009);
  if (base.x < -0.02 || base.x > 1.02 || base.y < -0.02 || base.y > 1.02) c = CREMA;

  /* --- niebla: dos capas de ruido a distinta velocidad --- */
  vec2 nb = clamp(base, 0.0, 1.0);
  float f1 = fbm(nb*vec2(2.2,1.4) + vec2(t*0.016, -t*0.008));
  float f2 = fbm(nb*vec2(3.8,2.4) - vec2(t*0.026, t*0.012));
  float niebla = smoothstep(0.36, 0.86, f1*0.65 + f2*0.45);
  niebla *= smoothstep(0.02, 0.26, nb.y) * smoothstep(0.78, 0.34, nb.y);
  c = mix(c, vec3(0.972,0.960,0.925), niebla*0.22);

  /* --- luz cálida arriba, sombra en los bordes --- */
  c = mix(c, vec3(0.98,0.93,0.80), smoothstep(0.55,0.0,nb.y)*0.18);
  float vig = smoothstep(1.30, 0.35, length((uv-0.5)*vec2(1.2,1.0)));
  c *= 0.92 + 0.08*vig;
  /* unificar paleta: desaturar apenas y tirar a cálido */
  float lum = dot(c, vec3(0.299,0.587,0.114));
  c = mix(c, vec3(lum), 0.05);
  c = mix(c, c*vec3(1.04,1.01,0.94), 0.55);

  /* --- grano --- */
  float g = hash(gl_FragCoord.xy + fract(t)*97.0);
  c += (g-0.5)*0.030;

  color = vec4(c, 1.0);
}`;
