import { generateMaterial, type MaterialName } from "./materials";

/** Pinta una placa de material fuera del hilo principal y la devuelve como JPEG. */
self.onmessage = async (e: MessageEvent<MaterialName>) => {
  const name = e.data;
  const canvas = generateMaterial(name) as OffscreenCanvas;
  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.86 });
  self.postMessage({ name, blob });
};
