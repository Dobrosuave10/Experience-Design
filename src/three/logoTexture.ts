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
