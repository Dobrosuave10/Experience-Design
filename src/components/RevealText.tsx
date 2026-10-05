import { useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { onPageShown } from "../lib/events";

export type Line = string | { text: string; em?: boolean; className?: string };

type Props = {
  as?: ElementType;
  lines: Line[];
  className?: string;
  id?: string;
  /** "scroll": al entrar en viewport. "ready": cuando la página se muestra (loader o telón). */
  trigger?: "scroll" | "ready";
  delay?: number;
  stagger?: number;
};

const lineText = (l: Line) => (typeof l === "string" ? l : l.text);

/**
 * Titular que se revela palabra por palabra desde una máscara.
 * El texto completo queda en aria-label; las palabras partidas son aria-hidden.
 * Sin animación (reduced motion) el texto está visible desde el inicio.
 */
export function RevealText({ as: Tag = "h2", lines, className, id, trigger = "scroll", delay = 0, stagger = 0.05 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        const words = el.querySelectorAll(".rv-word");
        gsap.set(words, { yPercent: 115 });
        const play = () => gsap.to(words, { yPercent: 0, duration: 1.25, ease: "expo.out", stagger, delay });
        if (trigger === "ready") {
          const off = onPageShown(play);
          return () => off();
        }
        ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: play });
      });
    },
    ref,
  );

  return (
    <Tag ref={ref} id={id} className={className} aria-label={lines.map(lineText).join(" ")}>
      {lines.map((l, i) => {
        const text = lineText(l);
        const em = typeof l !== "string" && l.em;
        const cls = typeof l !== "string" && l.className ? ` ${l.className}` : "";
        const words = text.split(" ").map((w, j) => (
          <span key={j}>
            {j > 0 && " "}
            <span className="rv-word">{w}</span>
          </span>
        ));
        return (
          <span className={`rv-line${cls}`} aria-hidden="true" key={i}>
            {em ? <em>{words}</em> : words}
          </span>
        );
      })}
    </Tag>
  );
}
