export function filterEntryType(entries, type = null) {
  if (type === null) return [...entries];

  return entries.filter((entry) => entry.type === type);
}
