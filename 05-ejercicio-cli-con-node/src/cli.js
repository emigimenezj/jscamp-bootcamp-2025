#!/usr/bin/env node

import { app } from "./app/run-cli.js";
import { renderError } from "./output/render-feedback.js";

try {
  await app(process.argv.slice(2));
} catch (error) {
  renderError(error);
  process.exitCode = error.exitCode ?? 1;
}
