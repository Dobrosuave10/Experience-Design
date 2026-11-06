import { media, programs } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { ProgramHero } from "../sections/ProgramHero";
import { Formation } from "../sections/Formation";
import { Audience } from "../sections/Audience";
import { MediaStrip } from "../sections/MediaStrip";

const program = programs.items.find((p) => p.id === "formacion")!;

/** Programa 02: Formación. Retícula y material: aprender prepara la mirada. */
export default function FormationPage() {
  return (
    <>
      <ProgramHero program={program} />
      <Formation interest={program.interest} tone="paper" showStatus={false} />
      <MediaStrip id="formacion-videos" label={media.formacion.label} items={media.formacion.items} columns={4} tone="paper" />
      <Audience program={program} tone="sand" />
      <NextChapter tone="ink" />
    </>
  );
}
