import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { hasFinePointer, prefersReducedMotion } from "../lib/env";
import "./Cursor.css";

/**
 * Anillo que acompaña al cursor nativo (no lo reemplaza).
 * Crece sobre elementos interactivos y muestra una palabra si el elemento tiene data-cursor.
 * Sólo escritorio con puntero fino y sin reduced motion.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReducedMotion()) return;
    el.classList.add("is-on", "is-out");
    const label = el.querySelector<HTMLSpanElement>(".cursor__label")!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      el.classList.remove("is-out");
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, [role=tab], label");
      const text = t?.dataset.cursor ?? "";
      el.classList.toggle("is-hover", !!t);
      el.classList.toggle("has-label", !!text);
      label.textContent = text;
    };
    const leave = () => el.classList.add("is-out");
    const enter = () => el.classList.remove("is-out");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span className="cursor__ring" />
      <span className="cursor__label label" />
    </div>
  );
}
