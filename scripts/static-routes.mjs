/**
 * Después de `vite build`: copia dist/index.html a dist/<ruta>/index.html para cada ruta
 * de `routes` (src/content/site.ts). Así los enlaces directos funcionan en cualquier
 * hosting de archivos estáticos, aunque el servidor no tenga reglas de reescritura.
 */
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const site = readFileSync(join(root, "src/content/site.ts"), "utf8");
const block = site.match(/export const routes = \{([\s\S]*?)\} as const;/);
if (!block) throw new Error("No se encontró `routes` en src/content/site.ts");
const paths = [...block[1].matchAll(/:\s*"([^"]+)"/g)].map((m) => m[1]).filter((p) => p !== "/");

for (const p of paths) {
  const dir = join(dist, p);
  mkdirSync(dir, { recursive: true });
  copyFileSync(join(dist, "index.html"), join(dir, "index.html"));
}
console.log(`static-routes: ${paths.length} rutas → ${paths.join(", ")}`);
