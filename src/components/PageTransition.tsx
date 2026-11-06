import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../lib/env";
import { setCovered } from "../lib/events";
import { setTransition } from "../lib/router";
import { lockScroll, resetScroll } from "../lib/smoothScroll";
import { milan, routes, saoPaulo } from "../content/site";
import { Logo } from "./Logo";
import { Louvers } from "./Louvers";
import { Photo } from "./Photo";
import "./PageTransition.css";

/**
 * Cambio de página: un telón terracota sube desde abajo con el sello, la página
 * cambia detrás y el telón sigue subiendo hasta descubrirla (la misma salida del loader).
 * Con reduced motion la página cambia sin telón.
 * Hacia Milán o São Paulo (navigate con `travel`) se viaja: la portada del destino entra
 * de derecha a izquierda y se convierte en la página.
 */
export function PageTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const travelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    let busy = false;

    setTransition((swap, { travel }) => {
      if (travel) {
        if (busy) return;
        busy = true;
        travelTo(travel, swap, () => (busy = false));
        return;
      }
      if (prefersReducedMotion()) {
        swap();
        requestAnimationFrame(() => resetScroll());
        return;
      }
      if (busy) return;
      busy = true;
      setCovered(true);
      lockScroll(true);
      const mark = el.querySelector(".pt__mark");
      gsap
        .timeline()
        .set(el, { visibility: "visible", yPercent: 100 })
        .to(el, { yPercent: 0, duration: 0.75, ease: "expo.inOut" })
        .fromTo(mark, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.45, ease: "expo.out" }, "-=0.3")
        .add(() => {
          swap();
          // Dos frames: React monta la página nueva y sus ScrollTriggers
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              resetScroll();
              ScrollTrigger.refresh();
              lockScroll(false);
              gsap
                .timeline({
                  onComplete: () => {
                    gsap.set(el, { visibility: "hidden" });
                    busy = false;
                  },
                })
                .to(mark, { opacity: 0, scale: 0.92, duration: 0.35, ease: "power3.in" })
                .add(() => setCovered(false), "-=0.05")
                .to(el, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, "-=0.1");
            }),
          );
        });
    });
    return () => setTransition(null);
  }, []);

  // Viaje a un destino: su portada entra de derecha a izquierda sobre la página actual, tal
  // como se ve la página arriba del todo (mismas clases, mismo estado inicial de sus animaciones).
  // Cuando cubre la pantalla la ruta cambia debajo; la portada real queda justo bajo el panel,
  // que se funde en 200 ms. Con reduced motion, un fundido simple.
  const travelTo = async (href: string, swap: () => void, done: () => void) => {
    const panel = travelRef.current!;
    const cover = panel.querySelector<HTMLElement>(`[data-dest="${href}"]`);
    const pages = () => document.querySelectorAll<HTMLElement>("main, body .footer");
    const reduced = prefersReducedMotion() || !cover;
    setCovered(true);
    lockScroll(true);

    const arrive = () => {
      if (cover && !reduced) document.documentElement.dataset.tone = cover.dataset.tone;
      swap();
      requestAnimationFrame(() =>
        requestAnimationFrame(async () => {
          gsap.set(pages(), { clearProps: "transform,opacity" });
          resetScroll();
          ScrollTrigger.refresh();
          lockScroll(false);
          // El foco va al título del destino, como si se hubiera cargado la página
          const h1 = document.querySelector<HTMLElement>("main h1");
          if (h1) {
            h1.setAttribute("tabindex", "-1");
            h1.focus({ preventScroll: true });
          }
          if (reduced) {
            setCovered(false);
            gsap.fromTo(pages(), { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power1.out", clearProps: "opacity", onComplete: done });
            return;
          }
          // La foto de la portada real (diferida) tiene que estar pintada antes de quitar el panel
          const img = cover!.querySelector("img") && document.querySelector<HTMLImageElement>("main img");
          if (img) await ready(img, 800);
          setCovered(false);
          gsap.to(panel, {
            opacity: 0,
            duration: 0.2,
            ease: "none",
            onComplete: () => {
              gsap.set(panel, { visibility: "hidden", opacity: 1 });
              cover!.hidden = true;
              done();
            },
          });
        }),
      );
    };

    if (reduced) {
      gsap.to(pages(), { opacity: 0, duration: 0.25, ease: "power1.in", onComplete: arrive });
      return;
    }
    cover.hidden = false;
    setInitial(cover);
    const img = cover.querySelector("img");
    if (img) await ready(img, 500);
    gsap
      .timeline({ onComplete: arrive })
      .set(panel, { visibility: "visible", xPercent: 100 })
      .set(cover, { scale: 1.06 })
      .to(pages(), { x: () => -window.innerWidth * 0.3, duration: 1, ease: "power3.inOut" }, 0)
      .to(panel, { xPercent: 0, duration: 1, ease: "power3.out" }, 0)
      .to(cover, { scale: 1, duration: 1, ease: "power3.out" }, 0);
  };

  return (
    <>
      <div ref={travelRef} className="pt-travel" aria-hidden="true">
        <DestinationCovers />
      </div>
      <div ref={ref} className="pt" aria-hidden="true">
        <div className="pt__mark">
          <Logo size={72} decorative shape="circle" />
          <span className="label">Experience Design</span>
        </div>
      </div>
    </>
  );
}

/** Espera a que la imagen esté decodificada, como mucho `ms`. */
function ready(img: HTMLImageElement, ms: number) {
  if (img.loading === "lazy") img.loading = "eager";
  return Promise.race([img.decode().catch(() => undefined), new Promise((r) => setTimeout(r, ms))]);
}

/** Cómo se ve cada portada arriba del todo: el inicio de sus animaciones de scroll (sections/Milan.tsx, sections/SaoPaulo.tsx). */
function setInitial(cover: HTMLElement) {
  const q = (sel: string) => cover.querySelectorAll(sel);
  if (cover.dataset.dest === routes.milan) {
    gsap.set(q(".milan__window"), { clipPath: "inset(30% 34% 30% 34%)" });
    gsap.set(q(".milan__window img"), { scale: 1.35 });
    gsap.set(q(".milan__shade"), { opacity: 0 });
    gsap.set(q(".milan__city"), { yPercent: 18 });
    gsap.set(q(".milan__topic"), { opacity: 0, y: 12 });
  } else {
    gsap.set(q(".louver"), { rotateY: 40 });
    gsap.set(q(".sp__city"), { yPercent: 8 });
    gsap.set(q(".sp__open-meta"), { opacity: 0 });
  }
}

/**
 * Copias de las portadas de Milán y São Paulo para el viaje, con las mismas clases que las
 * de verdad, así se ven iguales en cada ancho. La foto se pide cuando el navegador está libre.
 */
function DestinationCovers() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const warm = () => ref.current?.querySelectorAll("img").forEach((img) => (img.loading = "eager"));
    if (!("requestIdleCallback" in window)) {
      const t = setTimeout(warm, 2500);
      return () => clearTimeout(t);
    }
    const id = window.requestIdleCallback(warm, { timeout: 4000 });
    return () => window.cancelIdleCallback(id);
  }, []);
  return (
    <div ref={ref}>
      <div className="pt-dest milan" data-dest={routes.milan} data-tone="ink" hidden>
        <div className="milan__open-sticky">
          <div className="milan__window">
            <Photo name={milan.openingImage.image} alt="" sizes="(max-width: 767px) and (min-resolution: 2.5dppx) 120vw, (max-width: 767px) 160vw, (max-aspect-ratio: 1/1) 182vh, 100vw" />
            <div className="milan__shade" />
          </div>
          <div className="milan__crumbs wrap label">
            <span>Destinos</span>
            <span>/</span>
            <span aria-current="page">01 {milan.city}</span>
          </div>
          <div className="milan__city display">
            <span>{milan.city}</span>
            <span className="milan__year">{milan.year}</span>
          </div>
          <div className="milan__meta wrap">
            <p className="label">
              {milan.event}
            </p>
            <ul className="milan__topics">
              {milan.topics.map((t) => (
                <li key={t} className="milan__topic">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="pt-dest sp" data-dest={routes.saoPaulo} data-tone="clay" hidden>
        <div className="sp__open-sticky">
          <Louvers className="sp__louvers" behind="terracotta" count={16} />
          <div className="wrap sp__open-inner">
            <div className="sp__city">
              <span>São</span>
              <span>Paulo</span>
            </div>
            <div className="sp__open-meta">
              <p className="label">{saoPaulo.event}</p>
              <p className="label sp__year">{saoPaulo.year}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
