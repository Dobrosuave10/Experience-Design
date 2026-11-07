import { milanVideo } from "../content/site";
import { InViewVideo } from "../components/InViewVideo";
import { MagneticButton } from "../components/MagneticButton";
import { RevealText } from "../components/RevealText";
import "./MilanVideo.css";

/** Inicio: un fragmento del video de Milán (sin audio, en bucle) y el enlace al canal de YouTube. */
export function MilanVideo() {
  return (
    <section className="mvideo section" data-tone="ink" aria-labelledby="mvideo-title">
      <div className="wrap mvideo__grid">
        <div className="mvideo__text">
          <RevealText id="mvideo-title" as="h2" className="mvideo__title display" lines={[milanVideo.title]} />
          <MagneticButton href={milanVideo.url} external>
            {milanVideo.cta}
          </MagneticButton>
        </div>
        <figure className="mvideo__video">
          <InViewVideo src={milanVideo.video.src} poster={milanVideo.video.poster} label={milanVideo.alt} />
        </figure>
      </div>
    </section>
  );
}
