import { milan2027 } from "../content/site";
import "./Testimonials.css";

type Props = { tone?: "ink" | "paper" | "sand" | "warm" };

/** Tres personas que ya viajaron, con sus palabras textuales. Cita con filete terracota. */
export function Testimonials({ tone = "warm" }: Props) {
  const t = milan2027.testimonials;
  return (
    <section className="quotes section" data-tone={tone} aria-labelledby="quotes-title">
      <div className="wrap">
        <h2 id="quotes-title" className="label quotes__label">
          {t.label}
        </h2>
        <ul className="quotes__list">
          {t.items.map((q) => (
            <li key={q.name}>
              <figure className="quotes__item">
                <blockquote className="quotes__quote serif">
                  <p>«{q.quote}»</p>
                </blockquote>
                <figcaption className="quotes__who">
                  <span className="quotes__name">{q.name}</span>
                  <span className="quotes__role muted">{q.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
