import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import type { ImageName } from "../content/images.gen";
import { Photo } from "../components/Photo";
import { prefersReducedMotion } from "../lib/env";
import "./DestinationCarousel.css";

type Slide = { image: ImageName; alt: string };

/** Tiempo de cada imagen: suficiente para mirarla, sin que la sección se sienta lenta. */
const INTERVAL = 5200;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Carrusel de un destino. Avanza solo mientras está a la vista y `playing` es verdadero;
 * se detiene mientras el cursor está encima, cuando tiene el foco o mientras se lo toca,
 * y retoma después. Con movimiento reducido no avanza solo. Flechas, teclado (← →)
 * y deslizar en táctil. Cada instancia guarda su propio estado.
 */
export function DestinationCarousel({
  label,
  slides,
  playing = true,
  className = "",
}: {
  label: string;
  slides: Slide[];
  playing?: boolean;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const total = slides.length;
  const go = (step: number) => setIndex((i) => (i + step + total) % total);

  // Sólo corre cuando está en pantalla (y la pestaña del navegador está visible)
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Avance automático: el intervalo se reinicia con cada cambio, así un clic nunca
  // queda seguido de un salto inmediato
  const auto = playing && visible && !held && !prefersReducedMotion();
  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => {
      if (!document.hidden) go(1);
    }, INTERVAL);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, index]);

  // Deslizar: un gesto horizontal claro cambia de imagen; el vertical sigue siendo scroll
  const start = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    setHeld(true);
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (e.pointerType !== "mouse") setHeld(false);
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
      ref={root}
      className={`dcar ${className}`}
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setHeld(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHeld(false)}
    >
      <div
        id={`${id}-slides`}
        className="dcar__viewport"
        tabIndex={0}
        aria-label={`${label}. Usa las flechas para cambiar de imagen.`}
        aria-live={auto ? "off" : "polite"}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          start.current = null;
          setHeld(false);
        }}
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
            <Photo name={s.image} alt={s.alt} sizes="(max-width: 899px) 90vw, 34vw" />
          </figure>
        ))}
      </div>

      <div className="dcar__ui">
        <p className="dcar__count label">
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
            <ArrowLeft size={14} aria-hidden />
          </button>
          <button type="button" className="dcar__btn" onClick={() => go(1)} aria-controls={`${id}-slides`} aria-label="Imagen siguiente">
            <ArrowRight size={14} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
