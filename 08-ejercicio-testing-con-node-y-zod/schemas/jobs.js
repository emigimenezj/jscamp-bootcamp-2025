import { z } from 'zod'

const jobSchema = z.object({
  titulo: z.string().min(3).max(100),
  empresa: z.string(),
  ubicacion: z.string(),
  descripcion: z.string().optional(),
  /*
  data: z.object({
    technology: z.array(z.string()),
    modalidad: z.string().optional(),
    nivel: z.string().optional(),
  }).optional(),
  */
  // Si data es opcional, los filtros que hacemos en GET ?/jobs buscando data.technology no funcionarían. Lo ideal es dejar `data` como requerido y los campos opcionales como opcionales (modalidad y nivel)
  data: z.object({
    technology: z.array(z.string()),
    modalidad: z.string().optional(),
    nivel: z.string().optional(),
  }),
  content: z.unknown().optional(),
})

export function validateJob(input) {
  return jobSchema.safeParse(input)
}

export function validatePartialJob(input) {
  return jobSchema.partial().safeParse(input)
}
