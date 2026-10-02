import { useRef } from "react";
import { gsap } from "gsap";
import { neverLate } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { RevealText } from "../components/RevealText";
import "./NeverLate.css";

/**
 * Interludio. Las dudas de quien cree que llegó tarde, tachadas una a una.
 * Sin tono de autoayuda: una respuesta corta y a quién va dirigido.
 */
export function NeverLate() {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".late__doubt", el).forEach((d) => {
          gsap
            .timeline({ scrollTrigger: { trigger: d, start: "top 75%", end: "top 40%", scrub: 0.6 } })
            .fromTo(d.querySelector(".late__strike"), { scaleX: 0 }, { scaleX: 1, ease: "none" })
            .to(d, { opacity: 0.38, ease: "none" }, 0.3);
        });
      });
    },
    ref,
  );

  return (
    <section ref={ref} className="late section" data-tone="paper" aria-labelledby="late-title">
      <div className="wrap late__inner">
        <ul className="late__doubts" aria-label="Lo que a veces pensamos">
          {neverLate.doubts.map((d) => (
            <li key={d} className="late__doubt serif">
              <span className="late__text">{d}</span>
              <span className="late__strike" aria-hidden="true" />
            </li>
          ))}
        </ul>
        <RevealText id="late-title" className="late__answer display" lines={[{ text: neverLate.answer, em: false }]} stagger={0.06} />
        <p className="late__body muted">{neverLate.body}</p>
      </div>
    </section>
  );
}
