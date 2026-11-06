import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { destinations } from "../content/site";
import { DESKTOP, MOTION_OK } from "../lib/env";
import { navigate } from "../lib/router";
import { MagneticButton } from "../components/MagneticButton";
import { Photo } from "../components/Photo";
import { Rail, RailItem } from "../components/Rail";
import { InViewVideo } from "../components/InViewVideo";
import { CompassRose, FlagMark, TravelMap, type MapPoint, type TravelMapHandle } from "../components/TravelMap";
import "./DestinationsMap.css";

/**
 * Posición de cada foto del collage (x, y, ancho, alto en % del área; `d` = desfase de entrada).
 * Pensadas según la orientación de cada foto en `destinations.items[].collage`.
 */
type Slot = { x: number; y: number; w: number; h: number; d: number };
const LAYOUTS: Record<string, Slot[]> = {
  milan: [
    { x: 0, y: 2, w: 44, h: 30, d: 0 },
    { x: 47, y: 0, w: 30, h: 22, d: 0.18 },
    { x: 80, y: 4, w: 20, h: 38, d: 0.08 },
    { x: 0, y: 36, w: 22, h: 42, d: 0.34 },
    { x: 25, y: 29, w: 36, h: 28, d: 0.24 },
    { x: 64, y: 27, w: 18, h: 36, d: 0.46 },
    { x: 24, y: 61, w: 32, h: 25, d: 0.56 },
    { x: 59, y: 67, w: 29, h: 22, d: 0.66 },
    { x: 85, y: 47, w: 15, h: 29, d: 0.6 },
  ],
  "sao-paulo": [
    { x: 0, y: 4, w: 24, h: 44, d: 0 },
    { x: 27, y: 0, w: 20, h: 34, d: 0.16 },
    { x: 50, y: 8, w: 22, h: 40, d: 0.08 },
    { x: 74, y: 0, w: 26, h: 22, d: 0.3 },
    { x: 76, y: 26, w: 20, h: 36, d: 0.42 },
    { x: 6, y: 53, w: 18, h: 30, d: 0.5 },
    { x: 28, y: 31, w: 22, h: 42, d: 0.24 },
    { x: 53, y: 52, w: 22, h: 40, d: 0.62 },
  ],
};

/** Recorrido punteado de cada collage (en % del área): pasa por los huecos entre las fotos. */
const ROUTES: Record<string, MapPoint[]> = {
  milan: [[-6, 96], [12, 88], [23.5, 62], [30, 34], [46, 25], [63, 24.5], [78, 30], [83, 44], [78, 66], [90, 84], [104, 92]],
  "sao-paulo": [[-6, 94], [16, 88], [26, 58], [37, 76], [51, 50], [74, 46], [86, 66], [98, 82], [106, 90]],
};
/** Giro de cada polaroid, entre -4° y 4°: fijo, para que el collage no cambie entre visitas. */
const TILT = [-3, 2.5, -1.5, 3.5, -2.5, 1.5, -3.5, 2, -1];
const FLAG: Record<string, "it" | "br"> = { milan: "it", "sao-paulo": "br" };

/**
 * Destinos: Milán y São Paulo, uno por pantalla. La sección se queda fija mientras
 * el collage de polaroids (fotos y videos reales de cada viaje) se arma con el scroll y una
 * ruta punteada, con su avión, se dibuja entre ellas como en un mapa de viaje.
 * En móvil, dos columnas de polaroids.
 */
export function DestinationsRail() {
  // Las fotos del collage se piden recién cuando la línea se acerca a la pantalla:
  // así no compiten con la carga inicial de la página.
  const probe = useRef<HTMLSpanElement>(null);
  const [near, setNear] = useState(false);
  // Se mira la posición en cada scroll (no un IntersectionObserver): la sonda no tiene alto y
  // un scroll rápido la saltaba en un solo cuadro sin "cruzarla" (pasaba al volver con Atrás).
  useEffect(() => {
    const el = probe.current;
    if (!el) return;
    const check = () => {
      if (el.getBoundingClientRect().top > window.innerHeight) return;
      setNear(true);
      off();
    };
    const off = () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    check();
    return off;
  }, []);
  const maps = useRef<Record<string, TravelMapHandle | null>>({});
  // Sin movimiento (o en móvil, donde no hay ruta) el mapa queda completo
  const [reduced] = useState(() => typeof window !== "undefined" && !window.matchMedia(`${MOTION_OK} and ${DESKTOP}`).matches);

  return (
    <>
    <span ref={probe} aria-hidden="true" />
    <Rail
      label={destinations.title}
      tone="paper"
      className="rail--dest"
      setup={(mm, el) => {
        mm.add(MOTION_OK, () => {
          gsap.utils.toArray<HTMLElement>(".rail__item", el).forEach((item) => {
            gsap.fromTo(
              item.querySelectorAll(".rail__reveal"),
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: item, start: "top 60%", once: true } },
            );
          });
        });

        // Escritorio: el collage se arma mientras la pantalla queda fija
        mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
          gsap.utils.toArray<HTMLElement>(".rail__item", el).forEach((item) => {
            const id = item.dataset.dest ?? "";
            const compass = item.querySelector<HTMLElement>(".dmap__compass");
            const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top 75%", end: "bottom bottom", scrub: 0.6 } });
            // La ruta y el avión avanzan con la lectura; la rosa de los vientos gira apenas
            ScrollTrigger.create({
              trigger: item,
              start: "top 60%",
              end: "bottom bottom",
              scrub: true,
              onUpdate: (self) => {
                maps.current[id]?.setProgress(self.progress);
                if (compass) compass.style.transform = `rotate(${self.progress * 50 - 10}deg)`;
              },
            });
            item.querySelectorAll<HTMLElement>(".collage__photo").forEach((ph, i) => {
              const d = Number(ph.dataset.d ?? 0);
              tl.fromTo(
                ph,
                { opacity: 0, y: i % 2 ? 90 : 160, x: i % 3 === 0 ? -30 : i % 3 === 1 ? 24 : 0, scale: 0.9 },
                { opacity: 1, y: 0, x: 0, scale: 1, ease: "power2.out", duration: 0.32 },
                d,
              );
            });
          });
        });

        // Móvil: cada foto aparece al entrar
        mm.add(`${MOTION_OK} and (max-width: 767px)`, () => {
          gsap.utils.toArray<HTMLElement>(".collage__photo", el).forEach((ph) => {
            gsap.fromTo(ph, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: ph, start: "top 92%", once: true } });
          });
        });
      }}
    >
      {destinations.items.map((d) => (
        <RailItem key={d.id} className="rail__item--dest" labelledBy={`rail-${d.id}`} data={{ dest: d.id }}>
          <div className="rail__inner rail__dest">
            <div className="rail__text">
              <p className="rail__index label rail__reveal">
                <span className="rail__n">{d.n}</span>
                <FlagMark country={FLAG[d.id]} />
              </p>
              <h2 id={`rail-${d.id}`} className="rail__name display rail__reveal">
                {d.city}
              </h2>
              <p className="rail__sub serif rail__reveal">{d.railSub}</p>
              <div className="rail__reveal">
                <MagneticButton href={d.href} onClick={() => navigate(d.href, { travel: d.href })}>
                  {destinations.more}
                  <span className="sr-only"> sobre {d.name}</span>
                </MagneticButton>
              </div>
            </div>
            <div className="collage-wrap dmap">
              <TravelMap ref={(h) => void (maps.current[d.id] = h)} points={ROUTES[d.id]} drawn={reduced} />
              {d.id === "milan" && (
                <span className="dmap__compass">
                  <CompassRose />
                </span>
              )}
              <ul className="collage" aria-label={`Fotos y videos de ${d.event}`}>
                {d.collage.map((ph, i) => {
                  const s = LAYOUTS[d.id][i];
                  const style = { "--x": s.x, "--y": s.y, "--w": s.w, "--h": s.h, "--r": `${TILT[i % TILT.length]}deg` } as CSSProperties;
                  return (
                    <li key={ph.image ?? ph.video?.src} className={`collage__photo polaroid ${ph.video ? "polaroid--video" : ""}`} style={style} data-d={s.d}>
                      <figure className="polaroid__frame">
                        <span className="collage__img polaroid__img">
                          {ph.video ? (
                            <InViewVideo src={ph.video.src} poster={ph.video.poster} label={ph.alt} />
                          ) : (
                            near && ph.image && <Photo name={ph.image} alt={ph.alt} sizes={`(max-width: 767px) ${i % 3 === 0 ? 88 : 44}vw, ${Math.round(s.w * 0.6)}vw`} />
                          )}
                        </span>
                        {ph.caption && <figcaption className="polaroid__caption">{ph.caption}</figcaption>}
                      </figure>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </RailItem>
      ))}
    </Rail>
    </>
  );
}
