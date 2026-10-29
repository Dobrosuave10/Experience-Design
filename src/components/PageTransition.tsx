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
 * Hacia Milán o São Paulo (navigate con `travel`) el cambio es un viaje de derecha a izquierda.
 */
export function PageTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const travelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    let busy = false;

    setTransition((swap, { travel }) => {
      if (travel) {
        if (busy) return;
        busy = true;
        travelTo(travel, swap, () => (busy = false));
        return;
      }
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

  // Viaje a un destino: la página se va hacia la izquierda, un panel terracota con el
  // nombre del lugar cruza la pantalla de derecha a izquierda y el destino llega desde la derecha.
  const travelTo = (name: string, swap: () => void, done: () => void) => {
    const panel = travelRef.current!;
    const word = panel.querySelector<HTMLElement>(".pt-travel__name")!;
    word.textContent = name;
    const pages = () => document.querySelectorAll<HTMLElement>("main, body .footer");
    const reduced = prefersReducedMotion();
    setCovered(true);
    lockScroll(true);

    const arrive = () => {
      swap();
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          resetScroll();
          ScrollTrigger.refresh();
          lockScroll(false);
          setCovered(false);
          // El foco va al título del destino, como si se hubiera cargado la página
          const h1 = document.querySelector<HTMLElement>("main h1");
          if (h1) {
            h1.setAttribute("tabindex", "-1");
            h1.focus({ preventScroll: true });
          }
          const tl = gsap.timeline({
            onComplete: () => {
              gsap.set(panel, { visibility: "hidden" });
              gsap.set(pages(), { clearProps: "transform,opacity" });
              done();
            },
          });
          if (reduced) {
            tl.set(panel, { visibility: "hidden" }).fromTo(pages(), { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power1.out" });
            return;
          }
          tl.to(panel, { xPercent: -100, duration: 0.6, ease: "expo.inOut" })
            .to(word, { xPercent: -60, duration: 0.6, ease: "power2.in" }, 0)
            .fromTo(pages(), { x: () => window.innerWidth * 0.3 }, { x: 0, duration: 0.85, ease: "expo.out" }, 0.18);
        }),
      );
    };

    if (reduced) {
      gsap.to(pages(), { opacity: 0, duration: 0.25, ease: "power1.in", onComplete: arrive });
      return;
    }
    gsap
      .timeline({ onComplete: arrive })
      .set(panel, { visibility: "visible", xPercent: 100 })
      .set(word, { xPercent: 70 })
      .to(pages(), { x: () => -window.innerWidth * 0.3, duration: 0.6, ease: "power3.in" }, 0)
      .to(panel, { xPercent: 0, duration: 0.6, ease: "expo.inOut" }, 0)
      .to(word, { xPercent: 0, duration: 0.65, ease: "expo.out" }, 0.1);
  };

  return (
    <>
      <div ref={travelRef} className="pt-travel" aria-hidden="true">
        <span className="pt-travel__name display" />
      </div>
      <div ref={ref} className="pt" aria-hidden="true">
        <div className="pt__mark">
          <Logo size={72} decorative shape="circle" />
          <span className="label">Experience Design</span>
        </div>
      </div>
    </>
  );
}
