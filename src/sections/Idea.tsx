import { useRef } from "react";
import { gsap } from "gsap";
import { idea } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { RevealText } from "../components/RevealText";
import "./Idea.css";

/** Los tres verbos de la secuencia de Inicio: vivir (experiencia), tocar (materialidad), reflexionar (pensamiento). */
const SEQUENCE = idea.verbs.slice(0, 3);

/**
 * 02 Mirar. Sección casi vacía: una frase y los verbos que la completan.
 * En Inicio (`cycle`) la frase queda fija mientras se avanza y el progreso del
 * scroll, y nada más, decide qué verbo se ve: Se vive → Se toca → Se reflexiona.
 * Cada uno emerge (fundido, nitidez, unos píxeles hacia arriba) y se disuelve en
 * el siguiente; al subir, la secuencia se recorre al revés. Sin temporizadores.
 * En el resto del sitio, y con movimiento reducido, los verbos se muestran juntos.
 */
export function Idea({ label, cycle = false }: { label?: string; cycle?: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      if (cycle) {
        mm.add(MOTION_OK, () => {
          const words = gsap.utils.toArray<HTMLElement>(".idea__word", el);
          const track = el.querySelector<HTMLElement>(".idea__track")!;
          gsap.set(words, { autoAlpha: 0, y: 14, filter: "blur(8px)" });

          // Línea de tiempo medida en tramo de scroll (no en segundos): 0 → 10 recorre la sección.
          // Cada entrada se cruza con la salida anterior: nunca queda un hueco sin palabra.
          const enter = { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.3, ease: "power1.out" };
          const leave = { autoAlpha: 0, y: -8, filter: "blur(8px)", duration: 1.3, ease: "power1.in" };
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: track, start: "top 70%", end: "bottom bottom", scrub: true },
            })
            .to(words[0], enter, 0) //         Se vive: aparece al entrar
            .to(words[0], leave, 2.9) //       se disuelve…
            .to(words[1], enter, 3.3) //       …mientras emerge Se toca
            .to(words[1], leave, 6.0)
            .to(words[2], enter, 6.4) //       Se reflexiona
            .to({}, { duration: 2.3 }, 7.7); // queda presente hasta que la sección se va

          gsap.fromTo(
            ".idea__lead",
            { opacity: 0.25 },
            { opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "top 25%", scrub: true } },
          );
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
    <section ref={ref} className="idea section" data-tone="paper" aria-labelledby="idea-lead">
      <div className={cycle ? "idea__track" : "idea__pin"}>
        <div className={`wrap idea__inner ${cycle ? "idea__inner--sticky" : ""}`}>
          {label && <p className="label idea__kicker">{label}</p>}
          <h2 id="idea-lead" className="idea__lead display">
            {idea.lead}
          </h2>
          {cycle ? (
            <div className="idea__cycle">
              {/* Lectores de pantalla: la frase completa, sin depender de la animación */}
              <p className="sr-only">{SEQUENCE.join(" ")}</p>
              <div className="idea__stage" aria-hidden="true">
                {SEQUENCE.map((v) => (
                  <span key={v} className="idea__word idea__verb display">
                    <em>{v}</em>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <ul className="idea__verbs" aria-label="El diseño">
              {idea.verbs.map((v) => (
                <li key={v} className="idea__verb display">
                  <em>{v}</em>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="wrap idea__after">
        <RevealText as="p" className="idea__closing serif" lines={[idea.closing]} stagger={0.03} />
      </div>
    </section>
  );
}
