# Organización del proyecto

CLI para listar directorios. Procesa y valida argumentos, comprueba permisos de lectura, obtiene las entradas del filesystem y aplica filtros, ordenamiento y formato antes de mostrarlas.

## Estructura de `src`

```text
src/
├── cli.js
├── app/
│   ├── feature-pipeline.js
│   └── run-cli.js
├── arguments/
│   ├── parse.js
│   ├── utils.js
│   └── validate.js
├── constants/
│   ├── exit-codes.js
│   └── flags.js
├── errors/
│   ├── app-error.js
│   ├── cli-error.js
│   └── system-error.js
├── features/
│   ├── classify-entry.js
│   ├── colorize-entry.js
│   ├── filter-entry-type.js
│   ├── filter-hidden.js
│   ├── format-long-entry.js
│   ├── format-size.js
│   ├── reverse-entries.js
│   └── sort-entries.js
├── filesystem/
│   └── read-entries.js
├── output/
│   ├── render-feedback.js
│   ├── render-help.js
│   └── render-output.js
└── permission/
    └── validate.js
```

- `cli.js`: punto de entrada.
- `app`: coordina el flujo y las transformaciones.
- `arguments`: normaliza, valida y convierte los argumentos en opciones.
- `permission` y `filesystem`: validan el acceso y leen el directorio.
- `features`: filtra, ordena y da formato a las entradas.
- `output`: renderiza resultados, ayuda y errores.
- `errors` y `constants`: centralizan errores y valores compartidos.
