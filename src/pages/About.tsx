import { about, media, routes } from "../content/site";
import { PageHero } from "../components/PageHero";
import { NextChapter } from "../components/NextChapter";
import { AboutWho, Positioning, Principles } from "../sections/About";
import { Idea } from "../sections/Idea";
import { Founders } from "../sections/Founders";
import { MediaStrip } from "../sections/MediaStrip";

/** Nosotros: quiénes somos, posicionamiento, propósito, misión, visión, valores, filosofía, Danae y Christian, y sus fotos y videos del viaje. */
export default function About() {
  return (
    <>
      <PageHero id="nosotros" title={about.title} lead={about.statement} crumbs={[{ label: "Experience Design", href: routes.inicio }, { label: about.title }]} tone="ink" glow="#C97B4A" />
      <AboutWho />
      <Positioning />
      <Principles />
      <Idea label={about.philosophyLabel} />
      <Founders label={about.foundersLabel} />
      <MediaStrip id="nosotros-collage" label={media.nosotros.label} items={media.nosotros.items} columns={4} tone="paper" />
      <NextChapter />
    </>
  );
}
