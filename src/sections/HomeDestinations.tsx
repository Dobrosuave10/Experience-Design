import { useId, useState, type KeyboardEvent } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { destinations, routes } from "../content/site";
import { Link } from "../components/Link";
import { RevealText } from "../components/RevealText";
import { DestinationCarousel } from "./DestinationCarousel";
import "./HomeDestinations.css";

/**
 * Inicio: los destinos como una ventana editorial a dos culturas del diseño.
 * Dos selectores (Milán / São Paulo); cada uno muestra su propio carrusel, que avanza
 * solo. Los dos carruseles conservan su estado: cambiar de destino no reinicia al otro.
 */
export function HomeDestinations() {
  const [active, setActive] = useState(0);
  const id = useId();
  const items = destinations.items;

  // Pestañas: ← → cambian de destino, como en cualquier lista de pestañas
  const onTabKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <section className="hdest section" data-tone="ink" aria-labelledby="hdest-title">
      <div className="wrap hdest__grid">
        <div className="hdest__head">
          <p className="label hdest__kicker">{destinations.title}</p>
          <RevealText id="hdest-title" className="hdest__title display" lines={[destinations.homeLead]} stagger={0.04} />
        </div>

        <div className="hdest__list" role="tablist" aria-label="Destinos">
          {items.map((d, i) => (
            <button
              key={d.id}
              id={`${id}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              className={`hdest__item ${i === active ? "is-active" : ""}`}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              <span className="label hdest__n">{d.n}</span>
              <span className="hdest__name display">{d.name}</span>
              <span className="hdest__event">{d.homeLabel}</span>
            </button>
          ))}
        </div>

        <div className="hdest__media">
          {items.map((d, i) => (
            <div
              key={d.id}
              id={`${id}-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`${id}-tab-${i}`}
              inert={i !== active}
              aria-hidden={i !== active}
              className={`hdest__frame ${i === active ? "is-on" : ""}`}
            >
              <DestinationCarousel label={`Imágenes de ${d.name}`} slides={d.gallery} playing={i === active} />
            </div>
          ))}
        </div>

        <Link to={routes.destinos} className="hdest__all">
          <span>Ver destinos</span>
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
