import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router";
import snarkdown from "snarkdown";
import { Link } from "../components/Link.jsx";
import { useService } from "../hooks/useService.jsx";
import { fetchJob } from "../service/jobs.js";
import styles from "./detail.module.css";

export function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApplied, setIsApplied] = useState(false);
  const loadJob = useCallback(() => fetchJob(id), [id]);
  const { data: job, loading, error } = useService(loadJob);

  if (loading) {
    return (
      <section className={styles.loading}>
        <p>Cargando empleo...</p>
      </section>
    );
  }

  if (error || !job) {
    return (
      <section className={styles.notFound}>
        <h1>Oferta no encontrada</h1>
        <p>Puede que esta oferta haya caducado o que la URL no sea correcta.</p>
        <button
          className={styles.backButton}
          onClick={() => navigate("/search")}
        >
          Volver a la lista de empleos
        </button>
      </section>
    );
  }

  const applyButtonText = isApplied ? "Aplicado" : "Aplicar ahora";
  const applyButtonClasses = `${styles.applyButton} ${
    isApplied ? styles.isApplied : ""
  }`;
  const handleApplyClick = () => {
    setIsApplied(true);
  };

  return (
    <>
      <title>{job.titulo} - DevJobs</title>
      <meta name="description" content={job.descripcion} />

      <nav className={styles.breadcrumb}>
        <Link href="/search" className={styles.breadcrumbLink}>
          Empleos
        </Link>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbTitle}>{job.titulo}</span>
      </nav>

      <header className={styles.header}>
        <div>
          <h1>{job.titulo}</h1>
          <p className={styles.company}>
            {job.empresa} · {job.ubicacion}
          </p>
        </div>
        <button
          className={applyButtonClasses}
          onClick={handleApplyClick}
          disabled={isApplied}
        >
          {applyButtonText}
        </button>
      </header>

      <JobSection
        title="Descripción del puesto"
        content={job.content?.description}
      />

      <JobSection
        title="Responsabilidades"
        content={job.content?.responsibilities}
      />

      <JobSection title="Requisitos" content={job.content?.requirements} />

      <JobSection title="Acerca de la empresa" content={job.content?.about} />

      <footer className={styles.footer}>
        <button
          className={applyButtonClasses}
          onClick={handleApplyClick}
          disabled={isApplied}
        >
          {applyButtonText}
        </button>
      </footer>
    </>
  );
}

function JobSection({ title, content }) {
  if (!content) return null;

  const html = snarkdown(content);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={`${styles.sectionContent} ${styles.prose}`}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </section>
  );
}
