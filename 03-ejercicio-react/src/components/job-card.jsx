export function JobCard({ job }) {
  return (
    <article
      key={job.id}
      className="job-listing-card"
      data-modalidad={job.data.modalidad}
      data-nivel={job.data.nivel}
      data-technology={job.data.technology.join(", ")}
    >
      <div>
        <h3>{job.titulo}</h3>
        <small>
          {job.empresa} | {job.ubicacion} | {job.data.modalidad} |{" "}
          {job.data.nivel} | {job.data.technology.join(" | ")}
        </small>
        <p>{job.descripcion}</p>
      </div>
      <button className="button-apply-job">Aplicar</button>
    </article>
  );
}
