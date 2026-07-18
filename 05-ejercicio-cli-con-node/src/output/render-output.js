const ICON_BY_TYPE = {
  file: "📄",
  directory: "📁",
  symlink: "🔗",
  other: "❓",
};

const COLUMN_SEPARATOR = "  ";

const DEFAULT_COLUMNS = [
  { key: "icon" },
  { key: "name" },
  { key: "size", align: "right" },
];

const LONG_COLUMNS = [
  { key: "permissions" },
  { key: "owner", align: "right" },
  { key: "size", align: "right" },
  { key: "date" },
  { key: "icon" },
  { key: "name" },
];

export function renderOutput(entries, { long = false } = {}) {
  if (entries.length === 0) return;

  // Normalize entries into a common tabular structure.
  const rows = entries.map(createRow);
  const columns = long ? LONG_COLUMNS : DEFAULT_COLUMNS;

  // Use the widest visible value to determine each column width.
  const widths = getColumnWidths(rows, columns);

  const output = rows.map((row) => renderRow(row, columns, widths)).join("\n");

  console.log(output);
}

function createRow(entry) {
  return {
    permissions: entry.display?.permissions ?? "",
    owner: entry.display?.owner ?? "",
    size:
      entry.type === "directory"
        ? "-"
        : (entry.display?.size ?? String(entry.stats.size)),
    date: entry.display?.date ?? "",
    icon: ICON_BY_TYPE[entry.type] ?? ICON_BY_TYPE.other,
    name: entry.display?.name ?? entry.name,
  };
}

function getColumnWidths(rows, columns) {
  return Object.fromEntries(
    columns.map(({ key }) => [
      key,
      Math.max(...rows.map((row) => visibleLength(row[key]))),
    ]),
  );
}

function renderRow(row, columns, widths) {
  return columns
    .map(({ key, align }) => padCell(row[key], widths[key], align))
    .join(COLUMN_SEPARATOR)
    .trimEnd();
}

function padCell(value, width, align) {
  // Compensate for invisible ANSI characters before applying string padding.
  const targetLength = value.length + width - visibleLength(value);

  return align === "right"
    ? value.padStart(targetLength)
    : value.padEnd(targetLength);
}

// Match ANSI color/style sequences, such as "\x1b[34m" and "\x1b[0m".
// eslint-disable-next-line no-control-regex
const ANSI_COLOR_PATTERN = /\x1b\[[0-9;]*m/g;
function visibleLength(value) {
  // ANSI sequences affect string length but occupy no terminal columns.
  return value.replace(ANSI_COLOR_PATTERN, "").length;
}
