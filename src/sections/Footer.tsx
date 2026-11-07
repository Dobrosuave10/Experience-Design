import { InstagramLogo } from "@phosphor-icons/react";
import { brand, credit, footer, nav, navContact } from "../content/site";
import { Link } from "../components/Link";
import { Logo } from "../components/Logo";
import "./Footer.css";

/** Pie: la misma jerarquía del sitio (cinco entradas y sus subpáginas), con los canales bajo Contacto. */
export function Footer() {
  return (
    <footer className="footer section" data-tone="ink">
      <div className="wrap">
        <div className="footer__top">
          <Logo size={88} shape="circle" />
          <p className="footer__statement display">{footer.statement}</p>
        </div>
        <nav aria-label="Mapa del sitio" className="footer__map">
          {[...nav, navContact].map((n) => (
            <div key={n.href} className="footer__col">
              <Link to={n.href} className="footer__main">
                {n.label}
              </Link>
              {"children" in n && n.children && (
                <ul>
                  {n.children.map((c) => (
                    <li key={c.href}>
                      <Link to={c.href}>
                        {c.label}
                        {c.note && <span className="footer__note">&nbsp;· {c.note}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {/* Contacto: los canales van bajo su propio título */}
              {n === navContact && (
                <ul className="footer__contact">
                  {brand.whatsapp && brand.whatsappLabel && (
                    <li>
                      <a href={`tel:+${brand.whatsapp}`}>
                        {brand.whatsappLabel}
                      </a>
                    </li>
                  )}
                  {brand.email && (
                    <li>
                      <a href={`mailto:${brand.email}`}>{brand.email}</a>
                    </li>
                  )}
                  <li>
                    <a href={brand.instagram.url} target="_blank" rel="noopener noreferrer">
                      <InstagramLogo size={18} weight="light" aria-hidden />
                      {brand.instagram.handle}
                    </a>
                  </li>
                </ul>
              )}
            </div>
          ))}
        </nav>
        <div className="footer__bottom">
          <p className="footer__legal">
            © {new Date().getFullYear()} {brand.name}. {brand.website}
          </p>
          <p className="footer__credit">
            Diseño y desarrollo web por{" "}
            {/* Se lee como enlace: subrayado, ícono de LinkedIn y flecha de salida */}
            <a href={credit.url} target="_blank" rel="noopener noreferrer" className="footer__credit-link" aria-label={`Perfil de LinkedIn de ${credit.name} (abre en una pestaña nueva)`}>
              <svg className="footer__credit-icon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
                />
              </svg>
              <span className="footer__credit-name">{credit.name}</span>
              <span className="footer__credit-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
