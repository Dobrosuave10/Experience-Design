import { ArrowUpRight } from "@phosphor-icons/react";
import { inscripcion, inscripcionHref } from "../content/site";
import "./EnrollButton.css";

type Props = { children?: React.ReactNode; className?: string };

/**
 * Botón principal de inscripción: terracota, grande y legible, ancho completo en móvil.
 * Abre el formulario de Google (o WhatsApp, si aún no hay link) en una pestaña nueva.
 */
export function EnrollButton({ children = inscripcion.label, className = "" }: Props) {
  return (
    <a className={`enroll ${className}`} href={inscripcionHref()} target="_blank" rel="noopener noreferrer">
      <span className="enroll__label">{children}</span>
      <ArrowUpRight className="enroll__icon" size={22} weight="regular" aria-hidden />
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  );
}
