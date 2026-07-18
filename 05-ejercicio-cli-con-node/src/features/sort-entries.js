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
  if (criterion === null) return entries.toSorted(directoriesFirst);
  return entries.toSorted(COMPARATORS[criterion]);
}

function directoriesFirst(left, right) {
  return Number(right.type === "directory") - Number(left.type === "directory");
}
