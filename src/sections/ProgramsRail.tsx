import { gsap } from "gsap";
import { programs } from "../content/site";
import { MOTION_OK } from "../lib/env";
import { navigate } from "../lib/router";
import { MagneticButton } from "../components/MagneticButton";
import { Photo } from "../components/Photo";
import { Rail, RailItem } from "../components/Rail";

/**
 * Programas: Formación y Marca personal sobre la línea, uno por pantalla.
 * Número, verbo, nombre, una frase y el botón al detalle.
 */
export function ProgramsRail() {
  return (
    <Rail
      label={programs.hint}
      tone="warm"
      setup={(mm, el) => {
        mm.add(MOTION_OK, () => {
          gsap.utils.toArray<HTMLElement>(".rail__item", el).forEach((item) => {
            gsap
              .timeline({ scrollTrigger: { trigger: item, start: "top 62%", once: true } })
              .fromTo(item.querySelector(".rail__photo"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out" })
              .fromTo(item.querySelector(".rail__photo img"), { scale: 1.14 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0)
              .fromTo(item.querySelectorAll(".rail__reveal"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, 0.2);
          });
        });
      }}
    >
      {programs.items.map((p) => (
        <RailItem key={p.id} labelledBy={`rail-${p.id}`}>
          <div className="rail__inner rail__program">
            <div className="rail__text">
              <p className="rail__index label rail__reveal">
                <span className="rail__n">{p.n}</span>
                <span className="rail__eyebrow">{p.verb}</span>
              </p>
              <h2 id={`rail-${p.id}`} className="rail__name display rail__reveal">
                {p.name}
              </h2>
              <p className="rail__short rail__reveal">{p.short}</p>
              <div className="rail__reveal">
                <MagneticButton href={p.href} onClick={() => navigate(p.href)}>
                  {programs.more}
                  <span className="sr-only"> sobre {p.name}</span>
                </MagneticButton>
              </div>
            </div>
            <figure className="rail__photo">
              <Photo name={p.railImage.image} alt={p.railImage.alt} sizes="(max-width: 767px) 88vw, 42vw" />
            </figure>
          </div>
        </RailItem>
      ))}
    </Rail>
  );
}
