import { useRef } from "react";
import { gsap } from "gsap";
import type { ImageName } from "../content/images.gen";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import { Photo } from "../components/Photo";
import { RevealText } from "../components/RevealText";
import "./Gallery.css";

type Props = {
  id: string;
  label: string;
  title: string;
  photos: { image: ImageName; alt: string }[];
  tone?: "paper" | "sand" | "ink" | "warm";
};

/**
 * Archivo de fotos reales de un viaje: columnas de alturas libres (cada foto en su
 * proporción, sin recortes), que entran desfasadas al bajar.
 */
export function Gallery({ id, label, title, photos, tone = "paper" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGsap(
    (mm, el) => {
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".gallery__item", el).forEach((it, i) => {
          gsap.fromTo(
            it,
            { opacity: 0, y: 40 + (i % 3) * 18 },
            { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: it, start: "top 94%", once: true } },
          );
        });
      });
    },
    ref,
  );

  return (
    <section ref={ref} className="gallery section" data-tone={tone} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <header className="gallery__head">
          <p className="label gallery__label">{label}</p>
          <RevealText id={`${id}-title`} as="h2" className="gallery__title display" lines={[title]} />
        </header>
        <ul className="gallery__grid">
          {photos.map((p) => (
            <li key={p.image} className="gallery__item">
              <Photo name={p.image} alt={p.alt} sizes="(max-width: 767px) 46vw, (max-width: 1199px) 31vw, 24vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
