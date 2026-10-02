import { useRef } from "react";
import { gsap } from "gsap";
import { milan } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { DESKTOP, MOTION_OK } from "../lib/env";
import { goToContact } from "../lib/events";
import { MaterialPlate } from "../components/MaterialPlate";
import { MagneticButton } from "../components/MagneticButton";
import { RevealText } from "../components/RevealText";
import "./Milan.css";

/**
 * ExperienceSection: Milán 2027.
 * 1) Apertura: el terrazzo milanés se abre desde una ventana hasta ocupar todo,
 *    con "Milán" en blend difference encima.
 * 2) Seis capítulos en recorrido horizontal (escritorio) o lista editorial (móvil).
 * 3) Lo pendiente, dicho con honestidad, y el CTA principal.
 */
export function Milan() {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".milan__open", start: "top top", end: "bottom bottom", scrub: 0.8 } })
          .fromTo(".milan__window", { clipPath: "inset(30% 34% 30% 34%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1 })
          .fromTo(".milan__window .plate", { scale: 1.5 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(".milan__city", { yPercent: 18 }, { yPercent: -6, ease: "none", duration: 1.3 }, 0)
          .fromTo(".milan__topic", { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 }, 0.8);
      });

      // Recorrido horizontal: sólo escritorio
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const track = el.querySelector<HTMLElement>(".chapters__track")!;
        const wrap = el.querySelector<HTMLElement>(".chapters")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        wrap.style.height = `${distance() + window.innerHeight}px`;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              wrap.style.height = `${distance() + window.innerHeight}px`;
            },
          },
        });
        gsap.utils.toArray<HTMLElement>(".chapter__plate .plate", el).forEach((p) => {
          gsap.fromTo(p, { xPercent: -10 }, { xPercent: 10, ease: "none", scrollTrigger: { trigger: p.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
        return () => {
          wrap.style.height = "";
        };
      });
    },
    ref,
  );

  return (
    <section ref={ref} id="experiencias" className="milan section" data-tone="ink" aria-labelledby="milan-title">
      {/* Apertura */}
      <div className="milan__open">
        <div className="milan__open-sticky">
          <div className="milan__window">
            <MaterialPlate material="terrazzo" light={false} />
          </div>
          <h2 id="milan-title" className="milan__city display" aria-label={`${milan.city} ${milan.year}`}>
            <span aria-hidden="true">{milan.city}</span>
            <span aria-hidden="true" className="milan__year">
              {milan.year}
            </span>
          </h2>
          <div className="milan__meta wrap">
            <p className="label">{milan.event}</p>
            <ul className="milan__topics">
              {milan.topics.map((t) => (
                <li key={t} className="milan__topic">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Capítulos */}
      <div className="chapters">
        <div className="chapters__sticky">
          <ol className="chapters__track">
            <li className="chapter chapter--intro">
              <RevealText as="p" className="chapter__statement display" lines={[milan.statementA, { text: milan.statementB, em: true, className: "accent" }]} />
            </li>
            {milan.chapters.map((c, i) => (
              <li key={c.n} className={`chapter ${i % 2 ? "chapter--low" : ""}`}>
                <div className="chapter__plate">
                  <MaterialPlate material={c.material} />
                </div>
                <div className="chapter__text">
                  <span className="chapter__n label">{c.n}</span>
                  <h3 className="chapter__title display">{c.title}</h3>
                  <p className="chapter__body">{c.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Lo pendiente + CTA */}
      <div className="wrap milan__close">
        <RevealText className="milan__pending-title display" lines={[milan.pending.title]} />
        <div className="milan__pending">
          <dl className="milan__facts">
            {milan.pending.items.map((it) => (
              <div key={it} className="milan__fact">
                <dt className="label">{it}</dt>
                <dd className="serif">
                  <em>{milan.pending.status}</em>
                </dd>
              </div>
            ))}
          </dl>
          <div className="milan__cta">
            <p className="muted">{milan.pending.body}</p>
            <MagneticButton href="#contacto" onClick={() => goToContact("milan")}>
              {milan.cta}
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
