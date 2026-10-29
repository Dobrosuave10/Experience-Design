import { useRef } from "react";
import { gsap } from "gsap";
import { milan } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { RevealText } from "../components/RevealText";
import "./Itinerary.css";

/** Milán 2027, día por día. El encabezado queda fijo mientras pasan los días. */
export function Itinerary() {
  const ref = useRef<HTMLElement>(null);
  const it = milan.itinerary;

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".itin__day", el).forEach((d) => {
          gsap.fromTo(d, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: d, start: "top 88%", once: true } });
        });
      });
    },
    ref,
  );

  return (
    <section ref={ref} id="itinerario" className="itin section" data-tone="warm" aria-labelledby="itin-title">
      <div className="wrap itin__grid">
        <header className="itin__head">
          <p className="label itin__label">{it.label}</p>
          <RevealText id="itin-title" as="h2" className="itin__title display" lines={[it.title]} />
          <p className="itin__body muted">{it.body}</p>
        </header>
        <ol className="itin__days">
          {it.days.map((d) => (
            <li key={d.day} className="itin__day">
              <p className="itin__when">
                <span className="label itin__n">{d.day}</span>
                <span className="itin__date serif">
                  <em>{d.date}</em>
                </span>
              </p>
              <div className="itin__what">
                <h3 className="itin__name">{d.title}</h3>
                <p className="itin__text">{d.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
