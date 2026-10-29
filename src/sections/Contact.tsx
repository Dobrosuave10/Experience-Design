import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { InstagramLogo, EnvelopeSimple, WhatsappLogo, Plus } from "@phosphor-icons/react";
import { brand, contact, enroll } from "../content/site";
import { EnrollButton } from "../components/EnrollButton";
import { LeadForm } from "../components/LeadForm";
import { RevealText } from "../components/RevealText";
import "./Contact.css";

/**
 * Contacto: el foco es la inscripción a Milán 2027 por el formulario de Google.
 * Debajo, los canales directos y, plegada, una consulta general.
 */
export function Contact() {
  const [other, setOther] = useState(false);

  // La consulta plegada cambia la altura de la página: recalcular los triggers
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [other]);

  const wa = brand.whatsapp
    ? `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Hola, equipo de Experience Design. Me gustaría conocer más información.")}`
    : null;

  return (
    <section id="contacto" className="contact section" data-tone="paper" aria-labelledby="contact-title">
      <div className="wrap contact__main">
        <p className="label contact__label">{enroll.label}</p>
        <RevealText
          as="h1"
          id="contact-title"
          className="contact__title display"
          trigger="ready"
          lines={[enroll.title[0], { text: enroll.title[1], em: true, className: "accent" }]}
        />
        <p className="contact__body">{enroll.body}</p>

        <EnrollButton className="contact__enroll" />

        <ol className="contact__steps" aria-label={enroll.stepsLabel}>
          {enroll.steps.map((s, i) => (
            <li key={s} className="contact__step">
              <span className="contact__step-n serif" aria-hidden="true">
                <em>{String(i + 1).padStart(2, "0")}</em>
              </span>
              {s}
            </li>
          ))}
        </ol>

        <div className="contact__channels-wrap">
          <p className="label contact__channels-label">{enroll.channelsLabel}</p>
          <ul className="contact__channels">
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="contact__channel">
                  <WhatsappLogo size={24} weight="light" aria-hidden />
                  WhatsApp {brand.whatsappLabel}
                </a>
              </li>
            )}
            {brand.email && (
              <li>
                <a href={`mailto:${brand.email}`} className="contact__channel">
                  <EnvelopeSimple size={24} weight="light" aria-hidden />
                  {brand.email}
                </a>
              </li>
            )}
            <li>
              <a href={brand.instagram.url} target="_blank" rel="noopener noreferrer" className="contact__channel">
                <InstagramLogo size={24} weight="light" aria-hidden />
                Instagram {brand.instagram.handle}
              </a>
            </li>
          </ul>
        </div>

        <div className={`contact__other ${other ? "is-open" : ""}`}>
          <button className="contact__other-toggle" aria-expanded={other} aria-controls="contact-other" onClick={() => setOther(!other)}>
            {enroll.otherLabel}
            <Plus size={20} weight="light" aria-hidden className="contact__other-icon" />
          </button>
          {other && (
            <div id="contact-other" className="contact__other-panel">
              <p className="contact__b2b">{contact.b2b}</p>
              <LeadForm />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
