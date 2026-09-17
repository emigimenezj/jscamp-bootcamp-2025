import crypto from "node:crypto";
import { db } from "../db/database";
/* import { statements } from "../db/job-statements"; */
import { getStatements } from "../db/job-statements";
import type {
  CreateJobDTO,
  Job,
  JobContent,
  JobFilters,
  JobRow,
  UpdateJobDTO,
} from "../types";

const transaction = {
  create: db.transaction((job: Job) => {
    // Ejecutamos el statement cuando el esquema ya está creado
    const statements = getStatements();

    statements.insert.job.run({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      modality: job.data.modality,
      level: job.data.level,
    });

    insertTechnologies(job.id, job.data.technology);

    if (job.content) {
      insertContent(job.id, job.content);
    }
  }),

  update: db.transaction((id: string, input: UpdateJobDTO): JobRow | null => {
    const statements = getStatements();

    const current = statements.select.job.get(id) as JobRow | undefined;

    if (!current) return null;

    statements.update.job.run({
      id,
      title: input.title ?? current.title,
      company: input.company ?? current.company,
      location: input.location ?? current.location,
      description: input.description ?? current.description,
      modality: input.data?.modality ?? current.modality,
      level: input.data?.level ?? current.level,
    });

    if (input.data) {
      statements.delete.technologies.run(id);
      insertTechnologies(id, input.data.technology);
    }

    if (input.content) {
      const content = {
        jobId: id,
        ...input.content,
      };

      current.content
        ? statements.update.content.run(content)
        : insertContent(id, input.content);
    }

    return statements.select.job.get(id) as JobRow;
  }),
};

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    /* Ahora el modelo devuelve el contrato Job y el Controller queda intacto
    return statements.select.jobs.all({
      tech: filters?.tech ?? null,
      modality: filters?.modality ?? null,
      level: filters?.level ?? null,
    }) as JobRow[];
    */

    const statements = getStatements();

    const rows = statements.select.jobs.all({
      tech: filters?.tech ?? null,
      modality: filters?.modality ?? null,
      level: filters?.level ?? null,
    }) as JobRow[];

    return rows.map(toJob);
  }

  // Obtener un job por ID
  static async getById(id: string): Promise<Job | undefined> {
    /*
    return statements.select.job.get(id) as JobRow | undefined;
    */

    const statements = getStatements();

    const row = statements.select.job.get(id) as JobRow | undefined;

    // El modelo transforma a Job antes de exponer el resultado
    return row && toJob(row);
  }

  // Crear un nuevo job
  static async create(input: CreateJobDTO): Promise<Job> {
    const newJob: Job = {
      id: crypto.randomUUID(),
      ...input,
    };

    transaction.create(newJob);

    return newJob;
  }

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
    /*
    return statements.delete.job.run(id).changes > 0;
    */

    const statements = getStatements();

    return statements.delete.job.run(id).changes > 0;
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    /*
    return transaction.update(id, input);
    */

    const row = transaction.update(id, input);

    return row && toJob(row);
  }
}

// Pasamos toJob al modelo
function toJob(row: JobRow): Job {
  const { modality, level, technologies, content, ...job } = row;

  return {
    ...job,
    data: {
      technology: JSON.parse(technologies) as string[],
      modality,
      level,
    },
    ...(content && {
      content: JSON.parse(content) as NonNullable<Job["content"]>,
    }),
  };
}

function insertTechnologies(id: string, technologies: string[]) {
  const statements = getStatements();

  for (const technology of technologies) {
    statements.insert.technology.run({
      jobId: id,
      technology,
    });
  }
}

function insertContent(id: string, content: JobContent) {
  const statements = getStatements();

  statements.insert.content.run({
    id: crypto.randomUUID(),
    jobId: id,
    ...content,
  });
}
