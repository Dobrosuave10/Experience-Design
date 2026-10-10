import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { destinations, routes } from "../content/site";
import { Link } from "../components/Link";
import { Photo } from "../components/Photo";
import { RevealText } from "../components/RevealText";
import { prefersReducedMotion } from "../lib/env";
import "./HomeDestinations.css";

/** Tiempo de cada imagen en pantalla. */
const INTERVAL = 4600;

/** Una sola secuencia: las imágenes de Milán y luego las de São Paulo, cada una con su destino. */
const SLIDES = destinations.items.flatMap((d, dest) => d.gallery.map((g) => ({ ...g, dest })));
const firstOf = (dest: number) => SLIDES.findIndex((s) => s.dest === dest);

/**
 * Inicio: los destinos como una ventana editorial a dos culturas del diseño.
 * A la izquierda, el titular y la lista; a la derecha, una presentación que avanza sola
 * (fundido, sin controles). El destino activo de la lista sigue a la imagen; elegir un
 * destino muestra su primera imagen y la secuencia continúa desde ahí. Se detiene fuera
 * de pantalla y no avanza sola con movimiento reducido.
 */
export function HomeDestinations() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  /** Cada elección en la lista reinicia el tiempo de la imagen, aunque el destino ya esté activo. */
  const [picked, setPicked] = useState(0);
  const media = useRef<HTMLDivElement>(null);
  const id = useId();
  const items = destinations.items;
  const active = SLIDES[index].dest;

  useEffect(() => {
    const el = media.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // El temporizador se reinicia con cada cambio (también al elegir un destino):
  // después de un clic, la imagen elegida siempre tiene su tiempo completo.
  const auto = visible && !prefersReducedMotion();
  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL);
    return () => window.clearTimeout(t);
  }, [auto, index, picked]);

  const select = (dest: number) => {
    if (dest !== active) setIndex(firstOf(dest));
    setPicked((n) => n + 1);
  };

  // Pestañas: ← → cambian de destino
  const onTabKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length;
    select(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <section className="hdest section" data-tone="ink" aria-labelledby="hdest-title">
      <div className="wrap hdest__grid">
        <div className="hdest__text">
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
                aria-controls={`${id}-media`}
                tabIndex={i === active ? 0 : -1}
                className={`hdest__item ${i === active ? "is-active" : ""}`}
                onClick={() => select(i)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                <span className="label hdest__n">{d.n}</span>
                <span className="hdest__name display">{d.name}</span>
                <span className="hdest__event">{d.homeLabel}</span>
              </button>
            ))}
          </div>
        </div>

        <div ref={media} id={`${id}-media`} className="hdest__media" role="tabpanel" aria-labelledby={`${id}-tab-${active}`}>
          {SLIDES.map((s, i) => (
            <figure key={s.image} className={`hdest__slide ${i === index ? "is-on" : ""}`} aria-hidden={i !== index}>
              <Photo name={s.image} alt={s.alt} sizes="(max-width: 899px) 90vw, 38vw" />
            </figure>
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
