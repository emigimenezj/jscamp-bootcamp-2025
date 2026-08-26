import { ANSI } from "../constants/ansi.js"; // Como lo usamos en diferentes sitios, usamos el import de un fichero en `constants`

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
