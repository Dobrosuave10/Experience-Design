import { personalBrandPage as page, programs } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { ProgramHero } from "../sections/ProgramHero";
import { NeverLate } from "../sections/NeverLate";
import { WordList } from "../sections/WordList";
import { PersonalBrand } from "../sections/PersonalBrand";
import { Audience } from "../sections/Audience";

const program = programs.items[1];

/** Programa 02: Marca personal. Íntimo, retrato, cursiva, terracota. */
export default function PersonalBrandPage() {
  return (
    <>
      <ProgramHero program={program} />
      <NeverLate label={page.notLabel} doubts={page.not} answer={page.notAnswer} body={page.notBody} tone="paper" />
      <WordList id="mp-focus" variant="index" tone="paper" groups={[{ label: page.focusLabel, items: page.focus }]} />
      <PersonalBrand />
      <Audience program={program} tone="paper" />
      <NextChapter tone="sand" />
    </>
  );
}
