import {
  searchJobs,
  filterByExperience,
  filterByTechnology,
  filterByMinSalary,
} from "./functions.ts";
import type { Job } from "./objects.ts";
import type { ExperienceLevel, Technology, WorkMode } from "./types.ts";

type Search = string;
type Salary = number;

type Options = {
  text?: Search;
  level?: ExperienceLevel;
  technology?: Technology;
  minSalary?: Salary;
  workMode?: WorkMode;
};

// Función de búsqueda avanzada con opcionales
export function advancedSearch(jobs: Job[], options: Options): Job[] {
  let results = jobs;

  if (options.text) {
    results = searchJobs(results, options.text);
  }

  if (options.level) {
    results = filterByExperience(results, options.level);
  }

  if (options.technology) {
    results = filterByTechnology(results, options.technology);
  }

  if (options.minSalary) {
    results = filterByMinSalary(results, options.minSalary);
  }

  if (options.workMode) {
    results = results.filter((job) => job.workMode === options.workMode);
  }

  return results;
}

type Days = number;

// Función con valores por defecto
export function getRecentJobs(jobs: Job[], days: Days = 30): Job[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return jobs.filter((job) => job.postedDate >= cutoffDate);
}
