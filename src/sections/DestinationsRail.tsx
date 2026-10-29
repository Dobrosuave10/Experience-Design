import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { destinations } from "../content/site";
import { DESKTOP, MOTION_OK } from "../lib/env";
import { navigate } from "../lib/router";
import { MagneticButton } from "../components/MagneticButton";
import { Photo } from "../components/Photo";
import { Rail, RailItem } from "../components/Rail";

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

/**
 * Destinos: Milán y São Paulo, uno por pantalla. La sección se queda fija mientras
 * el collage de fotos reales de cada viaje se arma con el scroll; en móvil, dos columnas.
 */
export function DestinationsRail() {
  // Las fotos del collage se piden recién cuando la línea se acerca a la pantalla:
  // así no compiten con la carga inicial de la página.
  const probe = useRef<HTMLSpanElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = probe.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
            const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: "top 75%", end: "bottom bottom", scrub: 0.6 } });
            item.querySelectorAll<HTMLElement>(".collage__photo").forEach((ph, i) => {
              const d = Number(ph.dataset.d ?? 0);
              tl.fromTo(
                ph,
                { opacity: 0, y: i % 2 ? 90 : 160, x: i % 3 === 0 ? -30 : i % 3 === 1 ? 24 : 0, scale: 0.9 },
                { opacity: 1, y: 0, x: 0, scale: 1, ease: "power2.out", duration: 0.32 },
                d,
              ).fromTo(ph.querySelector(".collage__img"), { scale: 1.18 }, { scale: 1, ease: "power2.out", duration: 0.4 }, d);
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
        <RailItem key={d.id} className="rail__item--dest" labelledBy={`rail-${d.id}`}>
          <div className="rail__inner rail__dest">
            <div className="rail__text">
              <p className="rail__index label rail__reveal">
                <span className="rail__n">{d.n}</span>
                <span className="rail__eyebrow">{d.homeLabel}</span>
              </p>
              <h2 id={`rail-${d.id}`} className="rail__name display rail__reveal">
                {d.name}
              </h2>
              <p className="rail__fact rail__reveal">
                <span className="label muted">{destinations.doneLabel}</span>
                <span className="rail__fact-value">{d.done}</span>
              </p>
              <div className="rail__reveal">
                <MagneticButton href={d.href} onClick={() => navigate(d.href, { travel: d.name })}>
                  {destinations.more}
                  <span className="sr-only"> sobre {d.name}</span>
                </MagneticButton>
              </div>
            </div>
            <ul className="collage" aria-label={`Fotos de ${d.event}`}>
              {d.collage.map((ph, i) => {
                const s = LAYOUTS[d.id][i];
                const style = { "--x": s.x, "--y": s.y, "--w": s.w, "--h": s.h } as CSSProperties;
                return (
                  <li key={ph.image} className="collage__photo" style={style} data-d={s.d}>
                    <span className="collage__img">
                      {near && <Photo name={ph.image} alt={ph.alt} sizes={`(max-width: 767px) ${i % 3 === 0 ? 88 : 44}vw, ${Math.round(s.w * 0.6)}vw`} />}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </RailItem>
      ))}
    </Rail>
    </>
  );
}
