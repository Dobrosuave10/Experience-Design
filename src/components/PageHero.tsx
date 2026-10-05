import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { onPageShown } from "../lib/events";
import { AtmosphereCanvas } from "./AtmosphereCanvas";
import { Link } from "./Link";
import { RevealText } from "./RevealText";
import "./PageHero.css";

type Crumb = { label: string; href?: string };

type Props = {
  id: string;
  title: string;
  lead: string;
  body?: string;
  crumbs: Crumb[];
  tone?: "ink" | "paper" | "sand" | "clay";
  /** Luz WebGL detrás del título (color de la luz). */
  glow?: string;
  aside?: ReactNode;
  className?: string;
};

/**
 * Apertura de las páginas de primer nivel (Nosotros, Programas, Destinos, Contacto):
 * la palabra enorme, una frase que la sostiene y la ruta para saber dónde estás.
 */
export function PageHero({ id, title, lead, body, crumbs, tone = "ink", glow, aside, className = "" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        gsap.set(".phero__fade", { opacity: 0, y: 18 });
        const off = onPageShown(() =>
          gsap.to(".phero__fade", { opacity: 1, y: 0, duration: 1.3, ease: "expo.out", stagger: 0.1, delay: 0.45 }),
        );
        gsap.to(".phero__title", {
          yPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        return () => off();
      });
    },
    ref,
  );

  return (
    <section ref={ref} className={`phero section ${className}`} data-tone={tone} aria-labelledby={`${id}-title`}>
      {glow && <AtmosphereCanvas color={glow} />}
      <div className="wrap phero__inner">
        <nav className="phero__crumbs label phero__fade" aria-label="Estás en">
          <ol>
            {crumbs.map((c, i) => (
              <li key={c.label}>
                {c.href ? <Link to={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                {i < crumbs.length - 1 && <span className="phero__sep" aria-hidden="true">/</span>}
              </li>
            ))}
          </ol>
        </nav>

        <RevealText as="h1" id={`${id}-title`} className="phero__title display" trigger="ready" lines={[title]} delay={0.1} />

        <div className="phero__foot">
          <p className="phero__lead serif phero__fade">
            <em>{lead}</em>
          </p>
          {body && <p className="phero__body muted phero__fade">{body}</p>}
          {aside && <div className="phero__aside phero__fade">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
