<!-- Aquí puedes poner tus dudas del ejercicio -->

Dudas

- 1. ¿Por qué en la versión con clases de MVC se usan puros métodos estáticos?

¿No sería equivalente hacer algo como esto?:

```js
const myClass = {
  get: () => {},
  set: () => {},
  clear: () => {},
};
```

- 2. Mapeo de propiedades 1 a 1 en vez de usar `...` (spread operator)

```js
static update(id, input) {
    const { titulo, empresa, ubicacion, descripcion } = input;
    const { data, content } = input;

    const index = jobs.findIndex(({ id: target }) => target === id);

    if (index === -1) return null;

    const job = {
      id,
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content,
    };

    jobs[index] = job;

    return job;
  }

  static partialUpdate(id, input) {
    const index = jobs.findIndex(({ id: target }) => target === id);

    if (index === -1) return null;

    const job = {
      ...jobs[index],
      ...input,
      id,
    };

    jobs[index] = job;

    return job;
  }
```

- 3. ¿Debería ser un endpoint excesivamente restrictivo o no?
     Por ejemplo en el caso del `DELETE` fallar si envía algún json en el body (no sería necesariO)
     O también por ejemplo en el `GET` que reciba una propiedad que no hace nada.
     (lo que me hace ruido de esto es que si se deja pasar entonces en el futuro al agregar una propiedad o funcionalidad que matchee con el mal uso del endpoint va a hacer que de la nada el comportamiento actualmente esperado cambie y eso es una porquería, en mi humilde opinión).
