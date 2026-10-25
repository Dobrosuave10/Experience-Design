import { useEffect, useLayoutEffect, type ComponentType } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initSmoothScroll, resetScroll } from "./lib/smoothScroll";
import { onReady } from "./lib/events";
import { onSamePage, usePath } from "./lib/router";
import { defaultDescription, notFoundTitle, pageDescriptions, pageTitles, routes } from "./content/site";
import { Loader } from "./components/Loader";
import { Navigation } from "./components/Navigation";
import { PageTransition } from "./components/PageTransition";
import { Footer } from "./sections/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import FormationPage from "./pages/FormationPage";
import PersonalBrandPage from "./pages/PersonalBrandPage";
import Destinations from "./pages/Destinations";
import MilanPage from "./pages/MilanPage";
import SaoPauloPage from "./pages/SaoPauloPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

/* Las páginas son livianas (el peso está en three.js, que ya se carga en diferido):
   van en el bundle principal para que el telón nunca descubra una página a medio cargar. */
const pages: Record<string, ComponentType> = {
  [routes.inicio]: Home,
  [routes.nosotros]: About,
  [routes.programas]: Programs,
  [routes.formacion]: FormationPage,
  [routes.marcaPersonal]: PersonalBrandPage,
  [routes.destinos]: Destinations,
  [routes.milan]: MilanPage,
  [routes.saoPaulo]: SaoPauloPage,
  [routes.contacto]: ContactPage,
};

/**
 * Cambia el tono de la página (fondo/texto) según la sección que ocupa el centro
 * de la pantalla. El color transiciona en el body: la página "cambia de luz".
 * Se rearma en cada página.
 */
function useToneController(path: string) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    // Tono inicial: la primera sección de la página
    const first = document.querySelector<HTMLElement>("main [data-tone]");
    if (first) root.dataset.tone = first.dataset.tone;
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
  }, [path]);
}

export default function App() {
  const path = usePath();
  useEffect(() => initSmoothScroll(), []);
  useToneController(path);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    const off = onReady(() => requestAnimationFrame(refresh));
    const offSame = onSamePage(() => resetScroll());
    return () => {
      off();
      offSame();
    };
  }, []);

  // Cada página empieza arriba (también al volver con el botón Atrás, que no pasa por el telón)
  useLayoutEffect(() => {
    resetScroll();
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    document.title = pageTitles[path] ?? notFoundTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", pageDescriptions[path] ?? defaultDescription);
    return () => cancelAnimationFrame(raf);
  }, [path]);

  const Page = pages[path] ?? NotFound;

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Loader />
      <Navigation />
      <PageTransition />
      <main id="contenido" key={path}>
        <Page />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
