import { ArrowRight } from "@phosphor-icons/react";
import { chapterOrder, nextChapter } from "../content/site";
import { usePath } from "../lib/router";
import { Link } from "./Link";
import "./NextChapter.css";

/** Cierre de cada página: el nombre de la siguiente, enorme, como pasar de página. */
export function NextChapter({ tone = "ink" }: { tone?: "ink" | "paper" | "sand" | "clay" }) {
  const path = usePath();
  const i = chapterOrder.findIndex((c) => c.href === path);
  const next = chapterOrder[(i + 1) % chapterOrder.length];

  return (
    <section className="next section" data-tone={tone} aria-label={nextChapter.label}>
      <Link to={next.href} className="next__link wrap" data-cursor="Seguir">
        <span className="next__label label">
          {nextChapter.label} · {String(((i + 1) % chapterOrder.length) + 1).padStart(2, "0")}
        </span>
        <span className="next__title display">
          {next.label}
          <ArrowRight className="next__arrow" weight="light" aria-hidden />
        </span>
      </Link>
    </section>
  );
}
