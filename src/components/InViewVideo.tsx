import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/env";

type Props = { src: string; poster: string; label: string; className?: string };

/**
 * Video corto sin audio: silenciado, en bucle e inline. Sólo corre mientras está en
 * pantalla (y la pestaña visible); con movimiento reducido queda en su póster.
 */
export function InViewVideo({ src, poster, label, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || prefersReducedMotion()) return;
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
    <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} disablePictureInPicture />
  );
}
