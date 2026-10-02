import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { worlds } from "../content/site";
import { scrollToTarget } from "../lib/smoothScroll";
import { MaterialPlate } from "../components/MaterialPlate";
import { RevealText } from "../components/RevealText";
import { Logo } from "../components/Logo";
import "./Worlds.css";

/**
 * 03 Descubrir. Tres mundos, no tres tarjetas: paneles de material que se abren
 * al acercarse. Debajo, el hilo que los une: Conectar.
 */
export function Worlds() {
  const [active, setActive] = useState(0);

  return (
    <section className="worlds section" data-tone="sand" aria-labelledby="worlds-title">
      <div className="wrap worlds__head">
        <RevealText id="worlds-title" className="worlds__title display" lines={[worlds.title]} />
        <Logo size={56} decorative className="worlds__seal" />
      </div>

      <div className="worlds__panels wrap">
        {worlds.items.map((w, i) => (
          <a
            key={w.id}
            href={w.href}
            className={`world world--${w.tone} ${i === active ? "is-active" : ""}`}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            onFocus={() => setActive(i)}
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget(w.href);
            }}
            data-cursor="Entrar"
          >
            <MaterialPlate material={w.material} />
            <div className="world__shade" />
            <div className="world__top">
              <span className="label">0{i + 1}</span>
              <span className="label">{w.verb}</span>
            </div>
            <div className="world__bottom">
              <h3 className="world__name display">{w.name}</h3>
              <div className="world__more">
                <p className="world__text">{w.text}</p>
                <ul className="world__keys">
                  {w.keywords.map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
                <ArrowRight size={22} weight="light" aria-hidden className="world__arrow" />
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="wrap worlds__thread" aria-hidden="true">
        <span className="worlds__line" />
        <span className="worlds__thread-word serif">
          <em>{worlds.thread}</em>
        </span>
        <span className="worlds__line" />
      </div>
    </section>
  );
}
