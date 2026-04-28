/* Aquí va la lógica para mostrar los resultados de búsqueda */

const DEFAULT_PAGE_SIZE = 20;

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

fetch("./data.json")
  .then((response) => response.json())
  .then((response) => {
    console.log(response);

    const container = document.querySelector(".jobs-listings");

    /* 
    Lo que hiciste está excelente! Agregamos un pequeño extra llamado `DocumentFragment` que es una forma de mejorar el rendimiento de la aplicación. Lo hace así:

    1. Cuando nosotros pintamos el DOM iterativamente, por medio de un `forEach`, el navegador tiene que hacer un renderizado del DOM para mostrar ese nuevo elemento. Si el array de datos es grande, el navegador tiene que hacer muchos renderizados, lo que puede ser costoso en términos de rendimiento.
    2. Para evitar esto existe `DocumentFragment`. Es un objeto que nos permite crear un nuevo elemento en memoria ("como si fuese una `div` fuera del DOM"), y en lugar de insertar cada elemento en el HTML y pintar, lo que hacemos es guardar todos esos elementos del bucle dentro de nuestro objeto virtual.
    3. Una vez que el forEach termina, tenemos un objeto virtual lleno de todos los elementos que queremos mostrar en el DOM. Y lo que hacemos en la linea 61 es insertar todos esos elementos en el DOM por medio de un `appendChild`.

    CONCLUSIÓN: De esta manera, en vez de pintar el DOM en cada iteración, lo hacemos una sola vez al final, cuando ya tenemos el objeto virtual lleno de todos los elementos que queremos mostrar.
    */
    const documentFragment = document.createDocumentFragment();

    response.slice(0, DEFAULT_PAGE_SIZE).forEach((element) => {
      const { titulo, empresa, ubicacion, descripcion, data } = element;
      const { technology, location, modalidad, nivel } = data;

      const li = document.createElement("li");
      li.innerHTML = `
        <article
          class="job-listing-card"
          data-company="${empresa}"
          data-location="${location}"
          data-modalidad="${modalidad}"
          data-level="${nivel}"
          data-technology="${technology.join(",")}"
        >
          <div>
            <h3>${titulo}</h3>
            <small>${empresa} | ${ubicacion} | ${capitalize(modalidad)} | ${capitalize(nivel)} | ${technology.map(capitalize).join(", ")}</small>
            <p>${descripcion}</p>
          </div>
          <button class="button-apply-job">Aplicar</button>
        </article>
      `;
      documentFragment.appendChild(li);
    });

    const { length } = response;

    const pagination = document.querySelector(".pagination");
    const totalPages = Math.ceil(length / DEFAULT_PAGE_SIZE);

    for (let i = 1; i <= totalPages; i++) {
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = i;
      if (i === 1) a.classList.add("is-active");
      pagination.insertBefore(a, pagination.querySelector("#next-page"));
    }

    container.appendChild(documentFragment);
  })
  .catch(() => console.error("Error fetching data"));
