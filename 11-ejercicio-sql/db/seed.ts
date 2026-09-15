import crypto from "node:crypto";
import jobs from "../jobs.json";
import { db } from "./database";
import { statements } from "./job-statements";

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
