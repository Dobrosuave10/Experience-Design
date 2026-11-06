import { useId } from "react";
import { brand, programsSpine } from "../content/site";
import { images, type ImageName } from "../content/images.gen";
import { navigate } from "../lib/router";
import "./AxesTriangle.css";

/*
 * Triángulo equilátero (lado 960) en un lienzo de 1000 × 880. Las líneas van del centro
 * a la mitad de cada lado, así quedan tres piezas iguales: arriba Experiencias, abajo a la
 * izquierda Marca personal y abajo a la derecha Formación.
 */
const A = [500, 24], B = [20, 855], C = [980, 855];
const G = [500, (A[1] + B[1] + C[1]) / 3];
const mid = (p: number[], q: number[]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const AB = mid(A, B), AC = mid(A, C), BC = mid(B, C);
const pts = (...ps: number[][]) => ps.map((p) => p.join(",")).join(" ");

const SEGMENTS = [
  { id: "experiencias", poly: [A, AC, G, AB], label: [500, 340] },
  { id: "marca-personal", poly: [B, AB, G, BC], label: [318, 712] },
  { id: "formacion", poly: [C, BC, G, AC], label: [682, 712] },
] as const;

/** Versión de unos 960 px del srcset: suficiente para una pieza del triángulo. */
function mediumSrc(name: ImageName) {
  const img = images[name];
  const m = img.srcSet.match(/(\S+-960\.webp) 960w/);
  return m ? m[1] : img.src;
}

/**
 * Los tres ejes como un triángulo plano: cada pieza es una foto (recortada con clipPath)
 * con su verbo y su nombre, y lleva a la página del eje. Al centro, la "E." en su círculo.
 */
export function AxesTriangle() {
  const uid = useId().replace(/:/g, "");
  const items = programsSpine.items;

  return (
    <svg className="tri" viewBox="0 0 1000 880" role="group" aria-label={programsSpine.label}>
      <defs>
        {SEGMENTS.map((s) => (
          <clipPath key={s.id} id={`${uid}-${s.id}`}>
            <polygon points={pts(...s.poly)} />
          </clipPath>
        ))}
      </defs>

      {SEGMENTS.map((s) => {
        const it = items.find((i) => i.id === s.id)!;
        const href = it.axisHref;
        const xs = s.poly.map((p) => p[0]), ys = s.poly.map((p) => p[1]);
        const x = Math.min(...xs), y = Math.min(...ys), w = Math.max(...xs) - x, h = Math.max(...ys) - y;
        const [lx, ly] = s.label;
        const photo = programsSpine.triangle[s.id];
        return (
          <a
            key={s.id}
            href={href}
            className="tri__seg"
            aria-label={`${it.verb}: ${it.name}`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey) return;
              e.preventDefault();
              navigate(href);
            }}
          >
            <g clipPath={`url(#${uid}-${s.id})`}>
              <image href={mediumSrc(photo.image)} x={x} y={y} width={w} height={h} preserveAspectRatio={`${photo.align ?? "xMidYMid"} slice`} />
              <rect className="tri__shade" x={x} y={y} width={w} height={h} />
            </g>
            <g className="tri__label" aria-hidden="true">
              <text className="tri__verb" x={lx} y={ly - 42} textAnchor="middle">
                {it.verb.toUpperCase()}
              </text>
              <text className="tri__name" x={lx} y={ly + 8} textAnchor="middle">
                {it.name}
              </text>
              <line className="tri__rule" x1={lx - 24} x2={lx + 24} y1={ly + 26} y2={ly + 26} />
            </g>
          </a>
        );
      })}

      <g className="tri__lines" aria-hidden="true">
        <line x1={G[0]} y1={G[1]} x2={AB[0]} y2={AB[1]} />
        <line x1={G[0]} y1={G[1]} x2={AC[0]} y2={AC[1]} />
        <line x1={G[0]} y1={G[1]} x2={BC[0]} y2={BC[1]} />
      </g>
      <polygon className="tri__outline" points={pts(A, B, C)} aria-hidden="true" />

      <g className="tri__center" aria-hidden="true">
        <circle cx={G[0]} cy={G[1]} r={62} className="tri__disc" />
        <circle cx={G[0]} cy={G[1]} r={52} className="tri__ring" />
        {brand.logoAsset && <image href={brand.logoAsset} x={G[0] - 22} y={G[1] - 24} width={46} height={48} preserveAspectRatio="xMidYMid meet" />}
      </g>
    </svg>
  );
}
