import type { ExperienceLevel, WorkMode, Technology, ID } from "./types.ts";

export type Job = {
  id: ID;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: number;
  technologies: Technology[];
  experienceLevel: ExperienceLevel;
  workMode: WorkMode;
  isActive: boolean;
  postedDate: Date;
};

export type Company = {
  id: ID;
  name: string;
  description: string;
  website?: string;
  employees: number;
  foundedYear: number;
};

export type Candidate = {
  id: ID;
  name: string;
  email: string;
  phone?: string;
  skills: Technology[];
  experienceYears: number;
  resume?: string;
};
