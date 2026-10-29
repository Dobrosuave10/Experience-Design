import { milan } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { Pending } from "../components/Pending";
import { Testimonials } from "../components/Testimonials";
import { Milan } from "../sections/Milan";
import { Itinerary } from "../sections/Itinerary";
import { Gallery } from "../sections/Gallery";
import { MilanAudience, MilanFit, MilanIncludes, MilanPlaces, MilanSteps } from "../sections/MilanDetails";

/** Destino 01: Milán, Milan Design Week / Salone del Mobile. Misma estructura que São Paulo, más el detalle de la ficha 2027. */
export default function MilanPage() {
  return (
    <>
      <Milan />
      <MilanAudience tone="paper" />
      <Itinerary />
      <MilanPlaces tone="sand" />
      <MilanIncludes tone="paper" />
      <Gallery id="milan-galeria" label={milan.galleryLabel} title={milan.galleryTitle} photos={milan.gallery} tone="warm" />
      <Testimonials tone="sand" />
      <MilanFit tone="ink" />
      <Pending title={milan.facts.title} body={milan.facts.body} items={milan.facts.items} cta={milan.cta} interest="milan" tone="clay" />
      <MilanSteps tone="paper" />
      <NextChapter tone="ink" />
    </>
  );
}
