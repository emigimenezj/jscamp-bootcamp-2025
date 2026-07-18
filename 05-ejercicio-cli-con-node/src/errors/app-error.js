export class AppError extends Error {
  constructor(message, options = {}) {
    const { code = "APP_ERROR", exitCode = 1, hint, cause } = options;

    super(message, { cause });

    this.name = this.constructor.name;
    this.code = code;
    this.exitCode = exitCode;
    this.hint = hint;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
