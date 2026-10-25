import { destinations, routes } from "../content/site";
import { PageHero } from "../components/PageHero";
import { NextChapter } from "../components/NextChapter";
import { DestinationsRail } from "../sections/DestinationsRail";
import { Archive } from "../sections/Archive";

/** Destinos: experiencias para vivir (no son programas). Milán y São Paulo, cada uno con su collage. */
export default function Destinations() {
  return (
    <>
      <PageHero
        id="destinos"
        title={destinations.title}
        lead={destinations.lead}
        crumbs={[{ label: "Experience Design", href: routes.inicio }, { label: destinations.title }]}
        tone="ink"
        glow="#C97B4A"
        aside={<p className="serif programs__question">{destinations.question}</p>}
      />
      <DestinationsRail />
      <Archive />
      <NextChapter />
    </>
  );
}
