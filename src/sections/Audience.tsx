import { programs, type Program } from "../content/site";
import { RevealText } from "../components/RevealText";
import "./Audience.css";

/** Para quién es cada programa: una línea para estudiantes y otra para profesionales. */
export function Audience({ program: p, tone = "paper" }: { program: Program; tone?: "paper" | "sand" | "ink" | "warm" }) {
  const rows = [
    { label: programs.audienceStudents, text: p.audience.students },
    { label: programs.audienceProfessionals, text: p.audience.professionals },
  ];
  return (
    <section className="audience section" data-tone={tone} aria-labelledby={`audience-${p.id}`}>
      <div className="wrap audience__grid">
        <p className="label audience__kicker">{p.name}</p>
        <RevealText id={`audience-${p.id}`} as="h2" className="audience__title display" lines={[programs.audienceLabel]} />
        <dl className="audience__list">
          {rows.map((r) => (
            <div key={r.label} className="audience__row">
              <dt className="audience__who serif">
                <em>{r.label}</em>
              </dt>
              <dd className="audience__text">{r.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
