> **Observación:** Agregué un [README personal](./README.emigimenezj.md) que explica brevemente qué contiene el proyecto y cómo está organizado. Me pareció interesante lo de construir una herramienta CLI así que me fui un poquito más allá de lo requerido. 😅

# Dudas

- **Alcance del `try...catch`:** en `src/cli.js` envolví prácticamente toda la ejecución de la aplicación en un `try...catch`. ¿Un bloque tan amplio se considera un antipatrón o una mala práctica? Si es así, ¿qué criterio conviene usar para decidir dónde capturar los errores en una CLI como esta? En este caso lo hice por simplicidad porque ya me estaba empezando a volver un poco loco... 😅

- **CLI ¿reactivas?:** ¿Cómo se implementa o cómo suele construirse una CLI que permanece en ejecución, recibe comandos y actualiza la interfaz en tiempo real, tomando el control de la terminal hasta que el usuario sale? (Ejemplo: Claude Code o Codex) No espero un tutorial de implementación, sino algunos punteros a recursos interesantes para aprender sobre este tipo de herramientas. 🤔

🙏 ¡Gracias!
