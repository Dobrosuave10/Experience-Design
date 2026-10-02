import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { InstagramLogo, X } from "@phosphor-icons/react";
import { brand, nav } from "../content/site";
import { prefersReducedMotion } from "../lib/env";
import { goToContact, onReady } from "../lib/events";
import { lockScroll, scrollToTarget } from "../lib/smoothScroll";
import { Logo } from "./Logo";
import { MagneticButton } from "./MagneticButton";
import "./Navigation.css";

export function Navigation() {
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggleBtn = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  // Entrada tras el loader + ocultar al bajar / mostrar al subir
  useEffect(() => {
    const el = header.current!;
    const off = onReady(() => {
      if (!prefersReducedMotion()) gsap.fromTo(el, { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, delay: 0.5, ease: "expo.out" });
    });
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const past = self.scroll() > window.innerHeight * 0.25;
        el.classList.toggle("is-hidden", past && self.direction === 1);
        el.classList.toggle("is-solid", past);
      },
    });
    return () => {
      off();
      st.kill();
    };
  }, []);

  // Menú móvil: bloqueo de scroll, Escape, foco y trampa de foco
  const mounted = useRef(false);
  useEffect(() => {
    // En el primer render no tocar el bloqueo (lo controla el Loader)
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    lockScroll(open);
    const m = menu.current!;
    if (!open) return;
    const items = m.querySelectorAll<HTMLElement>(".menu__item");
    if (!prefersReducedMotion()) gsap.fromTo(items, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: "expo.out", delay: 0.15 });
    const focusables = m.querySelectorAll<HTMLElement>("a, button");
    focusables[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && focusables.length) {
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      toggleBtn.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    // Esperar a que se libere el scroll antes de desplazarse
    requestAnimationFrame(() => scrollToTarget(href));
  };

  return (
    <>
      <header ref={header} className="nav">
        <div className="nav__bar">
          <a
            href="#inicio"
            className="nav__brand"
            onClick={(e) => {
              e.preventDefault();
              go("#inicio");
            }}
          >
            <Logo size={34} />
            <span className="nav__name">Experience Design</span>
          </a>

          <nav className="nav__links" aria-label="Principal">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="nav__link"
                onClick={(e) => {
                  e.preventDefault();
                  go(n.href);
                }}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="nav__cta">
            <MagneticButton href="#contacto" onClick={() => goToContact()}>
              Vamos
            </MagneticButton>
          </div>

          <button
            ref={toggleBtn}
            className="nav__toggle label"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((o) => !o)}
          >
            Menú
          </button>
        </div>
      </header>

      <div
        ref={menu}
        id="menu"
        className={`menu ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        hidden={!open}
      >
        <div className="menu__top">
          <Logo size={34} />
          <button className="menu__close" onClick={() => setOpen(false)} aria-label="Cerrar menú">
            <X size={22} weight="light" />
          </button>
        </div>
        <nav className="menu__list" aria-label="Menú móvil">
          {nav.map((n, i) => (
            <div className="menu__row" key={n.href}>
              <a
                href={n.href}
                className="menu__item"
                onClick={(e) => {
                  e.preventDefault();
                  go(n.href);
                }}
              >
                <span className="menu__n label">0{i + 1}</span>
                <span className="menu__label serif">{n.label}</span>
              </a>
            </div>
          ))}
          <div className="menu__row">
            <a
              href="#contacto"
              className="menu__item menu__item--cta"
              onClick={(e) => {
                e.preventDefault();
                setOpen(false);
                requestAnimationFrame(() => goToContact());
              }}
            >
              <span className="menu__n label">05</span>
              <span className="menu__label serif">
                <em>Vamos</em>
              </span>
            </a>
          </div>
        </nav>
        <a className="menu__ig label" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">
          <InstagramLogo size={18} weight="light" aria-hidden />
          {brand.instagram.handle}
        </a>
      </div>
    </>
  );
}
