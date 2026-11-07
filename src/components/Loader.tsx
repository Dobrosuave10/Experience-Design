import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "../lib/env";
import { markReady } from "../lib/events";
import { lockScroll } from "../lib/smoothScroll";
import { Logo } from "./Logo";
import "./Loader.css";

/**
 * Apertura (sólo al abrir o recargar el sitio), igual en todos los dispositivos: sobre
 * marfil, la "E." negra dentro de su círculo entra suave (CSS, 0,6 s) y la capa se
 * funde (~1,3 s en total). No usa WebGL. Con movimiento reducido, un fundido breve.
 * La capa queda encima (y toma los clics) hasta que termina; el Hero empieza a entrar
 * con el fundido. Capa aislada: sólo bloquea el scroll y avisa (markReady).
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const [enter] = useState(() => !prefersReducedMotion());

  useEffect(() => {
    const el = ref.current!;
    lockScroll(true);
    window.scrollTo(0, 0);

    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      lockScroll(false);
      markReady();
    };
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      release();
      setGone(true);
    };

    // La marca se ve desde el primer cuadro; la capa se funde cuando cargan las fuentes
    // (o a los 900 ms, lo que ocurra antes), nunca antes de 700 ms
    let fadeTween: gsap.core.Tween | null = null;
    const fade = () => {
      if (fadeTween) return;
      fadeTween = gsap.to(el, {
        opacity: 0,
        duration: enter ? 0.6 : 0.35,
        delay: enter ? 0 : 0.15,
        ease: "power2.inOut",
        onStart: release,
        onComplete: finish,
      });
    };
    const t0 = performance.now();
    let cap = window.setTimeout(fade, 900);
    document.fonts.ready.then(() => {
      window.clearTimeout(cap);
      cap = window.setTimeout(fade, Math.max(0, (enter ? 700 : 300) - (performance.now() - t0)));
    });
    return () => {
      window.clearTimeout(cap);
      fadeTween?.kill();
    };
  }, [enter]);

  if (gone) return null;

  return (
    <div ref={ref} className="opening" role="status" aria-live="polite">
      <span className="sr-only">Experience Design</span>
      <div className={`opening__mark ${enter ? "opening__mark--enter" : ""}`} aria-hidden="true">
        <Logo shape="ring" size="min(48vw, 260px)" decorative />
      </div>
    </div>
  );
}
