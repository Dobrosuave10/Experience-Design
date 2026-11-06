import type { InterestId } from "../content/site";
import { getPath, navigate } from "./router";
import { scrollToTarget } from "./smoothScroll";

/** El loader avisa cuando el sitio está listo para su animación de entrada. */
let ready = false;
const readyListeners = new Set<() => void>();
export function markReady() {
  ready = true;
  readyListeners.forEach((fn) => fn());
  readyListeners.clear();
}
export function onReady(fn: () => void) {
  if (ready) fn();
  else readyListeners.add(fn);
  return () => readyListeners.delete(fn);
}

/**
 * La página se "muestra" cuando termina el loader (primera carga) o cuando el telón
 * de PageTransition empieza a subir. Las entradas de cada página esperan este momento
 * para no animarse detrás del telón.
 */
let covered = false;
const shownListeners = new Set<() => void>();
export function setCovered(value: boolean) {
  covered = value;
  if (!value) {
    shownListeners.forEach((fn) => fn());
    shownListeners.clear();
  }
}
export function onPageShown(fn: () => void) {
  if (!ready) return onReady(() => (covered ? shownListeners.add(fn) : fn()));
  if (!covered) {
    fn();
    return () => {};
  }
  shownListeners.add(fn);
  return () => shownListeners.delete(fn);
}

/**
 * Cualquier CTA puede llevar a Contacto. El interés ya no viaja en la URL: Contacto se
 * enfoca en la inscripción y los enlaces antiguos /contacto?interes=... simplemente lo ignoran.
 */
export function goToContact(_interest?: InterestId) {
  if (getPath() === "/contacto") {
    scrollToTarget("#contacto");
    return;
  }
  navigate("/contacto");
}
