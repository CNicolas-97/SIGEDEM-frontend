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

// Fragment shader: calcula el color de cada píxel. Mezcla dos imágenes
// (fondo y agua), las mueve con ruido, agrega reflejos, niebla y grano.
export const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec2 uv; out vec4 color;
uniform sampler2D tFondo, tAgua;
uniform vec2 uRes, uMouse;
uniform float uTime, uScroll;

const vec3 CREMA = vec3(0.937,0.918,0.863);
const float ASPECT_IMG = 1.6;

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

/* apaisado: recorte tipo cover. vertical: la escena entra entera, abajo */
vec2 encuadre(vec2 uv, float esc){
  float ar = uRes.x/uRes.y;
  if (ar >= ASPECT_IMG*0.92){
    vec2 s = vec2(1.0, ASPECT_IMG/ar);
    return (uv - 0.5)*s/esc + 0.5;
  }
  float h = (ar/ASPECT_IMG) * esc;
  return vec2((uv.x - 0.5)/esc + 0.5, (uv.y - (1.0 - h))/h);
}

vec4 sampleLayer(sampler2D t, vec2 base, vec2 disp){
  vec2 c = base + disp;
  if (c.x < -0.02 || c.x > 1.02 || c.y < -0.02 || c.y > 1.02) return vec4(0.0);
  return texture(t, c);
}

void main(){
  float t = uTime;
  float esc = 1.0 + uScroll*0.09;
  vec2 base = encuadre(vec2(uv.x, 1.0-uv.y), esc);

  /* --- ruido que mueve todo --- */
  float n1 = fbm(base*3.4 + vec2(t*0.055, t*0.028));
  float n2 = fbm(base*7.0 - vec2(t*0.09, t*0.04));

  /* --- capa 1: fondo. la red y el arco vibran apenas --- */
  vec2 dFondo = (vec2(n1, n2) - 0.5) * 0.0022
              + uMouse*0.009 + vec2(0.0, uScroll*0.014);
  vec4 fondo = sampleLayer(tFondo, base, dFondo);

  /* --- capa 2: agua, ondula más abajo --- */
  float mAgua = smoothstep(0.60, 1.0, base.y);
  vec2 dAgua = vec2(
      sin(base.y*46.0 + t*1.25)*0.0035 + (n2-0.5)*0.010,
      (n1-0.5)*0.006
    ) * mAgua + uMouse*0.010 + vec2(0.0, uScroll*0.030);
  vec4 agua = sampleLayer(tAgua, base, dAgua);

  /* cáusticas: bandas cruzadas que se mueven sobre el agua */
  float ca = fbm(base*vec2(9.0,16.0) + vec2(t*0.20, -t*0.13));
  float cb = fbm(base*vec2(13.0,20.0) - vec2(t*0.16, t*0.10));
  float caust = pow(1.0 - abs(ca-cb)*2.4, 5.0);
  agua.rgb += caust * 0.26 * mAgua * agua.a;

  /* --- composición sobre el crema --- */
  vec3 c = CREMA;
  c = mix(c, fondo.rgb, fondo.a);
  c = mix(c, agua.rgb,  agua.a);

  /* --- niebla: dos capas de ruido a distinta velocidad --- */
  vec2 nb = clamp(base, 0.0, 1.0);
  float f1 = fbm(nb*vec2(2.2,1.4) + vec2(t*0.016, -t*0.008));
  float f2 = fbm(nb*vec2(3.8,2.4) - vec2(t*0.026, t*0.012));
  float niebla = smoothstep(0.36, 0.86, f1*0.65 + f2*0.45);
  niebla *= smoothstep(0.02, 0.26, nb.y) * smoothstep(0.78, 0.34, nb.y);
  c = mix(c, vec3(0.972,0.960,0.925), niebla*0.50);

  /* --- luz cálida arriba, sombra en los bordes --- */
  c = mix(c, vec3(0.98,0.93,0.80), smoothstep(0.55,0.0,nb.y)*0.18);
  float vig = smoothstep(1.30, 0.35, length((uv-0.5)*vec2(1.2,1.0)));
  c *= 0.92 + 0.08*vig;
  /* unificar paleta: desaturar apenas y tirar a cálido */
  float lum = dot(c, vec3(0.299,0.587,0.114));
  c = mix(c, vec3(lum), 0.14);
  c = mix(c, c*vec3(1.04,1.01,0.94), 0.55);

  /* --- grano --- */
  float g = hash(gl_FragCoord.xy + fract(t)*97.0);
  c += (g-0.5)*0.030;

  color = vec4(c, 1.0);
}`;
