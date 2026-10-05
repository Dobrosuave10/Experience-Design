import { interests, type InterestId } from "../content/site";
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

/** Cualquier CTA puede llevar al formulario con un interés preseleccionado. */
const INTEREST_EVENT = "ed:interest";
export function goToContact(interest?: InterestId) {
  if (getPath() === "/contacto") {
    if (interest) window.dispatchEvent(new CustomEvent<InterestId>(INTEREST_EVENT, { detail: interest }));
    scrollToTarget("#contacto");
    return;
  }
  navigate(interest ? `/contacto?interes=${interest}` : "/contacto");
}
export function onInterest(fn: (id: InterestId) => void) {
  const h = (e: Event) => fn((e as CustomEvent<InterestId>).detail);
  window.addEventListener(INTEREST_EVENT, h);
  return () => window.removeEventListener(INTEREST_EVENT, h);
}
/** Interés que llega en la URL (/contacto?interes=milan), si es válido. */
export function interestFromUrl(): InterestId | null {
  const id = new URLSearchParams(window.location.search).get("interes");
  return interests.find((it) => it.id === id)?.id ?? null;
}
