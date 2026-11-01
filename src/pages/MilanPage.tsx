import { milan } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { Testimonials } from "../components/Testimonials";
import { FloatingEnroll } from "../components/FloatingEnroll";
import { Milan, MilanIntro, MilanRooms } from "../sections/Milan";
import { Itinerary } from "../sections/Itinerary";
import { Gallery } from "../sections/Gallery";
import { MilanAudience, MilanCta, MilanFit, MilanIncludes, MilanPlaces, MilanSteps } from "../sections/MilanDetails";
import "./MilanPage.css";

/**
 * Destino 01: Milán 2027, en el orden que pidió el cliente:
 * 1. Qué es el viaje (apertura, idea, para quiénes, ¿es para ti?).
 * 2. Qué vas a ver (itinerario, los seis escenarios, qué incluye).
 * 3. Cómo se vivió (los capítulos oscuros).
 * 4. Fotos.
 * 5. Testimonios.
 * 6. Cómo ser parte y el gran "Quiero ser parte".
 * Página compacta (MilanPage.css) y un botón fijo al formulario después del hero.
 */
export default function MilanPage() {
  return (
    <div className="milan-page">
      {/* 1 · Qué es */}
      <Milan />
      <MilanIntro />
      <MilanAudience tone="paper" />
      <MilanFit tone="ink" />
      <MilanCta tone="ink" />
      {/* 2 · Qué vas a ver */}
      <Itinerary />
      <MilanPlaces tone="sand" />
      <MilanIncludes tone="paper" />
      {/* 3 · Cómo se vivió */}
      <MilanRooms />
      {/* 4 · Fotos */}
      <Gallery id="milan-galeria" label={milan.galleryLabel} title={milan.galleryTitle} photos={milan.gallery} tone="warm" />
      <MilanCta tone="warm" />
      {/* 5 · Testimonios */}
      <Testimonials tone="sand" />
      {/* 6 · Cómo ser parte */}
      <MilanSteps tone="paper" />
      <NextChapter tone="ink" />
      <FloatingEnroll label={milan.floatingCta} after=".milan__open" hideOn=".md__enroll--final" />
    </div>
  );
}
