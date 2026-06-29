import { useState } from "react";
import { NavLink } from "react-router";
import atlasAvatar from "../assets/atlas.webp";
import { Link } from "./Link";
import styles from "./Header.module.css";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSessionClick = () => {
    setIsLoggedIn((currentSession) => !currentSession);
  };

  return (
    <header className={styles.header}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <h1 style={{ color: "white" }}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          DevJobs
        </h1>
      </Link>

      <div className={styles.headerActions}>
        <nav className={styles.navigation}>
          <NavLink
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
            }
            to="/search"
          >
            Empleos
          </NavLink>
        </nav>

        <button
          className={`${styles.sessionButton} ${
            isLoggedIn ? styles.profileButton : ""
          }`}
          type="button"
          onClick={handleSessionClick}
          aria-pressed={isLoggedIn}
          aria-label={isLoggedIn ? "Cerrar sesión de Atlas" : undefined}
          title={isLoggedIn ? "Cerrar sesión" : undefined}
        >
          {isLoggedIn ? (
            <>
              <span className={styles.avatarWrapper}>
                <img src={atlasAvatar} alt="" />
                <span className={styles.onlineIndicator} aria-hidden="true" />
              </span>
              <span className={styles.profileDetails}>
                <strong>EmiGimenezJ</strong>
                <small>Sesión activa</small>
              </span>
            </>
          ) : (
            <>
              <LoginIcon />
              <span className={styles.sessionLabel}>Iniciar sesión</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}

function LoginIcon() {
  return (
    <svg
      className={styles.loginIcon}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="m10 17 5-5-5-5" />
      <path d="M15 12H3" />
    </svg>
  );
}
