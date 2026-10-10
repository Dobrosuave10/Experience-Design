import { brand } from "../content/site";

const SIZE = 1024;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Dibuja la cara del sello en dos canvas:
 *  - color: terracota con moteado cerámico + "E." negra
 *  - relief: blanco con la "E." en gris (bump hundido y esmalte más brillante vía roughnessMap)
 * Si existe brand.logoAsset, se usa el archivo oficial y el relieve se deriva por luminancia.
 */
export async function makeLogoCanvases() {
  const color = document.createElement("canvas");
  const relief = document.createElement("canvas");
  color.width = color.height = relief.width = relief.height = SIZE;
  const c = color.getContext("2d")!;
  const r = relief.getContext("2d")!;

  let drewOfficial = false;
  if (brand.logoAsset) {
    try {
      const img = await loadImage(brand.logoAsset);
      c.drawImage(img, 0, 0, SIZE, SIZE);
      const data = c.getImageData(0, 0, SIZE, SIZE);
      const out = r.createImageData(SIZE, SIZE);
      for (let i = 0; i < data.data.length; i += 4) {
        const lum = 0.299 * data.data[i] + 0.587 * data.data[i + 1] + 0.114 * data.data[i + 2];
        const v = lum < 70 && data.data[i + 3] > 128 ? 90 : 255;
        out.data[i] = out.data[i + 1] = out.data[i + 2] = v;
        out.data[i + 3] = 255;
      }
      r.putImageData(out, 0, 0);
      drewOfficial = true;
    } catch {
      drewOfficial = false;
    }
  }

  if (!drewOfficial) {
    // Base terracota con variación de cocción
    const g = c.createRadialGradient(SIZE * 0.4, SIZE * 0.35, SIZE * 0.05, SIZE / 2, SIZE / 2, SIZE * 0.6);
    g.addColorStop(0, "#B7664F");
    g.addColorStop(1, "#9A4A37");
    c.fillStyle = g;
    c.fillRect(0, 0, SIZE, SIZE);
    r.fillStyle = "#fff";
    r.fillRect(0, 0, SIZE, SIZE);

    try {
      await document.fonts.load(`500 400px "Cormorant Garamond"`);
    } catch {
      /* usa serif de respaldo */
    }
    const font = `500 ${SIZE * 0.56}px "Cormorant Garamond", "Times New Roman", serif`;
    for (const ctx of [c, r]) {
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
    }
    const m = c.measureText("E.");
    const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    const y = SIZE / 2 + h / 2 - m.actualBoundingBoxDescent;
    const x = SIZE / 2 + SIZE * 0.012;
    c.fillStyle = "#1a1715";
    c.fillText("E.", x, y);
    r.fillStyle = "#5a5a5a";
    r.fillText("E.", x, y);
  }

  // Moteado cerámico sobre el color (también en el logo oficial: es el material)
  for (let i = 0; i < 2600; i++) {
    const px = Math.random() * SIZE, py = Math.random() * SIZE, rad = Math.random() * 1.6 + 0.3;
    c.fillStyle = Math.random() > 0.5 ? "rgba(60,25,15,0.18)" : "rgba(255,225,200,0.12)";
    c.beginPath();
    c.arc(px, py, rad, 0, Math.PI * 2);
    c.fill();
  }
  return { color, relief };
}

/**
 * Sello cuadrado de bronce: mapas para la cara de la placa.
 *  - color: bronce/terracota con una pátina amplia y tenue (sin moteado ni grano visible).
 *  - normal: "E." grabada con poca profundidad y bisel ancho, desde un mapa de alturas.
 *  - rough: satinado parejo; el fondo del grabado, apenas más mate.
 */
export async function makeSealMaps(size = 1024) {
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    return c;
  };
  const height = mk(), color = mk(), normal = mk(), rough = mk();
  const h = height.getContext("2d")!, c = color.getContext("2d")!, r = rough.getContext("2d")!;
  try {
    await document.fonts.load(`500 400px "Cormorant Garamond"`);
  } catch {
    /* serif de respaldo */
  }
  const font = `500 ${size * 0.6}px "Cormorant Garamond", "Times New Roman", serif`;
  h.font = font;
  h.textAlign = "center";
  h.textBaseline = "alphabetic";
  const m = h.measureText("E.");
  const glyphH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  const gx = size / 2 + size * 0.015, gy = size / 2 + glyphH / 2 - m.actualBoundingBoxDescent;

  // Altura: superficie blanca, grabado gris con bisel por desenfoque
  h.fillStyle = "#fff";
  h.fillRect(0, 0, size, size);
  h.filter = `blur(${size * 0.004}px)`;
  h.fillStyle = "#8a8a8a";
  h.fillText("E.", gx, gy);
  h.filter = "none";

  const H = h.getImageData(0, 0, size, size).data;
  const nCtx = normal.getContext("2d")!;
  const N = nCtx.createImageData(size, size);
  const at = (x: number, y: number) => H[(Math.min(size - 1, Math.max(0, y)) * size + Math.min(size - 1, Math.max(0, x))) * 4] / 255;
  const strength = 2.6 * (size / 1024);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x - 1, y) - at(x - 1, y + 1)) * strength;
      const dy = (at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) - at(x - 1, y - 1) - 2 * at(x, y - 1) - at(x + 1, y - 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      N.data[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      N.data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
      N.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      N.data[i + 3] = 255;
    }
  }
  nCtx.putImageData(N, 0, 0);

  // Color: bronce cálido con pátina amplia (dos manchas muy suaves, nada de puntos)
  c.fillStyle = "#8e4c2e";
  c.fillRect(0, 0, size, size);
  const g1 = c.createRadialGradient(size * 0.3, size * 0.25, 0, size * 0.3, size * 0.25, size * 0.8);
  g1.addColorStop(0, "rgba(196, 128, 86, 0.28)");
  g1.addColorStop(1, "rgba(196, 128, 86, 0)");
  c.fillStyle = g1;
  c.fillRect(0, 0, size, size);
  const g2 = c.createRadialGradient(size * 0.8, size * 0.85, 0, size * 0.8, size * 0.85, size * 0.7);
  g2.addColorStop(0, "rgba(92, 44, 26, 0.3)");
  g2.addColorStop(1, "rgba(92, 44, 26, 0)");
  c.fillStyle = g2;
  c.fillRect(0, 0, size, size);
  // fondo del grabado: un tono más profundo, como la oclusión del metal trabajado
  c.globalCompositeOperation = "multiply";
  c.font = font;
  c.textAlign = "center";
  c.filter = `blur(${size * 0.003}px)`;
  c.fillStyle = "#b8917c";
  c.fillText("E.", gx, gy);
  c.filter = "none";
  c.globalCompositeOperation = "source-over";

  r.fillStyle = "#8c8c8c";
  r.fillRect(0, 0, size, size);
  r.font = font;
  r.textAlign = "center";
  r.fillStyle = "#c4c4c4";
  r.fillText("E.", gx, gy);

  return { color, normal, rough };
}
