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
 * En Inicio (`sequence`) cada verbo es un elemento propio en el flujo normal de la
 * página: se revela (fundido, difuminado que se aclara, unos píxeles hacia arriba)
 * a medida que entra en pantalla y, una vez visible, queda. Se acumulan:
 * Se vive, Se toca, Se reflexiona. Sin sticky, sin tramos extra, sin temporizadores.
 * En el resto del sitio, y con movimiento reducido, los verbos se muestran juntos.
 */
export function Idea({ label, sequence = false }: { label?: string; sequence?: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      if (sequence) {
        mm.add(MOTION_OK, () => {
          // Cada frase sigue su propia posición en el viewport: entra mientras sube
          // desde el borde inferior hasta un poco más arriba del centro. Al volver
          // hacia arriba la entrada se deshace con naturalidad; nunca se reemplazan.
          gsap.utils.toArray<HTMLElement>(".idea__phrase", el).forEach((phrase) => {
            gsap.fromTo(
              phrase,
              { autoAlpha: 0, y: 18, filter: "blur(8px)" },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                ease: "power1.out",
                scrollTrigger: { trigger: phrase, start: "top 92%", end: "top 62%", scrub: true },
              },
            );
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
    <section ref={ref} className="idea section" data-tone="paper" aria-labelledby="idea-lead">
      <div className="idea__pin">
        <div className="wrap idea__inner">
          {label && <p className="label idea__kicker">{label}</p>}
          <h2 id="idea-lead" className="idea__lead display">
            {idea.lead}
          </h2>
          {sequence ? (
            <ol className="idea__verbs idea__verbs--sequence" aria-label="El diseño">
              {SEQUENCE.map((v) => (
                <li key={v} className="idea__phrase idea__verb display">
                  <em>{v}</em>
                </li>
              ))}
            </ol>
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
