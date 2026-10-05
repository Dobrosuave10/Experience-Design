import { Hero } from "../sections/Hero";
import { Idea } from "../sections/Idea";
import { Worlds } from "../sections/Worlds";
import { Touch } from "../sections/Touch";
import { HomeDestinations } from "../sections/HomeDestinations";
import { NeverLate } from "../sections/NeverLate";
import { Community } from "../sections/Community";
import { InviteBand } from "../sections/InviteBand";

/** Inicio: la entrada (WebGL), la idea, los tres programas, los destinos y la invitación. */
export default function Home() {
  return (
    <>
      <Hero />
      <Idea />
      <Worlds />
      <Touch />
      <HomeDestinations />
      <NeverLate />
      <Community />
      <InviteBand />
    </>
  );
}
