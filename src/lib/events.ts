import type { InterestId } from "../content/site";
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

/** Cualquier CTA puede llevar al formulario con un interés preseleccionado. */
const INTEREST_EVENT = "ed:interest";
export function goToContact(interest?: InterestId) {
  if (interest) window.dispatchEvent(new CustomEvent<InterestId>(INTEREST_EVENT, { detail: interest }));
  scrollToTarget("#contacto");
}
export function onInterest(fn: (id: InterestId) => void) {
  const h = (e: Event) => fn((e as CustomEvent<InterestId>).detail);
  window.addEventListener(INTEREST_EVENT, h);
  return () => window.removeEventListener(INTEREST_EVENT, h);
}
