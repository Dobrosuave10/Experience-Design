import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import "./TravelMap.css";

/** Avión de línea, apuntando a la derecha (unidades en px). */
const PLANE = "M-10,0 L11,0 M4,0 L-2,-9 L-4,-9 L0,0 M4,0 L-2,9 L-4,9 L0,0 M-7,0 L-10,-4.5 L-11.5,-4.5 L-10,0 M-7,0 L-10,4.5 L-11.5,4.5 L-10,0";

/** Punto del recorrido, en % del área del collage. */
export type MapPoint = [number, number];

export type TravelMapHandle = { setProgress: (p: number) => void };

/** Curva suave por los puntos (Catmull-Rom → Bézier cúbicas). */
function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const t = 0.5 / 3;
    d += ` C${p1[0] + (p2[0] - p0[0]) * t},${p1[1] + (p2[1] - p0[1]) * t} ${p2[0] - (p3[0] - p1[0]) * t},${p2[1] - (p3[1] - p1[1]) * t} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/**
 * Mapa de viaje del collage: una ruta punteada terracota (1px) que serpentea entre las
 * fotos y se dibuja con el scroll, con un pequeño avión de línea que la recorre.
 * La ruta va detrás de las fotos (sólo se ve entre ellas); el avión, delante.
 * El progreso lo marca quien lo usa (setProgress, 0..1); sin movimiento queda completa.
 */
export const TravelMap = forwardRef<TravelMapHandle, { points: MapPoint[]; drawn?: boolean }>(function TravelMap({ points, drawn = false }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const reveal = useRef<SVGPathElement>(null);
  const plane = useRef<SVGGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const len = useRef(0);
  const progress = useRef(drawn ? 1 : 0);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const d = size.w ? smoothPath(points.map(([x, y]) => [(x / 100) * size.w, (y / 100) * size.h])) : "";

  const apply = (p: number) => {
    progress.current = p;
    const path = reveal.current;
    if (!path || !len.current) return;
    const L = len.current;
    path.style.strokeDashoffset = String(L * (1 - p));
    const g = plane.current;
    if (!g) return;
    const at = Math.max(0.5, Math.min(L - 0.5, L * p));
    const a = path.getPointAtLength(at), b = path.getPointAtLength(Math.min(L, at + 1));
    const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    g.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${ang}) scale(1.4)`);
    g.style.opacity = p > 0.01 && p < 0.995 ? "1" : "0";
  };

  useEffect(() => {
    if (!reveal.current || !d) return;
    len.current = reveal.current.getTotalLength();
    reveal.current.style.strokeDasharray = String(len.current);
    apply(progress.current);
  }, [d]);

  useImperativeHandle(ref, () => ({ setProgress: apply }), []);

  const maskId = useRef(`tm-${Math.random().toString(36).slice(2, 8)}`).current;

  return (
    <div ref={box} className="tmap" aria-hidden="true">
      {d && (
        <>
          <svg className="tmap__route" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
            <defs>
              <mask id={maskId} maskUnits="userSpaceOnUse">
                <path ref={reveal} d={d} fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
              </mask>
            </defs>
            <path className="tmap__path" d={d} mask={`url(#${maskId})`} />
            <circle className="tmap__origin" cx={(points[0][0] / 100) * size.w} cy={(points[0][1] / 100) * size.h} r="3" />
          </svg>
          <svg className="tmap__overlay" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
            {/* Avión de línea: fuselaje, alas y cola en un solo trazo fino, apuntando a la derecha */}
            <g ref={plane} className="tmap__plane" style={{ opacity: 0 }}>
              <path className="tmap__plane-halo" d={PLANE} />
              <path d={PLANE} />
            </g>
          </svg>
        </>
      )}
    </div>
  );
});

/** Rosa de los vientos fina: dos cruces y un anillo, con la N. */
export function CompassRose({ className = "" }: { className?: string }) {
  return (
    <svg className={`compass ${className}`} viewBox="-50 -50 100 100" aria-hidden="true">
      <circle r="30" />
      <circle r="27" className="compass__ring" />
      <path d="M0,-44 L4,0 L0,44 L-4,0 Z M-44,0 L0,4 L44,0 L0,-4 Z" />
      <path className="compass__minor" d="M-22,-22 L22,22 M22,-22 L-22,22" />
      <path className="compass__north" d="M0,-44 L4,0 L-4,0 Z" />
      <text y="-46" textAnchor="middle">N</text>
    </svg>
  );
}

/** Bandera mínima, como una estampilla: tres franjas (Italia) o el rombo y el círculo (Brasil). */
export function FlagMark({ country }: { country: "it" | "br" }) {
  const label = country === "it" ? "Italia" : "Brasil";
  return (
    <svg className="flag" viewBox="0 0 24 16" role="img" aria-label={label}>
      {country === "it" ? (
        <>
          <rect width="8" height="16" fill="#2e7d4f" />
          <rect x="8" width="8" height="16" fill="#f7f3ec" />
          <rect x="16" width="8" height="16" fill="#c0392b" />
        </>
      ) : (
        <>
          <rect width="24" height="16" fill="#2b8a4e" />
          <path d="M12,2 L22,8 L12,14 L2,8 Z" fill="#f0c43a" />
          <circle cx="12" cy="8" r="3.4" fill="#22407a" />
        </>
      )}
      <rect x="0.5" y="0.5" width="23" height="15" fill="none" stroke="currentColor" strokeOpacity="0.25" />
    </svg>
  );
}
