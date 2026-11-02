import { useEffect, useRef, useState } from "react";
import { scrollToTarget } from "../lib/smoothScroll";
import "./ChapterIndex.css";

type Item = { id: string; n: string; short: string };

/** Alto de la barra de navegación (token --nav-h). */
function navHeight() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 72;
}

/**
 * Índice de capítulos: una barra delgada que queda fija bajo la navegación.
 * Marca el capítulo que cruza el 40% de la pantalla y, al hacer clic, baja hasta
 * él dejando libre el alto de la navegación y de la barra. En móvil es una tira
 * que se desliza sola, sin mover la página de lado.
 */
export function ChapterIndex({ items, label }: { items: readonly Item[]; label: string }) {
  const [active, setActive] = useState(-1);
  const bar = useRef<HTMLElement>(null);
  const strip = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter((el): el is HTMLElement => !!el);
    // Una franja fina a la altura del 40%: sólo un capítulo la cruza a la vez
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLElement));
        });
      },
      { rootMargin: "-40% 0px -59% 0px" },
    );
    els.forEach((el) => io.observe(el));
    // Arriba del primer capítulo (en el hero) no hay ninguno activo
    const first = els[0];
    const onScroll = () => {
      if (first && first.getBoundingClientRect().top > window.innerHeight * 0.4) setActive(-1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  // La tira lleva el capítulo activo a la vista, sin tocar el scroll de la página
  useEffect(() => {
    const s = strip.current;
    const li = active >= 0 ? (s?.children[active] as HTMLElement | undefined) : undefined;
    if (!s || !li || s.scrollWidth <= s.clientWidth) return;
    s.scrollTo({ left: li.offsetLeft - (s.clientWidth - li.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  const go = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    scrollToTarget(el, navHeight() + (bar.current?.offsetHeight ?? 0));
  };

  return (
    <nav ref={bar} className="chidx" aria-label={label}>
      <div className="wrap chidx__inner">
        <ol ref={strip} className="chidx__list">
          {items.map((it, i) => (
            <li key={it.id}>
              <a href={`#${it.id}`} className={`chidx__link ${i === active ? "is-active" : ""}`} aria-current={i === active ? "location" : undefined} onClick={(e) => go(e, it.id)}>
                <span className="chidx__n">{it.n}</span>
                <span className="chidx__name">{it.short}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
