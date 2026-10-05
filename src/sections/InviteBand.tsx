import { invite, routes } from "../content/site";
import { navigate } from "../lib/router";
import { MagneticButton } from "../components/MagneticButton";
import { RevealText } from "../components/RevealText";
import "./InviteBand.css";

/** Invitación corta a Contacto (el formulario vive en su propia página). */
export function InviteBand() {
  return (
    <section className="invite section" data-tone="clay" aria-labelledby="invite-title">
      <div className="wrap invite__inner">
        <RevealText id="invite-title" className="invite__title display" lines={[invite.title]} />
        <div className="invite__side">
          <p>{invite.body}</p>
          <MagneticButton href={routes.contacto} onClick={() => navigate(routes.contacto)}>
            {invite.cta}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
