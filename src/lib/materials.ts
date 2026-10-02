/**
 * Placas de material procedurales (canvas 2D).
 *
 * No son fotos ni pretenden serlo: son superficies (terracota, travertino,
 * nogal, terrazzo, lino, estuco) que ocupan los espacios de imagen mientras
 * llegan las fotografías reales, y que funcionan como lenguaje material propio.
 * Se generan una sola vez y se cachean como data URL.
 */

export type MaterialName = "terracotta" | "travertine" | "walnut" | "terrazzo" | "linen" | "plaster";

type RGB = [number, number, number];

// Resolución suficiente para cubrir paneles grandes sin pixelarse (se escala con cover)
const W = 600;
const H = 750;

// Value noise determinista
function makeNoise(seed: number) {
  const perm = new Uint8Array(512);
  let s = seed;
  const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const grad = (h: number) => (h / 255) * 2 - 1;
  const fade = (t: number) => t * t * (3 - 2 * t);
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const X = xi & 255, Y = yi & 255;
    const a = grad(perm[perm[X] + Y]);
    const b = grad(perm[perm[X + 1] + Y]);
    const c = grad(perm[perm[X] + Y + 1]);
    const d = grad(perm[perm[X + 1] + Y + 1]);
    const u = fade(xf), v = fade(yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  const fbm = (x: number, y: number, oct = 5) => {
    let f = 0, amp = 0.5, freq = 1;
    for (let i = 0; i < oct; i++) {
      f += amp * noise(x * freq, y * freq);
      freq *= 2.03;
      amp *= 0.5;
    }
    return f;
  };
  return { noise, fbm, rand };
}

const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

function paint(fn: (x: number, y: number, u: number, v: number) => RGB, w = W, h = H) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const [r, g, b] = fn(x, y, x / w, y / h);
      const i = (y * w + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return { canvas: c, ctx };
}

const S = W / 360; // factor respecto al diseño original

const generators: Record<MaterialName, () => HTMLCanvasElement> = {
  terracotta() {
    const { fbm, noise } = makeNoise(11);
    const a = hex("#9A4A37"), b = hex("#B7664F"), dark = hex("#7E3B2C");
    return paint((x, y) => {
      const m = fbm(x / (140 * S), y / (140 * S));
      const grain = noise((x / S) * 0.9, (y / S) * 0.9) * 0.5 + 0.5;
      let c = mix(a, b, clamp01(m * 0.9 + 0.5));
      c = mix(c, dark, grain > 0.86 ? 0.35 : 0);
      return mix(c, [230, 190, 170], grain < 0.06 ? 0.25 : 0);
    }).canvas;
  },
  travertine() {
    const { fbm, noise, rand } = makeNoise(23);
    const base = hex("#E4D8C5"), band = hex("#CDBBA0"), warm = hex("#EFE5D6");
    const { canvas, ctx } = paint((x, y) => {
      const warp = fbm(x / (220 * S), y / (60 * S)) * 30 * S;
      const bands = Math.sin((y + warp) / (7.5 * S)) * 0.5 + 0.5;
      const m = fbm(x / (300 * S), y / (25 * S), 4) * 0.5 + 0.5;
      let c = mix(base, band, clamp01(bands * m * 0.9));
      c = mix(c, warm, clamp01(noise(x / (40 * S), y / (40 * S)) * 0.5));
      return c;
    });
    // Poros característicos del travertino
    for (let i = 0; i < 260; i++) {
      const px = rand() * W, py = rand() * H, w = (2 + rand() * 9) * S, h = (0.8 + rand() * 1.6) * S;
      ctx.fillStyle = `rgba(150,128,100,${0.25 + rand() * 0.35})`;
      ctx.beginPath();
      ctx.ellipse(px, py, w, h, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    return canvas;
  },
  walnut() {
    const { fbm, noise } = makeNoise(37);
    const a = hex("#3B2A20"), b = hex("#5A4030"), c2 = hex("#2A1D16");
    return paint((x, y) => {
      const warp = fbm(x / (160 * S), y / (400 * S)) * 40 * S;
      const ring = Math.sin((x + warp) / (3.2 * S) + fbm(x / (30 * S), y / (200 * S)) * 4) * 0.5 + 0.5;
      const fine = noise(x / (1.5 * S), y / (60 * S)) * 0.5 + 0.5;
      let c = mix(a, b, clamp01(ring * 0.8 + fine * 0.2));
      return mix(c, c2, clamp01(fbm(x / (90 * S), y / (300 * S)) * 0.8));
    }).canvas;
  },
  terrazzo() {
    // Más resolución: el terrazzo cubre la pantalla completa en Milán
    const TW = 1100, TH = 1375, k = TW / 360;
    const { fbm, rand } = makeNoise(51);
    const base = hex("#E9E0D2"), cloud = hex("#DCD0BE");
    const { canvas, ctx } = paint((x, y) => mix(base, cloud, clamp01(fbm(x / (120 * k), y / (120 * k), 3) * 0.6 + 0.3)), TW, TH);
    const chips: string[] = ["#A6533F", "#B7664F", "#2A2521", "#8A7E70", "#C9B79C", "#5E4A3C", "#F5F1EA"];
    for (let i = 0; i < 520; i++) {
      const cx = rand() * TW, cy = rand() * TH, r = (1.2 + Math.pow(rand(), 2.4) * 13) * k;
      ctx.fillStyle = chips[Math.floor(rand() * chips.length)];
      ctx.beginPath();
      const sides = 4 + Math.floor(rand() * 4);
      for (let j = 0; j < sides; j++) {
        const ang = (j / sides) * Math.PI * 2 + rand() * 0.6;
        const rr = r * (0.6 + rand() * 0.5);
        const px = cx + Math.cos(ang) * rr, py = cy + Math.sin(ang) * rr;
        j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }
    return canvas;
  },
  linen() {
    const { noise, fbm } = makeNoise(67);
    const a = hex("#E6DCCB"), b = hex("#D3C5AE");
    return paint((x, y) => {
      const warp = Math.sin((x / S) * 1.9 + noise(x / (9 * S), y / (50 * S)) * 3) * 0.5 + 0.5;
      const weft = Math.sin((y / S) * 1.9 + noise(x / (50 * S), y / (9 * S)) * 3) * 0.5 + 0.5;
      const slub = noise(x / (3 * S), y / (70 * S)) * 0.5 + 0.5;
      const t = clamp01(warp * weft * 0.7 + slub * 0.25 + fbm(x / (150 * S), y / (150 * S)) * 0.3);
      return mix(a, b, t);
    }).canvas;
  },
  plaster() {
    const { fbm, noise } = makeNoise(79);
    const a = hex("#D9CAB7"), b = hex("#C9B39A"), hi = hex("#E8DDCF");
    return paint((x, y) => {
      // Estuco veneciano: pasadas de llana largas y suaves + grano fino
      const warp = fbm(x / (260 * S), y / (260 * S)) * 3;
      const trowel = fbm(x / (180 * S) + warp, y / (70 * S), 4);
      let c = mix(a, b, clamp01(trowel * 0.9 + 0.45));
      c = mix(c, hi, clamp01(fbm(x / (120 * S) - warp, y / (40 * S), 3) * 1.1 - 0.15));
      const grain = noise(x * 0.7, y * 0.7) * 0.5 + 0.5;
      return mix(c, [150, 130, 110], grain > 0.9 ? 0.12 : 0);
    }).canvas;
  },
};

const cache = new Map<MaterialName, string>();
const canvasCache = new Map<MaterialName, HTMLCanvasElement>();

export function materialCanvas(name: MaterialName): HTMLCanvasElement {
  let c = canvasCache.get(name);
  if (!c) {
    c = generators[name]();
    canvasCache.set(name, c);
  }
  return c;
}

export function materialURL(name: MaterialName): string {
  let url = cache.get(name);
  if (!url) {
    url = materialCanvas(name).toDataURL("image/jpeg", 0.86);
    cache.set(name, url);
  }
  return url;
}
