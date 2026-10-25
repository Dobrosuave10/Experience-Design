import { milan } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { Milan, MilanClose } from "../sections/Milan";
import { Itinerary } from "../sections/Itinerary";
import { Gallery } from "../sections/Gallery";
import { Community } from "../sections/Community";

/** Destino 01: Milán, Milan Design Week / Salone del Mobile. */
export default function MilanPage() {
  return (
    <>
      <Milan />
      <Itinerary />
      <Gallery id="milan-galeria" label={milan.galleryLabel} title={milan.galleryTitle} photos={milan.gallery} tone="paper" />
      <MilanClose />
      <Community />
      <NextChapter tone="ink" />
    </>
  );
}
