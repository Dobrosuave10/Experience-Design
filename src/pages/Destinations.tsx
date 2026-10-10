import { destinations, routes } from "../content/site";
import { PageHero } from "../components/PageHero";
import { NextChapter } from "../components/NextChapter";
import { DestinationPanels } from "../sections/DestinationPanels";
import { Archive } from "../sections/Archive";

/** Destinos: experiencias para vivir (no son programas). */
export default function Destinations() {
  return (
    <>
      <PageHero
        id="destinos"
        title={destinations.title}
        lead={destinations.pageLead}
        body={destinations.pageBody}
        crumbs={[{ label: "Experience Design", href: routes.inicio }, { label: destinations.title }]}
        tone="ink"
        glow="#B7664F"
        aside={<p className="serif programs__question">{destinations.question}</p>}
      />
      <DestinationPanels />
      <Archive />
      <NextChapter />
    </>
  );
}
