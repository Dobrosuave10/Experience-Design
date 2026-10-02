import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ArrowRight } from "@phosphor-icons/react";
import { hasFinePointer, prefersReducedMotion } from "../lib/env";
import "./MagneticButton.css";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "solid" | "line";
  icon?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
};

/**
 * CTA con leve atracción magnética hacia el cursor (sólo puntero fino, sin reduced motion).
 * Sistema de formas: los controles interactivos son pill; imágenes y paneles, rectos.
 */
export function MagneticButton({ children, onClick, href, variant = "solid", icon = true, className = "", type = "button", disabled, external }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    const inner = el.querySelector<HTMLElement>(".mbtn__inner");
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const ixTo = inner ? gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3.out" }) : null;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * 0.22);
      yTo(dy * 0.3);
      ixTo?.(dx * 0.08);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
      ixTo?.(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const content = (
    <span className="mbtn__inner">
      <span className="mbtn__label">{children}</span>
      {icon && <ArrowRight className="mbtn__icon" size={16} weight="regular" aria-hidden />}
    </span>
  );
  const cls = `mbtn mbtn--${variant} ${className}`;

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={cls}
        href={href}
        onClick={
          onClick
            ? (e) => {
                e.preventDefault();
                onClick();
              }
            : undefined
        }
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} className={cls} type={type} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}
