const SUFFIX_BY_TYPE = {
  directory: "/",
  symlink: "@",
  other: "?",
};

const EXEC_PERMISSION_MASK = 0o111; // 0o111 is the octal representation of the execute permission bits for user, group, and others.

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
