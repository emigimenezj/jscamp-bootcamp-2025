# Dudas

## Alcance de la capa de testing E2E

En aplicaciones grandes, los tests E2E pueden volverse costosos para ejecutar y además también limitar cambios frecuentes en la UI en caso de que el proyecto lo requiera. Siempre tuve el problema de identificar con criterio en dónde está el límite entre lo que es interesante testear con test E2E y lo que no ¿Cómo habría que decidir estos flujos que justifican un test E2E? Y más importante aun, ¿cómo decidir cuáles conviene no cubrir? ¿Podrían darme algunos ejemplos ilustrativos? ¡Gracias!

**Respuesta:**

Un poco lo que respondí en el ejercicio anterior, los tests E2E deberían cubrir los flujos críticos de negocio, es decir, lo que el usuario suele hacer en tu aplicación de principio a fin. Y todo aquello que conlleva ganar dinero o uso de una funcionalidad principal.

El resto de tareas ya va de la mano con tests unitarios, no E2E.

Los cambios de UI depende cual sea el caso, pero lo mejor es testar elementos por getByRole, y estos elementos aunque los movamos de lugar o cambiemos el contenido parcial, deberían de seguir siendo visualizados por el test.

Si los cambios son demasiados, tal vez esperaría a tener un E2E cuando se normalice el diseño.

## Repetición de validación de comportamiento

En algunos tests E2E me encontré repitiendo muchas veces las mismas comprobaciones. Por ejemplo, distintos flujos que pasan por el dashboard vuelven a verificar que el dashboard esté visible.

¿Es recomendable tener un test específico que valide ese estado y evitar repetir la misma comprobación en otros flujos?

En experiencias previas anteriores usé algo que llamé "Page Object Model" para encapsular las interacciones de cada página, incluyendo cosas como navegación, clicks y verificaciones. Eso hacía que los tests sean más legibles (claramente), pero también provocaba que muchas comprobaciones se ejecutaran una y otra vez en distintos flujos.

¿Sería un approach correcto este o habría que repensarlo? 🤔

**Respuesta:**
Los E2E siempre deberían ser independientes y auto-verificables, no deben depender de otros tests.

Dicho esto, lo que haría es:
- Repetir en los tests todas las comprobaciones que son "baratas", ahí pondría que una página sea visible antes de hacer algo.
- En el POM pondría las interacciones repetidas, lo que viene siendo navegación, clicks y locators.

En resumen, evitaría únicamente las cosas pesadas, que puede ser llamadas pesadas a un endpoint o directamente que se recargue la página.

## Vinculación de test E2E y el DOM

¿Cómo se recomienda vincular de forma robusta y unívoca los elementos renderizados con los tests E2E?

Entiendo la prioridad de usar `getByRole`, texto, labels o `data-testid`, pero ninguno garantiza por sí mismo que el elemento sea único en el DOM, especialmente en aplicaciones React con componentes reutilizables. Usar `id` tampoco parece escalable, ya que habría que garantizar manualmente su unicidad en toda la aplicación.

¿Existe algún patrón o estrategia recomendada para identificar elementos de forma estable y evitar que los tests se rompan por ambigüedad o cambios en la estructura del DOM?

**Respuesta:**
Con esto hay algo claro:
No existe un único atributo que garantice unicidad, la estrategia recomendada es en capas, combinando lo que ya mencionas:


Lo mejor es usar `getByRole` + `name` como primera opción:
Es el selector más estable porque compromete dos cosas a la vez, accesibilidad y comportamiento. Si un botón cambia de texto o pierde su rol, es un problema de UX que el test está detectando. Por eso te comentaba esto de testar con `getByRole`, puede cambiar el texto o su lugar, pero siempre debería ser visible por el test.

Los otros selectores no los recomiendo, ni `id`, ni `data-testid`, ni CSS.

Si estamos en una página, es raro que haciendo un `getByRole` + `name` no encontremos el elemento que busquemos, y en caso de que haya varios, podemos obtener el sub-elemento dentro de la página en donde se encuentra el elemento buscado, y después buscarlo dentro del sub-elemento.

Por ejemplo:

```js
const form = page.getByRole('form', { name: 'Nombre del formulario' });
const button = form.getByRole('button', { name: 'Enviar' });

await button.click();
```


## Diferencia entre presencia y visibilidad

En uno de mis tests tengo estas dos comprobaciones:

```js
await expect(results).not.toHaveCount(0); // presencia
await expect(results.first()).toBeVisible(); // visibilidad
```

Las agregó el agente 🤖 mientras le pedía abstracciones para mejorar la legibilidad de los tests. Entiendo que la primera verifica que exista al menos un elemento en el DOM (`presencia`), mientras que la segunda verifica que el primero sea visible (`visibilidad`).

Mi duda es: ¿tiene sentido mantener ambas comprobaciones? Si un elemento es visible en teoría necesariamente debería existir, por lo que verificar presencia previamente se me hace redundante.

Dicho de otra forma, ¿hay algún caso en tests E2E donde convenga comprobar explícitamente y únicamente presencia y no visibilidad?

**Respuesta:**

Este caso no tiene sentido, de hecho es redundante, con hacer `toBeVisible` ya verificamos que el elemento existe, si no está en el DOM da error.

El caso en el que se me ocurre que sí podemos evaluar la presencia de un elemento es cuando tenemos elementos que no son visibles explícitamente, por ejemplo un toast o un elemento con display:none que se mostrará luego.

## El temido responsive 😱

¿Tiene sentido usar Playwright para testear comportamiento responsive?

Ya sea que sí o que no, ¿podrían facilitarme algunos punteros o recursos interesantes sobre tema de testing responsive? La verdad es que nunca hice.

### Respuesta

Tiene sentido mientras haya funcionalidades diferentes en mobile, por ejemplo un menú del header que se muestra solo ahí.

En la documentación hay un montón de opciones tanto en config como en el propio test para aplicar con ejemplos. Te paso link:
https://playwright.dev/docs/emulation#viewport

aquí dejé marcado #viewport pero si recorres la página, vas a ver diferentes opciones muy interesantes.