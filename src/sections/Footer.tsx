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
            <a href={credit.url} target="_blank" rel="noopener noreferrer">
              {credit.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
