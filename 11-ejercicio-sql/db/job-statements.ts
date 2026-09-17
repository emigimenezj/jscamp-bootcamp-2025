import { db } from "./database";

// Base reutilizable para obtener un Job completo desde las tablas relacionadas (utilizando JOIN).
// Agrupa `technologies` como JSON (ej: '["react","node"]') y `content` como objeto JSON.
// (ej: '{"description":"...","about":"..."}'), para evitar consultas adicionales a la db por cada job devuelto.
const JOB_SELECT = `
  SELECT
    jobs.*,
    COALESCE(
      json_group_array(
        job_technologies.technology
        ORDER BY job_technologies.rowid
      )
        FILTER (WHERE job_technologies.technology IS NOT NULL),
      json('[]')
    ) AS technologies,
    CASE
      WHEN job_content.job_id IS NULL THEN NULL
      ELSE json_object(
        'description', job_content.description,
        'responsibilities', job_content.responsibilities,
        'requirements', job_content.requirements,
        'about', job_content.about
      )
    END AS content
  FROM jobs
  LEFT JOIN job_technologies ON job_technologies.job_id = jobs.id
  LEFT JOIN job_content ON job_content.job_id = jobs.id
`;

/* Sacamos el export al nivel del módulo y lo reemplazamos por getStatements() para que el prepare() no se ejecute al importar (puede fallaba si las tablas aún no existen).*/
type Statements = ReturnType<typeof createStatements>;

let cachedStatements: Statements | undefined;

export function getStatements(): Statements {
  cachedStatements ??= createStatements();
  return cachedStatements;
}

function createStatements() {
  return {
    select: {
      jobs: db.prepare(`
        ${JOB_SELECT}
        WHERE (
          @tech IS NULL
          OR EXISTS (
            SELECT 1
            FROM job_technologies AS filtered_technologies
            WHERE filtered_technologies.job_id = jobs.id
              AND filtered_technologies.technology = @tech COLLATE NOCASE
          )
        )
          AND (@modality IS NULL OR jobs.modality = @modality)
          AND (@level IS NULL OR jobs.level = @level)
        GROUP BY jobs.id /* , job_content.id — redundante: es PK única por job */
        ORDER BY jobs.rowid
      `),

      job: db.prepare(`
        ${JOB_SELECT}
        WHERE jobs.id = ?
        GROUP BY jobs.id /* , job_content.id — redundante: es PK única por job */
      `),
    },

    insert: {
      job: db.prepare(`
        INSERT INTO jobs (
          id, title, company, location, description, modality, level
        ) VALUES (
          @id, @title, @company, @location, @description, @modality, @level
        )
      `),

      technology: db.prepare(`
        INSERT INTO job_technologies (job_id, technology)
        VALUES (@jobId, @technology)
      `),

      content: db.prepare(`
        INSERT INTO job_content (
          id, job_id, description, responsibilities, requirements, about
        ) VALUES (
          @id, @jobId, @description, @responsibilities, @requirements, @about
        )
      `),
    },

    update: {
      job: db.prepare(`
        UPDATE jobs
        SET
          title = @title,
          company = @company,
          location = @location,
          description = @description,
          modality = @modality,
          level = @level
        WHERE id = @id
      `),

      content: db.prepare(`
        UPDATE job_content
        SET
          description = @description,
          responsibilities = @responsibilities,
          requirements = @requirements,
          about = @about
        WHERE job_id = @jobId
      `),
    },

    delete: {
      job: db.prepare("DELETE FROM jobs WHERE id = ?"),
      technologies: db.prepare("DELETE FROM job_technologies WHERE job_id = ?"),
      /* Sin usar: el ON DELETE CASCADE de jobs ya elimina el content al borrar el job.
      content: db.prepare("DELETE FROM job_content WHERE job_id = ?"),
      */
    },
  };
}

/*
export const statements = {
  select: {
    jobs: db.prepare(`
      ${JOB_SELECT}
      WHERE (
        @tech IS NULL
        OR EXISTS (
          SELECT 1
          FROM job_technologies AS filtered_technologies
          WHERE filtered_technologies.job_id = jobs.id
            AND filtered_technologies.technology = @tech COLLATE NOCASE
        )
      )
        AND (@modality IS NULL OR jobs.modality = @modality)
        AND (@level IS NULL OR jobs.level = @level)
      GROUP BY jobs.id, job_content.id
      ORDER BY jobs.rowid
    `),

    job: db.prepare(`
      ${JOB_SELECT}
      WHERE jobs.id = ?
      GROUP BY jobs.id, job_content.id
    `),
  },

  insert: {
    job: db.prepare(`
      INSERT INTO jobs (
        id, title, company, location, description, modality, level
      ) VALUES (
        @id, @title, @company, @location, @description, @modality, @level
      )
    `),

    technology: db.prepare(`
      INSERT INTO job_technologies (job_id, technology)
      VALUES (@jobId, @technology)
    `),

    content: db.prepare(`
      INSERT INTO job_content (
        id, job_id, description, responsibilities, requirements, about
      ) VALUES (
        @id, @jobId, @description, @responsibilities, @requirements, @about
      )
    `),
  },

  update: {
    job: db.prepare(`
      UPDATE jobs
      SET
        title = @title,
        company = @company,
        location = @location,
        description = @description,
        modality = @modality,
        level = @level
      WHERE id = @id
    `),

    content: db.prepare(`
      UPDATE job_content
      SET
        description = @description,
        responsibilities = @responsibilities,
        requirements = @requirements,
        about = @about
      WHERE job_id = @jobId
    `),
  },

  delete: {
    job: db.prepare("DELETE FROM jobs WHERE id = ?"),
    technologies: db.prepare("DELETE FROM job_technologies WHERE job_id = ?"),
    content: db.prepare("DELETE FROM job_content WHERE job_id = ?"),
  },
};
*/
