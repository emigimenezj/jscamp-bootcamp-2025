const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  gray: "\x1b[90m",
};

function colorize(value, ...styles) {
  return `${styles.join("")}${value}${ANSI.reset}`;
}

export function renderError(error) {
  const title = colorize("Error", ANSI.bold, ANSI.red);
  const code = error.code ? colorize(`[${error.code}]`, ANSI.gray) : "";

  const lines = [`${title}${code ? ` ${code}` : ""}`, error.message];

  if (error.hint) {
    const hintLabel = colorize("Hint:", ANSI.yellow);
    lines.push(`${hintLabel} ${error.hint}`);
  }

  process.stderr.write(`${lines.join("\n")}\n`);
}
