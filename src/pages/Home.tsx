import { Hero } from "../sections/Hero";
import { Idea } from "../sections/Idea";
import { ProgramsSpine } from "../sections/ProgramsSpine";
import { HomeDestinations } from "../sections/HomeDestinations";
import { NeverLate } from "../sections/NeverLate";
import { Community } from "../sections/Community";
import { neverLate } from "../content/site";
import { InviteBand } from "../sections/InviteBand";
import { Podcast } from "../sections/Podcast";

/** Inicio: la entrada (WebGL), la idea, los tres ejes, los destinos, la invitación y el podcast. */
export default function Home() {
  return (
    <>
      <Hero />
      <Idea sequence />
      <ProgramsSpine />
      <HomeDestinations />
      <NeverLate body={neverLate.homeBody} />
      <Community />
      <InviteBand />
      <Podcast />
    </>
  );
}
