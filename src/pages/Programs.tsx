import { programs, routes } from "../content/site";
import { PageHero } from "../components/PageHero";
import { NextChapter } from "../components/NextChapter";
import { ProgramDoors } from "../sections/ProgramDoors";

/** Programas: tres puertas independientes al mismo mundo. */
export default function Programs() {
  return (
    <>
      <PageHero
        id="programas"
        title={programs.title}
        lead={programs.lead}
        body={programs.body}
        crumbs={[{ label: "Experience Design", href: routes.inicio }, { label: programs.title }]}
        tone="ink"
        glow="#B7664F"
        aside={<p className="serif programs__question">{programs.question}</p>}
      />
      <ProgramDoors />
      <NextChapter />
    </>
  );
}
