import { useId } from "react";
import { Plus } from "@phosphor-icons/react";
import type { ArchiveEntry } from "../content/site";
import { MaterialPlate } from "./MaterialPlate";
import "./ExperienceCard.css";

type Props = {
  entry: ArchiveEntry;
  open: boolean;
  onToggle: () => void;
};

/** Fila del archivo de experiencias. Se expande para contar qué pasó (o qué viene). */
export function ExperienceCard({ entry, open, onToggle }: Props) {
  const id = useId();
  return (
    <li className={`xcard ${open ? "is-open" : ""} ${entry.status ? `xcard--${entry.status}` : ""}`}>
      <h3 className="xcard__heading">
        <button className="xcard__row" aria-expanded={open} aria-controls={id} onClick={onToggle}>
          <span className="xcard__year label">{entry.year}</span>
          <span className="xcard__place display">{entry.place}</span>
          <span className="xcard__tag label">{entry.tag}</span>
          <Plus className="xcard__icon" size={20} weight="light" aria-hidden />
        </button>
      </h3>
      <div id={id} className="xcard__panel" role="region" aria-label={entry.place}>
        <div className="xcard__panel-inner">
          <div className="xcard__content">
            <p className="xcard__text serif">{entry.text}</p>
            <div className="xcard__plate">
              <MaterialPlate material={entry.material} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
