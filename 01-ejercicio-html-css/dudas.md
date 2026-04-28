<!-- Aquí puedes escribir tus dudas sobre el ejercicio o sobre la corrección -->

Buenas, ¿qué tal están? 👋

Estuve pensando y me surgieron algunas dudas. En líneas generales me gustaría conocer una opinión externa sobre las preguntas generales y después una pregunta concreta sobre la industria (selectores de elementos vs. clases). Nada más.

# Preguntas

## Generales
- Me gustaría saber ¿qué errores ven mucho en trainee o juniors (o incluso más seniority 😅) en prácticas de HTML y CSS? Sin ir demasiado lejos, digamos que si en 5 minutos hubiera que mencionar los errores más comunes de HTML y CSS que se te podrían venir a la cabeza ¿cuáles serían?
- ¿Hay algún tema sobre HTML/CSS que esté infravalorado y que se aprenda demasiado tarde?

**Respuesta:**
Bien, esto es muy subjetivo, pero aquí te dejo mi opinión:
En donde siempre veo errores en el uso semántico de las etiquetas. El mal uso de `article`, de `section`, del orden de `h1`, `h2`, etc. Y algunas cosas más en juniors es el mal uso de `button` y de `a` (mezclar conceptos).
En CSS veo errores en cómo acomodar elementos, sobre todo con el uso de `flex` o `grid`. Luego con seniority veo errores más de contexto, por ejemplo no entender porque no funcionan propiedades (algunas dependen de que propiedad tiene el padre, etc) y pensar que todo funciona igual en el mismo contexto.

Por dar un ejemplo más trivial y no tan seniority, un position `absolute` va a depender siempre su posición del elemento padre con position `relative`.

Sobre cosas infravaloradas, creo que algo que es demasiado útil son las animaciones, sobre todo animaciones con el scroll o con el viewport. Dan mucho poder a la UI y no son tan usadas.

Otra cosa son el uso de `clip-path`, y de `mask-image`.

## Restricción del alcance de CSS
- Un problema que siempre tuve es con el nombre de las clases. Es complicado determinar qué tan específico o qué tan general hay que ser para no repetir un nombre de clase accidentalmente, sobre todo si el proyecto ya empieza a ser bastante grande. La solución que siempre pensé que podría ser muy efectiva para este problema es poder aplicar un archivo CSS a un subarbol específico del DOM como para no preocuparse demás en pisar nombres de clases, ¿se puede hacer o simular algo así de alguna manera? Eso sería increíble. En caso de que no ¿qué soluciones existen para este problema de escalabilidad? (siempre manteniéndonos en HTML y CSS nativo, sin frameworks ni demás)

**Respuesta:**
Se puede encapsular clases de CSS en un scope usando CSS si, se hace con la propiedad `@scope`.

```html
<div class="post-container">
  <h3 class="title">Título</h3>
  <p class="subtitle">Subtítulo</p>
</div>

<div class="content-container">
  <p>Utilizando la regla <code class="code">@scope</code> en CSS.</p>
</div>
```

```css
@scope (.post-container) {
  .title { font-size: 3rem; }
  .subtitle { font-size: 1.5rem; }
}
```

De esta manera, las clases `.title` y `.subtitle` solo se aplican dentro del scope `.post-container`, lo que evita conflictos de nombres.

Esto es medio nuevo, pero ya funciona en muchos navegadores así que lo podrias aplicar. Ojo con productos grandes, que hay que tener un poquito de cuidado igual jeje

Otra opción que se usa mucho sin frameworks (con React, Astro, etc. no tenemos problemas con el CSS) es usar metodologías como BEM (Block Element Modifier), pero igual hay que tener cuidado con el nombre de las clases.

## Selectores de elementos vs. Clases (CSS)
- ¿Se usan selectores de elementos (p. ej. `header p`, `section > article`) en la industria o se priorizan casi exclusivamente las clases? ¿Por qué?

**Respuesta:**
Siempre tenemos que evitar usar selectores de elementos cuando sea posible. Es mejor usar clases. Esto es por como funciona CSS. Cuando usamos selectors de elementos, CSS le da mayor especificidad a los estilos, lo que puede causar problemas de herencia y dificultar el mantenimiento del código.

- ¿En qué casos se considerarían aceptable (o recomendable) depender de la estructura de HTML para estilado en CSS? No puedo evitar pensar en que depender que la estructura permanezca igual parece una mala práctica. Habitualmente en programación cuando algo no puede ser modificado sin romper otra cosa, suele ser problemático...

**Respuesta:**
Lo ideal no es depender de la estructura HTML. Lo que se usa es tener un normalizer.css para estandarizar los estilos por defecto de los elementos HTML, y luego estilar por medio de CSS en base a la responsabilidad. Por ejemplo: un `.title` sabemos que es un `title`, no necesitamos saber si es un `h1`, `h2` o `p`. Lo mismo con un `.card`, no necesitamos saber si es un `div` o un `section`.

- Esta decisión en concreto ¿es relevante? Lo pregunto porque también soy consciente de que se pueden usar frameworks de CSS (como utility-first) o CSS-in-JS que de alguna manera camuflan un poco esta decisión de diseño del código.

**Respuesta:**
En este caso, todo esto que hacemos es sabiendo que vamos a migrar el proyecto a React y a utilizar CSS Modules. Por eso no dimos tanto énfasis en la arquitectura CSS.
Fuera de este contexto, sí es relevante, pero creo que hoy en día con tantos frameworks que optimizan el CSS y JS, antes de hacer un proyecto nativo me pensaría usar un framework simple que haga todo esto por mi. La mejor alternativa es Astro, que devuelve 0 JS y un CSS muy optimizado sin tener que hacer nada para lograrlo.

Eso es todo. Gracias por la ayuda y por el feedback.

Saludos,
Emi. 😁

