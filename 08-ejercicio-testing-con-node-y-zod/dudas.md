# Dudas sobre validaciones

- Lógica de negocios en Zod: en un campo como `modalidad` que puede tener valores diferentes pero muy concretos, ¿con Zod habría que validar que el campo es un `string` o que además cumple con que es alguno de esos valores concretas que se espera?

- Schema de validación para el Response: en el caso de una respuesta de mi API, ¿conviene aplicar un schema de validación también ahí, o normalmente se valida únicamente el input? Pregunto porque entiendo que podría llegar a ser redundante en cierto modo, pero no me queda del todo claro.

# Dudas sobre testing

## 1. Todos los escenarios posibles (DUDA PRINCIPAL)

Este siempre fue uno de los puntos que más me costó del testing 😅

En `GET /jobs` agregué algunos tests extra y bastante específicos:

```javascript
it("ignora los query parameters no soportados", async () => ...
it("combina múltiples filtros mediante un AND lógico", async () => ...
```

En el resto del ejercicio, en cambio, hice principalmente los tests pedidos. Sin embargo, después noté que todavía quedaban muchos escenarios posibles sin cubrir, por ejemplo:

- `empresa` y `ubicacion` obligatorias.
- `data.technology` como array de strings.
- variantes de `PUT`, como omitir un campo obligatorio.
- variantes de `PATCH`, como enviar un objeto vacío.
- hacer dos `DELETE` seguidos sobre el mismo ID.

Esto me recordó a una experiencia propia. Hace un tiempo estaba desarrollando un juego de cartas y empecé a pensar en testear todas las combinaciones posibles de manos. Aunque eso formaba parte de la lógica de negocio, rápidamente aparecieron miles de casos que terminaban verificando esencialmente lo mismo.

Ahí aparece mi duda principal: **¿cómo encontrar el equilibrio entre tener pocos tests y dejar casos importantes afuera, versus cubrir demasiadas combinaciones con poco valor adicional?**

Entiendo que no existe una regla universal, pero me gustaría tener una noción más clara del criterio que suelen aplicar en proyectos reales para decidir qué vale la pena testear y qué no.

Si además tienen algún ejemplo de producción donde hayan tenido que tomar una decisión de este estilo, me interesaría mucho saber cómo lo analizaron y a qué conclusión llegaron.

## 2. ¿Cuándo conviene abstraer lógica dentro de los tests?

Una duda adicional, un poco más bajada a tierra 😅

Siempre vi que en testing se suele priorizar que los tests sean lo más cortos, claros y directos posibles. Por eso muchas veces también vi bastante código repetido y poca obsesión por aplicar `DRY`.

Después entendí que puede tener sentido: abstraer algo muy concreto puede reducir repetición, pero también ocultar información y hacer que el test sea menos legible.

En este ejercicio hice justamente un ejemplo para probar esa idea (y de paso preguntar 😋):

```js
check.status(result, 200);
verify.invalid.title(job);
```

Los separé en dos objetos porque `check` contiene únicamente assertions, mientras que `verify` puede incluir assertions junto con algo de lógica adicional propia del test, como una llamada a la API.

Mi pregunta es: **¿qué opinan de este tipo de abstracciones dentro de la capa de testing?**

¿Les parecen útiles? ¿Prefieren evitarlas para mantener los tests más explícitos? ¿Qué criterio les parece el más indicado para aplicar? ¡Me intriga y quiero saber!
