const COMPARATORS = {
  name: (left, right) =>
    left.name.localeCompare(right.name, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  size: (left, right) => left.stats.size - right.stats.size,
  time: (left, right) =>
    left.stats.dates.modified.getTime() - right.stats.dates.modified.getTime(),
  created: (left, right) =>
    left.stats.dates.created.getTime() - right.stats.dates.created.getTime(),
};

export function sortEntries(entries, criterion = null) {
  // Si no hay criterio, podemos devolver el orden original de readdir
  if (criterion === null) return [...entries];
  return entries.toSorted(COMPARATORS[criterion]);
}
