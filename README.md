# Experience Design · experience-design.cl

Sitio de marca editorial e inmersivo. React + TypeScript + Vite, Three.js (hero), GSAP ScrollTrigger y Lenis.

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build
```

## Páginas

| Ruta | Página |
|---|---|
| `/` | Inicio: hero WebGL, idea, los tres programas (triángulo), destinos, invitación |
| `/nosotros` | Quiénes somos, misión, visión, valores, filosofía, Danae + Christian |
| `/programas` | Tres puertas: Marca personal, Estudiantes, Profesionales |
| `/programas/marca-personal`, `/programas/estudiantes`, `/programas/profesionales` | Cada programa con su propia atmósfera |
| `/destinos` | Milán y São Paulo, más el archivo de lo recorrido |
| `/destinos/milan`, `/destinos/sao-paulo` | Cada destino |
| `/contacto` | Formulario corto (nombre, email, WhatsApp, interés). Acepta `?interes=milan` para preseleccionar |

Programas y destinos son cosas distintas: los programas responden "¿qué camino es para mí?", los destinos "¿qué experiencia puedo vivir?". No mezclarlos.

El router es propio (`src/lib/router.ts`, History API) y cada cambio de página pasa por el telón terracota de `PageTransition`. En el hosting, todas las rutas deben servir `index.html` (en Vercel: `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`).

## Dónde se edita

- **Todo el texto, las rutas y los datos:** `src/content/site.ts`. Lo que aún no está definido (fechas, valor, programa, cupos, cursos, biografías) se muestra como "Por confirmar", "En desarrollo" o "Próximamente".
- **Nuevo destino en el archivo:** agrega una entrada a `archive.entries`.
- **Colores y tipografía:** `src/styles/tokens.css`.

## Imágenes

Los originales viven en `assets-src/` con nombres descriptivos. Para agregar o reemplazar una:

```bash
npm run images   # genera WebP en 480/960/1600 px en public/img y src/content/images.gen.ts
```

Luego asígnala por nombre en `src/content/site.ts` (campo `image`). Donde todavía no hay foto se muestra una placa de material, y el `brief` de ese espacio (atributo `data-photo-brief` en el HTML) dice qué foto va ahí.

| Imagen | Dónde se usa |
|---|---|
| `wordmark` (fondo eliminado automáticamente) | Hero, sobre el titular |
| `fundadores-showroom`, `charla-showroom`, `showroom-piedra` | Marca personal, Estudiantes y Profesionales (triángulo de Inicio, puertas de Programas y apertura de cada programa); `fundadores-showroom` también en Nosotros |
| `materiales` | Profesionales (detalle de material y formatos) |
| `milan-showroom` | Apertura de Milán y su puerta en Destinos |
| `milan-ciudad`, `salone-pabellon`, `showroom-piedra`, `milan-patio`, `salone-personas`, `instalacion-roja` | Capítulos de Milán 01 a 06 |
| `salone-banderas` | Junto a "Lo concreto, apenas esté confirmado" en Milán |
| `charla-showroom` | Comunidad (Inicio, Estudiantes, Milán) |
| `danae`, `christian` | Nosotros |
| **Faltan:** fotos de São Paulo / CASACOR | Apertura de São Paulo (hoy celosía + terracota) y los cinco ambientes (`saoPaulo.rooms[].brief`) |
| **Falta:** foto propia de Marca personal | Hoy usa `fundadores-showroom` |

## Pendiente de la marca (no inventado)

| Qué | Dónde |
|---|---|
| Sello circular oficial (SVG) | `public/brand/logo.svg` + `brand.logoAsset` en `site.ts`. Hoy se usa una reconstrucción del sello terracota con "E.". |
| Email / WhatsApp verificados | `brand.email`, `brand.whatsapp` |
| Endpoint del formulario | `VITE_LEAD_ENDPOINT` en `.env.local` (ver `.env.example`) |
| Imagen para compartir (og:image 1200x630) | `index.html` |
| Biografías | `founders.people[].bio` |
| Misión, visión y valores (validar el borrador) | `about.principles`, `about.values` |
| Año de CASACOR São Paulo y fotos | `saoPaulo`, `destinations.items` |

## Accesibilidad y rendimiento

- `prefers-reduced-motion`: sin Lenis, sin recorrido 3D, sin secciones fijas; todo el contenido visible.
- Sin WebGL: composición estática equivalente del sello y el arco.
- Three.js se carga en diferido y sólo renderiza mientras el hero está en pantalla; en móvil baja resolución y sin sombras.
