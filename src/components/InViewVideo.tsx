import { useEffect, useRef, useState } from "react";
import { isLite, prefersReducedMotion, saveData } from "../lib/env";

type Props = { src: string; poster: string; label: string; className?: string };

/**
 * Video corto sin audio: silenciado, en bucle e inline. Sólo corre mientras está en
 * pantalla (y la pestaña visible); con movimiento reducido, o en un teléfono con ahorro
 * de datos, queda en su póster.
 */
export function InViewVideo({ src, poster, label, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  // En teléfonos, ni el póster se pide hasta que el video se acerca a la pantalla
  const [posterOn, setPosterOn] = useState(() => !isLite());

  useEffect(() => {
    const v = ref.current;
    if (posterOn || !v) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setPosterOn(true), { rootMargin: "600px" });
    io.observe(v);
    return () => io.disconnect();
  }, [posterOn]);

  useEffect(() => {
    const v = ref.current;
    if (!v || prefersReducedMotion() || (isLite() && saveData())) return;
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden) {
        if (v.preload === "none") v.preload = "auto";
        v.play().catch(() => {});
      } else v.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    }, { threshold: 0.25 });
    io.observe(v);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <video ref={ref} className={className} src={src} poster={posterOn ? poster : undefined} muted loop playsInline preload="none" aria-label={label} disablePictureInPicture />
  );
}
