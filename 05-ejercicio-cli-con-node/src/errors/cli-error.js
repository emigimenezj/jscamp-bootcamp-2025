import { EXIT_CODES } from "../constants/exit-codes.js";
import { AppError } from "./app-error.js";

const CLI_ERROR_MESSAGES = Object.freeze({
  unknownFlags: (flags) => `Unknown flags: ${flags.join(", ")}.`,
  multiplePaths: "Only one path can be provided.",
  conflictingFilters: "--files and --folders cannot be used together.",
  conflictingDirections: "--asc and --desc cannot be used together.",
  multipleSortCriteria: (criteria) =>
    `Only one sorting criterion can be used: ${criteria.join(", ")}.`,
  reverseWithoutSort: "--reverse requires a sorting criterion.",
});

class CliError extends AppError {
  constructor(message, options = {}) {
    super(message, {
      exitCode: EXIT_CODES.USAGE, // Aplicamos el exitCode de manera declarativa
      ...options,
    });
  }
}

export class UnknownFlagsError extends CliError {
  constructor(flags) {
    super(CLI_ERROR_MESSAGES.unknownFlags(flags), {
      code: "UNKNOWN_FLAGS",
      hint: "Run the command with --help to see the available flags.",
    });
  }
}

export class MultiplePathsError extends CliError {
  constructor() {
    super(CLI_ERROR_MESSAGES.multiplePaths, {
      code: "MULTIPLE_PATHS",
      hint: "Provide a single directory path.",
    });
  }
}

export class ConflictingFiltersError extends CliError {
  constructor() {
    super(CLI_ERROR_MESSAGES.conflictingFilters, {
      code: "CONFLICTING_FILTERS",
      hint: "Use either --files or --folders.",
    });
  }
}

export class ConflictingDirectionsError extends CliError {
  constructor() {
    super(CLI_ERROR_MESSAGES.conflictingDirections, {
      code: "CONFLICTING_DIRECTIONS",
      hint: "Use either --asc or --desc.",
    });
  }
}

export class MultipleSortCriteriaError extends CliError {
  constructor(criteria) {
    super(CLI_ERROR_MESSAGES.multipleSortCriteria(criteria), {
      code: "MULTIPLE_SORT_CRITERIA",
      hint: "Choose only one sorting criterion.",
    });
  }
}

export class ReverseWithoutSortError extends CliError {
  constructor() {
    super(CLI_ERROR_MESSAGES.reverseWithoutSort, {
      code: "REVERSE_WITHOUT_SORT",
      hint: "Combine --reverse with a sorting flag such as --sort-name.",
    });
  }
}
