import { useRef } from "react";
import { gsap } from "gsap";
import { saoPaulo } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { Figure } from "../components/MaterialPlate";
import { Louvers } from "../components/Louvers";
import { RevealText } from "../components/RevealText";
import "./SaoPaulo.css";

/**
 * São Paulo, CASACOR. Su propia arquitectura: donde Milán es terrazzo, arcos y un
 * recorrido horizontal, São Paulo es celosía, mayúsculas de hormigón y una casa
 * que se recorre de ambiente en ambiente, en vertical.
 * Sin fotos reales todavía: cada ambiente usa una placa de material (ver `brief`).
 */
export function SaoPaulo() {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".sp__open", start: "top top", end: "bottom bottom", scrub: 0.8 } })
          .fromTo(".sp__open .louver", { rotateY: 40 }, { rotateY: 76, ease: "power2.inOut", stagger: { each: 0.025, from: "start" } })
          .fromTo(".sp__city", { yPercent: 8 }, { yPercent: 0, ease: "power2.out", duration: 0.6 }, 0.2)
          .fromTo(".sp__open-meta", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7);

        gsap.utils.toArray<HTMLElement>(".sp__room", el).forEach((r) => {
          gsap
            .timeline({ scrollTrigger: { trigger: r, start: "top 85%", end: "top 30%", scrub: 0.8 } })
            .fromTo(r.querySelector(".sp__room-frame"), { clipPath: "inset(0% 42% 0% 42%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out" })
            .fromTo(r.querySelector(".sp__room-n"), { opacity: 0, x: -30 }, { opacity: 1, x: 0, ease: "power2.out" }, 0.2);
        });
      });
    },
    ref,
  );

  return (
    <section ref={ref} className="sp section" aria-labelledby="sp-title">
      {/* Apertura: la celosía gira y aparece la ciudad */}
      <div className="sp__open" data-tone="clay">
        <div className="sp__open-sticky">
          <Louvers className="sp__louvers" behind="terracotta" count={16} />
          <div className="wrap sp__open-inner">
            <h1 id="sp-title" className="sp__city" aria-label={`${saoPaulo.city}, ${saoPaulo.event}`}>
              <span aria-hidden="true">São</span>
              <span aria-hidden="true">Paulo</span>
            </h1>
            <div className="sp__open-meta">
              <p className="label">{saoPaulo.event}</p>
              <p className="label sp__year">{saoPaulo.year}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Idea */}
      <div className="sp__intro" data-tone="sand">
        <div className="wrap sp__intro-grid">
          <RevealText className="sp__statement display" lines={[saoPaulo.statementA, { text: saoPaulo.statementB, em: true, className: "accent" }]} />
          <div className="sp__intro-text">
            <p className="body-lg">{saoPaulo.intro}</p>
            <p className="sp__origin serif">
              <em>{saoPaulo.origin}</em>
            </p>
          </div>
        </div>
      </div>

      {/* Ambientes: la casa en vertical */}
      <ol className="sp__rooms" data-tone="sand" aria-label="Ambientes">
        {saoPaulo.rooms.map((r, i) => (
          <li key={r.n} className={`sp__room ${i % 2 ? "sp__room--right" : ""}`}>
            <span className="sp__room-n" aria-hidden="true">
              {r.n}
            </span>
            <Figure slot={{ alt: "", material: r.material, brief: r.brief }} className="sp__room-frame" ratio="16 / 10" />
            <div className="sp__room-text">
              <h2 className="sp__room-title">{r.title}</h2>
              <p className="muted">{r.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
