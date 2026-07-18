# Aquí puedes dejar tus dudas

## Séptima parte

- Algo que dejé de lado fue el tema del fallback a la página `not found 404`. El problema que tuve fue que las diferentes instancias del componente `Route` no estaban comunicadas entre sí, por lo que no podía saber desde el route de `404` si ya había un match previo en otra ruta o no. La manera fácil que se me ocurrió de solucionarlo fue hardcodeando `availablePaths` en `route.jsx`, como solo son 2 rutas, entonces es simple. Sin embargo, me quedé con la duda ¿cómo se podría hacer una solución más escalable? ¿Con un contexto que englobe todos los componentes `<Route`? 🤔

**Respuesta:**
Excelente pregunta! Con contexto se podría hacer, pero te dejé una opción sin necesidad de eso en `route.jsx`. Cualquier cosa si hay algo que no quedó claro me puedes escribir por aquí o por Discord si? Espero que haya quedado claro :)

## Preguntas generales

- ¿Qué partes de este ejercicio podrían estar en producción y cuáles quedan en el contexto educativo del curso? Supongo que hacer un `Route` propio no es muy buena idea generalmente hablando de cara a usuarios reales.
- ¿Hubiese sido buena idea crear un contexto que conecte los filtros con los resultados de la tabla? Porque estuve muy tentado a hacerlo pero como en esta parte del curso no se ven contexto lo dejé implementado como custom hook.

**Respuesta:**
- Todo menos lo del `Route`. El resto de cosas lo verás en miles de aplicaciones de React en producción.
- Contexto se utiliza únicamente cuando queres compartir un estado entre componentes que no tienen una relación de padre-hijo directa o semi directa. En este caso, los filtros y la tabla sí tienen una relación de padre-hijo directa, por lo que no sería necesario usar contexto.

## Comentarios adicionales

Estaba revisando uno de mis ejerciciso anteriores, el primero de HTML + CSS particularmente, y me habían comentado que podía dejar dudas en `dudas.md`. En su momento cuando mandé a corregir el primer ejercicio no sabía que existía esta dinámica así que lo dejé vacío, cuando lo entendí lo modifiqué para dejar las preguntas que tenía. Si las pueden revisar sería genial. 😁

**Respuesta:**
Lo veré! Gracias por avisar jeje ya lo hago así tenes todo corregido :)