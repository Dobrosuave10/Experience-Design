import { founders } from "../content/site";
import { Figure } from "../components/MaterialPlate";
import { RevealText } from "../components/RevealText";
import "./Founders.css";

/** Quienes están detrás. Sin biografías inventadas: lo verificado y lo pendiente. */
export function Founders() {
  return (
    <section id="nosotros" className="founders section" data-tone="paper" aria-labelledby="founders-title">
      <div className="wrap">
        <RevealText id="founders-title" className="founders__statement display" lines={[founders.statement]} stagger={0.03} />

        <div className="founders__people">
          {founders.people.map((p, i) => (
            <article key={p.name} className={`founder founder--${i}`}>
              <Figure slot={p.image} ratio="4 / 5" />
              <div className="founder__text">
                <h3 className="founder__name display">{p.name}</h3>
                <p className="founder__field">{p.field}</p>
                <p className="founder__bio muted">{p.bio ?? founders.bioPending}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
