import { programPending, programs, studentsPage as page } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { Pending } from "../components/Pending";
import { ProgramHero } from "../sections/ProgramHero";
import { Journey } from "../sections/Journey";
import { WordList } from "../sections/WordList";
import { Community } from "../sections/Community";

const program = programs.items[1];

/** Programa 02: Estudiantes. Exploración, mayúsculas, recorrido horizontal. */
export default function StudentsPage() {
  return (
    <>
      <ProgramHero program={program} />
      <WordList
        id="es-audience"
        variant="cloud"
        tone="paper"
        groups={[
          { label: page.audienceLabel, items: page.levels },
          { label: "De", items: page.disciplines },
        ]}
      />
      <Journey label={page.journeyLabel} steps={page.journey} tone="sand" />
      <WordList id="es-gains" variant="cloud" tone="ink" groups={[{ label: page.gainsLabel, items: page.gains }]} />
      <Community />
      <Pending title={page.closeTitle} body={page.closeBody} items={page.pending} status={programPending.status} cta="Quiero saber más" interest={program.interest} tone="paper" />
      <NextChapter tone="paper" />
    </>
  );
}
