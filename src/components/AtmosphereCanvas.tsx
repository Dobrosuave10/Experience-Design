import { useEffect, useRef, useState } from "react";
import { Atmosphere } from "../three/Atmosphere";
import { prefersReducedMotion, webglAvailable } from "../lib/env";
import "./AtmosphereCanvas.css";

type Props = { color: string; className?: string };

/**
 * Capa de luz WebGL detrás del contenido. Sigue al puntero (mouse) y cambia de color
 * con `color`. Sólo dibuja mientras está en pantalla. Sin WebGL queda un degradado estático.
 */
export function AtmosphereCanvas({ color, className = "" }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const atmo = useRef<Atmosphere | null>(null);
  const [gl] = useState(() => webglAvailable());

  useEffect(() => {
    const el = canvas.current;
    if (!gl || !el) return;
    let a: Atmosphere;
    try {
      a = new Atmosphere(el, color, { reduced: prefersReducedMotion() });
    } catch {
      return;
    }
    atmo.current = a;
    const ro = new ResizeObserver(() => a.resize());
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? a.start() : a.stop()));
    io.observe(el);
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      a.setPointer((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    window.addEventListener("pointermove", move, { passive: true });
    // Si el navegador pierde el contexto, el canvas se esconde en vez de tapar el texto
    const lost = () => {
      a.stop();
      el.style.visibility = "hidden";
    };
    el.addEventListener("webglcontextlost", lost);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", move);
      el.removeEventListener("webglcontextlost", lost);
      a.dispose();
      atmo.current = null;
    };
    // El color inicial se fija al crear; los cambios van por setColor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl]);

  useEffect(() => {
    atmo.current?.setColor(color);
  }, [color]);

  return gl ? (
    <canvas ref={canvas} className={`atmo ${className}`} aria-hidden="true" />
  ) : (
    <div className={`atmo atmo--static ${className}`} style={{ color }} aria-hidden="true" />
  );
}
