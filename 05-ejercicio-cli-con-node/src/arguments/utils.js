export function normalizeArgs(args) {
  const normalizedFlags = expandShortFlags(args);
  return normalizedFlags;
}

// add support for short flags like -alh to be expanded to -a -l -h
function expandShortFlags(args) {
  return args.flatMap((arg) => {
    if (arg.startsWith("-") && !arg.startsWith("--") && arg.length > 2) {
      return arg
        .slice(1)
        .split("")
        .map((flag) => `-${flag}`);
    }

    return arg;
  });
}
