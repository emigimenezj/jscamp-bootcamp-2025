import { EXEC_PERMISSION_MASK } from "../constants/file-types.js";

const SUFFIX_BY_TYPE = {
  directory: "/",
  symlink: "@",
  other: "?",
};

export function classifyEntry(entry) {
  const isFile = entry.type === "file";
  const hasAnyExecutePermission = !!(entry.stats.mode & EXEC_PERMISSION_MASK);
  const isExecutable = isFile && hasAnyExecutePermission;

  const suffix = isExecutable ? "*" : (SUFFIX_BY_TYPE[entry.type] ?? "");

  return {
    ...entry,
    display: {
      ...entry.display,
      name: `${entry.display?.name ?? entry.name}${suffix}`,
    },
  };
}
