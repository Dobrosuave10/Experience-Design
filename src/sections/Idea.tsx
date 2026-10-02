import { useRef } from "react";
import { gsap } from "gsap";
import { idea } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { RevealText } from "../components/RevealText";
import "./Idea.css";

/**
 * 02 Mirar. Sección casi vacía: una frase y cuatro verbos que aparecen
 * uno a uno con el scroll, como si se dijeran en voz baja.
 */
export function Idea() {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        const verbs = gsap.utils.toArray<HTMLElement>(".idea__verb", el);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });
        tl.from(".idea__lead", { opacity: 0.15, duration: 0.6 });
        verbs.forEach((v, i) => {
          tl.from(v, { yPercent: 60, opacity: 0, duration: 1, ease: "power2.out" }, 0.6 + i * 1.1);
          if (i > 0) tl.to(verbs[i - 1], { opacity: 0.35, duration: 0.8 }, 0.6 + i * 1.1);
        });
        tl.to(verbs[verbs.length - 1], { opacity: 0.35, duration: 0.8 }, "+=0.4");
        tl.to(verbs, { opacity: 1, duration: 0.8 }, "<");
        tl.to({}, { duration: 0.6 });
      });
    },
    ref,
  );

  return (
    <section ref={ref} className="idea section" data-tone="paper" aria-labelledby="idea-lead">
      <div className="idea__pin">
        <div className="wrap idea__inner">
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
