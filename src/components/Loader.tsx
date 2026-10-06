import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion, hasFinePointer } from "../lib/env";
import { markReady } from "../lib/events";
import { lockScroll } from "../lib/smoothScroll";
import "./Loader.css";

/** Bordes (en % del sello) de las láminas horizontales en que se parte la "E.". */
const CUTS = [0, 40, 47, 54, 61, 68, 100];
const MAX_MS = 3200;

/**
 * Apertura. La "E." llega partida en láminas horizontales que flotan a distintas
 * profundidades; se acercan, se alinean y se unen sobre líneas de construcción.
 * Al cerrarse, el sello de terracota se llena detrás, una luz lo recorre, y la
 * "E." se abre: un iris desde el centro descubre el Hero tal como es.
 * El cursor inclina la escena en 3D mientras se arma. Clic o tecla: acelera.
 * Capa aislada: sólo bloquea el scroll y avisa (markReady) como el loader anterior.
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

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

    if (prefersReducedMotion()) {
      el.classList.add("is-static");
      const cap = window.setTimeout(() => {
        release();
        setGone(true);
      }, 900);
      document.fonts.ready.then(() => {
        window.clearTimeout(cap);
        release();
        setGone(true);
      });
      return () => window.clearTimeout(cap);
    }

    const q = gsap.utils.selector(el);
    const slices = q(".opening__slice");
    const rand = gsap.utils.random;

    // Estado inicial: láminas dispersas en profundidad, difuminadas
    slices.forEach((s, i) => {
      const side = i % 2 ? 1 : -1;
      gsap.set(s, {
        x: side * rand(70, 190),
        y: (i - (slices.length - 1) / 2) * rand(14, 26),
        z: rand(-420, 260),
        rotationY: side * rand(18, 42),
        rotationX: rand(-14, 14),
        opacity: 0,
        filter: "blur(6px)",
      });
    });
    gsap.set(q(".opening__line"), { scaleX: 0 });
    gsap.set(q(".opening__disc"), { scale: 0.2, opacity: 0 });
    gsap.set(q(".opening__ring"), { strokeDashoffset: 629 });

    const tl = gsap.timeline({ paused: true });
    tl
      // 1. aparecen los fragmentos y las líneas de construcción
      .to(slices, { opacity: 1, duration: 0.5, ease: "power1.out", stagger: { each: 0.05, from: "center" } }, 0)
      .to(q(".opening__line"), { scaleX: 1, duration: 0.9, ease: "power2.inOut", stagger: { each: 0.04, from: "center" } }, 0.1)
      // 2. se acercan y se alinean
      .to(
        slices,
        { x: 0, y: 0, z: 0, rotationY: 0, rotationX: 0, filter: "blur(0px)", duration: 1.15, ease: "expo.inOut", stagger: { each: 0.06, from: "edges" } },
        0.25,
      )
      .to(q(".opening__line"), { opacity: 0, duration: 0.5, ease: "power1.in" }, 1.2)
      // 3. la E se cierra: el sello se llena detrás, la letra pasa a tinta, una luz lo recorre
      .addLabel("lock", 1.55)
      .to(q(".opening__ring"), { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, "lock-=0.35")
      .to(q(".opening__disc"), { scale: 1, opacity: 1, duration: 0.8, ease: "expo.out" }, "lock")
      .to(q(".opening__stage"), { color: "#171513", duration: 0.35, ease: "power1.out" }, "lock+=0.05")
      .fromTo(q(".opening__sheen"), { xPercent: -160 }, { xPercent: 160, duration: 0.9, ease: "power2.inOut" }, "lock+=0.2")
      .to(q(".opening__ring"), { opacity: 0, duration: 0.4 }, "lock+=0.4")
      .addLabel("open", "lock+=0.85");

    // 4. la E se abre y el iris descubre el Hero
    let opened = false;
    const open = () => {
      if (opened) return;
      opened = true;
      release();
      gsap
        .timeline({ onComplete: () => setGone(true) })
        .to(q(".opening__seal"), { scale: 2.6, opacity: 0, duration: 1.1, ease: "power3.in" }, 0)
        .to(el, { "--iris": "130vmax", duration: 1.25, ease: "expo.inOut" }, 0.15);
    };

    // Arranca cuando la serif está lista (máx. 600 ms) para que la E no cambie de forma
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      tl.play();
    };
    document.fonts.load('500 120px "Cormorant Garamond"').then(start, start);
    const startCap = window.setTimeout(start, 600);

    // Al llegar a "open", espera a las fuentes (con tope) y abre
    let fontsReady = false;
    let reachedOpen = false;
    const t0 = performance.now();
    const tryOpen = () => {
      if (reachedOpen && (fontsReady || performance.now() - t0 > MAX_MS)) open();
    };
    document.fonts.ready.then(() => {
      fontsReady = true;
      tryOpen();
    });
    tl.addPause("open", () => {
      reachedOpen = true;
      tryOpen();
      if (!fontsReady) gsap.delayedCall(Math.max(0, (MAX_MS - (performance.now() - t0)) / 1000), open);
    });

    // Cursor: la escena se inclina y las láminas, por su profundidad, hacen parallax
    const stage = el.querySelector<HTMLElement>(".opening__stage")!;
    const rx = gsap.quickTo(stage, "rotationX", { duration: 0.9, ease: "power3.out" });
    const ry = gsap.quickTo(stage, "rotationY", { duration: 0.9, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      ry(nx * 16);
      rx(-ny * 12);
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
    };
    if (hasFinePointer()) window.addEventListener("pointermove", move, { passive: true });

    // Clic o tecla: no hace esperar a nadie
    const hurry = () => tl.timeScale(3);
    window.addEventListener("pointerdown", hurry);
    window.addEventListener("keydown", hurry);

    return () => {
      window.clearTimeout(startCap);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", hurry);
      window.removeEventListener("keydown", hurry);
      tl.kill();
    };
  }, []);

  if (gone) return null;

  const glyph = (
    <svg viewBox="0 0 200 200" className="opening__glyph">
      <text
        x="102"
        y="104"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Cormorant Garamond, Times New Roman, serif"
        fontWeight="500"
        fontSize="112"
        fill="currentColor"
      >
        E.
      </text>
    </svg>
  );

  return (
    <div ref={ref} className="opening" role="status" aria-live="polite">
      <span className="sr-only">Experience Design</span>
      <div className="opening__light" aria-hidden="true" />
      <div className="opening__scene" aria-hidden="true">
        <div className="opening__seal">
          <div className="opening__stage">
            <svg viewBox="0 0 200 200" className="opening__ringsvg">
              <circle className="opening__ring" cx="100" cy="100" r="99" fill="none" stroke="#B7664F" strokeWidth="1" strokeDasharray="629" />
            </svg>
            <div className="opening__disc">
              <span className="opening__sheen" />
            </div>
            {CUTS.slice(0, -1).map((top, i) => (
              <div key={i} className="opening__slice" style={{ clipPath: `inset(${top}% 0 ${100 - CUTS[i + 1]}% 0)` }}>
                {glyph}
              </div>
            ))}
            {CUTS.slice(1, -1).map((y) => (
              <span key={y} className="opening__line" style={{ top: `${y}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
