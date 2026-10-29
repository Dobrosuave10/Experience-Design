import { useEffect, useId, useState, type FormEvent } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand, contact } from "../content/site";
import { MagneticButton } from "./MagneticButton";
import "./LeadForm.css";

type Status = "idle" | "sending" | "sent" | "error" | "unconfigured";
type Errors = Partial<Record<"name" | "email", string>>;

const ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT as string | undefined;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Tres campos para una consulta general: nombre, email y WhatsApp (opcional).
 * La elección de interés está pausada: el foco de Contacto es la inscripción a Milán 2027.
 */
export function LeadForm() {
  const uid = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  useEffect(() => {
    if (status !== "idle") ScrollTrigger.refresh();
  }, [status]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const whatsapp = String(data.get("whatsapp") ?? "").trim();
    const next: Errors = {};
    if (!name) next.name = "Escribe tu nombre.";
    if (!EMAIL_RE.test(email)) next.email = "Revisa el email.";
    setErrors(next);
    if (Object.keys(next).length) {
      // El foco va al primer campo con error (se busca por nombre: el marcado aria-invalid
      // todavía no está en el DOM en este momento)
      const firstKey = (["name", "email"] as const).find((k) => next[k]);
      e.currentTarget.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }
    if (!ENDPOINT) {
      setStatus("unconfigured");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, whatsapp, interest: "otro", source: brand.website }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="lead lead--done" role="status">
        <p className="lead__done-title display">Gracias. Ya estás en el camino.</p>
        <p className="muted">Te escribimos pronto con lo concreto.</p>
      </div>
    );
  }

  return (
    <form className="lead" onSubmit={submit} noValidate>
      <div className="lead__row">
        <div className="lead__field">
          <label htmlFor={`${uid}-name`} className="label">
            Nombre
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
          />
          {errors.name && (
            <p id={`${uid}-name-err`} className="lead__error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="lead__field">
          <label htmlFor={`${uid}-email`} className="label">
            Email
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
          />
          {errors.email && (
            <p id={`${uid}-email-err`} className="lead__error">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="lead__field">
        <label htmlFor={`${uid}-wa`} className="label">
          WhatsApp <span className="lead__optional">(opcional)</span>
        </label>
        <input id={`${uid}-wa`} name="whatsapp" type="tel" autoComplete="tel" inputMode="tel" />
      </div>

      <div className="lead__submit">
        <MagneticButton type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Enviando" : contact.submit}
        </MagneticButton>
        <div aria-live="polite" className="lead__status">
          {status === "error" && <p className="lead__error">No pudimos enviarlo. Inténtalo otra vez o escríbenos por Instagram.</p>}
          {status === "unconfigured" && (
            <p className="lead__note">
              El envío del formulario todavía no está conectado. Mientras tanto, escríbenos a{" "}
              <a href={brand.instagram.url} target="_blank" rel="noopener noreferrer">
                {brand.instagram.handle}
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
