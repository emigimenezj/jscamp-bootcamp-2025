import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";
import { Suspense } from "react";

import styles from "./MainLayout.module.css";

export function MainLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.container}>
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </main>
      <Footer />
    </div>
  );
}

function PageLoader() {
  return (
    <div className={styles.loaderContainer} role="status" aria-live="polite">
      <div className={styles.loader} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p>
        <i>Cargando empleos...</i>
      </p>
    </div>
  );
}
