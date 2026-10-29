import { useRef } from "react";
import { gsap } from "gsap";
import type { ImageSlot } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { Figure } from "./MaterialPlate";
import { RevealText } from "./RevealText";
import "./Rooms.css";

type Room = Omit<ImageSlot, "brief"> & { n: string; title: string; text: string };

type IntroProps = {
  statementA: string;
  statementB: string;
  children?: React.ReactNode;
  tone: string;
};

/** La idea del destino: una frase grande y, si hace falta, una línea al lado. */
export function DestinationIntro({ statementA, statementB, children, tone }: IntroProps) {
  return (
    <div className="dest-intro" data-tone={tone}>
      <div className="wrap dest-intro__grid">
        <RevealText className="dest-intro__statement display" lines={[statementA, { text: statementB, em: true, className: "accent" }]} />
        {children && <div className="dest-intro__text">{children}</div>}
      </div>
    </div>
  );
}

/**
 * Las paradas de un destino, en vertical: número en cursiva terracota, foto real
 * que se abre desde el centro y el texto al costado. Alternan de lado.
 * La usan Milán y São Paulo.
 */
export function Rooms({ rooms, tone, label }: { rooms: Room[]; tone: string; label: string }) {
  const ref = useRef<HTMLOListElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".room", el).forEach((r) => {
          gsap
            .timeline({ scrollTrigger: { trigger: r, start: "top 85%", end: "top 30%", scrub: 0.8 } })
            .fromTo(r.querySelector(".room__frame"), { clipPath: "inset(0% 42% 0% 42%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out" })
            .fromTo(r.querySelector(".room__n"), { opacity: 0, x: -30 }, { opacity: 1, x: 0, ease: "power2.out" }, 0.2);
        });
      });
    },
    ref as React.RefObject<HTMLElement | null>,
  );

  return (
    <ol ref={ref} className="rooms" data-tone={tone} aria-label={label}>
      {rooms.map((r, i) => (
        <li key={r.n} className={`room ${i % 2 ? "room--right" : ""}`}>
          <span className="room__n" aria-hidden="true">
            {r.n}
          </span>
          <Figure slot={{ image: r.image, alt: r.alt, material: r.material, brief: r.title }} className="room__frame" ratio="16 / 10" sizes="(max-width: 767px) 92vw, 60vw" />
          <div className="room__text">
            <h2 className="room__title">{r.title}</h2>
            <p className="muted">{r.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
