import { Hero } from "../sections/Hero";
import { Idea } from "../sections/Idea";
import { ProgramsSpine } from "../sections/ProgramsSpine";
import { HomeDestinations } from "../sections/HomeDestinations";
import { NeverLate } from "../sections/NeverLate";
import { Community } from "../sections/Community";
import { neverLate } from "../content/site";
import { InviteBand } from "../sections/InviteBand";
import { HomeTransitions } from "../sections/HomeTransitions";

/** Inicio: la entrada (WebGL), la idea, los tres programas, los destinos y la invitación. */
export default function Home() {
  return (
    <HomeTransitions>
      <Hero />
      <Idea sequence />
      <ProgramsSpine />
      <HomeDestinations />
      <NeverLate body={neverLate.homeBody} />
      <Community />
      <InviteBand />
    </HomeTransitions>
  );
}
