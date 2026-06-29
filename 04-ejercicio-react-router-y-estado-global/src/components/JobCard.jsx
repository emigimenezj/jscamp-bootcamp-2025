import { useState } from "react";
import { Link } from "./Link.jsx";
import styles from "./JobCard.module.css";

export function JobCard({ job }) {
  const [isApplied, setIsApplied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleApplyClick = () => {
    setIsApplied(true);
  };

  const handleFavoriteClick = () => {
    setIsFavorite((currentFavorite) => !currentFavorite);
  };

  const buttonClasses = isApplied
    ? "button-apply-job is-applied"
    : "button-apply-job";
  const buttonText = isApplied ? "Aplicado" : "Aplicar";
  const favoriteButtonText = isFavorite
    ? "Quitar de favoritos"
    : "Agregar a favoritos";

  return (
    <article
      className={`job-listing-card ${styles.card}`}
      data-modalidad={job.data.modalidad}
      data-nivel={job.data.nivel}
      data-technology={job.data.technology}
    >
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h3>{job.titulo}</h3>
          <button
            className={`${styles.favoriteButton} ${
              isFavorite ? styles.isFavorite : ""
            }`}
            type="button"
            onClick={handleFavoriteClick}
            aria-pressed={isFavorite}
          >
            <FavoriteIcon isFavorite={isFavorite} />
            <span>{favoriteButtonText}</span>
          </button>
        </div>

        <small>
          {job.empresa} | {job.ubicacion}
        </small>

        <p>{job.descripcion}</p>
      </div>
      <div className="job-listing-actions">
        <button className={buttonClasses} onClick={handleApplyClick}>
          {buttonText}
        </button>
        <Link className="job-detail-link" href={`/job/${job.id}`}>
          Ver detalle
        </Link>
      </div>
    </article>
  );
}

function FavoriteIcon({ isFavorite }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={isFavorite ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}
