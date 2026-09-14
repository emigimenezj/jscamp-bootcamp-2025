# Dudas

## Alcance de la capa de testing E2E

En aplicaciones grandes, los tests E2E pueden volverse costosos para ejecutar y además también limitar cambios frecuentes en la UI en caso de que el proyecto lo requiera. Siempre tuve el problema de identificar con criterio en dónde está el límite entre lo que es interesante testear con test E2E y lo que no ¿Cómo habría que decidir estos flujos que justifican un test E2E? Y más importante aun, ¿cómo decidir cuáles conviene no cubrir? ¿Podrían darme algunos ejemplos ilustrativos? ¡Gracias!

## Repetición de validación de comportamiento

En algunos tests E2E me encontré repitiendo muchas veces las mismas comprobaciones. Por ejemplo, distintos flujos que pasan por el dashboard vuelven a verificar que el dashboard esté visible.

¿Es recomendable tener un test específico que valide ese estado y evitar repetir la misma comprobación en otros flujos?

En experiencias previas anteriores usé algo que llamé "Page Object Model" para encapsular las interacciones de cada página, incluyendo cosas como navegación, clicks y verificaciones. Eso hacía que los tests sean más legibles (claramente), pero también provocaba que muchas comprobaciones se ejecutaran una y otra vez en distintos flujos.

¿Sería un approach correcto este o habría que repensarlo? 🤔

## Vinculación de test E2E y el DOM

¿Cómo se recomienda vincular de forma robusta y unívoca los elementos renderizados con los tests E2E?

Entiendo la prioridad de usar `getByRole`, texto, labels o `data-testid`, pero ninguno garantiza por sí mismo que el elemento sea único en el DOM, especialmente en aplicaciones React con componentes reutilizables. Usar `id` tampoco parece escalable, ya que habría que garantizar manualmente su unicidad en toda la aplicación.

¿Existe algún patrón o estrategia recomendada para identificar elementos de forma estable y evitar que los tests se rompan por ambigüedad o cambios en la estructura del DOM?

## Diferencia entre presencia y visibilidad

En uno de mis tests tengo estas dos comprobaciones:

```js
await expect(results).not.toHaveCount(0); // presencia
await expect(results.first()).toBeVisible(); // visibilidad
```

Las agregó el agente 🤖 mientras le pedía abstracciones para mejorar la legibilidad de los tests. Entiendo que la primera verifica que exista al menos un elemento en el DOM (`presencia`), mientras que la segunda verifica que el primero sea visible (`visibilidad`).

Mi duda es: ¿tiene sentido mantener ambas comprobaciones? Si un elemento es visible en teoría necesariamente debería existir, por lo que verificar presencia previamente se me hace redundante.

Dicho de otra forma, ¿hay algún caso en tests E2E donde convenga comprobar explícitamente y únicamente presencia y no visibilidad?

## El temido responsive 😱

¿Tiene sentido usar Playwright para testear comportamiento responsive?

Ya sea que sí o que no, ¿podrían facilitarme algunos punteros o recursos interesantes sobre tema de testing responsive? La verdad es que nunca hice.
