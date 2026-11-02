import { milan, milanChapters, type MilanChapterId } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { Testimonials } from "../components/Testimonials";
import { FloatingEnroll } from "../components/FloatingEnroll";
import { ChapterIndex } from "../components/ChapterIndex";
import { Milan, MilanIntro, MilanRooms } from "../sections/Milan";
import { Itinerary } from "../sections/Itinerary";
import { Gallery } from "../sections/Gallery";
import { MilanAudience, MilanCta, MilanFit, MilanIncludes, MilanPlaces, MilanSteps } from "../sections/MilanDetails";
import "./MilanPage.css";

/** Encabezado común de cada capítulo: número grande, título en una línea y una frase. */
function Chapter({ id, children }: { id: MilanChapterId; children: React.ReactNode }) {
  const c = milanChapters.items.find((x) => x.id === id)!;
  return (
    <section id={id} className="chap" data-tone={c.tone} aria-labelledby={`${id}-title`}>
      <header className="chap__head wrap">
        <span className="chap__n serif" aria-hidden="true">
          <em>{c.n}</em>
        </span>
        <h2 id={`${id}-title`} className="chap__title display">
          <span className="sr-only">{c.n} </span>
          {c.title}
        </h2>
        <p className="chap__sub">{c.sub}</p>
      </header>
      {children}
    </section>
  );
}

/**
 * Destino 01: Milano Design Week 2027. El hero y luego seis capítulos con un índice
 * fijo: la experiencia, el programa, qué incluye, cómo se vivió en 2026, testimonios
 * e inscripción. Cada capítulo cambia de fondo (marfil, arena, oscuro) para que se
 * vea dónde empieza y dónde termina. Página compacta (MilanPage.css) y un botón fijo
 * al formulario después del hero.
 */
export default function MilanPage() {
  const tone = (id: MilanChapterId) => milanChapters.items.find((x) => x.id === id)!.tone;
  return (
    <div className="milan-page">
      <Milan />
      <div className="milan-chapters">
        <ChapterIndex items={milanChapters.items} label={milanChapters.label} />
        <Chapter id="la-experiencia">
          <MilanIntro tone={tone("la-experiencia")} />
          <MilanAudience tone={tone("la-experiencia")} />
          <MilanFit tone={tone("la-experiencia")} />
          <MilanCta tone={tone("la-experiencia")} />
        </Chapter>
        <Chapter id="el-programa">
          <Itinerary tone={tone("el-programa")} />
          <MilanPlaces tone={tone("el-programa")} />
        </Chapter>
        <Chapter id="que-incluye">
          <MilanIncludes tone={tone("que-incluye")} />
        </Chapter>
        <Chapter id="como-se-vivio">
          <MilanRooms tone={tone("como-se-vivio")} />
          <Gallery id="milan-galeria" label={milan.galleryLabel} title={milan.galleryTitle} photos={milan.gallery} tone={tone("como-se-vivio")} />
        </Chapter>
        <Chapter id="testimonios">
          <Testimonials tone={tone("testimonios")} />
        </Chapter>
        <Chapter id="inscribete">
          <MilanSteps tone={tone("inscribete")} />
        </Chapter>
      </div>
      <NextChapter tone="ink" />
      <FloatingEnroll label={milan.floatingCta} after=".milan__open" hideOn=".md__enroll--final" />
    </div>
  );
}
