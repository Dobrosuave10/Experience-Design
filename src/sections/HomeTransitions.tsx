import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGsap } from "../hooks/useGsap";
import { MOTION_OK } from "../lib/env";
import "./HomeTransitions.css";

/**
 * Inicio: las uniones entre secciones, como un solo recorrido.
 * Cada transición sigue la posición real del scroll (scrub): nunca fija la pantalla ni
 * hace esperar, se deshace al volver y un scroll rápido la deja en su estado final.
 * Sólo mueve variables CSS y máscaras de las uniones; no toca la escena 3D del Hero ni
 * las animaciones propias de cada sección. Sin movimiento, las uniones quedan abiertas.
 *
 *  1 · Túnel → "El diseño no solo se observa": el papel sube por una abertura en arco que
 *      se ensancha, como la luz de la salida del túnel.
 *  2 · → Descubrir / Expresar / Formación: un eje terracota baja hasta la etiqueta.
 *  3 · → Destinos: la sala oscura entra como un plano de esquinas suaves que se endereza;
 *      su imagen se descubre desde su propia máscara.
 *  4 · Destinos → "Nunca es tarde": el plano oscuro cierra su borde inferior al salir.
 */
export function HomeTransitions({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(
    (mm, root) => {
      mm.add(MOTION_OK, () => {
        const sheet = root.querySelector<HTMLElement>(".hero + .idea");
        if (sheet) {
          gsap.fromTo(sheet, { "--open": 0 }, { "--open": 1, ease: "none", scrollTrigger: { trigger: sheet, start: "top bottom", end: "top 55%", scrub: true } });
        }

        const head = root.querySelector<HTMLElement>(".idea + .spine .spine__head");
        if (head) {
          gsap.fromTo(head, { "--axis": 0 }, { "--axis": 1, ease: "none", scrollTrigger: { trigger: head, start: "top 95%", end: "top 62%", scrub: true } });
        }

        const room = root.querySelector<HTMLElement>(".spine + .hdest");
        if (room) {
          gsap.fromTo(room, { "--enter": 0 }, { "--enter": 1, ease: "none", scrollTrigger: { trigger: room, start: "top bottom", end: "top 45%", scrub: true } });
          gsap.fromTo(room, { "--leave": 0 }, { "--leave": 1, ease: "none", scrollTrigger: { trigger: room, start: "bottom 90%", end: "bottom 35%", scrub: true } });
          const media = room.querySelector(".hdest__media");
          if (media) {
            gsap.fromTo(
              media,
              { clipPath: "inset(16% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: media, start: "top 95%", end: "top 55%", scrub: true } },
            );
          }
        }
      });
    },
    ref,
  );

  return (
    <div ref={ref} className="home-flow">
      {children}
    </div>
  );
}
