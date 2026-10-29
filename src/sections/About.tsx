import { useRef } from "react";
import { gsap } from "gsap";
import { about } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { Figure } from "../components/MaterialPlate";
import { RevealText } from "../components/RevealText";
import "./About.css";

/** Nosotros: quiénes somos, con la foto de los dos fundadores abriéndose como una puerta. */
export function AboutWho() {
  const ref = useRef<HTMLElement>(null);
  useGsap(
    (mm) => {
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".about__frame", start: "top 85%", end: "top 30%", scrub: 0.8 } })
          .fromTo(".about__frame", { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)" }, { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)", ease: "power2.out" })
          .fromTo(".about__frame img", { scale: 1.2 }, { scale: 1, ease: "power2.out" }, 0);
      });
    },
    ref,
  );

  return (
    <section ref={ref} className="about section" data-tone="paper" aria-labelledby="about-who">
      <div className="wrap about__grid">
        <p id="about-who" className="label about__label">
          {about.who.label}
        </p>
        <RevealText as="p" className="about__text display" lines={[about.who.text]} stagger={0.02} />
        <Figure slot={about.image} className="about__frame" ratio="848 / 1080" sizes="(max-width: 899px) 80vw, 34vw" />
        <p className="about__history serif">
          <em>{about.who.history}</em>
        </p>
      </div>
    </section>
  );
}

/** Posicionamiento, lema y promesa: la marca dicha en tres frases. */
export function Positioning() {
  const { positioning: pos } = about;
  return (
    <section className="positioning section" data-tone="warm" aria-labelledby="positioning-title">
      <div className="wrap positioning__grid">
        <h2 id="positioning-title" className="positioning__title display">
          <span className="positioning__lead">{pos.lead}</span> {pos.rest} <em>{pos.accent}</em>
        </h2>
        <div className="positioning__pair">
          <p className="positioning__item">
            <span className="label positioning__label">{about.mottoLabel}</span>
            <span className="positioning__motto serif">{about.motto}</span>
          </p>
          <blockquote className="positioning__item positioning__quote">
            <span className="label positioning__label">{about.promiseLabel}</span>
            <p className="serif">{about.promise}</p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

/** Propósito, misión, visión y valores: dichos como un manifiesto, no como fichas. */
export function Principles() {
  return (
    <section className="principles section" data-tone="sand" aria-label="Misión, visión y valores">
      <div className="wrap">
        <div className="principles__mv">
          {about.principles.map((p) => (
            <article key={p.id} className="principles__item">
              <h2 className="label principles__label">{p.label}</h2>
              <RevealText as="p" className="principles__text display" lines={[p.text]} stagger={0.02} />
              <p className="principles__body muted">{p.body}</p>
            </article>
          ))}
        </div>

        <div className="principles__values">
          <h2 className="label principles__label">{about.valuesLabel}</h2>
          <ol className="principles__list">
            {about.values.map((v, i) => (
              <li key={v.name} className="principles__value">
                <span className="label principles__n">0{i + 1}</span>
                <span className="principles__name display">{v.name}</span>
                <span className="principles__line serif">
                  <em>{v.text}</em>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
