import { useEffect, useState } from "react";

import { Header } from "../components/header";
import { SearchFormSection } from "../components/search-form-section";
import { PageSizeSelector } from "../components/page-size-selector";
import { Pagination } from "../components/pagination";
import { Footer } from "../components/footer";
import { JobListings } from "../components/job-listings";
import { useRouter } from "../hooks/use-router";

const initialPaginationModel = {
  currentPage: 1,
  resultsPerPage: 2,
};

const initialFilterModel = {
  search: "",
  technology: "",
  location: "",
  experienceLevel: "",
};

/* Ojo con este nombre, puede parecer que extrae cualquier valor de la URL, pero el fallback es un número. Podemos cambiar la lógica o el nombre para que sea más claro. Lo que te propongo (no es la única manera si? Solo es una opción) es crear una función que extraiga todos los parámetros de la URL y los devuelva con su nombre */
const getIntParams = () => {
  const params = new URLSearchParams(window.location.search)

  const pageNum = Number(params.get('page'))
  const pageSizeNum = Number(params.get('pageSize'))

  return {
    page: Number.isNaN(pageNum) || pageNum < 1 ? 1 : pageNum,
    pageSize: Number.isNaN(pageSizeNum) || pageSizeNum < 1 ? 2 : pageSizeNum,
    search: params.get("search") ?? initialFilterModel.search,
    technology: params.get("technology") ?? initialFilterModel.technology,
    location: params.get("location") ?? initialFilterModel.location,
    experienceLevel: params.get("experienceLevel") ?? initialFilterModel.experienceLevel,
  }
}

/* Todas las funciones de utilidad las estoy sacando fuera del componente para que se pueda leer mejor el mismo. */
const low = (str) => str.toLowerCase().trim();
const compare = (s1, s2) => low(s1) === low(s2);
const incl = (s1, s2) => low(s1).includes(low(s2));

/* const extractIntFromURL = (key, fallback) => {
  const params = new URLSearchParams(window.location.search);
  const value = parseInt(params.get(key), 10);
  return isNaN(value) || value < 1 ? fallback : value;
}; */

const useFilters = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentPath } = useRouter()

  /* Extraemos los parámetros de la URL */
  const {page, pageSize, ...filterParams} = getIntParams()

  const [currentPage, setCurrentPage] = useState(() => page);
  const [resultsPerPage, setResultsPerPage] = useState(() => pageSize);
  const [filterModel, setFilterModel] = useState(() => ({...filterParams}));

  /* Use effect por convención va después de la declaración de estados */
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const response = await fetch("https://jscamp-api.vercel.app/api/jobs");
        const json = await response.json();
        setJobs(json.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  /* Muy bien pensado para simplificar, cambie el nombre para que quedase mas claro lo que hace sin tener que ver la función */
  const changeStateAndResetPage = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = changeStateAndResetPage(setResultsPerPage);
  const handleFiltersChange = changeStateAndResetPage(setFilterModel);

  const byUserCriteria = (job) => {
    const hasActiveFilters = Object.values(filterModel).some(Boolean);
    if (!hasActiveFilters) return true;

    let filter = true;

    const hasSearchFilter = Boolean(filterModel.search);
    const isFilteredBySearch = incl(job.titulo, filterModel.search);
    if (hasSearchFilter && !isFilteredBySearch) filter = false;

    const hasTechnologyFilter = Boolean(filterModel.technology);
    const isFilteredByTechnology = job.data.technology
      .map(low)
      .includes(low(filterModel.technology));
    if (hasTechnologyFilter && !isFilteredByTechnology) filter = false;

    const hasLocationFilter = Boolean(filterModel.location);
    const isFilteredByLocation = compare(
      job.data.modalidad,
      filterModel.location,
    );
    if (hasLocationFilter && !isFilteredByLocation) filter = false;

    const hasExperienceLevelFilter = Boolean(filterModel.experienceLevel);
    const isFilteredByExperienceLevel = compare(
      job.data.nivel,
      filterModel.experienceLevel,
    );
    if (hasExperienceLevelFilter && !isFilteredByExperienceLevel)
      filter = false;

    return filter;
  };

  useEffect(() => {
    const params = new URLSearchParams();

    const setValueInParamsIfExist = (key, value) => {
      if (value) params.set(key, value.trim().toLowerCase());
    };

    /* Podemos hacer esta función para simplificar la lectura del código */
    setValueInParamsIfExist("search", filterModel.search);
    setValueInParamsIfExist("technology", filterModel.technology);
    setValueInParamsIfExist("location", filterModel.location);
    setValueInParamsIfExist("experienceLevel", filterModel.experienceLevel);

    
    if (currentPage !== initialPaginationModel.currentPage)
      params.set("page", currentPage);
    if (resultsPerPage !== initialPaginationModel.resultsPerPage)
      params.set("pageSize", resultsPerPage);

    const queryString = params.toString() ?? '';
    const newURL = currentPath + queryString;
    window.history.pushState({}, "", newURL);
     
  }, [currentPage, resultsPerPage, filterModel, currentPath]);

  const firstPageJobIDX = (currentPage - 1) * resultsPerPage;
  const lastPageJobIDX = currentPage * resultsPerPage;

  /* Genial! Recuerda que la API también tiene la posibilidad de pasarle los filtros por query params. De esta manera no tenes que hacerlo tú */
  const filteredJobs = jobs.filter(byUserCriteria);
  const currentPageJobs = filteredJobs.slice(firstPageJobIDX, lastPageJobIDX);

  const totalPages = Math.ceil(filteredJobs.length / resultsPerPage);

  return {
    jobs: {
      current: currentPageJobs, // incluye filtro + paginación
      filtered: filteredJobs, // incluye filtro, sin paginación
      all: jobs,
    },
    page: {
      current: currentPage,
      size: resultsPerPage,
      total: totalPages,
      init: initialPaginationModel,
    },
    filter: {
      current: filterModel,
      init: initialFilterModel,
    },
    handle: {
      change: {
        filters: handleFiltersChange,
        page: setCurrentPage,
        pageSize: handlePageSizeChange,
      },
    },
    async: {
      loading,
    },
  };
};

export function SearchPage() {
  const { jobs, page, filter, handle, async } = useFilters();

  const title = async.loading
    ? "Cargando... — DevJobs"
    : `Resultados: ${jobs.filtered.length} | Página ${page.current} de ${page.total} — DevJobs`;

  return (
    <main>
      <title>{title}</title>
      <SearchFormSection
        filterModel={filter.current}
        initialFilterModel={filter.init}
        onFilterModelChange={handle.change.filters}
      />
      <section className="search-results-section">
        <h2 style={{ textAlign: "center" }}>Resultados de búsqueda</h2>
        {async.loading ? (
          <p style={{ textAlign: "center", marginBlock: "8rem" }}>
            Cargando trabajos...
          </p>
        ) : jobs.filtered.length === 0 ? (
          <p style={{ textAlign: "center", marginBlock: "8rem" }}>
            No se encontraron trabajos.
          </p>
        ) : (
          <>
            <JobListings jobs={jobs.current} />
            <PageSizeSelector
              pageSize={page.size}
              onPageSizeChange={handle.change.pageSize}
            />
            <Pagination
              currentPage={page.current}
              totalPages={page.total}
              onPageChange={handle.change.page}
            />
          </>
        )}
      </section>
    </main>
  );
}
