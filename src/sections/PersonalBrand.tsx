import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalBrand } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { goToContact } from "../lib/events";
import { MagneticButton } from "../components/MagneticButton";
import { RevealText } from "../components/RevealText";
import "./PersonalBrand.css";

/**
 * 07 Expresar. Íntima, sobre terracota. La pregunta queda fija mientras
 * el recorrido (historia, mirada, posicionamiento, voz) se ilumina paso a paso.
 */
export function PersonalBrand() {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".pb__thread-fill",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".pb__steps", start: "top 60%", end: "bottom 60%", scrub: true } },
        );
        gsap.utils.toArray<HTMLElement>(".pb__step", el).forEach((s) => {
          ScrollTrigger.create({ trigger: s, start: "top 62%", end: "bottom 38%", toggleClass: "is-lit" });
        });
      });
    },
    ref,
  );

  return (
    <section ref={ref} id="marca-personal" className="pb section" data-tone="clay" aria-labelledby="pb-title">
      <div className="wrap pb__grid">
        <div className="pb__aside">
          <div className="pb__sticky">
            <RevealText id="pb-title" className="pb__title display" lines={[personalBrand.titleA, { text: personalBrand.titleB, em: true }]} />
            <p className="pb__body">{personalBrand.body}</p>
            <p className="pb__note serif">
              <em>{personalBrand.note}</em>
            </p>
            <MagneticButton href="#contacto" onClick={() => goToContact("marca")}>
              {personalBrand.cta}
            </MagneticButton>
          </div>
        </div>

        <div className="pb__steps">
          <span className="pb__thread" aria-hidden="true">
            <span className="pb__thread-fill" />
          </span>
          <ol>
          {personalBrand.steps.map((s) => (
            <li key={s.title} className="pb__step">
              <h3 className="pb__step-title display">{s.title}</h3>
              <p className="pb__step-text">{s.text}</p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
