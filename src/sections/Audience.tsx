import { useState, type KeyboardEvent } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { programs, type Program } from "../content/site";
import { RevealText } from "../components/RevealText";
import "./Audience.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Para quién es cada programa: un carrusel vertical de palabras. Una categoría a la vez,
 * grande y en terracota, con su línea; se avanza con las flechas (botones o teclado).
 */
export function Audience({ program: p, tone = "paper" }: { program: Program; tone?: "paper" | "sand" | "ink" | "warm" }) {
  const items = p.audience;
  const [state, setState] = useState({ i: 0, dir: 1 });
  const go = (dir: 1 | -1) => setState(({ i }) => ({ i: (i + dir + items.length) % items.length, dir }));
  const current = items[state.i];

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      go(e.key === "ArrowDown" ? 1 : -1);
    }
  };

  return (
    <section className="audience section" data-tone={tone} aria-labelledby={`audience-${p.id}`}>
      <div className="wrap audience__grid">
        <p className="label audience__kicker">{p.name}</p>
        <RevealText id={`audience-${p.id}`} as="h2" className="audience__title display" lines={[programs.audienceLabel]} />

        <div className="audience__carousel" role="group" aria-roledescription="carrusel" aria-label={`${programs.audienceLabel}: ${p.name}`} onKeyDown={onKey}>
          <div className="audience__rail" aria-hidden="true">
            {items.map((it, i) => (
              <span key={it.name} className={`audience__tick ${i === state.i ? "is-current" : ""}`} />
            ))}
          </div>

          <div className="audience__stage" aria-live="polite">
            <div key={state.i} className={`audience__slide ${state.dir > 0 ? "is-down" : "is-up"}`}>
              <p className="audience__count label">
                <span className="audience__count-n">{pad(state.i + 1)}</span> / {pad(items.length)}
              </p>
              <p className="audience__who serif">
                <em>{current.name}</em>
              </p>
              {current.detail && <p className="audience__detail label">{current.detail}</p>}
              <p className="audience__text">{current.text}</p>
            </div>
          </div>

          <div className="audience__arrows">
            <button type="button" className="audience__arrow" onClick={() => go(-1)} aria-label="Categoría anterior">
              <CaretUp size={18} weight="light" aria-hidden />
            </button>
            <button type="button" className="audience__arrow" onClick={() => go(1)} aria-label="Categoría siguiente">
              <CaretDown size={18} weight="light" aria-hidden />
            </button>
          </div>
        </div>

        {/* Lectura completa para lectores de pantalla y buscadores */}
        <ul className="sr-only">
          {items.map((it) => (
            <li key={it.name}>
              {it.name}
              {it.detail ? ` (${it.detail})` : ""}: {it.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
