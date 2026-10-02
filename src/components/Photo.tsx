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

/** Imagen de marca optimizada (WebP + srcset), diferida por defecto. */
export function Photo({ name, alt, sizes = "100vw", className, style, priority = false }: Props) {
  const img = images[name];
  return (
    <img
      src={img.src}
      srcSet={img.srcSet || undefined}
      sizes={img.srcSet ? sizes : undefined}
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
