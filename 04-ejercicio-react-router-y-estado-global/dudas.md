# Aquí puedes dejar tus dudas

## ⚡ Lazy loading / Performance

> Referencias del ejercicio: [carga diferida de las páginas](./src/App.jsx) y [`Suspense` con su estado de carga](./src/components/MainLayout.jsx).

- En una app grande, ¿cómo suelen determinar qué rutas deberían cargarse con lazy loading? ¿Tiene sentido aplicarlo a todas las rutas? ¿En qué casos no lo aplicarían?
  Y si la respuesta fuera “sí, conviene aplicarlo casi siempre”, entonces me surge otra duda: ¿por qué no todas las aplicaciones lo usan por defecto todo el tiempo?

- Supongamos una app muy grande, con páginas que a su vez tienen muchos componentes internos. ¿También tendría sentido hacer lazy loading de esos componentes internos para mejorar la performance, o ahí ya estaríamos pasándonos de rosca?
  Imagino que hacer lazy loading de un componente tipo `Button` no tendría mucho sentido, pero me interesa entender cuál sería el criterio práctico para decidir el límite de cuándo sí y cuando no.

- En un momento de la clase, `Midu` menciona que se puede usar dynamic import para hacer lazy loading, pero que los componentes necesitan tener `export default`. También comenta que hay una forma de manejarlo para poder seguir usando exportaciones nombradas, pero después el video avanza y no se llega a explicar.
  ¿Cómo se puede hacer lazy loading con componentes que usan named exports?

## 🔗 URL

> Referencia del ejercicio: [sincronización de los filtros, la paginación y la URL](./src/pages/Search.jsx).

- ¿Es coherente usar la URL como fuente de verdad para los filtros/búsquedas en una aplicación productiva con usuarios reales?
  ¿O en productos más grandes normalmente se maneja de otra manera, por ejemplo con `Zustand`, `localStorage`, persistencia del lado del cliente, backend, etc.? Me interesa entender el criterio para decidir cuándo la URL debería mandar y cuándo no.

## 🗃️ Zustand

> Referencias del ejercicio: [store de autenticación](./src/store/authStore.js), [store de favoritos](./src/store/favoritesStore.js) y [consumo del store de favoritos](./src/components/JobCard.jsx).

- En algún momento escuché a Midu mencionar que tener varios stores en `Zustand` podía considerarse una mala práctica, incluso que el propio creador de Zustand no lo recomendaba demasiado. También tenía entendido algo parecido sobre los slices: que surgieron como una solución rápida a una necesidad de la comunidad, pero que después no terminaron convenciendo tanto.
  ¿Estoy entendiendo bien esto, o tanto múltiples stores como slices se pueden usar normalmente en contextos productivos sin problema?
  Me interesa especialmente saber qué approach recomiendan en una app real cuando el estado global es relativamente complejo y grande (sin llegar a Redux).

---

PD: Gracias de antemano por las respuestas 🙏
