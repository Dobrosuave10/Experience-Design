import { community } from "../content/site";
import { Figure } from "../components/MaterialPlate";
import { RevealText } from "../components/RevealText";
import "./Community.css";

/**
 * 06 Conectar. La única franja en movimiento del sitio (disciplinas que se cruzan)
 * y una hoja de contactos con las fotos reales del grupo.
 */
export function Community() {
  const loop = [...community.disciplines, ...community.disciplines];

  return (
    <section className="community section" data-tone="sand" aria-labelledby="community-title">
      <div className="wrap">
        <RevealText id="community-title" className="community__title display" lines={[community.title]} />
      </div>

      <div className="community__marquee" aria-hidden="true">
        <div className="community__marquee-track serif">
          {loop.map((d, i) => (
            <span key={i} className="community__disc">
              <em>{d}</em>
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">Personas de {community.disciplines.join(", ")}.</p>

      <div className="wrap community__sheet">
        <Figure slot={community.images[0]} ratio="4 / 5" className="community__img community__img--a" />
        <Figure slot={community.images[1]} ratio="1 / 1" className="community__img community__img--b" />
        <p className="community__body serif">{community.body}</p>
        <Figure slot={community.images[2]} ratio="3 / 4" className="community__img community__img--c" />
        <Figure slot={community.images[3]} ratio="4 / 3" className="community__img community__img--d" />
      </div>
    </section>
  );
}
