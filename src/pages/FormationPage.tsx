import { formationPage as page, programPending, programs } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { Pending } from "../components/Pending";
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
      <Pending title={page.closeTitle} body={page.closeBody} items={page.pending} status={programPending.status} cta="Quiero saber más" interest={program.interest} tone="ink" />
      <NextChapter tone="ink" />
    </>
  );
}
