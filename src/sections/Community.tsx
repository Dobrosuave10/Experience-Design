import { useRef } from "react";
import { gsap } from "gsap";
import { community } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { Photo } from "../components/Photo";
import { RevealText } from "../components/RevealText";
import "./Community.css";

/**
 * 06 Conectar. La única franja en movimiento del sitio (disciplinas que se cruzan)
 * y una escena real: una conversación en un showroom. La foto se abre desde una
 * ranura horizontal hasta ocupar el ancho, como cuando uno entra a la sala.
 */
export function Community() {
  const ref = useRef<HTMLElement>(null);
  const loop = [...community.disciplines, ...community.disciplines];

  useGsap(
    (mm) => {
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".community__scene", start: "top 85%", end: "center 55%", scrub: 0.8 } })
          .fromTo(".community__frame", { clipPath: "inset(38% 18% 38% 18%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out" })
          .fromTo(".community__frame img", { scale: 1.25 }, { scale: 1, ease: "power2.out" }, 0);
        gsap.fromTo(
          ".community__body",
          { y: 60 },
          { y: -30, ease: "none", scrollTrigger: { trigger: ".community__scene", start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    ref,
  );

  return (
    <section ref={ref} className="community section" data-tone="sand" aria-labelledby="community-title">
      <div className="wrap">
        <RevealText id="community-title" className="community__title display" lines={[community.title]} />
      </div>

      <div className="community__marquee" aria-hidden="true">
        <div className="community__marquee-track serif">
          {loop.map((d, i) => (
            <span key={i} className="community__disc">
              <em>{d}</em>
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">Personas de {community.disciplines.join(", ")}.</p>

      <div className="community__scene wrap">
        <figure className="community__frame">
          {community.image.image && <Photo name={community.image.image} alt={community.image.alt} sizes="(max-width: 767px) 180vw, 86vw" />}
        </figure>
        <p className="community__body serif">{community.body}</p>
      </div>
    </section>
  );
}
