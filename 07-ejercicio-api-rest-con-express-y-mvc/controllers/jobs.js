import { JobModel } from "../models/jobs.js";

export class JobController {
  static getAll(_, res) {
    const { search } = res.locals;

    const result = JobModel.getAll(search);

    return res.status(200).json(result);
  }

  static getId(req, res) {
    const { id } = req.params;

    const job = JobModel.getById(id);
    if (!job) return missing(res);

    return res.status(200).json(job);
  }

  static create(_, res) {
    const { input } = res.locals;

    const job = JobModel.create(input);

    return res.status(201).json(job);
  }

  static update(req, res) {
    const { id } = req.params;
    const { input } = res.locals;

    const job = JobModel.update(id, input);
    if (!job) return missing(res);

    return res.status(200).json(job);
  }

  static partialUpdate(req, res) {
    const { id } = req.params;
    const { input } = res.locals;

    const job = JobModel.partialUpdate(id, input);
    if (!job) return missing(res);

    return res.status(200).json(job);
  }

  static delete(req, res) {
    const { id } = req.params;

    const job = JobModel.delete(id);
    if (!job) return missing(res);

    return res.status(200).json(job);
  }
}

function missing(res) {
  return res.status(404).json({
    error: "Job not found",
  });
}
