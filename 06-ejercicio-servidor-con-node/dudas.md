# Dudas

- 🧠 Conceptos clave vs secundarios: ¿Qué conceptos de Node.js son **realmente fundamentales** y cuáles no tanto en el día a día?
  - Por ejemplo:
    - event loop
    - async/await y Promises
    - I/O asíncrono
    - Concurrencia y paralelismo (con workers entiendo)
    - eventos
    - streams
    - buffers
    - sistema de módulos
    - Cualquier otro que quieras incluir 😅
  - Porque mi idea no es aprender todo, sino entender qué es más importante y qué otras cosas pueda aprender "cuando haga falta". En otras palabras, saber qué conceptos hay que dominar sí o sí y cua´les simplemente saber que existen de momento...
- ⚙️ Elección de ejecución de una tarea: cuando se tiene una operación ¿cómo decidir si va en el `event loop`, en un `Worker Thread`, en otro `proceso` o en un `servicio` separado?
- 👀 Observabilidad: en una app de Node.JS en producción (por ejemplo una API!), ¿qué métricas son indispensables para saber si todo está bien? Vi durante el curso lo del endpoint `/health` y me interesa saber qué hay más allá de esto
  - Además, en este contexto, ¿hay algo que la gente suela ignorar y sea fundamental? Como los tests por ejemplo jajaja 😋


**Respuesta:**
Buenas preguntas! vamos por partes:

A nivel de prioridad alta pondría:

- Event loop.
- Promises y async/await.
- Sistema de módulos.
- Manejo de errores.
- HTTP y creación de APIs.
- Testing y debugging.

Son cosas que vas a ver en el día a día. Event loop es bueno para entender como funciona node y encontrar errores que, si no sabes esto, no sabrías como resolverlos fácilmente.

Promesas se usan todo el tiempo, en frontend y backend, es algo fundamental y que te abre la cabeza en entender que, hay tareas que necesitan terminar para que empiecen otras. Y hay tareas que se pueden hacer en segundo plano, sin bloquear el event loop.

Por ejemplo:
- Las peticiones a una API siempre se usa con `await` por el hecho de que esperamos algo, para hacer algo con ese resultado.
- Por otra parte, hay casos en los que podemos hacer una petición a una API para enviar reportes de errores, verificar datos en segundo plano, etc: en midu.dev por ejemplo, verificamos en segundo plano si el usuario sigue siendo suscriptor de la plataforma. Lo hacemos en segundo plano sin `await` para que no bloquee la UI.

Hay muchos casos, no todo tiene que ser `async/await`.

Y cada punto tiene lo suyo. Depende mucho del proyecto y que vayas a hacer. Pero esto es un poco la norma general.

---

## A tu segunda pregunta:

- Event loop: 99% de las cosas que haces normalmente.
El resto de cosas, solo cuando no se pueden hacer en el event loop. Por ejemplo: tener en la web un juego de pintura multi-jugador, al haber tantos procesos pesados juntos, se puede trancar la web. En este caso (que lo vas a ver en la práctica, se usan los workers).

---

## A tu tercera pregunta:

Las métricas importantes son:
- Latencia de las peticiones.
- Porcentaje de errores, especialmente respuestas 4xx y 5xx.
- Número de peticiones (muchas veces se hacen peticiones innecesarias).
- Uso de CPU y memoria (para cuando se hacen procesos pesados sobre todo).

Con eso ya tenes unas buenas herramientas para saber si todo está bien o no.

---

Podemos tener otros endpoints para saber detalles de la aplicación, el `health` es uno pero el más básico.

Por ejemplo, normalmente se separan dos conceptos:

- `liveness`: responde a la pregunta "¿el proceso sigue vivo?". Si falla, la plataforma puede reiniciar la aplicación.
- `readiness`: responde a la pregunta "¿la aplicación está preparada para recibir tráfico?". Acá podemos comprobar si la base de datos, Redis u otros servicios importantes están disponibles.

Esto es útil porque una aplicación puede seguir viva, pero no estar lista para atender peticiones.

Pero los endpoints no son suficientes si hablamos de una aplicación grande en producción. En esos casos se mira:

- **Métricas:** números como latencia, cantidad de peticiones, porcentaje de errores, uso de CPU y memoria.
- **Logs:** mensajes que explican qué ocurrió. Lo ideal es que tengan datos como la ruta, el método, el status y un `requestId` para seguir una petición concreta.
- **Trazas:** sirven para seguir una petición cuando pasa por varios servicios y descubrir dónde se está perdiendo el tiempo.

Las plataformas suelen mostrar esto en dashboards. GitHub, por ejemplo, muestra si los tests y los workflows de GitHub Actions pasan o fallan.

Todo esto está muy ligado a las métricas que te comenté al principio de la pregunta.

Cualquier otra duda, nos la puedes dejar.
Excelente trabajo!