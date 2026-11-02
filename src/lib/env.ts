const mq = (q: string) => typeof window !== "undefined" && window.matchMedia(q).matches;

export const prefersReducedMotion = () => mq("(prefers-reduced-motion: reduce)");
export const hasFinePointer = () => mq("(hover: hover) and (pointer: fine)");
export const isSmallScreen = () => mq("(max-width: 767px)");
/** Teléfono o pantalla táctil: sin WebGL persistente, sin Lenis ni efectos de scroll caros. */
export const LITE = "(max-width: 767px), (pointer: coarse)";
export const isLite = () => mq(LITE);
/** El usuario pidió ahorrar datos (Android/Chrome). */
export const saveData = () =>
  typeof navigator !== "undefined" && !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

export function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Motion queries para gsap.matchMedia */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 768px)";
