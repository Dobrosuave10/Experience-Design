import { EnvelopeSimple, InstagramLogo, WhatsappLogo } from "@phosphor-icons/react";
import { brand, milan, milan2027 } from "../content/site";
import { EnrollButton } from "../components/EnrollButton";
import { RevealText } from "../components/RevealText";
import "./MilanDetails.css";

/**
 * Milán 2027 en detalle, con los datos de la ficha oficial: para quién, dónde ocurre,
 * qué incluye, si es para ti y cómo ser parte. Texto grande y de alto contraste.
 */

type Tone = "ink" | "paper" | "sand" | "warm" | "clay";

function Head({ id, label, title }: { id: string; label: string; title: string }) {
  return (
    <header className="md__head">
      <p className="label md__label">{label}</p>
      <RevealText id={id} as="h2" className="md__title display" lines={[title]} />
    </header>
  );
}

/** Lista numerada de nombre + texto, en columnas. */
function Items({ items, cols = 3 }: { items: { name: string; text: string }[]; cols?: 2 | 3 }) {
  return (
    <ol className={`md__items md__items--${cols}`}>
      {items.map((it, i) => (
        <li key={it.name} className="md__item">
          <span className="md__n serif" aria-hidden="true">
            <em>{String(i + 1).padStart(2, "0")}</em>
          </span>
          <h3 className="md__name">{it.name}</h3>
          <p className="md__text">{it.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function MilanAudience({ tone = "paper" }: { tone?: Tone }) {
  const a = milan2027.audience;
  return (
    <section className="md section" data-tone={tone} aria-labelledby="md-audience">
      <div className="wrap">
        <Head id="md-audience" label={a.label} title={a.title} />
        <Items items={a.items} />
      </div>
    </section>
  );
}

export function MilanPlaces({ tone = "sand" }: { tone?: Tone }) {
  const p = milan2027.places;
  return (
    <section className="md section" data-tone={tone} aria-labelledby="md-places">
      <div className="wrap">
        <Head id="md-places" label={p.label} title={p.title} />
        <Items items={p.items} />
      </div>
    </section>
  );
}

export function MilanIncludes({ tone = "warm" }: { tone?: Tone }) {
  const inc = milan2027.includes;
  return (
    <section className="md section" data-tone={tone} aria-labelledby="md-includes">
      <div className="wrap">
        <Head id="md-includes" label={inc.label} title={inc.title} />
        <p className="md__lead">{inc.body}</p>
        <Items items={inc.items} cols={2} />
        <div className="md__boxes">
          <div className="md__box md__box--accent">
            <p className="label">{inc.newLabel}</p>
            <p>{inc.newText}</p>
          </div>
          <div className="md__box">
            <p className="label">{inc.requirementLabel}</p>
            <p>{inc.requirement}</p>
          </div>
          <div className="md__box">
            <p className="label">{inc.excludesLabel}</p>
            <ul className="md__plain">
              {inc.excludes.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="muted md__small">{inc.excludesNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MilanFit({ tone = "ink" }: { tone?: Tone }) {
  const f = milan2027.fit;
  return (
    <section className="md section" data-tone={tone} aria-labelledby="md-fit">
      <div className="wrap">
        <Head id="md-fit" label={f.label} title={f.question} />
        <p className="md__lead">{f.lead}</p>
        <div className="md__fit">
          <div>
            <h3 className="label md__fit-label">{f.yesLabel}</h3>
            <ul className="md__checks">
              {f.yes.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="label md__fit-label">{f.noLabel}</h3>
            <ul className="md__checks md__checks--no">
              {f.no.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Un llamado a inscribirse, solo el botón: se repite tras los testimonios y al final. */
/** CTA final. São Paulo lo reutiliza con su propio texto y link (WhatsApp). */
export function MilanCta({ tone = "paper", label = milan.cta, href }: { tone?: Tone; label?: string; href?: string }) {
  return (
    <div className="md md--cta" data-tone={tone}>
      <div className="wrap md__cta">
        <EnrollButton href={href}>{label}</EnrollButton>
      </div>
    </div>
  );
}

export function MilanSteps({ tone = "paper" }: { tone?: Tone }) {
  const s = milan2027.steps;
  const wa = brand.whatsapp
    ? `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Hola, equipo de Experience Design. Quiero ser parte de Milán 2027.")}`
    : null;
  return (
    <section className="md section" data-tone={tone} aria-labelledby="md-steps">
      <div className="wrap">
        <Head id="md-steps" label={s.label} title={s.title} />
        <Items items={s.items} />
        <div className="md__close">
          <p className="md__closing serif">{s.closing}</p>
          <EnrollButton className="md__enroll">{milan.cta}</EnrollButton>
          <ul className="md__channels">
            {wa && (
              <li>
                <a className="md__channel" href={wa} target="_blank" rel="noopener noreferrer">
                  <WhatsappLogo size={22} weight="light" aria-hidden />
                  WhatsApp {brand.whatsappLabel}
                </a>
              </li>
            )}
            <li>
              <a className="md__channel" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">
                <InstagramLogo size={22} weight="light" aria-hidden />
                Instagram {brand.instagram.handle}
              </a>
            </li>
            {brand.email && (
              <li>
                <a className="md__channel" href={`mailto:${brand.email}?subject=${encodeURIComponent("Milán 2027")}`}>
                  <EnvelopeSimple size={22} weight="light" aria-hidden />
                  {brand.email}
                </a>
              </li>
            )}
          </ul>
          <p className="label md__motto">{s.motto}</p>
        </div>
      </div>
    </section>
  );
}
