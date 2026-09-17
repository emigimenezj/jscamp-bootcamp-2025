# Dudas

- **¿Tiene sentido usar el sistema de tipos de TypeScript como fuente de verdad global en un proyecto grande con usuarios reales?** Es decir, que frontend, backend, consultas a base de datos y todo el resto de capas que existan deban adaptarse a un contrato de tipos en común. Normalmente a lo que estoy acostumbrado es que la fuente de la verdad sea la base de datos, y no el sistema de tipado.

**Respuesta:**
Los types en TS no son la fuente de la verdad y no deberían serlo. Son el reflejo de la verdadera fuente de la verdad (sea BD o API o lo que sea).

TypeScript no funciona como lógica de negocio, lo único que hace es solo asegurarnos en tiempo de desarrollo que nuestro código siga las estructuras que nosotros definimos (que por supuesto tienen que ser las correctas: las que nos proporcionan las fuentes de la verdad).

Nos hace escribir con menos errores y más ayudas, pero no definen nada. De hecho podemos obtener X valor de la BD, y si en TS definimos Y, el código no va a funcionar porque obtenemos X, no Y.

- **¿Hasta qué punto conviene compartir tipos entre frontend y backend?** En principio me parece bastante valioso para evitar duplicar y reducir el costo de mantenimiento cuando cambia un contrato, pero tmabién me genera dudas si el acoplamiento que se introduce puede llegar a ser contraproducente.

**Respuesta:** Bien, aquí hay algo que divide la decisión:
- Conviene compartir tipos SOLO cuando usamos DTOs (request/response) de la API, no los tipos internos de cada capa. En este caso viene muy bien porque si cambiamos el contrato de salida de un endpoint, el TypeCheck nos va a avisar en el Frontend también.
- No conviene compartirlo con otros tipos que no sean DTOs, porque cada tipo solo y exclusivamente va a funcionar en un requisito puntual (frontend o backend).
 del contrato.

- **¿Hasta qué punto conviene reutilizar tipos existentes para construir nuevos?** Por ejemplo, usar `Pick`, `Omit` o tipos derivados en lugar de declarar directamente algo como `string`. Cuando el proyecto es chico suele ser bastante interesante crear tipos a partir de otros tipos ya definidos, pero en proyectos grandes con tipado extenso se vuelve un tanto caótico tener que estar siempre respetando esa regla y a veces perdiendo tiempo en volver a recordar qué cosas hay a disposición para poder reutilizar en vez de simplemente escribir el tipo `string` de forma directa.

**Respuesta:** Esto es un poco mas simple a nivel teórico, luego depende de nosotros hacerlo bien:

Derivamos (es decir, usamos `Pick`, `Omit`, etc) cuando un tipo depende de otro y queremos heredar sus cambios/estructura.

Un ejemplo puede ser:

```ts
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

// En vez de escribir un DTO nuevo a mano, lo derivamos del modelo. Si agregamos más campos en User, tiene sentido que lo devolvamos también.
type UserResponseDTO = Omit<User, "passwordHash">;

// Lo mismo aquí, si agregamos más, queremos que el DTO devuelto sea exactamente igual al original.
type CreateUserDTO = Pick<User, "name" | "email">;
```

En el ejemplo creo que se ve claro, derivamos cuando queremos heredar los cambios porque las "responsabilidades" de cada tipo depende del otro.

¡Gracias de antemano! 😁

A ti por preguntarnos! Nos encantan estas preguntas, hacen pensar :)