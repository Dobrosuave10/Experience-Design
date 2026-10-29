import { useRef } from "react";
import { gsap } from "gsap";
import { milan, routes } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { Photo } from "../components/Photo";
import { DestinationIntro, Rooms } from "../components/Rooms";
import { Link } from "../components/Link";
import "./Milan.css";

/**
 * Destino 01: Milán, Milan Design Week / Salone del Mobile.
 * 1) Apertura: el terrazzo milanés se abre desde una ventana hasta ocupar todo,
 *    con "Milán" en blend difference encima.
 * 2) La idea y seis capítulos en vertical (los mismos componentes que São Paulo).
 * El itinerario, la galería y lo pendiente van en secciones propias.
 */
export function Milan() {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm) => {
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".milan__open", start: "top top", end: "bottom bottom", scrub: 0.8 } })
          .fromTo(".milan__window", { clipPath: "inset(30% 34% 30% 34%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1 })
          .fromTo(".milan__window img", { scale: 1.35 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(".milan__shade", { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.6 }, 0.5)
          .fromTo(".milan__city", { yPercent: 18 }, { yPercent: -6, ease: "none", duration: 1.3 }, 0)
          .fromTo(".milan__topic", { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 }, 0.8);
      });
    },
    ref,
  );

  return (
    <section ref={ref} id="experiencias" className="milan section" aria-labelledby="milan-title">
      {/* Apertura */}
      <div className="milan__open" data-tone="ink">
        <div className="milan__open-sticky">
          <div className="milan__window">
            <Photo name={milan.openingImage.image} alt={milan.openingImage.alt} sizes="(max-aspect-ratio: 1/1) 182vh, 100vw" />
            <div className="milan__shade" aria-hidden="true" />
          </div>
          <nav className="milan__crumbs wrap label" aria-label="Estás en">
            <Link to={routes.destinos}>Destinos</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">01 {milan.city}</span>
          </nav>
          <h1 id="milan-title" className="milan__city display" aria-label={`${milan.city}, ${milan.event}, ${milan.fair} ${milan.year}`}>
            <span aria-hidden="true">{milan.city}</span>
            <span aria-hidden="true" className="milan__year">
              {milan.year}
            </span>
          </h1>
          <div className="milan__meta wrap">
            <p className="label">
              {milan.event} · {milan.fair}
            </p>
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

      <DestinationIntro statementA={milan.statementA} statementB={milan.statementB} tone="ink" />

      {/* Capítulos: la ciudad en vertical, como la casa de São Paulo */}
      <Rooms rooms={milan.chapters} tone="ink" label="Capítulos" />
    </section>
  );
}
