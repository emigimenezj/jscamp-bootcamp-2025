/* Aquí va la lógica para filtrar los resultados de búsqueda */

const FILTER_TO_DATASET = {
  technology: "technology",
  location: "location",
  modalidad: "modalidad",
  level: "level",
};

const MULTI_VALUE_FILTERS = new Set([FILTER_TO_DATASET.technology]);

let activeSelectFilter = { name: null, value: "" };
let activeSearchTerm = "";

function cardMatchesSelect(card) {
  const { name, value: filterValue } = activeSelectFilter;
  if (!name || filterValue === "") return true;

  const datasetKey = FILTER_TO_DATASET[name];
  const cardValue = card.dataset[datasetKey];

  if (MULTI_VALUE_FILTERS.has(name)) {
    return cardValue.split(" ").includes(filterValue);
  }

  return cardValue === filterValue;
}

function cardMatchesSearch(card) {
  if (activeSearchTerm === "") return true;
  const title = card.querySelector("h3").textContent.toLowerCase();
  return title.includes(activeSearchTerm);
}

function applyFilters() {
  document.querySelectorAll(".job-listing-card").forEach((card) => {
    const isMatch = cardMatchesSelect(card) && cardMatchesSearch(card);
    card.classList.toggle("is-hidden", !isMatch);
  });
}

// [SELECT FILTERS]: Lógica para los filtros de selección (tecnología, ubicación, modalidad y nivel de experiencia)

const searchFilters = document.querySelector(".search-filters");

searchFilters.addEventListener("change", (event) => {
  const { name, value: filterValue } = event.target;

  if (!FILTER_TO_DATASET[name]) return;

  activeSelectFilter = { name, value: filterValue };

  // Reseteamos el resto de selects y actualizamos su estado visual
  searchFilters.querySelectorAll("select").forEach((select) => {
    if (select.name !== name) select.value = "";
    select.classList.toggle(
      "is-active",
      select.name === name && filterValue !== "",
    );
  });

  applyFilters();
});

// [SEARCH FILTER]: Lógica para el filtro de búsqueda por título
const searchInput = document.querySelector("#empleos-search-input");
searchInput.addEventListener("input", (event) => {
  activeSearchTerm = event.target.value.toLowerCase();
  applyFilters();
});
