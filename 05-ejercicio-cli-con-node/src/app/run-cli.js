import { parseArguments } from "../arguments/parse.js";
import { validateArguments } from "../arguments/validate.js";
import { validateReadPermission } from "../permission/validate.js";
import { renderHelp } from "../output/render-help.js";
import { readEntries } from "../filesystem/read-entries.js";
import { applyFeaturePipeline } from "./feature-pipeline.js";
import { renderOutput } from "../output/render-output.js";

export async function app(args) {
  validateArguments(args);
  const options = parseArguments(args);

  if (options.help) {
    renderHelp();
    return;
  }

  validateReadPermission(options.path);
  const entries = await readEntries(options.path);
  const processedEntries = applyFeaturePipeline(entries, options);
  renderOutput(processedEntries, { long: options.output.long });
}
