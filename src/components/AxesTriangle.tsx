import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "@phosphor-icons/react";
import { worlds } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK, prefersReducedMotion } from "../lib/env";
import { Logo } from "./Logo";
import { Photo } from "./Photo";
import { Link } from "./Link";
import "./AxesTriangle.css";

/**
 * Los tres ejes como un sistema: un triángulo dibujado en SVG cuyas esquinas son
 * imágenes (los tres programas: Marca personal, Estudiantes, Profesionales) y cuyo centro es el sello.
 * Los radios punteados que salen del centro son el hilo invisible: Conectar.
 *
 * Geometría en unidades del viewBox; el DOM se posiciona en % sobre el mismo plano,
 * así líneas e imágenes nunca se desalinean. En móvil el triángulo se estira en vertical.
 */

type Pt = { x: number; y: number };
type Geometry = { w: number; h: number; v: [Pt, Pt, Pt] };

const DESKTOP: Geometry = { w: 1000, h: 860, v: [{ x: 560, y: 150 }, { x: 190, y: 700 }, { x: 862, y: 660 }] };
const MOBILE: Geometry = { w: 400, h: 640, v: [{ x: 200, y: 92 }, { x: 82, y: 470 }, { x: 318, y: 470 }] };

const centroid = (v: Geometry["v"]): Pt => ({ x: (v[0].x + v[1].x + v[2].x) / 3, y: (v[0].y + v[1].y + v[2].y) / 3 });
const pct = (g: Geometry, p: Pt) => ({ left: `${(p.x / g.w) * 100}%`, top: `${(p.y / g.h) * 100}%` });
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 0],
];
const AUTO_MS = 5200;

export function AxesTriangle() {
  const root = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  const [active, setActive] = useState(0);
  const userTook = useRef(false);
  const g = mobile ? MOBILE : DESKTOP;
  const c = centroid(g.v);
  const item = worlds.items[active];

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setMobile(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Recorrido automático lento mientras está en pantalla y nadie interactuó
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let timer = 0;
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top 70%",
      end: "bottom 30%",
      onToggle: (self) => {
        window.clearInterval(timer);
        if (self.isActive)
          timer = window.setInterval(() => {
            if (!userTook.current) setActive((a) => (a + 1) % 3);
          }, AUTO_MS);
      },
    });
    return () => {
      st.kill();
      window.clearInterval(timer);
    };
  }, []);

  const choose = (i: number) => {
    userTook.current = true;
    setActive(i);
  };

  // Entrada: se trazan las aristas, se abren las imágenes, aparece el centro
  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        const edges = el.querySelectorAll<SVGLineElement>(".tri__edge");
        edges.forEach((e) => {
          const len = e.getTotalLength();
          gsap.set(e, { strokeDasharray: len, strokeDashoffset: len });
        });
        const tl = gsap.timeline({ paused: true });
        tl.to(edges, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: 0.35 })
          .fromTo(".tri__disc", { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(50% at 50% 50%)", duration: 1.3, ease: "expo.out", stagger: 0.25, clearProps: "clipPath" }, 0.5)
          .fromTo(".tri__label", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.2 }, 1)
          .fromTo(".tri__spokes", { opacity: 0 }, { opacity: 1, duration: 1.2 }, 1.4)
          .fromTo(".tri__center", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" }, 1.5)
          .fromTo(".tri__detail", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, 1.7);
        ScrollTrigger.create({ trigger: el, start: "top 72%", once: true, onEnter: () => tl.play() });
        // Las fotos quedan fijas en sus vértices (sin parallax con el cursor): sólo el hilo
        // de los radios se mueve, y únicamente mientras el triángulo está en pantalla.
        ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top", toggleClass: "is-live" });
      });
    },
    root,
    [mobile],
  );

  return (
    <div ref={root} className={`tri ${mobile ? "tri--mobile" : ""}`} data-active={active}>
      <div className="tri__stage" style={{ aspectRatio: `${g.w} / ${g.h}` }}>
        <svg className="tri__svg" viewBox={`0 0 ${g.w} ${g.h}`} aria-hidden="true">
          <g className="tri__spokes">
            {g.v.map((p, i) => (
              <line key={i} className={`tri__spoke ${i === active ? "is-hot" : ""}`} x1={c.x} y1={c.y} x2={p.x} y2={p.y} />
            ))}
          </g>
          {EDGES.map(([a, b]) => (
            <line
              key={`${a}${b}`}
              className={`tri__edge ${a === active || b === active ? "is-hot" : ""}`}
              x1={g.v[a].x}
              y1={g.v[a].y}
              x2={g.v[b].x}
              y2={g.v[b].y}
            />
          ))}
        </svg>

        <div className="tri__center" style={pct(g, c)}>
          <Logo size={mobile ? 58 : 92} />
          <span className="tri__thread serif">
            <em>{worlds.thread}</em>
          </span>
        </div>

        {worlds.items.map((w, i) => (
          <button
            key={w.id}
            className={`tri__node tri__node--${i} ${i === active ? "is-active" : ""}`}
            style={pct(g, g.v[i])}
            aria-pressed={i === active}
            aria-controls="tri-detail"
            onPointerEnter={(e) => e.pointerType === "mouse" && choose(i)}
            onFocus={() => choose(i)}
            onClick={() => choose(i)}
            data-cursor={w.verb}
          >
            <span className="tri__disc">
              <Photo name={w.image} alt={w.alt} sizes={mobile ? "130px" : "280px"} />
            </span>
            <span className="tri__label">
              <span className="label tri__verb">
                0{i + 1} {w.verb}
              </span>
              <span className="tri__name display">{w.name}</span>
            </span>
          </button>
        ))}

      </div>
      <Detail item={item} />
    </div>
  );
}

function Detail({ item }: { item: (typeof worlds.items)[number] }) {
  return (
    <div id="tri-detail" className="tri__detail" aria-live="polite">
      <div className="tri__detail-inner" key={item.id}>
        <p className="tri__detail-text serif">{item.text}</p>
        <ul className="tri__keys">
          {item.keywords.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
        <Link className="tri__go" to={item.href}>
          <span>Conocer {item.name}</span>
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
