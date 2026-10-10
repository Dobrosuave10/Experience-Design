import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hero, routes } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK, isSmallScreen, prefersReducedMotion, webglAvailable } from "../lib/env";
import { onPageShown } from "../lib/events";
import { navigate } from "../lib/router";
import { RevealText } from "../components/RevealText";
import { MagneticButton } from "../components/MagneticButton";
import { Logo } from "../components/Logo";
import { images } from "../content/images.gen";
import type { HeroScene } from "../three/HeroScene";
import "./Hero.css";

/**
 * 01 Entrar.
 * Escena WebGL: una galería de arcos con el tondo E. de terracota empotrado en el muro.
 * Al hacer scroll la cámara atraviesa la galería; la galería se disuelve en la luz del
 * último arco, que es el blanco de Programas: la sección siguiente aparece del otro
 * lado del umbral, sobre el mismo eje. Sin WebGL hay una composición estática equivalente.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HeroScene | null>(null);
  const [gl] = useState(() => webglAvailable());
  const [sceneReady, setSceneReady] = useState(false);

  // Carga diferida de Three.js
  useEffect(() => {
    if (!gl || !canvas.current) return;
    let scene: HeroScene | null = null;
    let cancelled = false;
    const reduced = prefersReducedMotion();
    import("../three/HeroScene").then(async ({ HeroScene }) => {
      if (cancelled || !canvas.current) return;
      scene = new HeroScene(canvas.current, { mobile: isSmallScreen(), reduced });
      sceneRef.current = scene;
      await scene.init();
      if (cancelled) return;
      await document.fonts.ready;
      measure();
      setSceneReady(true);
    });

    // Dónde termina el titular: la escena deja libre ese lado del cuadro
    const measure = () => {
      const words = section.current?.querySelectorAll<HTMLElement>(".hero__title .rv-word");
      if (!words?.length) return;
      const right = Math.max(...Array.from(words, (w) => w.getBoundingClientRect().right));
      sceneRef.current?.setSafeLeft((right + 24) / window.innerWidth);
    };
    const ro = new ResizeObserver(() => {
      sceneRef.current?.resize();
      measure();
    });
    ro.observe(canvas.current.parentElement!);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? sceneRef.current?.start() : sceneRef.current?.stop()));
    io.observe(section.current!);
    const vis = () => (document.hidden ? sceneRef.current?.stop() : sceneRef.current?.start());
    document.addEventListener("visibilitychange", vis);

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      sceneRef.current?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", move, { passive: true });

    return () => {
      cancelled = true;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("pointermove", move);
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [gl]);

  useEffect(() => {
    if (sceneReady) sceneRef.current?.start();
  }, [sceneReady]);

  // Scroll: avance de cámara, salida del texto y fundido a papel
  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => sceneRef.current?.setProgress(self.progress),
        });
        // El titular se queda atrás mientras la cámara avanza (no un simple fundido)
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true } })
          .to(".hero__content", { opacity: 0, y: -40, scale: 0.97, filter: "blur(6px)", ease: "none", duration: 0.26 }, 0.03)
          .to(".hero__scrim", { opacity: 0, ease: "none", duration: 0.25 }, 0.05)
          .to({}, { duration: 0.71 }, 0.29); // la línea de tiempo cubre todo el tramo: el titular sale en el primer cuarto

        const off = onPageShown(() => {
          gsap.fromTo(".hero__stage", { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 2.4, ease: "expo.out" });
          // El wordmark se "escribe" de izquierda a derecha, como el trazo de su caligrafía
          gsap.fromTo(".hero__wordmark", { clipPath: "inset(0 100% 0 0)", opacity: 1 }, { clipPath: "inset(0 0% 0 0)", duration: 2.2, ease: "power2.inOut", delay: 0.15 });
          gsap.fromTo(".hero__fade", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.4, ease: "expo.out", delay: 0.7, stagger: 0.12 });
        });
        return () => off();
      });
    },
    section,
  );

  return (
    <section ref={section} id="inicio" className={`hero section${gl ? "" : " hero--static"}`} data-tone="ink" aria-labelledby="hero-title">
      <div className="hero__sticky">
        <div className="hero__stage" aria-hidden="true">
          {gl ? (
            <canvas ref={canvas} className={`hero__canvas ${sceneReady ? "is-ready" : ""}`} />
          ) : (
            <div className="hero__fallback">
              <span className="hero__fallback-arch" />
              <Logo size="clamp(64px, 9vw, 150px)" decorative className="hero__fallback-logo" />
            </div>
          )}
        </div>

        <div className="hero__scrim" aria-hidden="true" />
        <div className="hero__content wrap">
          <img
            className="hero__wordmark"
            src={images["wordmark-paper"].src}
            width={images["wordmark-paper"].w}
            height={images["wordmark-paper"].h}
            alt="Experience Design"
            fetchPriority="high"
            draggable={false}
          />
          <RevealText
            as="h1"
            id="hero-title"
            className="hero__title display"
            trigger="ready"
            delay={0.25}
            stagger={0.07}
            lines={[hero.titleA, { text: hero.titleB, em: true }]}
          />
          <div className="hero__foot">
            <p className="hero__sub hero__fade">{hero.sub}</p>
            <div className="hero__fade">
              <MagneticButton href={routes.milan} onClick={() => navigate(routes.milan)}>
                {hero.cta}
              </MagneticButton>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
