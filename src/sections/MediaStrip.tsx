import { useRef } from "react";
import { gsap } from "gsap";
import type { MediaItem } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { InViewVideo } from "../components/InViewVideo";
import { Photo } from "../components/Photo";
import { RevealText } from "../components/RevealText";
import "./MediaStrip.css";

type Props = {
  id: string;
  label: string;
  title?: string;
  items: MediaItem[];
  tone?: "paper" | "sand" | "ink" | "warm";
  /** Columnas en escritorio (en el teléfono siempre son dos). */
  columns?: 3 | 4;
};

/**
 * Fotos y videos cortos (sin audio, en bucle, sólo mientras están en pantalla) en columnas
 * de alturas libres: cada pieza en su proporción, sin recortes; las horizontales, grandes.
 */
export function MediaStrip({ id, label, title, items, tone = "paper", columns = 3 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".media__item", el).forEach((it, i) => {
          gsap.fromTo(it, { opacity: 0, y: 30 + (i % 3) * 14 }, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: it, start: "top 94%", once: true } });
        });
      });
    },
    ref,
  );

  return (
    <section ref={ref} className="media section" data-tone={tone} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <header className="media__head">
          <p id={title ? undefined : `${id}-title`} className="label media__label">
            {label}
          </p>
          {title && <RevealText id={`${id}-title`} as="h2" className="media__title display" lines={[title]} />}
        </header>
        <ul className={`media__grid media__grid--${columns}`}>
          {items.map((m) => (
            <li key={m.image ?? m.video?.src} className={`media__item ${m.wide ? "media__item--wide" : ""}`}>
              {m.video ? (
                <span className="media__video" style={{ aspectRatio: m.ratio ?? "9 / 16" }}>
                  <InViewVideo src={m.video.src} poster={m.video.poster} label={m.alt} />
                </span>
              ) : (
                m.image && <Photo name={m.image} alt={m.alt} sizes={m.wide ? "(max-width: 767px) 92vw, 60vw" : "(max-width: 767px) 46vw, 30vw"} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
