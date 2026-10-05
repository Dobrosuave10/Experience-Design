import { NextChapter } from "../components/NextChapter";
import { Milan } from "../sections/Milan";
import { Community } from "../sections/Community";

/** Destino 01: Milán, Milan Design Week / Salone del Mobile. */
export default function MilanPage() {
  return (
    <>
      <Milan />
      <Community />
      <NextChapter tone="ink" />
    </>
  );
}
