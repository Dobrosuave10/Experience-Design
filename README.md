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

## Imágenes

Los originales viven en `assets-src/` con nombres descriptivos. Para agregar o reemplazar una:

```bash
npm run images   # genera WebP en 480/960/1600 px en public/img y src/content/images.gen.ts
```

Luego asígnala por nombre en `src/content/site.ts` (campo `image`).

| Imagen | Dónde se usa |
|---|---|
| `wordmark` (fondo eliminado automáticamente) | Hero, sobre el titular |
| `milan-esferas`, `materiales`, `fundadores-showroom` | Vértices del triángulo de ejes |
| `milan-showroom` | Apertura de Milán (pantalla completa) |
| `milan-ciudad`, `salone-pabellon`, `milan-patio`, `salone-personas`, `showroom-piedra`, `instalacion-roja` | Capítulos de Milán 01 a 06 |
| `salone-banderas` | Junto a "Lo concreto, apenas esté confirmado" |
| `materiales` | Formación |
| `charla-showroom` | Comunidad |
| `danae`, `christian` | Fundadores |

## Pendiente de la marca (no inventado)

| Qué | Dónde |
|---|---|
| Sello circular oficial (SVG) | `public/brand/logo.svg` + `brand.logoAsset` en `site.ts`. Hoy se usa una reconstrucción del sello terracota con "E.". |
| Email / WhatsApp verificados | `brand.email`, `brand.whatsapp` |
| Endpoint del formulario | `VITE_LEAD_ENDPOINT` en `.env.local` (ver `.env.example`) |
| Imagen para compartir (og:image 1200x630) | `index.html` |
| Biografías | `founders.people[].bio` |

## Accesibilidad y rendimiento

- `prefers-reduced-motion`: sin Lenis, sin recorrido 3D, sin secciones fijas; todo el contenido visible.
- Sin WebGL: composición estática equivalente del sello y el arco.
- Three.js se carga en diferido y sólo renderiza mientras el hero está en pantalla; en móvil baja resolución y sin sombras.
