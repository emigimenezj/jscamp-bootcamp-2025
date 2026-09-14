import type { Candidate, Job } from "./objects.ts";

// Validar candidato para un empleo
export function isQualified(candidate: Candidate, job: Job): boolean {
  // Verificar años de experiencia (¿¡ qué es esta ternaria del averno !? 😱)
  const requiredYears =
    job.experienceLevel === "junior"
      ? 0
      : job.experienceLevel === "mid"
        ? 2
        : job.experienceLevel === "senior"
          ? 5
          : 8;

  if (candidate.experienceYears < requiredYears) {
    return false;
  }

  // Verificar si tiene al menos una tecnología requerida
  const hasRequiredSkill = job.technologies.some((tech) =>
    candidate.skills.includes(tech),
  );

  return hasRequiredSkill;
}

type FormattedSalary = `€${string}` | "Salario no especificado";

// Función con type guards - formatear salario
export function formatSalary(salary: Job["salary"]): FormattedSalary {
  if (salary === undefined) {
    return "Salario no especificado";
  }

  return `€${salary.toLocaleString()}`;
}

type Email = string;

// Validar email
export function isValidEmail(email: Email): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
