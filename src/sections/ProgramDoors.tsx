import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "@phosphor-icons/react";
import { programs, type Program } from "../content/site";
import { prefersReducedMotion } from "../lib/env";
import { scrollToY } from "../lib/smoothScroll";
import { AtmosphereCanvas } from "../components/AtmosphereCanvas";
import { Figure, MaterialPlate } from "../components/MaterialPlate";
import { Link } from "../components/Link";
import "./ProgramDoors.css";

/**
 * Marcadores en vh dentro de la sección fija (altura n*100+40 vh, recorrido n*100-60 vh).
 * El centro de la pantalla los cruza: cada programa ocupa el mismo tramo de scroll.
 */
const markerBox = (i: number, n: number) => {
  const run = n * 100 - 60;
  const step = run / n;
  const top = i === 0 ? 0 : 50 + step * i;
  const bottom = i === n - 1 ? n * 100 + 40 : 50 + step * (i + 1);
  return { top: `${top}vh`, height: `${bottom - top}vh` };
};

const STACK_MQ = "(max-width: 899px), (prefers-reduced-motion: reduce)";

/**
 * Tres puertas. En escritorio la sección queda fija y el scroll elige el camino:
 * cambia la luz (tono de la página + atmósfera WebGL), la superficie de fondo,
 * la tipografía y la imagen, que se abre como una puerta en arco.
 * En móvil (o con reduced motion) las puertas se apilan, cada una con su tono.
 */
export function ProgramDoors() {
  const root = useRef<HTMLElement>(null);
  const [stacked, setStacked] = useState(() => window.matchMedia(STACK_MQ).matches);
  const [active, setActive] = useState(0);
  const items = programs.items;

  useEffect(() => {
    const mq = window.matchMedia(STACK_MQ);
    const on = () => setStacked(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Escritorio: cada tercio del recorrido es un programa (los marcadores llevan el tono)
  useEffect(() => {
    if (stacked || !root.current) return;
    const markers = root.current.querySelectorAll<HTMLElement>(".doors__marker");
    const triggers = Array.from(markers).map((m, i) =>
      ScrollTrigger.create({
        trigger: m,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => self.isActive && setActive(i),
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, [stacked]);

  const goTo = (i: number) => {
    const m = root.current?.querySelectorAll<HTMLElement>(".doors__marker")[i];
    if (!m) return;
    const y = m.getBoundingClientRect().top + window.scrollY + m.offsetHeight / 2 - window.innerHeight / 2;
    scrollToY(y, prefersReducedMotion());
  };

  if (stacked) {
    return (
      <section ref={root} className="doors doors--stacked section" aria-label={programs.hint}>
        {items.map((p, i) => (
          <div key={p.id} className="doors__stacked-item" data-tone={p.tone}>
            <Door program={p} index={i} active />
          </div>
        ))}
      </section>
    );
  }

  const p = items[active];
  return (
    <section ref={root} className="doors doors--pinned section" aria-label={programs.hint} style={{ height: `${items.length * 100 + 40}vh` }}>
      {items.map((it, i) => (
        <div key={it.id} className="doors__marker" data-tone={it.tone} style={markerBox(i, items.length)} aria-hidden="true" />
      ))}
      <div className="doors__pin">
        <div className="doors__plates" aria-hidden="true">
          {items.map((it, i) => (
            <div key={it.id} className={`doors__plate ${i === active ? "is-on" : ""}`}>
              <MaterialPlate material={it.material} light={false} />
            </div>
          ))}
        </div>
        <AtmosphereCanvas color={p.glow} />

        <div className="doors__stage wrap">
          <nav className="doors__index" aria-label="Programas">
            <p className="label doors__hint">{programs.hint}</p>
            <ol>
              {items.map((it, i) => (
                <li key={it.id}>
                  <button className={`doors__tab ${i === active ? "is-active" : ""}`} aria-pressed={i === active} onClick={() => goTo(i)}>
                    <span className="label">{it.n}</span>
                    <span className="doors__tab-name">{it.name}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="doors__progress" aria-hidden="true">
              <span style={{ transform: `scaleY(${(active + 1) / items.length})` }} />
            </div>
          </nav>

          {items.map((it, i) => (
            <Door key={it.id} program={it} index={i} active={i === active} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Door({ program: p, index, active }: { program: Program; index: number; active: boolean }) {
  return (
    <article className={`door door--${p.id} ${active ? "is-active" : ""}`} aria-hidden={!active} aria-labelledby={`door-${p.id}`}>
      <div className="door__frame-wrap">
        <Figure slot={p.image} className="door__frame" ratio={p.id === "estudiantes" ? "4 / 3" : p.id === "profesionales" ? "1 / 1" : "3 / 4"} sizes="(max-width: 899px) 90vw, 40vw" />
        {p.detail && <Figure slot={p.detail} className="door__detail" ratio="4 / 5" sizes="200px" />}
      </div>

      <div className="door__text">
        <p className="door__n label">
          Programa {p.n} <span className="door__mood">· {p.mood}</span>
        </p>
        <h2 id={`door-${p.id}`} className="door__name">
          {p.name}
        </h2>
        <p className="door__line serif">
          {p.lines.map((l, j) => (
            <span key={j} className="door__line-row" style={{ transitionDelay: active ? `${0.25 + j * 0.08}s` : "0s" }}>
              {j === p.lines.length - 1 ? <em>{l}</em> : l}
            </span>
          ))}
        </p>
        <ol className="door__keys" aria-label="Recorrido">
          {p.keywords.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ol>
        <Link to={p.href} className="door__go" tabIndex={active ? 0 : -1} data-cursor="Entrar">
          <span>{p.cta}</span>
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
      <span className="door__big" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
    </article>
  );
}
