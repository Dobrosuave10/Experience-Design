import { Hero } from "../sections/Hero";
import { Idea } from "../sections/Idea";
import { ProgramsSpine } from "../sections/ProgramsSpine";
import { Touch } from "../sections/Touch";
import { HomeDestinations } from "../sections/HomeDestinations";
import { NeverLate } from "../sections/NeverLate";
import { Community } from "../sections/Community";
import { InviteBand } from "../sections/InviteBand";

/** Inicio: la entrada (WebGL) que se abre a los tres programas, la idea, los destinos y la invitación. */
export default function Home() {
  return (
    <>
      <Hero />
      <ProgramsSpine />
      <Idea sequence />
      <Touch />
      <HomeDestinations />
      <NeverLate />
      <Community />
      <InviteBand />
    </>
  );
}
