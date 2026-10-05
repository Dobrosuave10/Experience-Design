import { InstagramLogo, EnvelopeSimple, WhatsappLogo } from "@phosphor-icons/react";
import { brand, contact } from "../content/site";
import { goToContact } from "../lib/events";
import { LeadForm } from "../components/LeadForm";
import { RevealText } from "../components/RevealText";
import "./Contact.css";

/** Contacto. Una invitación, no un formulario de contacto genérico: cuatro campos. */
export function Contact() {
  return (
    <section id="contacto" className="contact section" data-tone="ink" aria-labelledby="contact-title">
      <div className="wrap contact__grid">
        <div className="contact__intro">
          <RevealText as="h1" id="contact-title" className="contact__title display" trigger="ready" lines={[contact.title]} />
          <p className="contact__body muted">{contact.body}</p>

          <ul className="contact__channels">
            <li>
              <a href={brand.instagram.url} target="_blank" rel="noopener noreferrer" className="contact__channel">
                <InstagramLogo size={20} weight="light" aria-hidden />
                {brand.instagram.handle}
              </a>
            </li>
            {brand.email && (
              <li>
                <a href={`mailto:${brand.email}`} className="contact__channel">
                  <EnvelopeSimple size={20} weight="light" aria-hidden />
                  {brand.email}
                </a>
              </li>
            )}
            {brand.whatsapp && (
              <li>
                <a href={`https://wa.me/${brand.whatsapp}`} target="_blank" rel="noopener noreferrer" className="contact__channel">
                  <WhatsappLogo size={20} weight="light" aria-hidden />
                  WhatsApp
                </a>
              </li>
            )}
          </ul>

          <p className="contact__b2b">
            {contact.b2b}{" "}
            <button className="contact__b2b-link" onClick={() => goToContact("colaboraciones")}>
              {contact.b2bCta}
            </button>
          </p>
        </div>

        <div className="contact__form">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
