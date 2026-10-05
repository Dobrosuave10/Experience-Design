import { useRef } from "react";
import { gsap } from "gsap";
import { useGsap } from "../hooks/useGsap";
import { DESKTOP, MOTION_OK } from "../lib/env";
import "./Journey.css";

type Step = { title: string; text: string };

/**
 * Un recorrido de izquierda a derecha (Estudiantes): la línea se dibuja con el scroll
 * y cada etapa se enciende al alcanzarla. En móvil, la misma línea en vertical.
 */
export function Journey({ label, steps, tone = "sand" }: { label: string; steps: Step[]; tone?: "sand" | "paper" | "ink" | "clay" }) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".journey__track", start: "top 75%", end: "bottom 45%", scrub: 0.6 } });
        tl.fromTo(".journey__line-fill", { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, ease: "none", duration: steps.length });
        gsap.utils.toArray<HTMLElement>(".journey__step", el).forEach((s, i) => {
          tl.fromTo(s, { opacity: 0.25, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, i * 0.9);
        });
      });
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        gsap.fromTo(".journey__arrow", { x: -12 }, { x: 0, stagger: 0.2, scrollTrigger: { trigger: el, start: "top 60%", once: true } });
      });
    },
    ref,
  );

  return (
    <section ref={ref} className="journey section" data-tone={tone} aria-labelledby="journey-title">
      <div className="wrap">
        <h2 id="journey-title" className="label journey__label">
          {label}
        </h2>
        <div className="journey__track">
          <span className="journey__line" aria-hidden="true">
            <span className="journey__line-fill" />
          </span>
          <ol className="journey__steps">
            {steps.map((s, i) => (
              <li key={s.title} className="journey__step">
                <span className="journey__dot" aria-hidden="true" />
                <span className="journey__n label">0{i + 1}</span>
                <h3 className="journey__title">{s.title}</h3>
                <p className="journey__text">{s.text}</p>
                {i < steps.length - 1 && (
                  <span className="journey__arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
