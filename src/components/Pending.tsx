import type { InterestId } from "../content/site";
import { goToContact } from "../lib/events";
import { navigate } from "../lib/router";
import { MagneticButton } from "./MagneticButton";
import { RevealText } from "./RevealText";
import "./Pending.css";

/** Un dato pendiente (sólo la etiqueta, con `status`) o ya confirmado (etiqueta y valor). */
type Item = string | { label: string; value: string };

type Props = {
  title: string;
  body: string;
  items: Item[];
  status?: string;
  cta: string;
  interest: InterestId;
  /** Si está, el CTA lleva a esta página en vez del formulario de contacto. */
  href?: string;
  tone?: "ink" | "paper" | "sand" | "clay";
};

/** Lo concreto (o lo que aún no está definido, dicho con honestidad) y el CTA. */
export function Pending({ title, body, items, status = "", cta, interest, href, tone = "paper" }: Props) {
  return (
    <section className="pending section" data-tone={tone} aria-label={title}>
      <div className="wrap pending__grid">
        <RevealText className="pending__title display" lines={[title]} stagger={0.04} />
        <dl className="pending__facts">
          {items.map((it) => {
            const { label, value } = typeof it === "string" ? { label: it, value: status } : it;
            return (
              <div key={label} className="pending__fact">
                <dt className="label">{label}</dt>
                <dd className="serif">
                  <em>{value}</em>
                </dd>
              </div>
            );
          })}
        </dl>
        <div className="pending__cta">
          <p className="muted">{body}</p>
          <MagneticButton href={href ?? "/contacto"} onClick={() => (href ? navigate(href) : goToContact(interest))}>
            {cta}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
