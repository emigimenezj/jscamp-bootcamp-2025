import Database from "better-sqlite3";

export const db = new Database("jobs.db");

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    modality TEXT NOT NULL CHECK (modality IN ('remote', 'onsite', 'hybrid')),
    level TEXT NOT NULL CHECK (level IN ('junior', 'mid', 'senior'))
  );

  CREATE TABLE IF NOT EXISTS job_technologies (
    job_id TEXT NOT NULL,
    technology TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS job_content (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    requirements TEXT NOT NULL,
    about TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );
`);
