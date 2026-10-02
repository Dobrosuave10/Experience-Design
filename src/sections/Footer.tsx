import { InstagramLogo } from "@phosphor-icons/react";
import { brand, footer, nav } from "../content/site";
import { scrollToTarget } from "../lib/smoothScroll";
import { Logo } from "../components/Logo";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer section" data-tone="ink">
      <div className="wrap">
        <div className="footer__top">
          <Logo size={88} />
          <p className="footer__statement display">{footer.statement}</p>
        </div>
        <div className="footer__bottom">
          <nav aria-label="Pie de página" className="footer__nav">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(n.href);
                }}
              >
                {n.label}
              </a>
            ))}
          </nav>
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
