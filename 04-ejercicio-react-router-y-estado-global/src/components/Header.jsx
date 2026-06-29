import { useRef } from "react";
import { NavLink } from "react-router";
import atlasAvatar from "../assets/atlas.webp";
import { useAuthStore } from "../store/authStore.js";
import { Link } from "./Link";
import styles from "./Header.module.css";

export function Header() {
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

        <AuthControl />
      </div>
    </header>
  );
}

function AuthControl() {
  const loginPopoverRef = useRef(null);
  const username = useAuthStore((state) => state.username);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const handleOpenLogin = () => {
    loginPopoverRef.current?.showPopover();
    loginPopoverRef.current?.querySelector("input")?.focus();
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const usernameInput = form.elements.username;
    const newUsername = usernameInput.value.trim();

    if (!newUsername) {
      usernameInput.setCustomValidity("Ingresá un nombre de usuario.");
      usernameInput.reportValidity();
      return;
    }

    loginPopoverRef.current?.hidePopover();
    login(newUsername);
    form.reset();
  };

  const handleUsernameKeyDown = (event) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  if (isLoggedIn) {
    return (
      <details className={styles.profileMenu}>
        <summary
          className={`${styles.sessionButton} ${styles.profileButton}`}
          aria-label={`Abrir menú de ${username}`}
        >
          <span className={styles.avatarWrapper}>
            <img src={atlasAvatar} alt="" />
            <span className={styles.onlineIndicator} aria-hidden="true" />
          </span>
          <span className={styles.profileDetails}>
            <strong>{username}</strong>
            <small>Sesión activa</small>
          </span>
          <MenuChevron />
        </summary>

        <div className={styles.profileDropdown}>
          <button
            className={styles.logoutButton}
            type="button"
            onClick={logout}
          >
            <LogoutIcon />
            Log Out!
          </button>
        </div>
      </details>
    );
  }

  return (
    <>
      <button
        className={styles.sessionButton}
        type="button"
        onClick={handleOpenLogin}
        aria-haspopup="dialog"
        aria-controls="login-popover"
      >
        <LoginIcon />
        <span className={styles.sessionLabel}>Iniciar sesión</span>
      </button>

      <div
        className={styles.loginPopover}
        id="login-popover"
        ref={loginPopoverRef}
        popover="auto"
        role="dialog"
        aria-labelledby="login-title"
      >
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.loginHeading}>
            <span className={styles.loginHeadingIcon}>
              <LoginIcon />
            </span>
            <div>
              <h2 id="login-title">Iniciar sesión</h2>
              <p>Ingresá el nombre de tu usuario.</p>
            </div>
          </div>

          <label className={styles.loginField}>
            Nombre de usuario
            <input
              type="text"
              name="username"
              autoComplete="username"
              placeholder="Por ejemplo: Ada"
              onInput={(event) => event.currentTarget.setCustomValidity("")}
              onKeyDown={handleUsernameKeyDown}
              required
            />
          </label>

          <button className={styles.loginSubmit} type="submit">
            Log In!
          </button>
        </form>
      </div>
    </>
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

function MenuChevron() {
  return (
    <svg
      className={styles.menuChevron}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
