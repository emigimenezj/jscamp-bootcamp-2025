import { useCallback, useEffect, useMemo, useState } from "react";

import { Pagination } from "../components/Pagination.jsx";
import { SearchFormSection } from "../components/SearchFormSection.jsx";
import { JobListings } from "../components/JobListings.jsx";
import { useRouter } from "../hooks/useRouter.jsx";
import { useService } from "../hooks/useService.jsx";
import { fetchJobs } from "../service/jobs.js";

const RESULTS_PER_PAGE = 4;

const useFilters = () => {
  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      technology: params.get("technology") || "",
      location: params.get("type") || "",
      experienceLevel: params.get("level") || "",
    };
  });
  const [textToFilter, setTextToFilter] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("text") || "";
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const page = Number(params.get("page"));
    return Number.isNaN(page) ? page : 1;
  });

  const { navigateTo } = useRouter();

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (textToFilter) params.append("text", textToFilter);
    if (filters.technology) params.append("technology", filters.technology);
    if (filters.location) params.append("type", filters.location);
    if (filters.experienceLevel) params.append("level", filters.experienceLevel);

    const offset = (currentPage - 1) * RESULTS_PER_PAGE;
    params.append("limit", RESULTS_PER_PAGE);
    params.append("offset", offset);

    return params.toString();
  }, [filters, currentPage, textToFilter]);

  const loadJobs = useCallback(() => fetchJobs(queryParams), [queryParams]);

  const { data, loading, error } = useService(loadJobs);

  const jobs = data?.data ?? [];
  const total = data?.total ?? 0;

  useEffect(() => {
    const params = new URLSearchParams();

    if (textToFilter) params.append("text", textToFilter);
    if (filters.technology) params.append("technology", filters.technology);
    if (filters.location) params.append("type", filters.location);
    if (filters.experienceLevel)
      params.append("level", filters.experienceLevel);

    if (currentPage > 1) params.append("page", currentPage);

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    navigateTo(newUrl);
  }, [filters, currentPage, textToFilter, navigateTo]);

  const totalPages = Math.ceil(total / RESULTS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (filters) => {
    setFilters(filters);
    setCurrentPage(1);
  };

  const handleTextFilter = (newTextToFilter) => {
    setTextToFilter(newTextToFilter);
    setCurrentPage(1);
  };

  return {
    loading,
    error,
    jobs,
    total,
    totalPages,
    currentPage,
    textToFilter,
    handlePageChange,
    handleSearch,
    handleTextFilter,
  };
};

export function SearchPage() {
  const {
    jobs,
    total,
    loading,
    error,
    totalPages,
    currentPage,
    textToFilter,
    handlePageChange,
    handleSearch,
    handleTextFilter,
  } = useFilters();

  const title = loading
    ? `Cargando... - DevJobs`
    : `Resultados: ${total}, Página ${currentPage} - DevJobs`;

  return (
    <>
      <title>{title}</title>
      <meta
        name="description"
        content="Explora miles de oportunidades laborales en el sector tecnológico. Encuentra tu próximo empleo en DevJobs."
      />

      <SearchFormSection
        initialText={textToFilter}
        onSearch={handleSearch}
        onTextFilter={handleTextFilter}
      />

      <section className="search-results">
        <h2>Resultados de búsqueda</h2>

        {error ? (
          <p>No se pudieron cargar los empleos.</p>
        ) : loading ? (
          <p>Cargando empleos...</p>
        ) : (
          <JobListings jobs={jobs} />
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>
    </>
  );
}
