import { useRef } from "react";
import { gsap } from "gsap";
import { saoPaulo } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { Louvers } from "../components/Louvers";
import { DestinationIntro, Rooms } from "../components/Rooms";
import "./SaoPaulo.css";

/**
 * São Paulo, CASACOR. Su propia apertura (celosía y mayúsculas de hormigón) y,
 * como Milán, una casa que se recorre de ambiente en ambiente, en vertical.
 * Cada ambiente, con una foto real de CASACOR São Paulo 2025.
 */
export function SaoPaulo() {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm) => {
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".sp__open", start: "top top", end: "bottom bottom", scrub: 0.8 } })
          .fromTo(".sp__open .louver", { rotateY: 40 }, { rotateY: 76, ease: "power2.inOut", stagger: { each: 0.025, from: "start" } })
          .fromTo(".sp__city", { yPercent: 8 }, { yPercent: 0, ease: "power2.out", duration: 0.6 }, 0.2)
          .fromTo(".sp__open-meta", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.7);
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

      <DestinationIntro statementA={saoPaulo.statementA} statementB={saoPaulo.statementB} tone="sand">
        <p className="body-lg">{saoPaulo.intro}</p>
        <p className="dest-origin serif">
          <em>{saoPaulo.origin}</em>
        </p>
      </DestinationIntro>

      {/* Ambientes: la casa en vertical */}
      <Rooms rooms={saoPaulo.rooms} tone="sand" label="Ambientes" />
    </section>
  );
}
