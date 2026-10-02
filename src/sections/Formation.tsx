import { useState } from "react";
import { formation } from "../content/site";
import { goToContact } from "../lib/events";
import { MagneticButton } from "../components/MagneticButton";
import { RevealText } from "../components/RevealText";
import { Photo } from "../components/Photo";
import "./Formation.css";

/**
 * 05 Aprender. No una academia: formatos dichos como texto corrido, y la
 * modalidad (presencial / online) como una elección dentro del mismo eje.
 */
export function Formation() {
  const [mode, setMode] = useState(formation.modalities[0].id);
  const current = formation.modalities.find((m) => m.id === mode)!;

  return (
    <section id="formacion" className="formation section" data-tone="paper" aria-labelledby="formation-title">
      <div className="wrap formation__grid">
        <div className="formation__main">
          <RevealText id="formation-title" className="formation__title display" lines={[formation.title]} stagger={0.035} />
          <p className="formation__body body-lg muted">{formation.body}</p>

          <div className="formation__formats">
            <h3 className="label muted">{formation.formatsLabel}</h3>
            <p className="formation__list serif">
              {formation.formats.map((f, i) => (
                <span key={f} className="formation__format">
                  {f}
                  {i < formation.formats.length - 1 && <span className="formation__sep">,</span>}{" "}
                </span>
              ))}
            </p>
          </div>
        </div>

        <aside className="formation__side" aria-label="Modalidades">
          <figure className="formation__img">
            {formation.image.image && <Photo name={formation.image.image} alt={formation.image.alt} sizes="(max-width: 899px) 90vw, 30vw" />}
          </figure>
          <div className="formation__modes">
            <div className="formation__tabs" role="tablist" aria-label="Modalidad">
              {formation.modalities.map((m) => (
                <button
                  key={m.id}
                  role="tab"
                  id={`tab-${m.id}`}
                  aria-selected={m.id === mode}
                  aria-controls="mode-panel"
                  tabIndex={m.id === mode ? 0 : -1}
                  className="formation__tab"
                  onClick={() => setMode(m.id)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                      const idx = formation.modalities.findIndex((x) => x.id === mode);
                      const next = formation.modalities[(idx + (e.key === "ArrowRight" ? 1 : -1) + formation.modalities.length) % formation.modalities.length];
                      setMode(next.id);
                      document.getElementById(`tab-${next.id}`)?.focus();
                    }
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p id="mode-panel" role="tabpanel" aria-labelledby={`tab-${mode}`} className="formation__mode-text" key={mode}>
              {current.text}
            </p>
            <div className="formation__status">
              <span className="label">{formation.status}</span>
              <MagneticButton variant="line" href="#contacto" onClick={() => goToContact("formacion")}>
                {formation.cta}
              </MagneticButton>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
