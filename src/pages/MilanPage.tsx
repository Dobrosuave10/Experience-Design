import { inscripcionHref, milan } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { Pending } from "../components/Pending";
import { Testimonials } from "../components/Testimonials";
import { Milan, MilanIntro, MilanRooms } from "../sections/Milan";
import { Itinerary } from "../sections/Itinerary";
import { Gallery } from "../sections/Gallery";
import { MilanAudience, MilanCta, MilanFit, MilanIncludes, MilanPlaces, MilanSteps } from "../sections/MilanDetails";

/**
 * Destino 01: Milán 2027. Primero cómo ser parte y quienes ya viajaron; después el detalle
 * de la ficha oficial, y las fotos al final. Todo "Quiero ser parte" lleva al formulario.
 */
export default function MilanPage() {
  return (
    <>
      <Milan />
      <MilanSteps tone="paper" />
      <Testimonials tone="sand" />
      <MilanCta tone="sand" />
      <Itinerary />
      <MilanIncludes tone="paper" />
      <MilanPlaces tone="sand" />
      <MilanAudience tone="paper" />
      <MilanFit tone="ink" />
      <Pending title={milan.facts.title} body={milan.facts.body} items={milan.facts.items} cta={milan.cta} interest="milan" href={inscripcionHref()} external tone="clay" />
      <MilanIntro />
      <MilanRooms />
      <Gallery id="milan-galeria" label={milan.galleryLabel} title={milan.galleryTitle} photos={milan.gallery} tone="warm" />
      <MilanCta tone="warm" />
      <NextChapter tone="ink" />
    </>
  );
}
