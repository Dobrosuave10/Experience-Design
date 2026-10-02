import { worlds } from "../content/site";
import { AxesTriangle } from "../components/AxesTriangle";
import { RevealText } from "../components/RevealText";
import "./Worlds.css";

/**
 * 03 Descubrir. Los tres ejes no son tres tarjetas: son tres vértices de un mismo
 * sistema, con el sello al centro y "Conectar" como hilo entre ellos.
 */
export function Worlds() {
  return (
    <section className="worlds section" data-tone="sand" aria-labelledby="worlds-title">
      <div className="wrap">
        <RevealText id="worlds-title" className="worlds__title display" lines={[worlds.title]} />
        <AxesTriangle />
      </div>
    </section>
  );
}
