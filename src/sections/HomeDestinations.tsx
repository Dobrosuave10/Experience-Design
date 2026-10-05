import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { destinations, routes } from "../content/site";
import { Figure } from "../components/MaterialPlate";
import { Link } from "../components/Link";
import { RevealText } from "../components/RevealText";
import "./HomeDestinations.css";

/**
 * Inicio: los destinos como índice editorial. Al pasar por un nombre, su imagen
 * aparece a la derecha (en móvil, junto a cada nombre).
 */
export function HomeDestinations() {
  const [active, setActive] = useState(0);
  return (
    <section className="hdest section" data-tone="ink" aria-labelledby="hdest-title">
      <div className="wrap hdest__grid">
        <div className="hdest__head">
          <p className="label hdest__kicker">{destinations.title}</p>
          <RevealText id="hdest-title" className="hdest__title display" lines={[destinations.lead]} stagger={0.04} />
        </div>

        <ol className="hdest__list">
          {destinations.items.map((d, i) => (
            <li key={d.id}>
              <Link
                to={d.href}
                className={`hdest__item ${i === active ? "is-active" : ""}`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                data-cursor="Entrar"
              >
                <span className="label hdest__n">{d.n}</span>
                <span className="hdest__name display">{d.name}</span>
                <span className="hdest__event">
                  {d.event}
                  <span className="hdest__sub">{d.sub}</span>
                </span>
                <ArrowRight className="hdest__arrow" size={22} weight="light" aria-hidden />
              </Link>
            </li>
          ))}
        </ol>

        <div className="hdest__media" aria-hidden="true">
          {destinations.items.map((d, i) => (
            <div key={d.id} className={`hdest__frame ${i === active ? "is-on" : ""}`}>
              <Figure slot={d.image} ratio="4 / 5" sizes="(max-width: 899px) 0px, 34vw" />
              {!d.image.image && <span className="hdest__frame-name">{d.name}</span>}
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
