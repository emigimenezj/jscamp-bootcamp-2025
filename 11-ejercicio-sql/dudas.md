# Dudas

Tengo dos dudas puntuales; en líneas generales, el resto creo que lo tengo bajo control.

- En vez de implementar la lógica de filtrado de `GET /jobs` dentro de `JobModel`, terminé resolviéndola directamente en SQL desde `job-statements.ts`. Al principio me pareció una decisión más interesante y lógica, pero cuando la consulta fue creciendo empecé a dudar ¿Es una buena decisión dejar esa lógica de filtrado en SQL? 🤔

- Por otra parte otra cosa que también no me quedó del todo claro si está bien es la división de responsabilidades. En el caso de transformar las `rows` de la DB al contrato del tipo `Job` todo se vuelve bastante tedioso. En principio lo hice en el `JobModel`, después vi que `midu` dijo que lo hubiese hecho en el `Controller` entonces lo migré y al final no sé si me terminó de convencer del todo. Dado que se tiene esa diferencia entre contratos db/tipado, ¿en dónde debería ejecutarse esta transformación para dividir correctamente responsabilidades?

- Una última cosa más: la creación de las tablas terminó quedando dentro de `database.ts` porque, al abstraer los statements en `job-statements.ts`, lo que me pasaba era que se preparaban al importar el módulo y fallaban porque las tablas todavía no existían. Sé que mezclar inicialización del esquema con creación de la conexión no es ideal, lo dejé así porque es la forma que encontré para hacerlo andar pero ¿cómo conviene separar estas responsabilidades sin verse forzado a contaminar el archivo `database.ts`?

PD: ya que estaba agregué algunos tests reutilizando parte del código del ejercicio `08-testing-con-node-y-zod` para probar si todo funcionaba y también para ¡probar la persistencia! 🥳

¡Gracias! 😁

---

**Respuesta 1:**
Buena pregunta, y la respuesta es que si, siempre debemos dejar la lógica de filtrado en SQL. La idea es que el modelo no tenga que preocuparse por el filtrado. Y por otro lado, siempre el motor de SQL hará el filtrado más rápido que nosotros en nuestro modelo en el lenguaje que usemos.

**Respuesta 2:**
Personalmente y a nivel de arquitectura (siempre el libro cambia según el lector), prefiero que el filtrado se haga en el modelo. El controlador no tiene que preocuparse por el las transformaciones de los datos. Si poneos la lógica en el controlador, si mañana cambiamos el modelo también tendríamos que cambiar el controlador, y es un anti patrón.

**Respuesta 3:**

Hicimos los cambios para que funcione, creo que es mejor verlo desde ahí :)
