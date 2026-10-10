import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { isSmallScreen, prefersReducedMotion, webglAvailable } from "../lib/env";
import { getSealTarget, markReady } from "../lib/events";
import { lockScroll } from "../lib/smoothScroll";
import { Logo } from "./Logo";
import type { OpeningScene } from "../three/OpeningScene";
import "./Loader.css";

/** Si la escena no está lista en este tiempo, la apertura usa el sello estático. */
const SCENE_TIMEOUT = 2200;

/**
 * Apertura (sólo al abrir o recargar el sitio). En la penumbra, fragmentos de bronce
 * y terracota se encajan y forman el sello cuadrado; las juntas se cierran, una luz
 * rasante recorre la placa y el sello viaja hasta su lugar en el Hero mientras la
 * penumbra se disuelve. Es el mismo objeto (src/three/seal.ts) que queda en el Hero.
 * Con movimiento reducido o sin WebGL: el sello quieto y un fundido breve.
 * Clic o tecla: acelera. Capa aislada: sólo bloquea el scroll y avisa (markReady).
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [gone, setGone] = useState(false);
  const [staticSeal, setStaticSeal] = useState(false);

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

    // Sello estático: aparece, queda un instante y la capa se funde
    let cap = 0;
    const playStatic = (quick: boolean) => {
      setStaticSeal(true);
      const fade = () =>
        gsap.to(el, { opacity: 0, duration: quick ? 0.35 : 0.7, ease: "power2.inOut", delay: quick ? 0.15 : 0.5, onStart: release, onComplete: finish });
      cap = window.setTimeout(fade, 900);
      document.fonts.ready.then(() => {
        window.clearTimeout(cap);
        fade();
      });
    };

    if (prefersReducedMotion() || !webglAvailable() || !canvas.current) {
      playStatic(true);
      return () => window.clearTimeout(cap);
    }

    let scene: OpeningScene | null = null;
    let tl: gsap.core.Timeline | null = null;
    let cancelled = false;
    let fellBack = false;
    const fallback = () => {
      if (fellBack || tl) return;
      fellBack = true;
      playStatic(false);
    };
    const guard = window.setTimeout(fallback, SCENE_TIMEOUT);

    import("../three/OpeningScene")
      .then(async ({ OpeningScene }) => {
        if (cancelled || !canvas.current) return;
        scene = new OpeningScene(canvas.current, { mobile: isSmallScreen() });
        await scene.init();
        if (cancelled || fellBack) return;
        window.clearTimeout(guard);
        gsap.to(canvas.current, { opacity: 1, duration: 0.4, ease: "power1.out" });
        tl = scene.play({
          target: () => {
            const t = getSealTarget();
            if (import.meta.env.DEV) Object.assign(window, { __sealTarget: t });
            return t;
          },
          release,
          // la penumbra se disuelve y descubre el Hero; al final se va el sello de la apertura
          onHandoff: (fadeOut) => {
            gsap.to(el.querySelector(".opening__bg"), { opacity: 0, duration: 0.65, ease: "power2.inOut" });
            gsap.to(canvas.current, { opacity: 0, duration: fadeOut, ease: "power1.inOut", delay: 0.55 });
          },
          done: () => gsap.delayedCall(0.1, finish),
        });
      })
      .catch(fallback);

    const onResize = () => scene?.resize();
    window.addEventListener("resize", onResize);
    // Clic o tecla: no hace esperar a nadie
    const hurry = () => tl?.timeScale(3);
    window.addEventListener("pointerdown", hurry);
    window.addEventListener("keydown", hurry);

    return () => {
      cancelled = true;
      window.clearTimeout(guard);
      window.clearTimeout(cap);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerdown", hurry);
      window.removeEventListener("keydown", hurry);
      tl?.kill();
      scene?.dispose();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={ref} className="opening" role="status" aria-live="polite">
      <span className="sr-only">Experience Design</span>
      <div className="opening__bg" aria-hidden="true" />
      <canvas ref={canvas} className="opening__canvas" aria-hidden="true" />
      {staticSeal && (
        <div className="opening__static" aria-hidden="true">
          <Logo shape="square" size="min(36vw, 200px)" decorative />
        </div>
      )}
    </div>
  );
}
