import { useId } from "react";
import { brand } from "../content/site";

type Props = {
  size?: number | string;
  className?: string;
  /** true = decorativo (aria-hidden) */
  decorative?: boolean;
  /** "square": el sello cuadrado de bronce (navbar y Hero); "circle": el sello original. */
  shape?: "circle" | "square";
};

/**
 * Sello de Experience Design.
 *
 * Si `brand.logoAsset` está definido se usa el archivo oficial.
 * Si no, se dibuja una reconstrucción PROVISORIA (círculo terracota con "E." negra)
 * basada en la descripción del logo. Reemplazar por el archivo oficial apenas esté disponible.
 */
export function Logo({ size = 40, className, decorative = false, shape = "circle" }: Props) {
  const gradId = useId();
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": brand.name };

  if (brand.logoAsset) {
    return (
      <img
        src={brand.logoAsset}
        alt={decorative ? "" : brand.name}
        width={typeof size === "number" ? size : undefined}
        height={typeof size === "number" ? size : undefined}
        className={className}
        style={{ width: size, height: size }}
      />
    );
  }

  if (shape === "square") {
    // Versión compacta del sello de bronce: esquinas suaves, luz arriba a la izquierda,
    // un filo claro apenas insinuado y la "E." grabada en un tono más profundo.
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} className={className} {...a11y}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b2673f" />
            <stop offset="0.55" stopColor="#97512f" />
            <stop offset="1" stopColor="#7a3f24" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="98" height="98" rx="12" fill={`url(#${gradId})`} />
        <rect x="2.5" y="2.5" width="95" height="95" rx="10.5" fill="none" stroke="rgba(255, 222, 196, 0.28)" strokeWidth="1.2" />
        <text
          x="51"
          y="53"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Cormorant Garamond, Times New Roman, serif"
          fontWeight="500"
          fontSize="58"
          fill="#3a1d11"
          fillOpacity="0.88"
        >
          E.
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} {...a11y}>
      <circle cx="50" cy="50" r="50" fill="#A6533F" />
      <text
        x="51"
        y="52"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Cormorant Garamond, Times New Roman, serif"
        fontWeight="500"
        fontSize="56"
        fill="#171513"
      >
        E.
      </text>
    </svg>
  );
}
