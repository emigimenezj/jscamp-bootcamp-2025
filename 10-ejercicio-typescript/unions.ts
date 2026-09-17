import { searchJobs } from "./functions.ts";
import type { Job } from "./objects.ts";

type Success = {
  success: true;
  jobs: Job[];
  count: number;
};
/* // Código anterior: "Error" pisaba (shadowing) el tipo global Error de TypeScript
type Error = {
  success: false;
  error: string;
};
export type SearchResult = Success | Error;
*/

// Renombrado a SearchFailure para no hacer shadowing del tipo global Error
type SearchFailure = {
  success: false;
  error: string;
};
export type SearchResult = Success | SearchFailure;

// Función que devuelve SearchResult
export function safeSearch(jobs: Job[], searchTerm: string): SearchResult {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return {
      success: false,
      error: "El término de búsqueda no puede estar vacío",
    };
  }

  const results = searchJobs(jobs, searchTerm);

  return {
    success: true,
    jobs: results,
    count: results.length,
  };
}

// Función para mostrar resultados usando type narrowing
export function displaySearchResults(result: SearchResult): void {
  if (result.success) {
    console.log(`Encontrados ${result.count} empleos:`);
    result.jobs.forEach((job) => {
      console.log(`- ${job.title} en ${job.company}`);
    });
  } else {
    console.error(`Error: ${result.error}`);
  }
}
