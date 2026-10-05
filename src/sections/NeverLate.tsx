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
type Props = {
  doubts?: readonly string[];
  answer?: string;
  body?: string;
  label?: string;
  tone?: "paper" | "sand" | "clay" | "ink";
};

export function NeverLate({ doubts = neverLate.doubts, answer = neverLate.answer, body = neverLate.body, label = "Lo que a veces pensamos", tone = "paper" }: Props) {
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
    <section ref={ref} className="late section" data-tone={tone} aria-labelledby="late-title">
      <div className="wrap late__inner">
        <ul className="late__doubts" aria-label={label}>
          {doubts.map((d) => (
            <li key={d} className="late__doubt serif">
              <span className="late__text">{d}</span>
              <span className="late__strike" aria-hidden="true" />
            </li>
          ))}
        </ul>
        <RevealText id="late-title" className="late__answer display" lines={[{ text: answer, em: false }]} stagger={0.06} />
        <p className="late__body muted">{body}</p>
      </div>
    </section>
  );
}
