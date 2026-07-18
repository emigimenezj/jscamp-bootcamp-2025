import { AppError } from "./app-error.js";

const SYSTEM_ERROR_FALLBACK = {
  code: "SYSTEM_ERROR",
  exitCode: 3,
  message: (path) => `Could not read the directory "${path}".`,
  hint: "Check the path and your filesystem permissions.",
};

const SYSTEM_ERROR_BY_CODE = {
  ENOENT: {
    message: (path) => `The path "${path}" does not exist.`,
    hint: "Check that the path is correct and try again.",
  },

  EACCES: {
    message: (path) => `Permission denied while accessing "${path}".`,
    hint: "Check the directory permissions.",
  },

  ENOTDIR: {
    message: (path) => `"${path}" is not a directory.`,
    hint: "Provide the path to a directory.",
  },

  ELOOP: {
    message: (path) =>
      `Too many symbolic links were found while reading "${path}".`,
    hint: "Check for a circular symbolic link.",
  },
};

export class SystemError extends AppError {
  constructor(error, path) {
    const definition = SYSTEM_ERROR_BY_CODE[error.code];

    const getMessage = definition?.message ?? SYSTEM_ERROR_FALLBACK.message;
    const message = getMessage(path);

    const errorOptions = {
      code: error.code ?? SYSTEM_ERROR_FALLBACK.code,
      exitCode: SYSTEM_ERROR_FALLBACK.exitCode,
      hint: definition?.hint ?? SYSTEM_ERROR_FALLBACK.hint,
      cause: error,
    };

    super(message, errorOptions);

    this.path = path;
  }
}

export class ReadPermissionError extends AppError {
  constructor(path) {
    super(
      `You do not have read permission to list directories and files in "${path}".`,
      {
        code: "READ_PERMISSION_DENIED",
        exitCode: SYSTEM_ERROR_FALLBACK.exitCode,
        hint: "Grant read permission for the path and try again.",
      },
    );

    this.path = path;
  }
}
