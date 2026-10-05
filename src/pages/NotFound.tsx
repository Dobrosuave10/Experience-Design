import { routes } from "../content/site";
import { Link } from "../components/Link";

export default function NotFound() {
  return (
    <section className="section notfound" data-tone="ink" aria-labelledby="nf-title">
      <div className="wrap notfound__inner">
        <h1 id="nf-title" className="display notfound__title">
          Este camino no existe.
        </h1>
        <Link to={routes.inicio} className="label notfound__link">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
