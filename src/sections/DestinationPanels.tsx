import { useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "@phosphor-icons/react";
import { destinations } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { Link } from "../components/Link";
import { DestinationCarousel } from "./DestinationCarousel";
import "./DestinationPanels.css";

/** En pantallas anchas los paneles se fijan y se revelan con el scroll; en móvil son bloques normales. */
const WIDE_MOTION = "(prefers-reduced-motion: no-preference) and (min-width: 900px)";

/**
 * Los destinos como dos umbrales. El nombre y las referencias del evento a la izquierda;
 * a la derecha, el carrusel propio de cada destino. Milán se abre como una ventana desde
 * el centro; São Paulo, como una celosía que se separa. Mismo universo, dos arquitecturas.
 */
export function DestinationPanels() {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(WIDE_MOTION, () => {
        const milan = el.querySelector(".dpanel--milan")!;
        gsap
          .timeline({ scrollTrigger: { trigger: milan, start: "top top", end: "bottom bottom", scrub: 0.8 } })
          .fromTo(milan.querySelector(".dpanel__media"), { clipPath: "inset(22% 30% 22% 30%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut" })
          .fromTo(milan.querySelectorAll(".dcar__slide img"), { scale: 1.3 }, { scale: 1, ease: "power2.inOut" }, 0)
          .fromTo(milan.querySelectorAll(".dpanel__fade"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 }, 0.55);

        const sp = el.querySelector(".dpanel--sao-paulo")!;
        gsap
          .timeline({ scrollTrigger: { trigger: sp, start: "top top", end: "bottom bottom", scrub: 0.8 } })
          .fromTo(sp.querySelector(".dpanel__media"), { clipPath: "inset(0% 50% 0% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut" })
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
            <DestinationCarousel className="dpanel__media" label={`Imágenes de ${d.name}`} slides={d.gallery} />
            <div className="wrap dpanel__content">
              <p className="label dpanel__n dpanel__fade">
                {d.n} · Destino
              </p>
              <h2 id={`dp-${d.id}`} className="dpanel__name display">
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
