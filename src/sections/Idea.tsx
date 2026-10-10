import { useRef } from "react";
import { gsap } from "gsap";
import { idea } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { RevealText } from "../components/RevealText";
import "./Idea.css";

/** Los cuatro verbos de Inicio, cada uno con su carácter: vivir, tocar, reflexionar, admirar. */
const SENSES = ["vive", "toca", "reflexiona", "admira"] as const;
type Sense = (typeof SENSES)[number];

/**
 * Cada verbo, una manera de aparecer, con el mismo lenguaje de movimiento (power2.out,
 * recorridos cortos). Son líneas de tiempo pausadas: su avance lo pone el scroll.
 * El estado final es siempre el de reposo: nítido, opaco, sin máscara.
 */
const ENTRANCES: Record<Sense, (em: HTMLElement) => gsap.core.Timeline> = {
  // Se vive · presencia: entra a su lugar y gana cuerpo (de un tono tenue al terracota)
  vive: (em) =>
    gsap
      .timeline()
      .fromTo(em, { opacity: 0, y: 36 }, { opacity: 1, y: 0, ease: "power2.out", duration: 1 }, 0)
      .fromTo(em, { color: "#dcbfae" }, { color: "#a6533f", ease: "power1.inOut", duration: 0.8 }, 0.2),
  // Se toca · materia: una máscara la descubre de izquierda a derecha y el tono se asienta
  toca: (em) =>
    gsap
      .timeline()
      .fromTo(em, { clipPath: "inset(-12% 100% -12% 0%)" }, { clipPath: "inset(-12% -6% -12% 0%)", ease: "power2.out", duration: 1 }, 0)
      .fromTo(em, { color: "#c98a72" }, { color: "#a6533f", ease: "power1.inOut", duration: 0.7 }, 0.3),
  // Se reflexiona · claridad: sin desplazamiento; de una suavidad óptica a la nitidez completa
  reflexiona: (em) =>
    gsap.timeline().fromTo(
      em,
      { opacity: 0.18, filter: "blur(7px)" },
      { opacity: 1, filter: "blur(0px)", ease: "power2.out", duration: 1 },
    ),
  // Se admira · apertura: el espacio se abre desde el centro, más ancho y más lento
  admira: (em) =>
    gsap
      .timeline()
      .fromTo(
        em,
        { clipPath: "inset(-12% 50% -12% 50%)", y: 18 },
        { clipPath: "inset(-12% -6% -12% -6%)", y: 0, ease: "power2.out", duration: 1 },
        0,
      ),
};

/**
 * Mirar. Una frase que se escribe, los verbos que la completan y un cierre.
 * En Inicio (`sequence`): "El diseño no solo se observa." se escribe letra a letra; después
 * aparecen Se vive, Se toca, Se reflexiona y Se admira, cada uno con su carácter, y cierra
 * "Más allá de la pantalla, el diseño se convierte en experiencia."
 * Todo está en el flujo normal de la página y cada pieza sigue su propia posición en
 * pantalla (scrub directo): el scroll nunca espera a una animación, un scroll rápido
 * deja todo en su estado final y al volver se deshace. Sin pin, sin temporizadores.
 * El texto completo vive en el DOM para lectores de pantalla; las letras sueltas no.
 * En el resto del sitio, y con movimiento reducido, se muestra quieto.
 */
export function Idea({ label, sequence = false }: { label?: string; sequence?: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      if (sequence) {
        mm.add(MOTION_OK, () => {
          // Escritura: cada letra ya ocupa su lugar (sin saltos de línea ni de ancho);
          // aparece con un fundido corto que se solapa con la siguiente, como un trazo.
          const lead = el.querySelector<HTMLElement>(".idea__lead")!;
          gsap.fromTo(
            lead.querySelectorAll(".idea__char"),
            { opacity: 0, yPercent: 12 },
            {
              opacity: 1,
              yPercent: 0,
              ease: "power2.out",
              duration: 1,
              stagger: 0.35,
              scrollTrigger: { trigger: lead, start: "top 88%", end: "top 58%", scrub: true },
            },
          );

          gsap.utils.toArray<HTMLElement>(".idea__phrase", el).forEach((phrase) => {
            const tl = ENTRANCES[phrase.dataset.sense as Sense](phrase.querySelector("em")!).pause();
            gsap.to(tl, {
              progress: 1,
              ease: "none",
              scrollTrigger: { trigger: phrase, start: "top 86%", end: "top 56%", scrub: true },
            });
          });

          // Cierre: las dos líneas suben desde su propia máscara, una tras otra
          gsap.fromTo(
            el.querySelectorAll(".idea__beyond-line > span"),
            { yPercent: 105 },
            {
              yPercent: 0,
              ease: "power2.out",
              stagger: 0.4,
              scrollTrigger: { trigger: el.querySelector(".idea__beyond"), start: "top 85%", end: "bottom 62%", scrub: true },
            },
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

  if (sequence) {
    const { beyond } = idea;
    return (
      <section ref={ref} className="idea idea--sequence section" data-tone="paper" aria-labelledby="idea-lead">
        <div className="wrap idea__inner">
          <h2 id="idea-lead" className="idea__lead display">
            <span className="sr-only">{idea.lead}</span>
            <span aria-hidden="true">
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
            </span>
          </h2>
          <ol className="idea__verbs idea__verbs--sequence" aria-label="El diseño">
            {idea.verbs.map((v, i) => (
              <li key={v} className={`idea__phrase idea__phrase--${SENSES[i]} idea__verb display`} data-sense={SENSES[i]}>
                <em>{v}</em>
              </li>
            ))}
          </ol>
        </div>
        <div className="wrap idea__after">
          <p className="idea__beyond serif">
            <span className="idea__beyond-line">
              <span>{beyond.lead}</span>
            </span>{" "}
            <span className="idea__beyond-line idea__beyond-line--rest">
              <span>
                <em>
                  {beyond.rest} <span className="idea__beyond-accent">{beyond.accent}</span>
                </em>
              </span>
            </span>
          </p>
        </div>
      </section>
    );
  }

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
