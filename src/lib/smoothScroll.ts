import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isLite, prefersReducedMotion } from "./env";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

/** Lenis sólo con rueda/trackpad; en teléfonos y pantallas táctiles, scroll nativo. Sin Lenis con reduced motion. */
export function initSmoothScroll() {
  if (prefersReducedMotion() || isLite()) return () => {};
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  if (import.meta.env.DEV) Object.assign(window, { __lenis: lenis, __ST: ScrollTrigger });
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/** `offset`: px que deja libres arriba (barra de navegación, índice fijo). */
export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6, offset: -offset });
  else if (offset) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  // Mover el foco para teclado y lectores de pantalla
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function scrollToY(y: number, immediate = false) {
  if (lenis) lenis.scrollTo(y, { duration: 1.4, immediate, force: true });
  else window.scrollTo({ top: y, behavior: immediate || prefersReducedMotion() ? "auto" : "smooth" });
}

/** Cambio de página: arriba de inmediato, también si Lenis está detenido. */
export function resetScroll() {
  lenis?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.classList.toggle("is-locked", locked);
}
