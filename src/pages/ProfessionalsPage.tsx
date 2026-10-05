import { professionalsPage as page, programPending, programs } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { Pending } from "../components/Pending";
import { ProgramHero } from "../sections/ProgramHero";
import { NeverLate } from "../sections/NeverLate";
import { WordList } from "../sections/WordList";
import { Formation } from "../sections/Formation";

const program = programs.items[2];

/** Programa 03: Profesionales. Arquitectónico, material, retícula. */
export default function ProfessionalsPage() {
  return (
    <>
      <ProgramHero program={program} />
      <NeverLate tone="paper" />
      <WordList
        id="pr-audience"
        variant="grid"
        tone="ink"
        groups={[
          { label: page.audienceLabel, items: page.audience },
          { label: page.industriesLabel, items: page.industries },
        ]}
      />
      <WordList id="pr-gains" variant="grid" tone="sand" groups={[{ label: page.gainsLabel, items: page.gains }]} />
      <Formation interest={program.interest} tone="paper" showStatus={false} />
      <Pending title={page.closeTitle} body={page.closeBody} items={page.pending} status={programPending.status} cta="Quiero saber más" interest={program.interest} tone="ink" />
      <NextChapter tone="ink" />
    </>
  );
}
