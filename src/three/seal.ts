import * as THREE from "three";
import { makeSealMaps } from "./logoTexture";

/**
 * El sello de Experience Design como objeto: una placa cuadrada de esquinas suaves,
 * fina, de bronce/terracota satinado con la "E." grabada. Una sola especificación
 * para la apertura (que lo arma con fragmentos) y para el Hero (donde queda instalado).
 */
export const SEAL = {
  /** Medio lado de la placa (unidades de escena). */
  half: 0.78,
  radius: 0.15,
  /** Cuerpo fino y chaflán preciso: presencia sin volumen de moneda. */
  depth: 0.026,
  bevel: 0.012,
};

/** Cuadrado de esquinas redondeadas; `corners` elige qué esquinas se redondean (para los fragmentos). */
export function roundedRect(x0: number, y0: number, x1: number, y1: number, r: number, corners = { bl: true, br: true, tr: true, tl: true }) {
  const s = new THREE.Shape();
  const rbl = corners.bl ? r : 0, rbr = corners.br ? r : 0, rtr = corners.tr ? r : 0, rtl = corners.tl ? r : 0;
  s.moveTo(x0 + rbl, y0);
  s.lineTo(x1 - rbr, y0);
  if (rbr) s.quadraticCurveTo(x1, y0, x1, y0 + rbr);
  s.lineTo(x1, y1 - rtr);
  if (rtr) s.quadraticCurveTo(x1, y1, x1 - rtr, y1);
  s.lineTo(x0 + rtl, y1);
  if (rtl) s.quadraticCurveTo(x0, y1, x0, y1 - rtl);
  s.lineTo(x0, y0 + rbl);
  if (rbl) s.quadraticCurveTo(x0, y0, x0 + rbl, y0);
  return s;
}

/**
 * Placa extruida (cara y canto). Las caras usan las coordenadas de la forma como UV;
 * las texturas del sello las llevan a 0..1 sobre la placa completa, así un fragmento
 * muestra exactamente su parte de la "E.".
 */
export function plateGeometry(shape: THREE.Shape, bevel = SEAL.bevel, depth = SEAL.depth) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 12,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

export function sealShape() {
  const h = SEAL.half - SEAL.bevel;
  return roundedRect(-h, -h, h, h, SEAL.radius);
}

/**
 * Materiales del sello: [cara, canto] para las ExtrudeGeometry (grupo 0 = caras, 1 = canto).
 * Bronce envejecido satinado: metal moderado, rugosidad media, reflejos contenidos.
 */
export async function createSealMaterials(renderer: THREE.WebGLRenderer, size = 1024, markSrc?: string) {
  const maps = await makeSealMaps(size, markSrc);
  const toPlate = (t: THREE.Texture) => {
    // UV de la forma (-half..half) → 0..1
    t.repeat.set(1 / (2 * SEAL.half), 1 / (2 * SEAL.half));
    t.offset.set(0.5, 0.5);
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  };
  const map = toPlate(new THREE.CanvasTexture(maps.color));
  map.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.MeshStandardMaterial({
    map,
    normalMap: toPlate(new THREE.CanvasTexture(maps.normal)),
    normalScale: new THREE.Vector2(0.9, 0.9),
    roughnessMap: toPlate(new THREE.CanvasTexture(maps.rough)),
    roughness: 1,
    metalness: 0.5,
    envMapIntensity: 0.75,
  });
  const edge = new THREE.MeshStandardMaterial({ color: "#6f3a22", metalness: 0.6, roughness: 0.42, envMapIntensity: 0.8 });
  return { face, edge };
}
