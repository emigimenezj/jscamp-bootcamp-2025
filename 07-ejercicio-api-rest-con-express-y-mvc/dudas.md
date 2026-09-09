# Dudas

## Métodos estáticos en MVC

- En la versión con clases del patrón MVC, tanto el modelo como el controlador terminan usando casi exclusivamente métodos estáticos. ¿Qué ventaja aporta usar una clase en ese caso frente a exportar directamente un objeto con funciones, por ejemplo `{ get, set, clear }`? ¿Hay alguna diferencia conceptual o práctica importante? Por mi parte, si no se van a usar instancias de las clases y todo va a ser estático entonces la notación de clase es boilerplate innecesario, o al menos lo veo así en principio.

**Respuesta:**

Muy buenas preguntas, vamos por la primera:

La realidad es que si no vas a instanciar una clase, poca necesidad de usar clases hay.

La instancia de clases nos permite:
- inyección de dependencias (esto viene muy bien para hacer testing de mocks muy fácil).
- herencia o branding para tooling o convenciones de equipo.

Fuera de estas dos cosas, no es necesario.
En este caso, si usas funciones es totalmente válido.
A nivel personal por ejemplo, prefiero hacerlo por funciones y no clases, en este tipo de APIs.

## Mapeo explícito vs. spread en actualizaciones

- En el `JobModel`, para `PUT` mapeé explícitamente cada propiedad recibida, mientras que para `PATCH` reutilizo el objeto existente y aplico `...input` sobre él. ¿Es una buena práctica mantener esta diferencia? ¿Conviene evitar el spread de `input` en actualizaciones completas para controlar explícitamente qué propiedades pueden formar parte del recurso? Al menos mi experiencia en programación me enseñó por las buenas y por las malas que no controlar explícitamente lo que hacés puede conducir a desastre.

**Respuesta:**

Partimos de esto:
El mapeo explícito en PUT es buena práctica. Permite definir los campos que forman el recurso, y un campo nuevo que aparezca en `input` en el futuro no puede colarse en el objeto que almacenemos.

El tener un spread es seguro solo si tenemos un middleware de validación que rechace las claves desconocidas. En este caso, puedes usar spread.

## Qué tan estricta debería ser una API

- ¿Qué tan estricto debería ser un endpoint con datos que no espera o no utiliza? Por ejemplo, ¿conviene rechazar un `body` enviado en un `DELETE` o query params desconocidos en un `GET`, o normalmente se ignoran?

  Me genera dudas permitirlos porque un parámetro que hoy no significa nada podría adquirir significado en una versión futura de la API y cambiar silenciosamente el comportamiento de una request que antes era válida. ¿Esto es una preocupación razonable en el diseño de APIs?

**Respuesta:**

Bien, vamos por puntos:

1. `body` en DELETE:
DELETE conceptualmente no lleva body, algunos clientes y proxies lo eliminan directamente. Así que no es necesario hacerlo manualmente.

2. Query params desconocidos en GET:
Se puede hacer las dos cosas y ambas son válidas: ignorarlos o rechazarlos. Muchas APIs lo que hacen es ignorar los parámetros desconocidos con la lógica de - si van a usar mi API entonces deberían de saber cómo se tiene que usar - . Y otras lo que hacen es rechazarla directamente.

En este caso es totalmente subjetivo.

3. Campos desconocidos en body:

Stripe y GraphQL son dos grandes que rechazan parámetros desconocidos. Partiendo de esto, rechazar con un 400 las peticiones con campos desconocidos es una buena idea.

## Middlewares

- Tomé la decisión de agregar middlewares propios para logging, manejo global de errores y validación de requests, aunque eso se sale un poco del alcance del ejercicio. ¿Es una buena separación de responsabilidades o estoy agregando complejidad innecesaria para este tipo de API?

- Además de estos casos, ¿cuáles dirían que son los usos más comunes y útiles de los middlewares en aplicaciones reales? Me interesan especialmente aquellos que suelen aportar bastante valor pero que a veces no se consideran al principio por desconocimiento.

**Respuesta:**

Es una buena separación de responsabilidades si, de hecho las APIs usan este tipo de separaciones.

Lo que te puedo decir de usos más comunes y útiles en middleware es usar herramientas que nos ayuden en determinadas responsabilidades:

- Seguridad: Usamos `helmet` (headers de seguridad), rate limiting (`express-rate-limit`) y límites de tamaño de body
- Auth: Hacemos parseo de JWT/sesión + autorización por roles si es necesario
- Observabilidad: Usamos request-id para correlacionar logs y logging estructurado con `pino-http`.
- Validación con esquemas: Normalmente se usa `zod`

Hay muchas herramientas y recuerda:
No hay que hacer todo.
A medida que la aplicación crezca y lo requiera, ahí es en donde vamos agregando nuevas responsabilidades.