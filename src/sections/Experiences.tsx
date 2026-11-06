import { useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "@phosphor-icons/react";
import { experiencesPage as page, routes } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { navigate } from "../lib/router";
import { Link } from "../components/Link";
import { MagneticButton } from "../components/MagneticButton";
import { Photo } from "../components/Photo";
import { RevealText } from "../components/RevealText";
import "./Experiences.css";

/**
 * Programas · Experiencias. Los tres ejes en una línea, dos bloques editoriales con foto
 * horizontal grande (sin recortes) y el cierre hacia Destinos con las próximas experiencias.
 */
export function Experiences() {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".xp__reveal", el).forEach((r) => {
          gsap.from(r, { opacity: 0, y: 30, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: r, start: "top 85%", once: true } });
        });
      });
    },
    ref,
  );

  return (
    <section ref={ref} className="xp section" data-tone="paper" aria-labelledby="xp-axes">
      <div className="wrap">
        <div className="xp__axes xp__reveal">
          <p id="xp-axes" className="label xp__label">
            {page.axes.label}
          </p>
          <p className="xp__axes-text serif">{page.axes.text}</p>
        </div>

        {page.blocks.map((b, i) => (
          <article key={b.id} className={`xp__block ${i % 2 ? "xp__block--flip" : ""}`} aria-labelledby={`xp-${b.id}`}>
            <figure className="xp__photo xp__reveal">
              <Photo name={b.image} alt={b.alt} sizes="(max-width: 899px) 92vw, 60vw" />
            </figure>
            <div className="xp__text xp__reveal">
              <h2 id={`xp-${b.id}`} className="label xp__label">
                {b.label}
              </h2>
              {b.paragraphs.map((t) => (
                <p key={t} className="xp__p">
                  {t}
                </p>
              ))}
              <p className="xp__accent serif">
                <em>{b.accent}</em>
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="xp__cta" data-tone="ink">
        <div className="wrap xp__cta-grid">
          <div>
            <p className="label xp__label">{page.cta.label}</p>
            <RevealText as="h2" className="xp__cta-title display" lines={[page.cta.title]} />
          </div>
          <ul className="xp__next">
            {page.cta.items.map((n) => (
              <li key={n.place}>
                <Link to={n.href} className="xp__next-line">
                  <span className="xp__next-place serif">{n.place}</span>
                  <span className="xp__next-note">{n.note}</span>
                  <ArrowRight size={18} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <div className="xp__cta-btn">
            <MagneticButton href={routes.destinos} onClick={() => navigate(routes.destinos)}>
              {page.cta.button}
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
