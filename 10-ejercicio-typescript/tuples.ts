import type { Job } from "./objects.ts";

// Tupla para coordenadas de ubicación
export type Coordinates = [latitude: number, longitude: number];

// Tupla para rango de salario
export type SalaryRange = [min: number, max: number];

// Función que devuelve el rango de salarios
export function getSalaryRange(jobs: Job[]): SalaryRange {
  const salaries = jobs
    .map((job) => job.salary)
    .filter((salary) => salary !== undefined);

  if (salaries.length === 0) {
    return [0, 0];
  }

  const min = Math.min(...salaries);
  const max = Math.max(...salaries);

  return [min, max];
}
