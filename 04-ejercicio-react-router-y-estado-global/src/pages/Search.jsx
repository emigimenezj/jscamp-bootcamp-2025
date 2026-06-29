import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { Pagination } from "../components/Pagination.jsx";
import { SearchFormSection } from "../components/SearchFormSection.jsx";
import { JobListings } from "../components/JobListings.jsx";
import { useService } from "../hooks/useService.jsx";
import { fetchJobs } from "../service/jobs.js";

const RESULTS_PER_PAGE = 4;

const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState(() => {
    return {
      technology: searchParams.get("technology") ?? "",
      location: searchParams.get("type") ?? "",
      experienceLevel: searchParams.get("level") ?? "",
    };
  });
  const [textToFilter, setTextToFilter] = useState(
    () => searchParams.get("text") ?? "",
  );
  const [currentPage, setCurrentPage] = useState(() => {
    const page = Number(searchParams.get("page"));
    return Number.isInteger(page) && page > 0 ? page : 1;
  });

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (textToFilter) params.append("text", textToFilter);
    if (filters.technology) params.append("technology", filters.technology);
    if (filters.location) params.append("type", filters.location);
    if (filters.experienceLevel)
      params.append("level", filters.experienceLevel);

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
    setSearchParams((params) => {
      const setOrDelete = (key, value) =>
        value ? params.set(key, value) : params.delete(key);

      setOrDelete("text", textToFilter);
      setOrDelete("technology", filters.technology);
      setOrDelete("type", filters.location);
      setOrDelete("level", filters.experienceLevel);
      setOrDelete("page", currentPage > 1 ? currentPage : "");

      return params;
    });
  }, [filters, currentPage, textToFilter, setSearchParams]);

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
