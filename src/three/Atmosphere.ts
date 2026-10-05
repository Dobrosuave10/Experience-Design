/**
 * Atmósfera WebGL (sin Three.js, un solo fragment shader).
 *
 * No dibuja objetos: sólo luz. Un halo cálido que sigue al puntero y otro que
 * deriva lento, modulados por ruido, sobre el color de fondo de la página.
 * Al cambiar de programa/destino el color de la luz se interpola: la sala "cambia de luz".
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform vec3 uColor;
uniform float uAlpha;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float ar = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * ar, uv.y);
  vec2 m = vec2(uPointer.x * ar, uPointer.y);
  float n = fbm(p * 1.4 + vec2(uTime * 0.025, -uTime * 0.018));
  float hand = smoothstep(0.85, 0.0, length(p - m));
  vec2 c = vec2((0.72 + 0.12 * sin(uTime * 0.09)) * ar, 0.62 + 0.1 * cos(uTime * 0.11));
  float drift = smoothstep(1.1, 0.0, length(p - c));
  float a = (hand * 0.42 + drift * 0.36) * (0.55 + 0.9 * n) * uAlpha;
  gl_FragColor = vec4(uColor * a, a);
}
`;

const hexToRgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
];

export class Atmosphere {
  private gl: WebGLRenderingContext;
  private prog: WebGLProgram;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private raf = 0;
  private running = false;
  private t0 = performance.now();
  private color: [number, number, number];
  private target: [number, number, number];
  private pointer = [0.6, 0.55];
  private pointerTarget = [0.6, 0.55];
  private alpha = 0;
  private reduced: boolean;

  constructor(
    private canvas: HTMLCanvasElement,
    color: string,
    opts: { reduced: boolean },
  ) {
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) throw new Error("WebGL no disponible");
    this.gl = gl;
    this.reduced = opts.reduced;
    this.color = hexToRgb(color);
    this.target = [...this.color];

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    this.prog = gl.createProgram()!;
    gl.attachShader(this.prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(this.prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(this.prog);
    gl.useProgram(this.prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(this.prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const name of ["uRes", "uTime", "uPointer", "uColor", "uAlpha"]) this.u[name] = gl.getUniformLocation(this.prog, name);
    this.resize();
  }

  setColor(hex: string) {
    this.target = hexToRgb(hex);
    if (this.reduced) this.color = [...this.target];
    if (!this.running) this.frame();
  }

  /** Coordenadas normalizadas 0..1 (origen abajo a la izquierda, como gl_FragCoord). */
  setPointer(x: number, y: number) {
    this.pointerTarget = [x, y];
  }

  resize() {
    // La luz es difusa: media resolución basta y ahorra GPU
    const scale = 0.5;
    const w = Math.max(1, Math.round(this.canvas.clientWidth * scale));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * scale));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
    }
    if (!this.running) this.frame();
  }

  private frame = () => {
    const gl = this.gl;
    const k = this.reduced ? 1 : 0.04;
    for (let i = 0; i < 3; i++) this.color[i] += (this.target[i] - this.color[i]) * k;
    this.pointer[0] += (this.pointerTarget[0] - this.pointer[0]) * 0.05;
    this.pointer[1] += (this.pointerTarget[1] - this.pointer[1]) * 0.05;
    this.alpha += (1 - this.alpha) * (this.reduced ? 1 : 0.03);
    const t = this.reduced ? 0 : (performance.now() - this.t0) / 1000;
    gl.uniform2f(this.u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.u.uTime, t);
    gl.uniform2f(this.u.uPointer, this.pointer[0], this.pointer[1]);
    gl.uniform3f(this.u.uColor, this.color[0], this.color[1], this.color[2]);
    gl.uniform1f(this.u.uAlpha, this.alpha);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (this.running) this.raf = requestAnimationFrame(this.frame);
  };

  start() {
    if (this.running || this.reduced) {
      this.frame();
      return;
    }
    this.running = true;
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  dispose() {
    this.stop();
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}
