import { ANSI } from "../constants/ansi.js";
import { EXEC_PERMISSION_MASK } from "../constants/file-types.js";

const COLOR_BY_TYPE = {
  directory: ANSI.blue,
  symlink: ANSI.cyan,
  other: ANSI.gray,
};

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
