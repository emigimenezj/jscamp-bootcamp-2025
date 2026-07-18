export function filterHidden(entries, includeHidden = false) {
  if (includeHidden) return [...entries];

  return entries.filter((entry) => !entry.hidden);
}
