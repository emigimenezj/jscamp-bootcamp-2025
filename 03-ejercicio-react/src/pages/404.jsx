import { Link } from "../components/link";

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <h1>404 - Pagina no encontrada</h1>
        <p>La ruta que intentaste abrir no existe.</p>

        <Link href="/" className="not-found-home-link">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
