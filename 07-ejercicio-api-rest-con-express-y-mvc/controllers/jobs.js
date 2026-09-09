import { DEFAULTS } from "../config.js";
import { JobModel } from "../models/jobs.js";

export class JobController {
  static getAll(req, res) {
    const { query } = req;

    const { text, title } = query;
    const { level, technology } = query;
    const {
      limit = DEFAULTS.LIMIT_PAGINATION,
      offset = DEFAULTS.LIMIT_OFFSET,
    } = query;

    const pagination = {
      limit: Number(limit),
      offset: Number(offset),
    };

    const invalid =
      !Number.isInteger(pagination.limit) ||
      pagination.limit <= 0 ||
      !Number.isInteger(pagination.offset) ||
      pagination.offset < 0;

    if (invalid) {
      return res.status(400).json({
        error: "Invalid pagination",
      });
    }

    const search = {
      text,
      title,
      level,
      technology,
      ...pagination,
    };

    const result = JobModel.getAll(search);

    return res.status(200).json(result);
  }

  static getId(req, res) {
    const { id } = req.params;

    const job = JobModel.getById(id);

    if (!job) {
      return res.status(404).json({
        error: "Job not found",
      });
    }

    return res.status(200).json(job);
  }

  static create(req, res) {
    const input = req.body ?? {};

    const { titulo, empresa, ubicacion, descripcion } = input;
    const { data, content } = input;

    const required = [titulo, empresa, ubicacion, descripcion, data, content];
    const invalid = required.some((value) => value == null);

    if (invalid) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const job = JobModel.create(input);

    return res.status(201).json(job);
  }

  static update(req, res) {
    const { id } = req.params;
    const input = req.body ?? {};

    const { titulo, empresa, ubicacion, descripcion } = input;
    const { data, content } = input;

    const required = [titulo, empresa, ubicacion, descripcion, data, content];
    const invalid = required.some((value) => value == null);

    if (invalid) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const job = JobModel.update(id, input);

    if (!job) {
      return res.status(404).json({
        error: "Job not found",
      });
    }

    return res.status(200).json(job);
  }

  static partialUpdate(req, res) {
    const { id } = req.params;
    const input = req.body ?? {};

    const job = JobModel.partialUpdate(id, input);

    if (!job) {
      return res.status(404).json({
        error: "Job not found",
      });
    }

    return res.status(200).json(job);
  }

  static delete(req, res) {
    const { id } = req.params;

    const job = JobModel.delete(id);

    if (!job) {
      return res.status(404).json({
        error: "Job not found",
      });
    }

    return res.status(200).json(job);
  }
}
