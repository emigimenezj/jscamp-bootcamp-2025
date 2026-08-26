> **Observación:** Agregué un [README personal](./README.emigimenezj.md) que explica brevemente qué contiene el proyecto y cómo está organizado. Me pareció interesante lo de construir una herramienta CLI así que me fui un poquito más allá de lo requerido. 😅

# Dudas

- **Alcance del `try...catch`:** en `src/cli.js` envolví prácticamente toda la ejecución de la aplicación en un `try...catch`. ¿Un bloque tan amplio se considera un antipatrón o una mala práctica? Si es así, ¿qué criterio conviene usar para decidir dónde capturar los errores en una CLI como esta? En este caso lo hice por simplicidad porque ya me estaba empezando a volver un poco loco... 😅

**Respuesta:**
Buena pregunta!
En este caso no es un antipatrón, te explico:
Tenes dos puntos en el que capturas los errores: en el archivo inicial (Captura arriba) y dentro de la aplicación en cada parte que puede fallar (Captura abajo).

- **Arriba** (en `cli.js`): solo renderizas y decidís el código de salida. No sabes (ni necesitas saber) qué falló.
- **Abajo** (cerca de la operación/función): transformas los errores del sistema en errores con contexto, esto ya lo haces con `SystemError` (a partir de `error.code` generas un mensaje claro). Ahí sabes el detalle del error.

Tu diseño ya cumple esto: `cli.js` delega la interpretación a cada error (cada uno lleva su `message`, `hint` y `exitCode`).

La idea siempre es poder capturar los errores funcionales cerca de donde se producen, y luego mandarlo hacia arriba para mostrarlos y gestionarlos.

- **CLI ¿reactivas?:** ¿Cómo se implementa o cómo suele construirse una CLI que permanece en ejecución, recibe comandos y actualiza la interfaz en tiempo real, tomando el control de la terminal hasta que el usuario sale? (Ejemplo: Claude Code o Codex) No espero un tutorial de implementación, sino algunos punteros a recursos interesantes para aprender sobre este tipo de herramientas. 🤔

**Respuesta:**
Es muy interesante, y todo se basa en promesas y eventos. Node tiene muchas recursos internos que permiten escuchar en tiempo real lo que va sucediendo en otros procesos (como sub terminales) y cosas que el usuario va ingresando.

Te voy a compartir algunas dependencias (nativas y no nativas) para que vayas entendiendo como pueden construir esto terminales como ClaudeCode:

**[`node:readline/promises`](https://nodejs.org/api/readline.html#readlinepromises-interface)**: es la API nativa de Node que lee línea por línea con historial y autocompletado. Es la base sobre la que se construye todo. Muchas librerías usan esto internamente para eso mismo.

**[Ink](https://github.com/vadimdemedes/ink)**: Es React para CLIs, y seguramente (si no me falla la memoria) es lo que usa ClaudeCode.

Lo que hace es permitirte renderizar una interfaz que se vuelve a pintar en cada estado. Como el ejemplo del botón que va actualizando un contador al cambiar de estado, pero en terminal. En el README hay un ejemplo muy claro de eso.

Y por último, hay muchas librerías que hacer la TUI mucho más linda, como https://bomb.sh/docs/clack/guides/examples/

Al abrirla ya verás a lo que me refiero.

En definitiva, lo que hacen es escuchar, abrir procesos, mirar todo lo que pasa en esos procesos y capturar eventos de salida.

Tenemos esto por ejemplo:
https://github.com/microsoft/node-pty

Que lo que hace es crear un pseudo-terminal real, pone un proceso dentro de él, y hace un stream de lectura/escritura para capturar en tiempo real todo lo que el proceso va imprimiendo/devolviendo. Es literalmente lo que hace Codex y ClaudeCode, abrir terminales, poner un proceso en cada una y leer/escribir en ellos en tiempo real.

No se si fue de ayuda, pero para tener un punto de partida inicial de cómo funcionan y de donde vienen sus "features" viene bien :)