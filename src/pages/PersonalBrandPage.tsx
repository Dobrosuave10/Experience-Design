import { media, personalBrandPage as page, programs } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { ProgramHero } from "../sections/ProgramHero";
import { NeverLate } from "../sections/NeverLate";
import { WordList } from "../sections/WordList";
import { PersonalBrand } from "../sections/PersonalBrand";
import { Audience } from "../sections/Audience";
import { MediaStrip } from "../sections/MediaStrip";

const program = programs.items.find((p) => p.id === "marca-personal")!;

/** Programa 03: Marca personal. Íntimo, retrato, cursiva, terracota. */
export default function PersonalBrandPage() {
  return (
    <>
      <ProgramHero program={program} />
      <NeverLate label={page.notLabel} doubts={page.not} answer={page.notAnswer} body={page.notBody} tone="paper" />
      <WordList id="mp-focus" variant="index" tone="paper" groups={[{ label: page.focusLabel, items: page.focus }]} />
      <PersonalBrand />
      <MediaStrip id="marca-videos" label={media.marcaPersonal.label} items={media.marcaPersonal.items} uniform="3 / 4" tone="paper" />
      <Audience program={program} tone="paper" />
      <NextChapter tone="sand" />
    </>
  );
}
