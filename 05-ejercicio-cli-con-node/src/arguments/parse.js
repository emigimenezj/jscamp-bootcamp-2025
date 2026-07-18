import { FLAGS } from "../constants/flags.js";
import { normalizeArgs } from "./utils.js";

const DEFAULT_OPTIONS = {
  path: ".",
  filters: {
    all: false,
    type: null, // "file" | "directory" | null
  },
  sort: {
    by: null, // "name" | "size" | "time" | "created" | null
    reverse: false,
  },
  output: {
    long: false,
    human: {
      readable: false,
    },
    classify: false,
    color: false,
  },
  help: false,
};

export function parseArguments(args) {
  const options = structuredClone(DEFAULT_OPTIONS);
  const normalizedArgs = normalizeArgs(args);

  for (const arg of normalizedArgs) {
    const { filters, sort, output } = options;
    // PATH
    if (!arg.startsWith("-")) {
      options.path = arg;
      continue;
    }
    // FILTERS
    if (FLAGS.ALL.includes(arg)) filters.all = true;
    if (FLAGS.FILTER_FILES.includes(arg)) filters.type = "file";
    if (FLAGS.FILTER_FOLDERS.includes(arg)) filters.type = "directory";
    // SORT
    if (FLAGS.SORT_NAME.includes(arg)) sort.by = "name";
    if (FLAGS.SORT_REVERSE.includes(arg)) sort.reverse = true;
    if (FLAGS.SORT_SIZE.includes(arg)) sort.by = "size";
    if (FLAGS.SORT_TIME.includes(arg)) sort.by = "time";
    if (FLAGS.SORT_CREATED.includes(arg)) sort.by = "created";
    if (FLAGS.SORT_ASC.includes(arg)) sort.by = "name";
    if (FLAGS.SORT_DESC.includes(arg)) {
      sort.by = "name";
      sort.reverse = true;
    }
    // OUTPUT
    if (FLAGS.LONG.includes(arg)) output.long = true;
    if (FLAGS.HUMAN_READABLE.includes(arg)) output.human.readable = true;
    if (FLAGS.CLASSIFY.includes(arg)) output.classify = true;
    if (FLAGS.OUTPUT_COLOR.includes(arg)) output.color = true;
    // HELP
    if (FLAGS.HELP.includes(arg)) options.help = true;
  }
  return options;
}

// -a / --all: incluir archivos y carpetas ocultos.
// -l / --long: mostrar permisos, propietario, tamaño, fecha y otros metadatos.
// -h / --human-readable: mostrar tamaños legibles, como 2.4 KB o 15 MB.
// -n / --sort-name / --asc: ordenar por nombre de forma ascendente.
// --desc: alias de --sort-name -r. Ordenar por nombre de forma descendente.
// -r / --reverse: invertir el orden del criterio de ordenamiento activo.
// -s / --sort-size: ordenar por tamaño.
// -t / --sort-time: ordenar por fecha de modificación.
// -c / --sort-created: ordenar por fecha de creación.
// -F / --classify: añadir un carácter al final de cada nombre para indicar el tipo de archivo.
// --files: mostrar solamente archivos.
// --folders: mostrar solamente carpetas.
// --color: mostrar colores según el tipo de archivo.
// --help: mostrar la ayuda.
