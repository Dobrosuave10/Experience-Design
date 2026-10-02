import { useEffect, useLayoutEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initSmoothScroll } from "./lib/smoothScroll";
import { onReady } from "./lib/events";
import { Loader } from "./components/Loader";
import { Navigation } from "./components/Navigation";
import { Cursor } from "./components/Cursor";
import { Hero } from "./sections/Hero";
import { Idea } from "./sections/Idea";
import { Worlds } from "./sections/Worlds";
import { Touch } from "./sections/Touch";
import { Milan } from "./sections/Milan";
import { NeverLate } from "./sections/NeverLate";
import { Formation } from "./sections/Formation";
import { Community } from "./sections/Community";
import { PersonalBrand } from "./sections/PersonalBrand";
import { Founders } from "./sections/Founders";
import { Archive } from "./sections/Archive";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";

/**
 * Cambia el tono de la página (fondo/texto) según la sección que ocupa el centro
 * de la pantalla. El color transiciona en el body: la página "cambia de luz".
 */
function useToneController() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-tone]")).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) root.dataset.tone = el.dataset.tone;
        },
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);
}

export default function App() {
  useEffect(() => initSmoothScroll(), []);
  useToneController();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    const off = onReady(() => requestAnimationFrame(refresh));
    return () => {
      off();
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Loader />
      <Navigation />
      <Cursor />
      <main id="contenido">
        <Hero />
        <Idea />
        <Worlds />
        <Touch />
        <Milan />
        <NeverLate />
        <Formation />
        <Community />
        <PersonalBrand />
        <Founders />
        <Archive />
        <Contact />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
