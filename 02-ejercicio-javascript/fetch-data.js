/* Aquí va la lógica para mostrar los resultados de búsqueda */

const DEFAULT_PAGE_SIZE = 20;

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

fetch("./data.json")
  .then((response) => response.json())
  .then((response) => {
    console.log(response);

    const container = document.querySelector(".jobs-listings");

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
      container.appendChild(li);
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
  })
  .catch(() => console.error("Error fetching data"));
