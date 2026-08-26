#!/usr/bin/env node

import { app } from "./app/run-cli.js";
import { EXIT_CODES } from "./constants/exit-codes.js";
import { renderError } from "./output/render-feedback.js";

try {
  await app(process.argv.slice(2));
} catch (error) {
  renderError(error);
  process.exitCode = error.exitCode ?? EXIT_CODES.APP; // Agregamos exitCode como fallback por si error.exitCode no devuelve el esperado
}
