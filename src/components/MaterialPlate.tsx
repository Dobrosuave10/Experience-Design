import { useEffect, useRef, useState, type CSSProperties } from "react";
import { materialURL, type MaterialName } from "../lib/materials";
import type { ImageSlot } from "../content/site";
import { Photo } from "./Photo";
import "./MaterialPlate.css";

type PlateProps = {
  material: MaterialName;
  className?: string;
  style?: CSSProperties;
  /** Luz que sigue al puntero: la superficie "responde" al acercarse. */
  light?: boolean;
};

/** Superficie de material generada al entrar en viewport (no bloquea la carga). */
export function MaterialPlate({ material, className = "", style, light = true }: PlateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let alive = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        materialURL(material).then((u) => alive && setUrl(u));
      },
      { rootMargin: "60% 0px" },
    );
    io.observe(el);
    return () => {
      alive = false;
      io.disconnect();
    };
  }, [material]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!light || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--lx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--ly", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div
      ref={ref}
      className={`plate plate--${material} ${url ? "is-ready" : ""} ${light ? "has-light" : ""} ${className}`}
      style={{ ...style, backgroundImage: url ? `url(${url})` : undefined }}
      onPointerMove={onMove}
      aria-hidden="true"
    />
  );
}

type FigureProps = {
  slot: ImageSlot;
  className?: string;
  ratio?: string;
  sizes?: string;
};

/**
 * Espacio de imagen editorial. Usa la foto real si existe; si no, una placa de material.
 * `slot.brief` documenta qué foto corresponde (queda en el DOM como data-attribute).
 */
export function Figure({ slot, className = "", ratio = "4 / 5", sizes = "50vw" }: FigureProps) {
  return (
    <figure className={`figure ${className}`} style={{ aspectRatio: ratio }} data-photo-brief={slot.image ? undefined : slot.brief}>
      {slot.image ? (
        <Photo name={slot.image} alt={slot.alt} sizes={sizes} />
      ) : (
        <>
          <MaterialPlate material={slot.material} />
          {slot.alt && <span className="sr-only">{slot.alt}</span>}
        </>
      )}
    </figure>
  );
}
