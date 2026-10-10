import { useRef } from "react";
import { gsap } from "gsap";
import { idea } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { RevealText } from "../components/RevealText";
import "./Idea.css";

/** Los cuatro verbos de Inicio, cada uno con su tratamiento: vivir, tocar, reflexionar, admirar. */
const SENSES = ["vive", "toca", "reflexiona", "admira"] as const;

/** Cada verbo, una manera de aparecer. Todos ligados a la posición de su frase en pantalla. */
const ENTRANCES: Record<(typeof SENSES)[number], (em: HTMLElement) => gsap.core.Timeline> = {
  // Se vive · presencia: la frase emerge del papel y una luz cálida la recorre
  vive: (em) =>
    gsap
      .timeline()
      .fromTo(em, { autoAlpha: 0, y: 20, filter: "blur(6px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", ease: "power1.out", duration: 0.45 }, 0)
      .fromTo(em, { backgroundPosition: "100% 0%" }, { backgroundPosition: "0% 0%", ease: "none", duration: 0.75 }, 0.25),
  // Se toca · materia: luz rasante que sube; la sombra larga se recoge y queda el relieve del papel
  toca: (em) =>
    gsap.timeline().fromTo(
      em,
      {
        autoAlpha: 0,
        y: 14,
        textShadow: "0 1px 0 rgba(255,244,236,0), 0 -1px 0 rgba(96,40,26,0), 0.14em 0.1em 0.16em rgba(96,40,26,0.24)",
      },
      {
        autoAlpha: 1,
        y: 0,
        textShadow: "0 1px 0 rgba(255,244,236,0.7), 0 -1px 0 rgba(96,40,26,0.22), 0.01em 0.01em 0.02em rgba(96,40,26,0.1)",
        ease: "power1.out",
        duration: 1,
      },
    ),
  // Se reflexiona · pausa: sin desplazamiento; entra fuera de foco y su doble se funde en ella
  reflexiona: (em) =>
    gsap.timeline().fromTo(
      em,
      { autoAlpha: 0, filter: "blur(10px)", textShadow: "0.16em 0.05em 0 rgba(166,83,63,0.26)" },
      { autoAlpha: 1, filter: "blur(0px)", textShadow: "0em 0em 0 rgba(166,83,63,0)", ease: "sine.inOut", duration: 1 },
    ),
  // Se admira · contemplación: una abertura que se ensancha y una luz tenue detrás
  admira: (em) =>
    gsap
      .timeline()
      .fromTo(
        em,
        { clipPath: "ellipse(0% 0% at 50% 62%)", scale: 0.965 },
        { clipPath: "ellipse(75% 140% at 50% 62%)", scale: 1, ease: "power2.out", duration: 1 },
        0,
      )
      .fromTo(em.parentElement!, { "--glow": 0 }, { "--glow": 1, ease: "sine.inOut", duration: 0.8 }, 0.2),
};

/**
 * Mirar. Una frase que se escribe y los verbos que la completan.
 * En Inicio (`sequence`): "El diseño no solo se observa." se escribe letra a letra y después
 * aparecen Se vive, Se toca, Se reflexiona y Se admira, cada uno con su tratamiento.
 * Todo en el flujo normal de la página: cada pieza sigue su propia posición en pantalla
 * (scrub), así un scroll rápido nunca la deja a medias y al volver se deshace.
 * Sin sticky ni temporizadores, e independiente del Hero y de cualquier otra sección.
 * Para lectores de pantalla queda la declaración completa en una sola frase.
 * En el resto del sitio, y con movimiento reducido, los verbos se muestran juntos.
 */
export function Idea({ label, sequence = false }: { label?: string; sequence?: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      if (sequence) {
        mm.add(MOTION_OK, () => {
          // Escritura: cada letra ocupa ya su lugar (sin saltos de línea ni de ancho); sólo aparece
          const lead = el.querySelector<HTMLElement>(".idea__lead")!;
          gsap.fromTo(
            lead.querySelectorAll(".idea__char"),
            { opacity: 0, filter: "blur(3px)" },
            {
              opacity: 1,
              filter: "blur(0px)",
              ease: "power1.out",
              duration: 1,
              stagger: 0.32,
              scrollTrigger: { trigger: lead, start: "top 86%", end: "top 60%", scrub: 0.4 },
            },
          );

          gsap.utils.toArray<HTMLElement>(".idea__phrase", el).forEach((phrase) => {
            const sense = phrase.dataset.sense as (typeof SENSES)[number];
            const tl = ENTRANCES[sense](phrase.querySelector("em")!);
            tl.pause();
            gsap.to(tl, {
              progress: 1,
              ease: "none",
              scrollTrigger: { trigger: phrase, start: "top 80%", end: "top 52%", scrub: 0.4 },
            });
          });
        });
        return;
      }
      mm.add(MOTION_OK, () => {
        const verbs = gsap.utils.toArray<HTMLElement>(".idea__verb", el);
        // Sin fijar la pantalla: al entrar, los verbos aparecen seguidos y quedan todos visibles
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
    <section ref={ref} className={`idea section${sequence ? " idea--sequence" : ""}`} data-tone="paper" aria-labelledby="idea-lead">
      <div className="idea__pin">
        <div className="wrap idea__inner">
          {label && <p className="label idea__kicker">{label}</p>}
          {sequence ? (
            <>
              <h2 id="idea-lead" className="sr-only">
                {idea.declaration}
              </h2>
              <p className="idea__lead display" aria-hidden="true">
                {idea.lead.split(" ").map((word, i) => (
                  <span key={i}>
                    {i > 0 && " "}
                    <span className="idea__word">
                      {Array.from(word).map((ch, j) => (
                        <span key={j} className="idea__char">
                          {ch}
                        </span>
                      ))}
                    </span>
                  </span>
                ))}
              </p>
              <ol className="idea__verbs idea__verbs--sequence" aria-hidden="true">
                {idea.verbs.map((v, i) => (
                  <li key={v} className={`idea__phrase idea__phrase--${SENSES[i]} idea__verb display`} data-sense={SENSES[i]}>
                    <em>{v}</em>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
      <div className="wrap idea__after">
        <RevealText as="p" className="idea__closing serif" lines={[idea.closing]} stagger={0.03} />
      </div>
    </section>
  );
}
