# Dudas sobre validaciones

- Lógica de negocios en Zod: en un campo como `modalidad` que puede tener valores diferentes pero muy concretos, ¿con Zod habría que validar que el campo es un `string` o que además cumple con que es alguno de esos valores concretas que se espera?

**Respuesta:**
Buena pregunta! Si los valores son concretos es mejor usar un `z.enum`. Puedes usar `string` (no pasa nada), pero si queremos ser deterministas, es mejor usar `z.enum`.

Lo ideal es que si ese enum se usa en varios sitios, tengamos una constante de configuración que sea nuestra fuente de la verdad, y esos datos los pasemos a zod para que valide con `z.enum`. Es probable que esa constante también la usemos para la UI y otras funciones.

Un ejemplo:

```js
// Esto puede estar en `/filters/constants
const MODALIDADES = ['remoto', 'hibrido', 'senior']

// Esto puede estar en `/filters/schemas`
import { MODALIDADES } from '@/filters/constants/modalidad.js'

const jobSchema = z.object({
  modalidad: z.enum(MODALIDADES),
})
```

- Schema de validación para el Response: en el caso de una respuesta de mi API, ¿conviene aplicar un schema de validación también ahí, o normalmente se valida únicamente el input? Pregunto porque entiendo que podría llegar a ser redundante en cierto modo, pero no me queda del todo claro.

**Respuesta:** 
Lo normal es validar siempre el input. La idea de validar con zod es para cuando no confiamos en los datos, y esto suele pasar en el input porque el usuario es quien nos envía esto.

El output depende de nosotros y tenemos control de la respuesta que devolvemos. Con TypeScript ya puede ser suficiente.

Solo lo veo importante si usamos servicios de terceros sin TypeCheck que devolvemos al output, en ese caso podemos verificar que la data del servicio sea la que esperamos, pero lo normal es que no haga falta.

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

**Respuesta:**
Mi respuesta va a depender de cada caso, mejor te doy ejemplos:
- Si soy airbnb y gran parte del flujo por el cual gano dinero se concentra en el filtro de búsqueda, entonces mi foco de mayor tests tiene que estar en los filtros, porque si no tengo eso controlado, los errores pueden ser catastróficos. En cambio si tengo un error en el cambio de foto de perfil, el usuario puede seguir con su vida usando la aplicación sin bloqueos. La filosofía está en: 1. lo que da dinero hay que testarlo, porque los errores evitan ganar dinero. 2. si el error evita que pueda seguir usando la aplicación, es bueno prestarle atención, si son errores que el usuario puede ignorar o seguir con su proceso, se puede testar más adelante.
- Una vez que tenemos los tests principales hechos, lo importante es la Observabilidad. Ver en donde surgen los errores de los usuarios, agregar un test y corregir. No hace falta volvernos locos, lo lindo de los tests es que existan errores reales para poder solucionarlos y evitar que vuelvan a suceder.
- No hay que testar a la primera casos borde, si el usuario ingresa por ejemplo un offset negativo, los resultados aparecerán en null, pero no es algo que tengamos que ponerle foco de entrada. Esto es un ejemplo simple, a nivel de aplicación podemos tener muchos casos borde que solo aparecen si hay alguien con intención de hacerlo mal.


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

**Respuesta:**
Opinión personal:
Si son tests muy grandes y/o trabajas en un equipo en donde quieran tener todos el mismo tipo de lógica al testar, me parece perfecto, pero hay que tener cuidado con que haya sobre ingeniería y muchas capas de abstracción.

Por ejemplo:

```js
const check = {
  status(result, expected) {
    assert.equal(result.response.status, expected);
  },

  error(result) {
    assert.equal(typeof result.body.error, "string");
    assert.ok(result.body.error.length > 0);
  },
};
```

`check.status` y `check.error` tienen pocas líneas de código, lo puedo ver como sobre ingeniería, pero si trabajo en un equipo me interesa que todos evalúen el status y el error de la misma manera.

Lo que hago es mis tests es:
1. Factory para los servicios/APIs.
2. No abstraigo nada, solo creo funciones para cuando se repite mucho el mismo código/patrón.

Por ejemplo:
Si en todos mis tests de GET verifico el status y devuelvo la respuesta, lo que hago es:

```js
const handleGetAndCheckStatus = ({ path, status } = {
  status: 200,
}) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const res = await fetch(API_URL + normalizedPath);

  assert.strictEqual(res.status, status);
  
  return res.json();
}
```

Y después uso ese handler en todos mis tests que tienen ese código.
Repito, si trabajas con un equipo, lo mejor es lo que hiciste, si es un trabajo individual, haz las abstracciones a medida que te lo vaya exigiendo el test, de a poco y sin complejizar nada.