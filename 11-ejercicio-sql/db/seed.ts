import crypto from "node:crypto";
import jobs from "../jobs.json";
import { db } from "./database";
/* import { statements } from "./job-statements"; */
import { getStatements } from "./job-statements";

/* Pasamos el schema aquí en el seed */
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    modality TEXT NOT NULL CHECK (modality IN ('remote', 'onsite', 'hybrid')),
    level TEXT NOT NULL CHECK (level IN ('junior', 'mid', 'senior'))
  );

  CREATE TABLE IF NOT EXISTS job_technologies (
    job_id TEXT NOT NULL,
    technology TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS job_content (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    requirements TEXT NOT NULL,
    about TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );
`);

// Preparamos el statement cuando las tablas ya existen
const statements = getStatements();

const seed = db.transaction(() => {
  // Limpiar la base de datos antes de poblarla
  db.prepare("DELETE FROM jobs").run();

  // Proceso de inserción de entidades
  for (const job of jobs) {
    statements.insert.job.run(job);

    for (const technology of job.technologies) {
      statements.insert.technology.run({
        jobId: job.id,
        technology,
      });
    }

    if (job.content) {
      statements.insert.content.run({
        id: crypto.randomUUID(),
        jobId: job.id,
        ...job.content,
      });
    }
  }
});

seed();

console.log(`Seed completed: ${jobs.length} jobs inserted.`);
