import { FLAGS, FLAGS_RAW } from "../constants/flags.js";
import {
  ConflictingDirectionsError,
  ConflictingFiltersError,
  MultiplePathsError,
  MultipleSortCriteriaError,
  ReverseWithoutSortError,
  UnknownFlagsError,
} from "../errors/cli-error.js";
import { normalizeArgs } from "./utils.js";

export function validateArguments(args) {
  const normalizedArgs = normalizeArgs(args);

  validateUnknownFlags(normalizedArgs);

  if (hasFlag(normalizedArgs, FLAGS.HELP)) return;

  validatePaths(normalizedArgs);
  validateFilters(normalizedArgs);
  validateSort(normalizedArgs);
}

function validateUnknownFlags(normalizedArgs) {
  const byUnknownFlags = (arg) =>
    arg.startsWith("-") && !FLAGS_RAW.includes(arg);

  const unknownFlags = normalizedArgs.filter(byUnknownFlags);

  if (unknownFlags.length) throw new UnknownFlagsError(unknownFlags);
}

function validatePaths(normalizedArgs) {
  const paths = normalizedArgs.filter((arg) => !arg.startsWith("-"));
  if (paths.length > 1) throw new MultiplePathsError();
}

function validateFilters(normalizedArgs) {
  const hasFiles = hasFlag(normalizedArgs, FLAGS.FILTER_FILES);
  const hasFolders = hasFlag(normalizedArgs, FLAGS.FILTER_FOLDERS);

  if (hasFiles && hasFolders) throw new ConflictingFiltersError();
}

function validateSort(normalizedArgs) {
  const hasAsc = hasFlag(normalizedArgs, FLAGS.SORT_ASC);
  const hasDesc = hasFlag(normalizedArgs, FLAGS.SORT_DESC);

  if (hasAsc && hasDesc) throw new ConflictingDirectionsError();

  const createSortCandidate = (name, active) => ({ name, active });

  const activeSortCriteria = [
    createSortCandidate(
      "name",
      hasFlag(normalizedArgs, FLAGS.SORT_NAME) ||
        hasFlag(normalizedArgs, FLAGS.SORT_DESC),
    ),
    createSortCandidate("size", hasFlag(normalizedArgs, FLAGS.SORT_SIZE)),
    createSortCandidate("time", hasFlag(normalizedArgs, FLAGS.SORT_TIME)),
    createSortCandidate("created", hasFlag(normalizedArgs, FLAGS.SORT_CREATED)),
  ]
    .filter(({ active }) => active)
    .map(({ name }) => name);

  if (activeSortCriteria.length > 1)
    throw new MultipleSortCriteriaError(activeSortCriteria);

  const hasReverse = hasFlag(normalizedArgs, FLAGS.SORT_REVERSE);

  if (hasReverse && activeSortCriteria.length === 0)
    throw new ReverseWithoutSortError();
}

function hasFlag(normalizedArgs, flag) {
  return normalizedArgs.some((arg) => flag.includes(arg));
}
