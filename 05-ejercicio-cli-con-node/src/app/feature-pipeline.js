import { filterHidden } from "../features/filter-hidden.js";
import { filterEntryType } from "../features/filter-entry-type.js";
import { sortEntries } from "../features/sort-entries.js";
import { reverseEntries } from "../features/reverse-entries.js";
import { classifyEntry } from "../features/classify-entry.js";
import { formatLongEntry } from "../features/format-long-entry.js";
import { formatSize } from "../features/format-size.js";
import { colorizeEntry } from "../features/colorize-entry.js";

export function applyFeaturePipeline(entries, options) {
  const { filters, sort, output } = options;

  const filteredEntries = applyFilters(entries, filters);
  const sortedEntries = applySorting(filteredEntries, sort);
  const outputEntries = applyOutputFeatures(sortedEntries, output);

  return outputEntries;
}

function applyFilters(entries, filters) {
  let result = entries;

  result = filterHidden(result, filters.all);
  result = filterEntryType(result, filters.type);

  return result;
}

function applySorting(entries, sort) {
  let result = entries;

  result = sortEntries(result, sort.by);
  if (sort.reverse) result = reverseEntries(result);

  return result;
}

function applyOutputFeatures(entries, output) {
  const { readable } = output.human;
  const now = output.long ? Date.now() : undefined;

  return entries.map((entry) => {
    let result = formatSize(entry, readable);

    if (output.classify) result = classifyEntry(result);
    if (output.color) result = colorizeEntry(result);
    if (output.long) result = formatLongEntry(result, { readable, now });

    return result;
  });
}
