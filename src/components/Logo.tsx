import { brand } from "../content/site";

type Props = {
  size?: number | string;
  className?: string;
  /** true = decorativo (aria-hidden) */
  decorative?: boolean;
};

/**
 * Sello de Experience Design.
 *
 * Si `brand.logoAsset` está definido se usa el archivo oficial.
 * Si no, se dibuja una reconstrucción PROVISORIA (círculo terracota con "E." negra)
 * basada en la descripción del logo. Reemplazar por el archivo oficial apenas esté disponible.
 */
export function Logo({ size = 40, className, decorative = false }: Props) {
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
