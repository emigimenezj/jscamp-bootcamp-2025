# Dudas

- **¿Tiene sentido usar el sistema de tipos de TypeScript como fuente de verdad global en un proyecto grande con usuarios reales?** Es decir, que frontend, backend, consultas a base de datos y todo el resto de capas que existan deban adaptarse a un contrato de tipos en común. Normalmente a lo que estoy acostumbrado es que la fuente de la verdad sea la base de datos, y no el sistema de tipado.

- **¿Hasta qué punto conviene compartir tipos entre frontend y backend?** En principio me parece bastante valioso para evitar duplicar y reducir el costo de mantenimiento cuando cambia un contrato, pero tmabién me genera dudas si el acoplamiento que se introduce puede llegar a ser contraproducente.

- **¿Hasta qué punto conviene reutilizar tipos existentes para construir nuevos?** Por ejemplo, usar `Pick`, `Omit` o tipos derivados en lugar de declarar directamente algo como `string`. Cuando el proyecto es chico suele ser bastante interesante crear tipos a partir de otros tipos ya definidos, pero en proyectos grandes con tipado extenso se vuelve un tanto caótico tener que estar siempre respetando esa regla y a veces perdiendo tiempo en volver a recordar qué cosas hay a disposición para poder reutilizar en vez de simplemente escribir el tipo `string` de forma directa.

¡Gracias de antemano! 😁
