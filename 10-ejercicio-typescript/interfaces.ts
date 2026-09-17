import {
  filterByExperience,
  filterByMinSalary,
  filterByTechnology,
  searchJobs,
} from "./functions.ts";
import type { Job } from "./objects.ts";
import type { ApplicationStatus, ExperienceLevel, ID, Technology } from "./types.ts";

/* No conviene usar types reutilizados de las firmas con typeof
export interface JobSearchService {
  searchJobs: typeof searchJobs;
  filterByExperience: typeof filterByExperience;
  filterByMinSalary: typeof filterByMinSalary;
  filterByTechnology: typeof filterByTechnology;
}
*/

export interface JobSearchService {
  searchJobs(jobs: Job[], searchTerm: string): Job[];
  filterByExperience(jobs: Job[], level: ExperienceLevel): Job[];
  filterByMinSalary(jobs: Job[], minSalary: number): Job[];
  filterByTechnology(jobs: Job[], tech: Technology): Job[];
}

export const searchService: JobSearchService = {
  searchJobs,
  filterByExperience,
  filterByMinSalary,
  filterByTechnology,
};

type Letter = string;

// Interface para aplicación a empleo
export interface JobApplication {
  id: ID;
  jobId: ID;
  candidateId: ID;
  status: ApplicationStatus;
  appliedDate: Date;
  coverLetter?: Letter;
}

type Benefit = string;
type Requirement = string;

// Interface que extiende Job con propiedades adicionales
export interface DetailedJob extends Job {
  benefits: Benefit[];
  requirements: Requirement[];
  applicationDeadline?: Date;
}
