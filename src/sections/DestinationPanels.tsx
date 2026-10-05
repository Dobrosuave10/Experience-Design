import { useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "@phosphor-icons/react";
import { destinations } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { Figure } from "../components/MaterialPlate";
import { Link } from "../components/Link";
import { Louvers } from "../components/Louvers";
import "./DestinationPanels.css";

/**
 * Los destinos como dos umbrales a pantalla completa. Milán se abre como una
 * ventana sobre la ciudad; São Paulo, como una celosía que gira y deja pasar la luz.
 * Mismo universo, dos arquitecturas.
 */
export function DestinationPanels() {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        const milan = el.querySelector(".dpanel--milan")!;
        gsap
          .timeline({ scrollTrigger: { trigger: milan, start: "top top", end: "bottom bottom", scrub: 0.8 } })
          .fromTo(milan.querySelector(".dpanel__media"), { clipPath: "inset(22% 30% 22% 30%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut" })
          .fromTo(milan.querySelector(".dpanel__media img"), { scale: 1.3 }, { scale: 1, ease: "power2.inOut" }, 0)
          .fromTo(milan.querySelectorAll(".dpanel__fade"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 }, 0.55);

        const sp = el.querySelector(".dpanel--sao-paulo")!;
        gsap
          .timeline({ scrollTrigger: { trigger: sp, start: "top top", end: "bottom bottom", scrub: 0.8 } })
          .fromTo(sp.querySelectorAll(".louver"), { rotateY: 40 }, { rotateY: 74, ease: "power2.inOut", stagger: { each: 0.03, from: "center" } })
          .fromTo(sp.querySelectorAll(".dpanel__fade"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 }, 0.55);
      });
    },
    ref,
  );

  return (
    <section ref={ref} className="dpanels section" data-tone="ink" aria-label="Destinos">
      {destinations.items.map((d) => (
        <article key={d.id} className={`dpanel dpanel--${d.id}`} aria-labelledby={`dp-${d.id}`}>
          <div className="dpanel__sticky">
            {d.id === "milan" ? (
              <Figure slot={d.image} className="dpanel__media" ratio="auto" sizes="100vw" />
            ) : (
              <Louvers className="dpanel__media" behind="terracotta" />
            )}
            <div className="dpanel__shade" aria-hidden="true" />
            <div className="wrap dpanel__content">
              <p className="label dpanel__n dpanel__fade">
                {d.n} · Destino
              </p>
              <h2 id={`dp-${d.id}`} className={`dpanel__name display ${d.id === "sao-paulo" ? "dpanel__fade" : ""}`}>
                {d.name}
              </h2>
              <div className="dpanel__meta">
                <p className="dpanel__event dpanel__fade">
                  <span className="label">{d.event}</span>
                  <span className="dpanel__sub">{d.sub}</span>
                </p>
                <p className="dpanel__text serif dpanel__fade">
                  <em>{d.text}</em>
                </p>
                <p className="dpanel__when label dpanel__fade">{d.when}</p>
                <Link to={d.href} className="dpanel__go dpanel__fade" data-cursor="Entrar">
                  <span>{d.cta}</span>
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
