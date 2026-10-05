import { InstagramLogo } from "@phosphor-icons/react";
import { brand, footer, nav, navContact } from "../content/site";
import { Link } from "../components/Link";
import { Logo } from "../components/Logo";
import "./Footer.css";

/** Pie: la misma jerarquía del sitio, completa (cinco entradas y sus subpáginas). */
export function Footer() {
  return (
    <footer className="footer section" data-tone="ink">
      <div className="wrap">
        <div className="footer__top">
          <Logo size={88} />
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
                        {c.note && <span className="footer__note"> · {c.note}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
        <div className="footer__bottom">
          <div className="footer__contact">
            <a href={brand.instagram.url} target="_blank" rel="noopener noreferrer">
              <InstagramLogo size={18} weight="light" aria-hidden />
              {brand.instagram.handle}
            </a>
            {brand.email && <a href={`mailto:${brand.email}`}>{brand.email}</a>}
          </div>
          <p className="footer__legal">
            © {new Date().getFullYear()} {brand.name}. {brand.website}
          </p>
        </div>
      </div>
    </footer>
  );
}
