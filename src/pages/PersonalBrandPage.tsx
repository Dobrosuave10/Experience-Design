import { personalBrandPage as page, programPending, programs } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { Pending } from "../components/Pending";
import { ProgramHero } from "../sections/ProgramHero";
import { NeverLate } from "../sections/NeverLate";
import { WordList } from "../sections/WordList";
import { PersonalBrand } from "../sections/PersonalBrand";

const program = programs.items[0];

/** Programa 01: Marca personal. Íntimo, retrato, cursiva, terracota. */
export default function PersonalBrandPage() {
  return (
    <>
      <ProgramHero program={program} />
      <NeverLate label={page.notLabel} doubts={page.not} answer={page.notAnswer} body={page.notBody} tone="paper" />
      <WordList id="mp-focus" variant="index" tone="paper" groups={[{ label: page.focusLabel, items: page.focus }]} />
      <PersonalBrand />
      <Pending title={page.closeTitle} body={page.closeBody} items={page.pending} status={programPending.status} cta={program.cta.replace("Conocer", "Quiero conocer")} interest={program.interest} tone="sand" />
      <NextChapter tone="sand" />
    </>
  );
}
