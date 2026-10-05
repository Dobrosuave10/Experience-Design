import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/env";
import { setCovered } from "../lib/events";
import { setTransition } from "../lib/router";
import { lockScroll, resetScroll } from "../lib/smoothScroll";
import { Logo } from "./Logo";
import "./PageTransition.css";

/**
 * Cambio de página: un telón terracota sube desde abajo con el sello, la página
 * cambia detrás y el telón sigue subiendo hasta descubrirla (la misma salida del loader).
 * Con reduced motion la página cambia sin telón.
 */
export function PageTransition() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    let busy = false;

    setTransition((swap) => {
      if (prefersReducedMotion()) {
        swap();
        requestAnimationFrame(() => resetScroll());
        return;
      }
      if (busy) return;
      busy = true;
      setCovered(true);
      lockScroll(true);
      const mark = el.querySelector(".pt__mark");
      gsap
        .timeline()
        .set(el, { visibility: "visible", yPercent: 100 })
        .to(el, { yPercent: 0, duration: 0.75, ease: "expo.inOut" })
        .fromTo(mark, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.45, ease: "expo.out" }, "-=0.3")
        .add(() => {
          swap();
          // Dos frames: React monta la página nueva y sus ScrollTriggers
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              resetScroll();
              ScrollTrigger.refresh();
              lockScroll(false);
              gsap
                .timeline({
                  onComplete: () => {
                    gsap.set(el, { visibility: "hidden" });
                    busy = false;
                  },
                })
                .to(mark, { opacity: 0, scale: 0.92, duration: 0.35, ease: "power3.in" })
                .add(() => setCovered(false), "-=0.05")
                .to(el, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, "-=0.1");
            }),
          );
        });
    });
    return () => setTransition(null);
  }, []);

  return (
    <div ref={ref} className="pt" aria-hidden="true">
      <div className="pt__mark">
        <Logo size={72} decorative />
        <span className="label">Experience Design</span>
      </div>
    </div>
  );
}
