import type { InterestId } from "../content/site";
import { goToContact } from "../lib/events";
import { MagneticButton } from "./MagneticButton";
import { RevealText } from "./RevealText";
import "./Pending.css";

type Props = {
  title: string;
  body: string;
  items: string[];
  status: string;
  cta: string;
  interest: InterestId;
  tone?: "ink" | "paper" | "sand" | "clay";
};

/** Lo que aún no está definido, dicho con honestidad, y el CTA al formulario corto. */
export function Pending({ title, body, items, status, cta, interest, tone = "paper" }: Props) {
  return (
    <section className="pending section" data-tone={tone} aria-label={title}>
      <div className="wrap pending__grid">
        <RevealText className="pending__title display" lines={[title]} stagger={0.04} />
        <dl className="pending__facts">
          {items.map((it) => (
            <div key={it} className="pending__fact">
              <dt className="label">{it}</dt>
              <dd className="serif">
                <em>{status}</em>
              </dd>
            </div>
          ))}
        </dl>
        <div className="pending__cta">
          <p className="muted">{body}</p>
          <MagneticButton href="/contacto" onClick={() => goToContact(interest)}>
            {cta}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
