import { useRouter } from "../hooks/use-router";

/* Hola! Una manera de poder tener un registro global de todas las rutas disponibles en nuestro sitio es englobar el componente Route en un componente que funcione como contexto. */

/* Pero... Contexto es algo que veremos más adelante, sin embargo hay otras maneras, y en una de ellas es en la que me quiero centrar hoy. */

/* La idea es tener un objeto global fuera del componente que vaya almacenando todas las rutas que se mapean en `App.jsx`. El comportamiento funciona así: */

/* Cada vez que se llama a <Route /> en `App.jsx`, lo que hacemos es obtener el valor del atributo `path` y almacenarlo en el objeto global. */

/* Por que lo hacemos fuera del componente `Route`? Porque si lo dejamos dentro, cada vez que se renderice el componente, ese objeto se destruirá y se creará de nuevo. */

/* Entonces, cuando tengamos todos los paths registrados, podremos validar si la ruta actual está registrada o no. Y en caso de que no esté, cargar el componente `NotFoundPage`. */


/* 1. Creamos el objeto fuera del componente, como tenemos una SPA, el objeto se creará una sola vez y no se destruirá aunque naveguemos entre páginas. */
const availablePaths = new Set();


// eslint-disable-next-line
export function Route({ path, component: Component }) {
  const { currentPath } = useRouter();

  /* 2. Cada vez que se llame el componente, lo guardamos en el objeto, solo si no existe */
  if (!availablePaths.has(path)) {
    availablePaths.add(path);
  }

  /* Esto ya no lo necesitamos */
  // const availablePaths = ["/", "/search"];

  /* 3. Si no hay path y la ruta actual no está registrada, cargamos el componente que le pasemos, en este caso el 404 porque se envía sin path */
  if (!path && !availablePaths.has(currentPath)) return <Component />;

  /* 4. Si la ruta actual no coincide con el path, no renderizamos nada */
  if (currentPath !== path) return null;

  return <Component />;
}
