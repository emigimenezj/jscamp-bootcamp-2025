import {
  filterByExperience,
  filterByMinSalary,
  filterByTechnology,
  searchJobs,
} from "./functions.ts";
import type { Job } from "./objects.ts";
import type { ApplicationStatus, ID } from "./types.ts";

// Interface para servicios de búsqueda
export interface JobSearchService {
  searchJobs: typeof searchJobs;
  filterByExperience: typeof filterByExperience;
  filterByMinSalary: typeof filterByMinSalary;
  filterByTechnology: typeof filterByTechnology;
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
