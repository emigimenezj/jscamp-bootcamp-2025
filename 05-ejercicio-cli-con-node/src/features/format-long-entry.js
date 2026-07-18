import ms from "ms";

const PERMISSION_DEFINITIONS = [
  { mask: 0o400, symbol: "r" },
  { mask: 0o200, symbol: "w" },
  { mask: 0o100, symbol: "x" },

  { mask: 0o040, symbol: "r" },
  { mask: 0o020, symbol: "w" },
  { mask: 0o010, symbol: "x" },

  { mask: 0o004, symbol: "r" },
  { mask: 0o002, symbol: "w" },
  { mask: 0o001, symbol: "x" },
];

const TYPE_SYMBOL = {
  file: "-",
  directory: "d",
  symlink: "l",
  other: "?",
};

export function formatLongEntry(entry, options = {}) {
  const { readable = false, now = Date.now() } = options;

  const permissions = formatPermissions(entry.stats.mode, entry.type);
  const modified = formatDate(entry.stats.dates.modified, readable, now);

  return {
    ...entry,
    display: {
      ...entry.display,
      permissions,
      owner: String(entry.stats.uid),
      date: modified,
    },
  };
}

function formatPermissions(mode, type) {
  const permissions = PERMISSION_DEFINITIONS.map(({ mask, symbol }) =>
    mode & mask ? symbol : "-",
  ).join("");

  const typeSymbol = TYPE_SYMBOL[type] ?? TYPE_SYMBOL.other;

  return typeSymbol + permissions;
}

function formatDate(date, humanReadable, now) {
  if (!humanReadable) return date.toISOString().slice(0, 19).replace("T", " ");

  const elapsed = now - date.getTime();
  const duration = ms(Math.abs(elapsed), { long: true });

  return elapsed >= 0 ? `${duration} ago` : `in ${duration}`;
}
