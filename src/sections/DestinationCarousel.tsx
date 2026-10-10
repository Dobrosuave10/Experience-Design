import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import type { ImageName } from "../content/images.gen";
import { Photo } from "../components/Photo";

type Slide = { image: ImageName; alt: string };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Carrusel de un destino. Lo maneja sólo quien lo mira: flechas, teclado (← →
 * con el foco en el carrusel) y deslizar en táctil. Sin reproducción automática.
 * Cada destino tiene su propio estado. Las imágenes se funden entre sí, sin saltos.
 */
export function DestinationCarousel({ label, slides, className = "" }: { label: string; slides: Slide[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const id = useId();
  const total = slides.length;
  const go = (step: number) => setIndex((i) => (i + step + total) % total);

  // Deslizar: un gesto horizontal claro cambia de imagen; el vertical sigue siendo scroll
  const start = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) go(dx < 0 ? 1 : -1);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  return (
    <div
      className={`dcar ${className}`}
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <div
        id={`${id}-slides`}
        className="dcar__viewport"
        tabIndex={0}
        aria-label={`${label}. Usa las flechas para cambiar de imagen.`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (start.current = null)}
      >
        {slides.map((s, i) => (
          <figure
            key={s.image}
            className={`dcar__slide ${i === index ? "is-active" : ""}`}
            role="group"
            aria-roledescription="imagen"
            aria-label={`${i + 1} de ${total}`}
            aria-hidden={i !== index}
          >
            <Photo name={s.image} alt={s.alt} sizes="(max-width: 899px) 86vw, 34vw" />
          </figure>
        ))}
      </div>

      <div className="dcar__ui">
        <p className="dcar__count label" aria-live="polite" aria-atomic="true">
          <span className="sr-only">Imagen </span>
          {pad(index + 1)}
          <span className="dcar__of"> / {pad(total)}</span>
        </p>
        <ol className="dcar__dots" aria-hidden="true">
          {slides.map((s, i) => (
            <li key={s.image} className={i === index ? "is-active" : ""} />
          ))}
        </ol>
        <div className="dcar__nav">
          <button type="button" className="dcar__btn" onClick={() => go(-1)} aria-controls={`${id}-slides`} aria-label="Imagen anterior">
            <ArrowLeft size={16} aria-hidden />
          </button>
          <button type="button" className="dcar__btn" onClick={() => go(1)} aria-controls={`${id}-slides`} aria-label="Imagen siguiente">
            <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
