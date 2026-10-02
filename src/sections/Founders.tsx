import { useRef } from "react";
import { gsap } from "gsap";
import { founders } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { DESKTOP, MOTION_OK } from "../lib/env";
import { Photo } from "../components/Photo";
import { RevealText } from "../components/RevealText";
import "./Founders.css";

/**
 * Quienes están detrás. Retratos editoriales, no tarjetas de equipo:
 * Danae aparece primero, Christian entra con el scroll y se cruza con ella.
 * Sin biografías inventadas: lo verificado y lo pendiente.
 */
export function Founders() {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm) => {
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".founder__frame").forEach((f) => {
          gsap
            .timeline({ scrollTrigger: { trigger: f, start: "top 85%", end: "top 35%", scrub: 0.8 } })
            .fromTo(f, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out" })
            .fromTo(f.querySelector("img"), { scale: 1.2 }, { scale: 1, ease: "power2.out" }, 0);
        });
      });
      // Christian se desplaza a otra velocidad: las dos imágenes se cruzan
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        gsap.fromTo(
          ".founder--1",
          { yPercent: 10 },
          { yPercent: -14, ease: "none", scrollTrigger: { trigger: ".founders__people", start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    ref,
  );

  return (
    <section ref={ref} id="nosotros" className="founders section" data-tone="paper" aria-labelledby="founders-title">
      <div className="wrap">
        <RevealText id="founders-title" className="founders__statement display" lines={[founders.statement]} stagger={0.03} />

        <div className="founders__people">
          {founders.people.map((p, i) => (
            <article key={p.name} className={`founder founder--${i}`}>
              <figure className="founder__frame">
                {p.image.image && <Photo name={p.image.image} alt={p.image.alt} sizes="(max-width: 767px) 90vw, 42vw" />}
              </figure>
              <div className="founder__text">
                <RevealText as="h3" className="founder__name display" lines={p.name.split(" ")} stagger={0.08} />
                <p className="founder__field">{p.field}</p>
                <p className="founder__bio muted">{p.bio ?? founders.bioPending}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
