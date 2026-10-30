import { brand, saoPaulo } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { SaoPaulo } from "../sections/SaoPaulo";
import { Gallery } from "../sections/Gallery";
import { MilanCta } from "../sections/MilanDetails";

/** Destino 02: São Paulo, CASACOR. */
export default function SaoPauloPage() {
  return (
    <>
      <SaoPaulo />
      <Gallery id="sp-galeria" label={saoPaulo.galleryLabel} title={saoPaulo.galleryTitle} photos={saoPaulo.gallery} tone="paper" />
      <MilanCta tone="clay" label={saoPaulo.cta} href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Hola, quiero saber de São Paulo")}`} />
      <NextChapter tone="ink" />
    </>
  );
}
