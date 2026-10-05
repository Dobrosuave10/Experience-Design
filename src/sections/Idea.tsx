import { useRef } from "react";
import { gsap } from "gsap";
import { idea } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { RevealText } from "../components/RevealText";
import "./Idea.css";

/**
 * 02 Mirar. Sección casi vacía: una frase y cuatro verbos que aparecen
 * uno tras otro al entrar en pantalla, como si se dijeran en voz baja.
 */
export function Idea({ label }: { label?: string }) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        const verbs = gsap.utils.toArray<HTMLElement>(".idea__verb", el);
        // Sin fijar la pantalla: al entrar, los cuatro verbos aparecen seguidos y quedan todos visibles
        gsap.from(verbs, {
          yPercent: 40,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.14,
          scrollTrigger: { trigger: el.querySelector(".idea__verbs"), start: "top 85%", once: true },
        });
      });
    },
    ref,
  );

  return (
    <section ref={ref} className="idea section" data-tone="paper" aria-labelledby="idea-lead">
      <div className="idea__pin">
        <div className="wrap idea__inner">
          {label && <p className="label idea__kicker">{label}</p>}
          <h2 id="idea-lead" className="idea__lead display">
            {idea.lead}
          </h2>
          <ul className="idea__verbs" aria-label="El diseño">
            {idea.verbs.map((v) => (
              <li key={v} className="idea__verb display">
                <em>{v}</em>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap idea__after">
        <RevealText as="p" className="idea__closing serif" lines={[idea.closing]} stagger={0.03} />
      </div>
    </section>
  );
}
