import type { CSSProperties } from "react";
import { brand } from "../content/site";
import "./Logo.css";

type Props = {
  size?: number | string;
  className?: string;
  /** true = decorativo (aria-hidden) */
  decorative?: boolean;
  /**
   * "mark": la "E." oficial, en el color del texto (navegación, menú, Hero).
   * "circle": la "E." negra sobre el círculo terracota del manual (footer, telón).
   * "square" se mantiene como alias de "mark".
   */
  shape?: "mark" | "circle" | "square";
};

/**
 * Logo oficial de Experience Design (marca "E.", vector extraído del PDF del manual).
 * El archivo se usa como máscara: la marca toma el color del tono activo, sin
 * mantener una versión por cada fondo.
 */
export function Logo({ size = 40, className, decorative = false, shape = "mark" }: Props) {
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": brand.name };
  const style = { "--logo-size": typeof size === "number" ? `${size}px` : size, "--logo-src": `url("${brand.logoAsset}")` } as CSSProperties;
  const kind = shape === "circle" ? "circle" : "mark";
  return (
    <span className={`logo logo--${kind} ${className ?? ""}`} style={style} {...a11y}>
      <span className="logo__mark" />
    </span>
  );
}
