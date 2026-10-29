import { milan } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { Pending } from "../components/Pending";
import { Milan } from "../sections/Milan";
import { Itinerary } from "../sections/Itinerary";
import { Gallery } from "../sections/Gallery";
import { Testimonials } from "../components/Testimonials";

/** Destino 01: Milán, Milan Design Week / Salone del Mobile. Misma estructura que São Paulo. */
export default function MilanPage() {
  return (
    <>
      <Milan />
      <Itinerary />
      <Gallery id="milan-galeria" label={milan.galleryLabel} title={milan.galleryTitle} photos={milan.gallery} tone="paper" />
      <Testimonials tone="warm" />
      <Pending title={milan.facts.title} body={milan.facts.body} items={milan.facts.items} cta={milan.cta} interest="milan" tone="clay" />
      <NextChapter tone="ink" />
    </>
  );
}
