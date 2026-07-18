const HELP_TEXT = `Uso:
  node src/cli.js [ruta] [opciones]

Argumentos:
  ruta                          Directorio que se quiere listar (por defecto: .).

Opciones:
  -a, --all                     Incluir archivos y carpetas ocultos.
  -l, --long                    Mostrar permisos, propietario, tamaño, fecha y otros metadatos.
  -h, --human-readable          Mostrar tamaños legibles, como 2.4 KB o 15 MB.
  -n, --sort-name, --asc        Ordenar por nombre de forma ascendente.
  --desc                        Ordenar por nombre de forma descendente.
  -r, --reverse                 Invertir el criterio de ordenamiento activo.
  -s, --sort-size               Ordenar por tamaño.
  -t, --sort-time               Ordenar por fecha de modificación.
  -c, --sort-created            Ordenar por fecha de creación.
  -F, --classify                Añadir un carácter al nombre para indicar el tipo de entrada.
  --files                       Mostrar solamente archivos.
  --folders                     Mostrar solamente carpetas.
  --color                       Mostrar colores según el tipo de archivo.
  --help                        Mostrar esta ayuda.

Ejemplos:
  node src/cli.js
  node src/cli.js ./src --all --sort-name
  node src/cli.js ./src --files --sort-size --reverse
  node src/cli.js --help`;

export function renderHelp() {
  console.log(HELP_TEXT);
}
