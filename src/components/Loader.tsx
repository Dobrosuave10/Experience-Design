import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { brand } from "../content/site";
import { prefersReducedMotion } from "../lib/env";
import { markReady } from "../lib/events";
import { lockScroll } from "../lib/smoothScroll";
import { Logo } from "./Logo";
import "./Loader.css";

const MIN_MS = 1400;
const MAX_MS = 3200;

/**
 * Entrada cinematográfica: el círculo del sello se traza, se llena de terracota,
 * aparece la "E." y el telón sube. Espera a las fuentes (máx. 3,2 s).
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = ref.current!;
    lockScroll(true);
    window.scrollTo(0, 0);

    if (prefersReducedMotion()) {
      document.fonts.ready.then(() => {
        lockScroll(false);
        markReady();
        setGone(true);
      });
      return;
    }

    const tl = gsap.timeline({ paused: true });
    tl.fromTo(el.querySelector(".loader__ring"), { strokeDashoffset: 315 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" })
      .to(el.querySelector(".loader__disc"), { scale: 1, opacity: 1, duration: 0.7, ease: "expo.out" }, "-=0.25")
      .fromTo(el.querySelector(".loader__glyph"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }, "-=0.45")
      .fromTo(el.querySelector(".loader__name"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.4");
    tl.play();

    const start = performance.now();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      gsap.delayedCall(wait / 1000 + 0.35, () => {
        lockScroll(false);
        markReady();
        gsap
          .timeline({ onComplete: () => setGone(true) })
          .to(el.querySelector(".loader__mark"), { scale: 0.86, opacity: 0, duration: 0.6, ease: "power3.in" })
          .to(el, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.2");
      });
    };
    document.fonts.ready.then(finish);
    const cap = window.setTimeout(finish, MAX_MS);
    return () => {
      window.clearTimeout(cap);
      tl.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={ref} className="loader" role="status" aria-live="polite">
      <span className="sr-only">Cargando Experience Design</span>
      <div className="loader__mark" aria-hidden="true">
        {brand.logoAsset ? (
          <Logo size={96} decorative className="loader__disc" />
        ) : (
          <svg viewBox="0 0 104 104" width="104" height="104">
            <circle className="loader__ring" cx="52" cy="52" r="50" fill="none" stroke="#B7664F" strokeWidth="1" strokeDasharray="315" />
            <circle className="loader__disc" cx="52" cy="52" r="50" fill="#A6533F" />
            <text
              className="loader__glyph"
              x="53"
              y="54"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Cormorant Garamond, Times New Roman, serif"
              fontWeight="500"
              fontSize="58"
              fill="#171513"
            >
              E.
            </text>
          </svg>
        )}
        <span className="loader__name label">Experience Design</span>
      </div>
    </div>
  );
}
