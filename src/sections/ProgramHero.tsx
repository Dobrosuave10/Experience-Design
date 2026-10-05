import { useRef } from "react";
import { gsap } from "gsap";
import { programs, routes, type Program } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { onPageShown } from "../lib/events";
import { AtmosphereCanvas } from "../components/AtmosphereCanvas";
import { Figure } from "../components/MaterialPlate";
import { Link } from "../components/Link";
import "./ProgramHero.css";

/**
 * Apertura de cada programa. Misma estructura, otra atmósfera:
 * Marca personal en arco y cursiva, Estudiantes en mayúsculas y horizontal,
 * Profesionales en retícula y material.
 */
export function ProgramHero({ program: p }: { program: Program }) {
  const ref = useRef<HTMLElement>(null);
  const others = programs.items.filter((o) => o.id !== p.id);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        gsap.set([".ph__name-in", ".ph__line-row"], { yPercent: 110 });
        gsap.set(".ph__fade", { opacity: 0, y: 16 });
        gsap.set(".ph__frame", { clipPath: p.id === "estudiantes" ? "inset(0 100% 0 0)" : p.id === "profesionales" ? "inset(50% 50% 50% 50%)" : "inset(100% 0 0 0)" });
        const off = onPageShown(() => {
          gsap
            .timeline({ delay: 0.15 })
            .to(".ph__frame", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" })
            .fromTo(".ph__frame img", { scale: 1.2 }, { scale: 1, duration: 2, ease: "expo.out" }, 0.2)
            .to(".ph__name-in", { yPercent: 0, duration: 1.3, ease: "expo.out" }, 0.4)
            .to(".ph__line-row", { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.08 }, 0.6)
            .to(".ph__fade", { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, 0.9);
        });
        gsap.to(".ph__frame-wrap", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        return () => off();
      });
    },
    ref,
  );

  return (
    <section ref={ref} className={`ph ph--${p.id} section`} data-tone={p.tone} aria-labelledby="ph-title">
      <AtmosphereCanvas color={p.glow} />
      <div className="wrap ph__grid">
        <nav className="ph__crumbs label ph__fade" aria-label="Estás en">
          <Link to={routes.programas}>Programas</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">
            {p.n} {p.name}
          </span>
        </nav>

        <div className="ph__frame-wrap">
          <Figure slot={p.image} className="ph__frame" ratio={p.id === "estudiantes" ? "16 / 9" : p.id === "profesionales" ? "1 / 1" : "3 / 4"} sizes="(max-width: 899px) 90vw, 45vw" />
          {p.detail && <Figure slot={p.detail} className="ph__detail ph__fade" ratio="4 / 5" sizes="220px" />}
        </div>

        <div className="ph__text">
          <p className="label ph__n ph__fade">Programa {p.n}</p>
          <h1 id="ph-title" className="ph__name">
            <span className="ph__mask">
              <span className="ph__name-in">{p.name}</span>
            </span>
          </h1>
          <p className="ph__line serif">
            {p.lines.map((l, j) => (
              <span key={j} className="ph__mask">
                <span className="ph__line-row">{j === p.lines.length - 1 ? <em>{l}</em> : l}</span>
              </span>
            ))}
          </p>
          <p className="ph__intro ph__fade">{p.intro}</p>
        </div>

        <ul className="ph__others ph__fade" aria-label="Otros programas">
          {others.map((o) => (
            <li key={o.id}>
              <Link to={o.href}>
                <span className="label">{o.n}</span> {o.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
