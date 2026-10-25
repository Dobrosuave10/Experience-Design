import { saoPaulo } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { Pending } from "../components/Pending";
import { SaoPaulo } from "../sections/SaoPaulo";
import { Gallery } from "../sections/Gallery";

/** Destino 02: São Paulo, CASACOR. */
export default function SaoPauloPage() {
  return (
    <>
      <SaoPaulo />
      <Gallery id="sp-galeria" label={saoPaulo.galleryLabel} title={saoPaulo.galleryTitle} photos={saoPaulo.gallery} tone="paper" />
      <Pending title={saoPaulo.pending.title} body={saoPaulo.pending.body} items={saoPaulo.pending.items} status={saoPaulo.pending.status} cta={saoPaulo.cta} interest="sao-paulo" tone="clay" />
      <NextChapter tone="ink" />
    </>
  );
}
