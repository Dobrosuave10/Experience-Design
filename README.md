# Experience Design · experience-design.cl

Sitio de marca editorial e inmersivo. React + TypeScript + Vite, Three.js (hero), GSAP ScrollTrigger y Lenis.

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build
```

## Dónde se edita

- **Todo el texto y los datos:** `src/content/site.ts`. Lo que aún no está definido (fechas, valor, programa, cupos, cursos, biografías) se muestra como "Por confirmar", "En desarrollo" o "Próximamente".
- **Nuevo destino en el archivo:** agrega una entrada a `archive.entries`.
- **Colores y tipografía:** `src/styles/tokens.css`.

## Pendiente de la marca (no inventado)

| Qué | Dónde |
|---|---|
| Logo oficial (SVG) | `public/brand/logo.svg` + `brand.logoAsset` en `site.ts`. Hoy se usa una reconstrucción provisoria del sello. El 3D lo toma automáticamente. |
| Fotos reales | Cada espacio de imagen tiene `brief` en `site.ts` (comunidad x4, formación x1, retratos x2). Mientras falten se muestran placas de material. |
| Email / WhatsApp verificados | `brand.email`, `brand.whatsapp` |
| Endpoint del formulario | `VITE_LEAD_ENDPOINT` en `.env.local` (ver `.env.example`) |
| Imagen para compartir (og:image 1200x630) | `index.html` |

## Accesibilidad y rendimiento

- `prefers-reduced-motion`: sin Lenis, sin recorrido 3D, sin secciones fijas; todo el contenido visible.
- Sin WebGL: composición estática equivalente del sello y el arco.
- Three.js se carga en diferido y sólo renderiza mientras el hero está en pantalla; en móvil baja resolución y sin sombras.
