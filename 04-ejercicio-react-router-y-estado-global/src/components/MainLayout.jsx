import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";
import styles from "./MainLayout.module.css";

export function MainLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.container}>{children}</main>
      <Footer />
    </div>
  );
}
