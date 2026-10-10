import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { InstagramLogo, X } from "@phosphor-icons/react";
import { brand, nav, navContact, routes } from "../content/site";
import { hasFinePointer, prefersReducedMotion } from "../lib/env";
import { onReady } from "../lib/events";
import { isActive, navigate, usePath } from "../lib/router";
import { lockScroll } from "../lib/smoothScroll";
import { Link } from "./Link";
import { Logo } from "./Logo";
import { MagneticButton } from "./MagneticButton";
import "./Navigation.css";

/** Texto del CTA de la barra (mismo destino que Contacto). */
const CTA_LABEL = "Conversemos";

/**
 * Navegación principal: Inicio, Nosotros, Programas, Destinos y Contacto (CTA).
 * Programas y Destinos despliegan sus subpáginas en escritorio; en móvil, el menú
 * a pantalla completa muestra las cinco entradas y debajo, más pequeño, sus subpáginas.
 */
export function Navigation() {
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggleBtn = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const path = usePath();

  // Entrada tras el loader + visibilidad.
  // En Inicio la barra se ve durante todo el Hero (la travesía del túnel). Pasado el túnel
  // —cuando el Hero termina su recorrido— queda en modo discreto: oculta mientras se lee,
  // aparece al llevar el cursor al borde superior (o, en táctil, al subir o tocar arriba)
  // y se vuelve a ocultar con una pausa cuando el cursor se va y nadie la está usando.
  // En el resto de las páginas se mantiene el comportamiento de siempre.
  const openRef = useRef(open);
  /** Modo discreto activo (sólo pasado el túnel de Inicio). */
  const autoRef = useRef(false);
  openRef.current = open;
  useEffect(() => {
    const el = header.current!;
    const off = onReady(() => {
      if (!prefersReducedMotion()) gsap.fromTo(el, { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, delay: 0.5, ease: "expo.out", clearProps: "transform,opacity" });
    });

    const fine = hasFinePointer();
    let hideTimer = 0;
    const inUse = () => openRef.current || el.matches(":hover") || el.matches(":focus-within");
    const show = () => {
      window.clearTimeout(hideTimer);
      el.classList.remove("is-hidden");
    };
    const hide = () => {
      window.clearTimeout(hideTimer);
      if (!inUse()) el.classList.add("is-hidden");
    };
    const hideSoon = () => {
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(hide, 650);
    };

    /** Fin de la travesía: el Hero de Inicio deja de estar fijo y entra el contenido. */
    const pastTunnel = (y: number) => {
      const hero = document.querySelector<HTMLElement>("main .hero");
      if (!hero) return null;
      return y >= hero.offsetTop + hero.offsetHeight - window.innerHeight - 1;
    };

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        const past = y > window.innerHeight * 0.25;
        el.classList.toggle("is-solid", past);
        const tunnel = pastTunnel(y);
        if (tunnel === null) {
          // Páginas sin túnel: ocultar al bajar / mostrar al subir
          autoRef.current = false;
          el.classList.toggle("is-hidden", past && self.direction === 1 && !el.matches(":focus-within"));
          return;
        }
        if (!tunnel) {
          // Dentro del Hero y del túnel: siempre visible
          autoRef.current = false;
          show();
          return;
        }
        if (!autoRef.current) {
          autoRef.current = true;
          hide();
          return;
        }
        // Táctil: subir es pedir la barra; bajar es seguir leyendo
        if (!fine) {
          if (self.direction === -1) show();
          else hide();
        }
      },
    });

    // Cursor: el borde superior la llama; mientras esté sobre ella (o un submenú) se queda
    const onMove = (e: PointerEvent) => {
      if (!autoRef.current || e.pointerType !== "mouse") return;
      if (e.clientY <= 24) show();
      else if (!el.classList.contains("is-hidden") && !inUse()) hideSoon();
      else if (inUse()) window.clearTimeout(hideTimer);
    };
    // Táctil: tocar la franja superior también la muestra
    const onTouch = (e: TouchEvent) => {
      if (autoRef.current && e.touches[0] && e.touches[0].clientY <= 28) show();
    };
    // Teclado: al recibir foco aparece; al perderlo se oculta con la misma pausa
    const onFocusIn = () => autoRef.current && show();
    const onFocusOut = () => autoRef.current && hideSoon();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    el.addEventListener("pointerleave", onFocusOut);

    return () => {
      off();
      st.kill();
      window.clearTimeout(hideTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchstart", onTouch);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
      el.removeEventListener("pointerleave", onFocusOut);
    };
  }, []);

  // Al cambiar de página la barra vuelve a verse
  useEffect(() => {
    autoRef.current = false;
    header.current?.classList.remove("is-hidden", "is-solid");
  }, [path]);

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
    const items = m.querySelectorAll<HTMLElement>(".menu__item, .menu__sub");
    if (!prefersReducedMotion()) gsap.fromTo(items, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.04, ease: "expo.out", delay: 0.15 });
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

  // En el menú móvil: cerrar y navegar
  const go = (href: string) => (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => navigate(href));
  };
  const current = (href: string) => (isActive(path, href) ? { "aria-current": "page" as const } : {});
  const all = [...nav, navContact];
  const groups = nav.filter((n) => n.children);

  return (
    <>
      <header ref={header} className={`nav ${path === routes.inicio ? "nav--hero" : ""}`}>
        <div className="nav__bar">
          <Link to={routes.inicio} className="nav__brand" aria-label={`${brand.name}, inicio`}>
            <Logo size={34} decorative shape="square" />
            {/* El wordmark del Hero, en versión horizontal: EXPERIENCE (serif) + Design (script) */}
            <span className="nav__name" aria-hidden="true">
              <span className="nav__wm nav__wm--experience" />
              <span className="nav__wm nav__wm--design" />
            </span>
          </Link>

          <nav className="nav__links" aria-label="Principal">
            {nav.map((n) => (
              <div key={n.href} className={`nav__item ${n.children ? "has-sub" : ""}`}>
                <Link to={n.href} className="nav__link" {...current(n.href)}>
                  {n.label}
                </Link>
                {n.children && (
                  <div className="nav__sub">
                    <ul className="nav__sub-list">
                      {n.children.map((c, i) => (
                        <li key={c.href}>
                          <Link to={c.href} className="nav__sub-link" {...current(c.href)}>
                            <span className="nav__sub-n label">0{i + 1}</span>
                            <span className="nav__sub-name serif">{c.label}</span>
                            {c.note && <span className="nav__sub-note">{c.note}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="nav__cta">
            <MagneticButton variant="line" href={navContact.href} onClick={() => navigate(navContact.href)}>
              {CTA_LABEL}
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
          <Logo size={34} shape="square" />
          <button className="menu__close" onClick={() => setOpen(false)} aria-label="Cerrar menú">
            <X size={22} weight="light" />
          </button>
        </div>
        <nav className="menu__list" aria-label="Menú móvil">
          {all.map((n, i) => (
            <div className="menu__row" key={n.href}>
              <a href={n.href} className={`menu__item ${n === navContact ? "menu__item--cta" : ""}`} onClick={go(n.href)} {...current(n.href)}>
                <span className="menu__n label">0{i + 1}</span>
                <span className="menu__label serif">{n === navContact ? <em>{CTA_LABEL}</em> : n.label}</span>
              </a>
            </div>
          ))}
        </nav>
        <div className="menu__subs">
          {groups.map((g) => (
            <div key={g.href} className="menu__group">
              <p className="menu__group-title label">{g.label}</p>
              <ul>
                {g.children!.map((c) => (
                  <li key={c.href}>
                    <a href={c.href} className="menu__sub" onClick={go(c.href)} {...current(c.href)}>
                      {c.label}
                      {c.note && <span className="menu__sub-note">{c.note}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <a className="menu__ig label" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">
          <InstagramLogo size={18} weight="light" aria-hidden />
          {brand.instagram.handle}
        </a>
      </div>
    </>
  );
}
