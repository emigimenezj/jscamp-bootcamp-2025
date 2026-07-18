export const FLAGS = {
  ALL: ["-a", "--all"],
  LONG: ["-l", "--long"],
  HUMAN_READABLE: ["-h", "--human-readable"],
  SORT_NAME: ["-n", "--sort-name"],
  SORT_ASC: ["--asc"],
  SORT_DESC: ["--desc"],
  SORT_REVERSE: ["-r", "--reverse"],
  SORT_SIZE: ["-s", "--sort-size"],
  SORT_TIME: ["-t", "--sort-time"],
  SORT_CREATED: ["-c", "--sort-created"],
  CLASSIFY: ["-F", "--classify"],
  FILTER_FILES: ["--files"],
  FILTER_FOLDERS: ["--folders"],
  OUTPUT_COLOR: ["--color"],
  HELP: ["--help"],
};

export const FLAGS_RAW = Object.values(FLAGS).flat();
