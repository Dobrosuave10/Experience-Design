import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { idea } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { RevealText } from "../components/RevealText";
import "./Idea.css";

/** Los tres verbos del ciclo de Inicio: vivir (experiencia), tocar (materialidad), reflexionar (pensamiento). */
const CYCLE = idea.verbs.slice(0, 3);

// Tiempos del ciclo (s). El fundido de salida se cruza con la entrada siguiente: una palabra se disuelve en la otra.
const IN = 1.7;
const HOLD = 1.5;
const OUT = 2.1;
const OVERLAP = 1.1;

/**
 * 02 Mirar. Sección casi vacía: una frase y los verbos que la completan.
 * En Inicio (`cycle`) los verbos ocupan un mismo lugar y se suceden de a uno:
 * emergen, sostienen su presencia un instante y se disuelven en el siguiente.
 * En el resto del sitio, y con movimiento reducido, se muestran juntos como antes.
 */
export function Idea({ label, cycle = false }: { label?: string; cycle?: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      if (cycle) {
        mm.add(MOTION_OK, () => {
          const words = gsap.utils.toArray<HTMLElement>(".idea__word", el);
          const ticks = gsap.utils.toArray<HTMLElement>(".idea__tick-fill", el);
          const stage = el.querySelector<HTMLElement>(".idea__stage")!;
          gsap.set(words, { autoAlpha: 0, yPercent: 14, filter: "blur(10px)" });
          gsap.set(ticks, { scaleX: 0 });

          // Ciclo sin corte: cada verbo, al empezar a disolverse, llama al siguiente.
          // Las animaciones vivas se guardan para pausarlas fuera de pantalla.
          let live: gsap.core.Animation[] = [];
          let running = false;
          const track = (a: gsap.core.Animation) => {
            // se descartan las que ya terminaron (sin tocar su onComplete: el de delayedCall es la llamada misma)
            live = live.filter((x) => x.progress() < 1);
            live.push(a);
            return a;
          };
          const show = (i: number) => {
            const w = words[i];
            const t = ticks[i];
            track(gsap.to(w, { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", duration: IN, ease: "power2.out", overwrite: true }));
            // la marca de cada verbo se dibuja mientras la palabra está presente
            track(gsap.fromTo(t, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: IN + HOLD, ease: "none" }));
            track(
              gsap.delayedCall(IN + HOLD, () => {
                track(gsap.to(w, { autoAlpha: 0, yPercent: -9, filter: "blur(8px)", duration: OUT, ease: "power1.inOut" }));
                track(gsap.to(t, { scaleX: 0, transformOrigin: "right", duration: OUT * 0.8, ease: "power1.inOut" }));
                // la siguiente emerge mientras esta todavía se está yendo
                track(gsap.delayedCall(OUT - OVERLAP, () => show((i + 1) % words.length)));
              }),
            );
          };
          const start = () => {
            if (running) return;
            running = true;
            live = live.filter((x) => x.progress() < 1);
            if (live.length) live.forEach((a) => a.resume());
            else show(0);
          };
          const pause = () => {
            running = false;
            live.forEach((a) => a.pause());
          };
          const reset = () => {
            pause();
            live.forEach((a) => a.kill());
            live = [];
            gsap.set(words, { autoAlpha: 0, yPercent: 14, filter: "blur(10px)" });
            gsap.set(ticks, { scaleX: 0 });
          };

          // El scroll revela la sección y arranca (o pausa) el ciclo; nunca bloquea la navegación
          gsap.fromTo(".idea__lead", { opacity: 0.25 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "top 25%", scrub: true } });
          ScrollTrigger.create({
            trigger: stage,
            start: "top 88%",
            end: "bottom 8%",
            onEnter: start,
            onEnterBack: start,
            onLeave: pause,
            onLeaveBack: reset,
          });
          // Respuesta leve al scroll: el verbo se desplaza un poco más lento que la página
          gsap.fromTo(stage, { y: 40 }, { y: -40, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });

          return () => reset();
        });
        return;
      }
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
          {cycle ? (
            <div className="idea__cycle">
              {/* Lectores de pantalla: la frase completa, sin depender de la animación */}
              <p className="sr-only">{CYCLE.join(" ")}</p>
              <div className="idea__stage" aria-hidden="true">
                {CYCLE.map((v) => (
                  <span key={v} className="idea__word idea__verb display">
                    <em>{v}</em>
                  </span>
                ))}
              </div>
              <div className="idea__ticks" aria-hidden="true">
                {CYCLE.map((v) => (
                  <span key={v} className="idea__tick">
                    <span className="idea__tick-fill" />
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
