import type { CSSProperties } from "react";
import { images, type ImageName } from "../content/images.gen";

type Props = {
  name: ImageName;
  alt: string;
  /** Ancho que ocupará en pantalla, para que el navegador elija del srcset. */
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  /** Sólo para la imagen principal sobre el pliegue. */
  priority?: boolean;
};

/**
 * En teléfonos de 3x el navegador pedía la versión de 1350–1920 px para una foto de 390 px
 * de ancho. Antes del `sizes` original va una regla sólo para ellos que apunta a 2x:
 * se ve igual de nítido y pesa la mitad. Pantallas de más de 767 px no la cumplen.
 */
function phoneSizes(sizes: string) {
  const m = sizes.match(/^\(max-width: (?:767|899)px\) (\d+)vw/) ?? sizes.match(/^(\d+)vw$/);
  return m ? `(max-width: 767px) and (min-resolution: 2.5dppx) ${Math.round((+m[1] * 2) / 3)}vw, ${sizes}` : sizes;
}

/** Imagen de marca optimizada (WebP + srcset), diferida por defecto. */
export function Photo({ name, alt, sizes = "100vw", className, style, priority = false }: Props) {
  const img = images[name];
  return (
    <img
      src={img.src}
      srcSet={img.srcSet || undefined}
      sizes={img.srcSet ? phoneSizes(sizes) : undefined}
      width={img.w}
      height={img.h}
      alt={alt}
      className={className}
      style={style}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      draggable={false}
    />
  );
}
