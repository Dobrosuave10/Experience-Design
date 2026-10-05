import type { ReactNode } from "react";
import type { MaterialName } from "../lib/materials";
import { MaterialPlate } from "./MaterialPlate";
import "./Louvers.css";

/**
 * Celosía de lamas verticales (brise-soleil), el gesto de la arquitectura moderna
 * paulista. Las lamas giran con el scroll (las anima quien la usa, sobre `.louver`)
 * y dejan ver lo que hay detrás. Es la identidad visual de São Paulo frente al
 * terrazzo y los arcos de Milán.
 */
export function Louvers({ count = 14, behind = "terracotta", children, className = "" }: { count?: number; behind?: MaterialName; children?: ReactNode; className?: string }) {
  return (
    <div className={`louvers ${className}`}>
      <div className="louvers__behind">
        <MaterialPlate material={behind} />
        {children}
      </div>
      <div className="louvers__slats" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="louver" />
        ))}
      </div>
    </div>
  );
}
