import { useSyncExternalStore } from "react";

/**
 * Router mínimo sobre la History API (sin dependencias).
 * Las rutas viven en content/site.ts (`routes`) y App elige la página por pathname.
 * La navegación pasa por `navigate`, que deja que PageTransition cubra la pantalla,
 * cambie la página detrás del telón y la descubra.
 */

const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";

let current = typeof window !== "undefined" ? normalize(window.location.pathname) : "/";
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    current = normalize(window.location.pathname);
    emit();
  });
}

export const getPath = () => current;

export function usePath() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    getPath,
    getPath,
  );
}

/** PageTransition registra aquí su telón. Recibe `swap`, que cambia la página. */
type Transition = (swap: () => void) => void;
let transition: Transition | null = null;
export function setTransition(fn: Transition | null) {
  transition = fn;
}

/** Al volver a la página actual (ej. clic en el logo estando en Inicio) se sube al inicio. */
const sameListeners = new Set<() => void>();
export function onSamePage(fn: () => void) {
  sameListeners.add(fn);
  return () => sameListeners.delete(fn);
}

export function navigate(href: string) {
  const url = new URL(href, window.location.origin);
  const path = normalize(url.pathname);
  const full = path + url.search;
  if (path === current) {
    if (url.search !== window.location.search) history.replaceState(null, "", full);
    sameListeners.forEach((fn) => fn());
    return;
  }
  const swap = () => {
    history.pushState(null, "", full);
    current = path;
    emit();
  };
  if (transition) transition(swap);
  else swap();
}

/** true si `href` es la página actual o una de sus subpáginas (para marcar la navegación). */
export function isActive(path: string, href: string) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}
