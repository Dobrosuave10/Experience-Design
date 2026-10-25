import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import "./Rail.css";

type Props = {
  label: string;
  tone: "warm" | "paper" | "sand" | "ink";
  className?: string;
  children: ReactNode;
  /** Animaciones propias de cada página, dentro del mismo matchMedia. */
  setup?: (mm: gsap.MatchMedia, scope: HTMLElement) => void;
};

/**
 * La línea de Inicio (ProgramsSpine), pegada a la izquierda: se dibuja con el scroll
 * y cada elemento tiene un nodo que se enciende mientras ocupa la pantalla.
 * Los hijos son <RailItem>. Sin movimiento (o sin JS) la línea queda completa.
 */
export function Rail({ label, tone, className = "", children, setup }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        gsap.fromTo(".rail__fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 50%", end: "bottom 50%", scrub: 0.5 } });
      });
      // El nodo se enciende también con movimiento reducido: es información, no adorno
      mm.add("(min-width: 0px)", () => {
        gsap.utils.toArray<HTMLElement>(".rail__item", el).forEach((item) => {
          ScrollTrigger.create({ trigger: item, start: "top 55%", end: "bottom 45%", toggleClass: { targets: item, className: "is-current" } });
        });
      });
      setup?.(mm, el);
    },
    ref,
  );

  return (
    <section ref={ref} className={`rail section ${className}`} data-tone={tone} aria-label={label}>
      <div className="rail__line" aria-hidden="true">
        <span className="rail__fill" />
      </div>
      <ol className="rail__list">{children}</ol>
    </section>
  );
}

/** Un elemento de la línea: ocupa la pantalla y lleva su nodo. */
export function RailItem({ className = "", children, labelledBy }: { className?: string; children: ReactNode; labelledBy: string }) {
  return (
    <li className={`rail__item ${className}`}>
      <article className="rail__pane" aria-labelledby={labelledBy}>
        <span className="rail__node" aria-hidden="true" />
        {children}
      </article>
    </li>
  );
}
