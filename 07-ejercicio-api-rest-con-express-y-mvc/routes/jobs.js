import { Router } from "express";
import { JobController } from "../controllers/jobs.js";
import { jobValidation } from "../middlewares/validation/jobs.js";

export const jobsRouter = Router();

jobsRouter.get("/", jobValidation.query, JobController.getAll);
jobsRouter.get("/:id", JobController.getId);

jobsRouter.post("/", jobValidation.create, JobController.create);

jobsRouter.put("/:id", jobValidation.update, JobController.update);
jobsRouter.patch("/:id", jobValidation.patch, JobController.partialUpdate);

jobsRouter.delete("/:id", JobController.delete);
