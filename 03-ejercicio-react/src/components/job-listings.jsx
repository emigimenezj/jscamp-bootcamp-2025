import { JobCard } from "./job-card";

export function JobListings({ jobs }) {
  return (
    <div className="jobs-listings">
      {jobs.length === 0 ? (
        <p>
          No se han encontrado empleos que coincidan con los criterios de
          búsqueda
        </p>
      ) : null}
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
