import { programs, routes } from "../content/site";
import { PageHero } from "../components/PageHero";
import { NextChapter } from "../components/NextChapter";
import { ProgramsRail } from "../sections/ProgramsRail";

/** Programas: Formación y Marca personal, uno por pantalla sobre la línea. */
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
        glow="#C97B4A"
        aside={<p className="serif programs__question">{programs.question}</p>}
      />
      <ProgramsRail />
      <NextChapter />
    </>
  );
}
