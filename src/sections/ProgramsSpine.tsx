import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "@phosphor-icons/react";
import { programsSpine } from "../content/site";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { Link } from "../components/Link";
import { Photo } from "../components/Photo";
import { RevealText } from "../components/RevealText";
import "./ProgramsSpine.css";

type Item = (typeof programsSpine.items)[number];

/**
 * Inicio · Programas. Una línea vertical recorre la sección y se dibuja con el scroll:
 * es el hilo que une Viajes, Marca personal y Formación. Los bloques se apoyan
 * alternadamente a cada lado y se conectan a la línea con una cota horizontal.
 */
export function ProgramsSpine() {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        // La línea crece con la lectura
        gsap.fromTo(
          ".spine__fill",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".spine__body", start: "top 65%", end: "bottom 65%", scrub: 0.6 } },
        );

        gsap.utils.toArray<HTMLElement>(".spine__block", el).forEach((b) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: b, start: "top 78%", once: true } });
          tl.fromTo(b.querySelector(".spine__frame"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.out" })
            .fromTo(b.querySelector(".spine__frame img"), { scale: 1.14 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0)
            .fromTo(b.querySelector(".spine__connector"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power2.inOut" }, 0.15)
            .fromTo(b.querySelectorAll(".spine__reveal"), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, 0.35)
            .fromTo(b.querySelector(".spine__inset"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.4, ease: "expo.out" }, 0.5);

          // Nodo de la línea: se enciende mientras el bloque ocupa el centro
          ScrollTrigger.create({ trigger: b, start: "top 55%", end: "bottom 45%", toggleClass: { targets: b, className: "is-current" } });

          // Parallax muy leve: la imagen principal y el detalle a velocidades distintas
          gsap.fromTo(b.querySelector(".spine__frame img"), { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: b, start: "top bottom", end: "bottom top", scrub: true } });
          gsap.fromTo(b.querySelector(".spine__inset-wrap"), { y: 30 }, { y: -30, ease: "none", scrollTrigger: { trigger: b, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
    },
    ref,
  );

  return (
    <section ref={ref} id="programas-inicio" className="spine section" data-tone="warm" aria-labelledby="spine-title">
      <div className="wrap">
        <header className="spine__head">
          <p className="label spine__kicker">{programsSpine.kicker}</p>
          <RevealText id="spine-title" className="spine__title display" lines={[programsSpine.title]} />
        </header>

        <div className="spine__body">
          <div className="spine__line" aria-hidden="true">
            <span className="spine__fill" />
          </div>
          <ol className="spine__list">
            {programsSpine.items.map((it, i) => (
              <li key={it.id} className={`spine__block spine__block--${i % 2 ? "right" : "left"} spine__block--${it.id}`}>
                <Block item={it} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Block({ item }: { item: Item }) {
  return (
    <article className="spine__article" aria-labelledby={`spine-${item.id}`}>
      <span className="spine__connector" aria-hidden="true">
        <span className="spine__node" />
      </span>

      <div className="spine__media">
        <figure className="spine__frame">
          <Photo name={item.main.image} alt={item.main.alt} sizes="(max-width: 767px) 86vw, 40vw" />
        </figure>
        <div className="spine__inset-wrap">
          <Inset item={item} />
        </div>
      </div>

      <div className="spine__text">
        <p className="spine__index label spine__reveal">
          <span>{item.n}</span>
          <span className="spine__verb">{item.verb}</span>
        </p>
        <h3 id={`spine-${item.id}`} className="spine__name display spine__reveal">
          {item.name}
        </h3>
        <p className="spine__desc spine__reveal">{item.text}</p>
        <Extra item={item} />
        <Link to={item.href} className="spine__cta spine__reveal" data-cursor="Entrar">
          <span>{item.cta}</span>
          <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </article>
  );
}

/** Pieza secundaria que se superpone a la imagen principal: el gesto propio de cada programa. */
function Inset({ item }: { item: Item }) {
  if (item.notes) {
    // Marca personal: una hoja de cuaderno con la trayectoria en construcción
    return (
      <div className="spine__inset spine__sheet" aria-hidden="true">
        <svg className="spine__sketch" viewBox="0 0 200 120" fill="none">
          <path d="M20 110V52a40 40 0 0 1 80 0v58" />
          <path d="M34 110V56a26 26 0 0 1 52 0v54" />
          <path d="M8 110h184M120 110V30h60v80M120 30l30-18 30 18" />
          <path d="M20 118h80M20 115v6M100 115v6" className="spine__sketch-dim" />
        </svg>
        <ul className="spine__notes">
          {item.notes.map((n, i) => (
            <li key={n}>
              <span className="spine__note-n">{String(i + 1).padStart(2, "0")}</span>
              {n}
            </li>
          ))}
        </ul>
        <span className="spine__swatch">
          <Photo name={item.detail.image} alt="" sizes="80px" />
        </span>
      </div>
    );
  }
  return (
    <figure className="spine__inset spine__detail">
      <Photo name={item.detail.image} alt={item.detail.alt} sizes="200px" />
    </figure>
  );
}

function Extra({ item }: { item: Item }) {
  if (item.history) {
    const h = item.history;
    return (
      <div className="spine__history spine__reveal">
        <p className="label spine__history-label">{h.pastLabel}</p>
        <ul className="spine__past">
          {h.past.map((p) => (
            <li key={p.year}>
              <span className="spine__year">{p.year}</span>
              <span className="spine__place serif">{p.place}</span>
              <span className="spine__note">{p.note}</span>
            </li>
          ))}
        </ul>
        <p className="spine__next">
          <span className="label">{h.nextLabel}</span>
          <span className="spine__next-line">
            <span className="spine__place serif">
              {h.next.place} {h.next.year}
            </span>
            <span className="spine__note">{h.next.note}</span>
          </span>
        </p>
      </div>
    );
  }
  if (item.formats) {
    return (
      <p className="spine__formats spine__reveal">
        {item.formats.map((f) => (
          <span key={f}>{f}</span>
        ))}
      </p>
    );
  }
  return null;
}
