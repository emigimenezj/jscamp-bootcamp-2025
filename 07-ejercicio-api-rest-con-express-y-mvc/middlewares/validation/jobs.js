import { DEFAULTS } from "../../config.js";

const fields = [
  "titulo",
  "empresa",
  "ubicacion",
  "descripcion",
  "data",
  "content",
];

const types = {
  titulo: "string",
  empresa: "string",
  ubicacion: "string",
  descripcion: "string",
  data: "object",
  content: "object",
};

export const jobValidation = {
  query(req, res, next) {
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

    const filters = [text, title, level, technology];

    if (
      filters.some((value) => value !== undefined && typeof value !== "string")
    ) {
      return res.status(400).json({
        error: "Invalid filters",
      });
    }

    res.locals.search = {
      text,
      title,
      level,
      technology,
      ...pagination,
    };

    return next();
  },

  create(req, res, next) {
    return validate(req, res, next);
  },

  update(req, res, next) {
    return validate(req, res, next);
  },

  patch(req, res, next) {
    return validate(req, res, next, true);
  },
};

function validate(req, res, next, partial = false) {
  const input = req.body;
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return res.status(400).json({
      error: "Invalid body",
    });
  }

  const keys = Object.keys(input);
  const unknown = keys.some((field) => !fields.includes(field));
  if (unknown) {
    return res.status(400).json({
      error: "Invalid fields",
    });
  }

  if (partial && keys.length === 0) {
    return res.status(400).json({
      error: "No fields to update",
    });
  }

  if (!partial) {
    const missing = fields.some(
      (field) => !Object.hasOwn(input, field) || input[field] == null,
    );

    if (missing) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }
  }

  const target = partial ? keys : fields;

  const invalid = target.some((field) => !valid(field, input[field]));

  if (invalid) {
    return res.status(400).json({
      error: "Invalid fields",
    });
  }

  res.locals.input = input;

  return next();
}

function valid(field, value) {
  const type = types[field];

  if (type === "object") {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  return typeof value === type;
}
