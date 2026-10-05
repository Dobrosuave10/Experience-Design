import { useRef } from "react";
import { gsap } from "gsap";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import "./WordList.css";

type Group = { label: string; items: readonly string[] };

type Props = {
  id: string;
  groups: Group[];
  /** "index": lista editorial numerada. "cloud": palabras grandes en texto corrido. "grid": retícula con líneas. */
  variant: "index" | "cloud" | "grid";
  tone?: "paper" | "sand" | "ink" | "clay";
  intro?: string;
};

/** Listas de palabras (a quién va, qué se vive) dichas como tipografía, no como viñetas. */
export function WordList({ id, groups, variant, tone = "paper", intro }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".wl__items", el).forEach((list) => {
          gsap.fromTo(
            list.children,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: list, start: "top 82%", once: true } },
          );
        });
      });
    },
    ref,
  );

  return (
    <section ref={ref} className={`wl wl--${variant} section`} data-tone={tone} aria-labelledby={`${id}-0`}>
      <div className="wrap wl__inner">
        {intro && <p className="wl__intro serif">{intro}</p>}
        {groups.map((g, gi) => (
          <div key={g.label} className="wl__group">
            <h2 id={`${id}-${gi}`} className="wl__label label">
              {g.label}
            </h2>
            <ul className="wl__items">
              {g.items.map((it, i) => (
                <li key={it} className="wl__item">
                  {variant === "index" && <span className="wl__n label">{String(i + 1).padStart(2, "0")}</span>}
                  <span className="wl__word">{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
