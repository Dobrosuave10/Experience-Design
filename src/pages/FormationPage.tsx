import { programs } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { ProgramHero } from "../sections/ProgramHero";
import { Formation } from "../sections/Formation";
import { Audience } from "../sections/Audience";

const program = programs.items[0];

/** Programa 01: Formación. Retícula y material: aprender prepara la mirada. */
export default function FormationPage() {
  return (
    <>
      <ProgramHero program={program} />
      <Formation interest={program.interest} tone="paper" showStatus={false} />
      <Audience program={program} tone="sand" />
      <NextChapter tone="ink" />
    </>
  );
}
