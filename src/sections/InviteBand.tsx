import { invite, inscripcionHref } from "../content/site";
import { MagneticButton } from "../components/MagneticButton";
import { RevealText } from "../components/RevealText";
import "./InviteBand.css";

/** Invitación corta: lleva directo al formulario de inscripción, en una pestaña nueva. */
export function InviteBand() {
  return (
    <section className="invite section" data-tone="clay" aria-labelledby="invite-title">
      <div className="wrap invite__inner">
        <RevealText id="invite-title" className="invite__title display" lines={[invite.title]} />
        <div className="invite__side">
          <p>{invite.body}</p>
          <MagneticButton href={inscripcionHref()} external>
            {invite.cta}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
