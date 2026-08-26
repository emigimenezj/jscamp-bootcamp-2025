// Códigos ANSI compartidos entre los módulos de salida y de color. Lo mismo que comentamos en los otros archivos de `constants`. La idea es poder olvidarse de estos valores difíciles de recordar/reconocer, y hacer una constante mucho mas declarativa e inmutable - con esto no nos vamos a confundir - .
export const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};
