import { useState } from "react";
import { touch } from "../content/site";
import { MaterialPlate } from "../components/MaterialPlate";
import { RevealText } from "../components/RevealText";
import "./Touch.css";

/**
 * 04 Tocar. Una muestra de materiales: al pasar (o tocar en móvil) una franja,
 * se abre y la luz sigue a la mano.
 */
export function Touch() {
  const [active, setActive] = useState(0);

  return (
    <section className="touch section" data-tone="paper" aria-labelledby="touch-title">
      <div className="wrap touch__head">
        <RevealText id="touch-title" className="touch__title display" lines={[touch.title]} />
        <p className="touch__body muted">{touch.body}</p>
      </div>

      <div className="wrap">
        <div className="touch__strip" role="group" aria-label="Muestras de material">
          {touch.materials.map((m, i) => (
            <button
              key={m.name}
              className={`touch__swatch ${i === active ? "is-active" : ""}`}
              aria-pressed={i === active}
              aria-label={m.label}
              data-cursor="Tocar"
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <MaterialPlate material={m.name} />
            </button>
          ))}
        </div>
        <p className="touch__name serif" aria-live="polite">
          {touch.materials[active].label}
        </p>
      </div>
    </section>
  );
}
