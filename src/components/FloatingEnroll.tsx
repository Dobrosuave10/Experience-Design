import { useEffect, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { inscripcionHref } from "../content/site";
import "./FloatingEnroll.css";

type Props = {
  label: string;
  /** Aparece una vez que este elemento (el hero) sale de la pantalla. */
  after: string;
  /** Se oculta mientras este elemento (el CTA final) está en pantalla. */
  hideOn: string;
};

/**
 * Botón fijo abajo a la derecha: una píldora terracota que lleva al formulario de
 * inscripción (pestaña nueva). Aparece después del hero, late una sola vez al
 * mostrarse y se retira mientras el llamado final está a la vista.
 */
export function FloatingEnroll({ label, after, hideOn }: Props) {
  const [past, setPast] = useState(false);
  const [final, setFinal] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(after);
    const end = document.querySelector(hideOn);
    const ios: IntersectionObserver[] = [];
    if (hero) {
      const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting && e.boundingClientRect.top < 0));
      io.observe(hero);
      ios.push(io);
    }
    if (end) {
      const io = new IntersectionObserver(([e]) => setFinal(e.isIntersecting));
      io.observe(end);
      ios.push(io);
    }
    return () => ios.forEach((io) => io.disconnect());
  }, [after, hideOn]);

  const visible = past && !final;
  return (
    <a
      className={`fenroll ${visible ? "is-visible" : ""}`}
      href={inscripcionHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span>{label}</span>
      <ArrowUpRight size={16} weight="regular" aria-hidden />
      <span className="sr-only"> (formulario de inscripción, se abre en una pestaña nueva)</span>
    </a>
  );
}
