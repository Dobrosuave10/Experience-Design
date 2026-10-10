import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hero, routes } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK, isSmallScreen, prefersReducedMotion, webglAvailable } from "../lib/env";
import { onPageShown, setSealTarget } from "../lib/events";
import { navigate } from "../lib/router";
import { RevealText } from "../components/RevealText";
import { MagneticButton } from "../components/MagneticButton";
import { Logo } from "../components/Logo";
import { images } from "../content/images.gen";
import type { HeroScene } from "../three/HeroScene";
import "./Hero.css";

/**
 * 01 Entrar.
 * Escena WebGL: el sello de terracota suspendido frente a una galería de arcos.
 * Al hacer scroll la cámara atraviesa los arcos hacia la luz y la luz se vuelve papel:
 * así empieza la siguiente sección. Sin WebGL hay una composición estática equivalente.
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
      // La apertura termina su sello sobre éste (sólo con el Hero arriba, en su encuadre inicial)
      setSealTarget(() => (window.scrollY < 2 && sceneRef.current ? sceneRef.current.sealScreen() : null));
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
      setSealTarget(null);
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
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true } })
          .to(".hero__content", { opacity: 0, y: -60, ease: "none", duration: 0.3 }, 0.02)
          .to(".hero__veil", { opacity: 1, ease: "none", duration: 0.35 }, 0.65);

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
    <section ref={section} id="inicio" className="hero section" data-tone="ink" aria-labelledby="hero-title">
      <div className="hero__sticky">
        <div className="hero__stage" aria-hidden="true">
          {gl ? (
            <canvas ref={canvas} className={`hero__canvas ${sceneReady ? "is-ready" : ""}`} />
          ) : (
            <div className="hero__fallback">
              <span className="hero__fallback-arch" />
              <Logo size="min(34vw, 260px)" decorative shape="square" className="hero__fallback-logo" />
            </div>
          )}
        </div>

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

        <div className="hero__veil" aria-hidden="true" />
      </div>
    </section>
  );
}
