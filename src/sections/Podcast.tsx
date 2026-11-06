import { podcast } from "../content/site";
import { InViewVideo } from "../components/InViewVideo";
import { MagneticButton } from "../components/MagneticButton";
import { RevealText } from "../components/RevealText";
import "./Podcast.css";

/** Inicio: un fragmento del podcast (sin audio, en bucle) y el enlace al canal de YouTube. */
export function Podcast() {
  return (
    <section className="podcast section" data-tone="ink" aria-labelledby="podcast-title">
      <div className="wrap podcast__grid">
        <div className="podcast__text">
          <p className="label podcast__label">{podcast.label}</p>
          <RevealText id="podcast-title" as="h2" className="podcast__title display" lines={[podcast.title]} />
          <MagneticButton href={podcast.url} external>
            {podcast.cta}
          </MagneticButton>
        </div>
        <figure className="podcast__video">
          <InViewVideo src={podcast.video.src} poster={podcast.video.poster} label={podcast.alt} />
        </figure>
      </div>
    </section>
  );
}
