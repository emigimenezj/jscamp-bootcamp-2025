const ANSI = {
  reset: "\x1b[0m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  gray: "\x1b[90m",
};

const COLOR_BY_TYPE = {
  directory: ANSI.blue,
  symlink: ANSI.cyan,
  other: ANSI.gray,
};

const EXEC_PERMISSION_MASK = 0o111; // 0o111 is the octal representation of the execute permission bits for user, group, and others.

export function colorizeEntry(entry) {
  const isFile = entry.type === "file";
  const hasAnyExecutePermission = !!(entry.stats.mode & EXEC_PERMISSION_MASK);
  const isExecutable = isFile && hasAnyExecutePermission;

  const color = isExecutable ? ANSI.green : COLOR_BY_TYPE[entry.type];

  if (!color) return { ...entry };

  return {
    ...entry,
    display: {
      ...entry.display,
      name: `${color}${entry.display?.name ?? entry.name}${ANSI.reset}`,
    },
  };
}
