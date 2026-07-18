# Aquí puedes dejar tus dudas

## ⚡ Lazy loading / Performance

> Referencias del ejercicio: [carga diferida de las páginas](./src/App.jsx) y [`Suspense` con su estado de carga](./src/components/MainLayout.jsx).

- En una app grande, ¿cómo suelen determinar qué rutas deberían cargarse con lazy loading? ¿Tiene sentido aplicarlo a todas las rutas? ¿En qué casos no lo aplicarían?
  Y si la respuesta fuera “sí, conviene aplicarlo casi siempre”, entonces me surge otra duda: ¿por qué no todas las aplicaciones lo usan por defecto todo el tiempo?

**Respuesta:**

Hola! Si tenemos una aplicación grande, con más razón es necesario cargar las páginas con lazy loading. Es hasta casi obligatorio te diré.

Ahora, sobre tu pregunta de porque no todas las aplicaciones lo usan por defecto, la razón es que genera complejidad añadida: necesitas manejar estados de carga, errores, y si la app es pequeña (pocas páginas, poco código), la mejora es mínima. 

Un poco para resumirte: si la ruta no es la landing page, casi siempre vale la pena.

Luego vas a ver frameworks de React (como Next.js) que ya lo hacen internamente de otra manera y no tenes de que preocuparte.

- Supongamos una app muy grande, con páginas que a su vez tienen muchos componentes internos. ¿También tendría sentido hacer lazy loading de esos componentes internos para mejorar la performance, o ahí ya estaríamos pasándonos de rosca?
  Imagino que hacer lazy loading de un componente tipo `Button` no tendría mucho sentido, pero me interesa entender cuál sería el criterio práctico para decidir el límite de cuándo sí y cuando no.

**Respuesta:**

Te voy a dar un ejemplo muy concreto: si en la landing page tenemos en la 4ta sección (muy debajo) un componente de mapa, o una visualización 3D de un render, ahí tiene todo el sentido del mundo usar lazy loading, porque esos componentes suelen ser pesados + el usuario solo los va a ver haciendo scroll.

Lo importante es que la página cargue y muestre información lo más rápido posible, normalmente no hace falta poner lazy loading a los componentes, pero en esos ejemplos que te di sí.

Aunque el render 3D esté en el hero (el usuario lo ve al entrar al sitio), lo mejor es meterlo en un lazy loading porque al no hacerlo, el usuario no vería nada por unos segundos hasta que cargue todo. En su lugar, podemos mostrar el texto, header y assets mientras el render se carga.

- En un momento de la clase, `Midu` menciona que se puede usar dynamic import para hacer lazy loading, pero que los componentes necesitan tener `export default`. También comenta que hay una forma de manejarlo para poder seguir usando exportaciones nombradas, pero después el video avanza y no se llega a explicar.
  ¿Cómo se puede hacer lazy loading con componentes que usan named exports?

**Respuesta:**

Buena pregunta! Lo podemos hacer de esta manera:

```js
// En nuestro componente de Home.jsx
export function HomePage() {
  // ...
}
```

```js
// En nuestro App.js
const HomePage = lazy(() =>
  import("./pages/Home.jsx").then(mod => ({ default: mod.HomePage })) // <- Usamos .then() para obtener el módulo concreto que se exporta en `Home.jsx`
);
```

## 🔗 URL

> Referencia del ejercicio: [sincronización de los filtros, la paginación y la URL](./src/pages/Search.jsx).

- ¿Es coherente usar la URL como fuente de verdad para los filtros/búsquedas en una aplicación productiva con usuarios reales?
  ¿O en productos más grandes normalmente se maneja de otra manera, por ejemplo con `Zustand`, `localStorage`, persistencia del lado del cliente, backend, etc.? Me interesa entender el criterio para decidir cuándo la URL debería mandar y cuándo no.

**Respuesta:**

La URL es ideal cuando queremos compartir los resultados con otros usuarios.
Por ejemplo: búsquedas, paginación, ordenamiento... Si otro usuario recibe este link, va a ver lo mismo, y es exactamente lo que queremos hacer con los empleos.
Esto pasa igual en una ecommerce, quiero compartir una página concreta de una categoría concreta, y esto lo hacemos con la URL.

Si lo que vemos/cambiamos es de una preferencia individual, por ejemplo `dark mode`, `idioma`, `tamaño de fuente` (decisiones que son para el usuario individual), entonces lo podemos hacer por medio de localStorage.

## 🗃️ Zustand

> Referencias del ejercicio: [store de autenticación](./src/store/authStore.js), [store de favoritos](./src/store/favoritesStore.js) y [consumo del store de favoritos](./src/components/JobCard.jsx).

- En algún momento escuché a Midu mencionar que tener varios stores en `Zustand` podía considerarse una mala práctica, incluso que el propio creador de Zustand no lo recomendaba demasiado. También tenía entendido algo parecido sobre los slices: que surgieron como una solución rápida a una necesidad de la comunidad, pero que después no terminaron convenciendo tanto.
  ¿Estoy entendiendo bien esto, o tanto múltiples stores como slices se pueden usar normalmente en contextos productivos sin problema?
  Me interesa especialmente saber qué approach recomiendan en una app real cuando el estado global es relativamente complejo y grande (sin llegar a Redux).

**Respuesta:**

En apps reales con responsabilidades claramente separados (auth, favoritos, carrito, etc), tener múltiples stores está perfecto y es lo recomendado (concepto de "divide y vencerás").

Lo bueno que tiene Zustand es que si actualizas una Store, no se va a re-renderizar las demás Store, entonces separarlas no tiene ningún problema.
Los Slices lo malo que tiene es que añaden boilerplate. Si es para separar una Store muy grande en porciones chicas, es una herramienta y se puede usar, pero lo mejor es que no.

En resumen, podes usar varias Stores y Slices si es necesario. Siempre va a depender de la aplicación, lo importante es no abusar de las herramientas y aplicarlas solo cuando es necesario. En la mayoría de los casos con las Stores es suficiente.

---

PD: Gracias de antemano por las respuestas 🙏

Gracias a ti por las preguntas! :)