import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { archive } from "../content/site";
import { ExperienceCard } from "../components/ExperienceCard";
import { RevealText } from "../components/RevealText";
import "./Archive.css";

/**
 * Historia y archivo en uno: la prueba real (pilotos 2023 y 2024, Milán 2025)
 * y la próxima experiencia. Se puede sumar un destino agregando una entrada en content/site.ts.
 */
export function Archive() {
  const [open, setOpen] = useState(0);

  // El acordeón cambia la altura de la página: recalcular los triggers posteriores
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 850);
    return () => window.clearTimeout(t);
  }, [open]);

  return (
    <section className="archive section" data-tone="ink" aria-labelledby="archive-title">
      <div className="wrap">
        <div className="archive__head">
          <RevealText id="archive-title" className="archive__title display" lines={[archive.title]} />
          <p className="archive__body muted">{archive.body}</p>
        </div>
        <ul className="archive__list">
          {archive.entries.map((e, i) => (
            <ExperienceCard key={`${e.place}-${e.year}`} entry={e} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
