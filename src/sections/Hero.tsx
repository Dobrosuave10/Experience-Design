import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hero, routes } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK, isLite, isSmallScreen, prefersReducedMotion, webglAvailable } from "../lib/env";
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
 * Escena WebGL: una galería de arcos de medio punto que lleva a una abertura iluminada,
 * marfil, con la "E." negra en su círculo. Al hacer scroll la cámara la atraviesa y, pasado
 * el túnel, la pantalla queda marfil con esa "E." (el mismo fondo de la sección que sigue,
 * sin línea entre ambas). Sin WebGL (teléfonos), un túnel estático que se acerca con una
 * escala y el mismo cierre.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HeroScene | null>(null);
  // En teléfonos y táctiles, la composición estática: three.js ni se descarga
  const [gl] = useState(() => !isLite() && webglAvailable());
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
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true } })
          .to(".hero__content", { opacity: 0, y: -60, ease: "none", duration: 0.3 }, 0.02)
          // El marfil cubre la escena cuando la cámara ya llegó a la luz; la "E." del cierre aparece
          // recién con el marfil casi opaco (así no se ve doble con la del túnel) y crece como ella
          .to(".hero__veil", { opacity: 1, ease: "none", duration: 0.14 }, 0.74)
          .fromTo(".hero__end", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, ease: "none", duration: 0.12 }, 0.84);
        // Sin WebGL (teléfonos): el túnel estático se acerca con una escala barata
        if (!gl) gsap.fromTo(".hero__tunnel", { scale: 1 }, { scale: 5, ease: "power1.in", scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true } });

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
              <svg className="hero__tunnel" viewBox="0 0 200 262" aria-hidden="true">
                <path d="M8.0 262V104.0A92.0 92.0 0 0 1 192.0 104.0V262Z" fill="#2a1d17" />
                <path d="M28.2 262V138.8A71.8 71.8 0 0 1 171.8 138.8V262Z" fill="#3b2820" />
                <path d="M44.0 262V165.9A56.0 56.0 0 0 1 156.0 165.9V262Z" fill="#4f3427" />
                <path d="M56.3 262V187.0A43.7 43.7 0 0 1 143.7 187.0V262Z" fill="#6b4535" />
                <path d="M65.9 262V203.5A34.1 34.1 0 0 1 134.1 203.5V262Z" fill="#8e5a42" />
                <path d="M73.4 262V216.4A26.6 26.6 0 0 1 126.6 216.4V262Z" fill="#b47a5c" />
                <path d="M79.3 262V226.4A20.7 20.7 0 0 1 120.7 226.4V262Z" fill="var(--ink)" />
                <image href="/brand/mark-light.svg" x="94.5" y="220.4" width="11" height="12" />
              </svg>
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
            <div className="hero__fade">
              <MagneticButton href={routes.milan} onClick={() => navigate(routes.milan, { travel: routes.milan })}>
                {hero.cta}
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Fin del túnel: blanco, con la "E." negra en su círculo fino */}
        <div className="hero__veil" aria-hidden="true">
          <Logo size="18vh" decorative className="hero__end" />
        </div>
      </div>
    </section>
  );
}
