import { saoPaulo } from "../content/site";
import { NextChapter } from "../components/NextChapter";
import { Pending } from "../components/Pending";
import { SaoPaulo } from "../sections/SaoPaulo";

/** Destino 02: São Paulo, CASACOR. */
export default function SaoPauloPage() {
  return (
    <>
      <SaoPaulo />
      <Pending title={saoPaulo.pending.title} body={saoPaulo.pending.body} items={saoPaulo.pending.items} status={saoPaulo.pending.status} cta={saoPaulo.cta} interest="sao-paulo" tone="clay" />
      <NextChapter tone="ink" />
    </>
  );
}
