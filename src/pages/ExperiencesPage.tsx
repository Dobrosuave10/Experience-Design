import { programs } from "../content/site";
import { ProgramHero } from "../sections/ProgramHero";
import { Experiences } from "../sections/Experiences";

const program = programs.items.find((p) => p.id === "experiencias")!;

/** Programa 01: Experiencias. Como Formación, sin "Para quién es": termina en Destinos. */
export default function ExperiencesPage() {
  return (
    <>
      <ProgramHero program={program} />
      <Experiences />
    </>
  );
}
