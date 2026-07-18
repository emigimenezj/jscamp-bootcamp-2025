const UNITS = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];

export function formatSize(entry, humanReadable = false) {
  const { stats } = entry;
  const size = humanReadable ? toHumanReadable(stats.size) : String(stats.size);

  return {
    ...entry,
    display: {
      ...entry.display,
      size,
    },
  };
}

function toHumanReadable(bytes) {
  if (bytes === 0) return "0 B";

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    UNITS.length - 1,
  );
  const value = bytes / 1024 ** unitIndex;

  return `${Number(value.toFixed(2))} ${UNITS[unitIndex]}`;
}
