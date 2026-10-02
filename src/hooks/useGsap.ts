import { useLayoutEffect, type DependencyList, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Ejecuta animaciones GSAP con gsap.matchMedia acotado a un scope,
 * y revierte todo (incluyendo ScrollTriggers) al desmontar.
 */
export function useGsap(
  setup: (mm: gsap.MatchMedia, scope: HTMLElement) => void,
  scope: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);
    setup(mm, el);
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
