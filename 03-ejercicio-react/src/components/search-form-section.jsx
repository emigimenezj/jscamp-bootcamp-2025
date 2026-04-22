import { useEffect, useId, useRef, useState } from "react";

export function SearchFormSection(props) {
  const { filterModel, initialFilterModel, onFilterModelChange } = props;

  const searchInputName = useId();
  const technologySelectorName = useId();
  const locationSelectorName = useId();
  const experienceLevelSelectorName = useId();
  const formRef = useRef(null);

  const [searchDraft, setSearchDraft] = useState(filterModel.search ?? "");
  const timeoutID = useRef(null);

  useEffect(() => {
    setSearchDraft(filterModel.search ?? "");
  }, [filterModel.search]);

  useEffect(() => {
    return () => timeoutID.current && clearTimeout(timeoutID.current);
  }, []);

  const extractFormValues = () => {
    const formData = new FormData(formRef.current);

    return {
      search: formData.get(searchInputName),
      technology: formData.get(technologySelectorName),
      location: formData.get(locationSelectorName),
      experienceLevel: formData.get(experienceLevelSelectorName),
    };
  };

  const handleSearchChange = (event) => {
    setSearchDraft(event.target.value);

    if (timeoutID.current) clearTimeout(timeoutID.current);
    timeoutID.current = setTimeout(() => {
      if (!formRef.current) return;
      onFilterModelChange(extractFormValues());
    }, 500);
  };

  const handleSelectorChange = () => {
    if (timeoutID.current) {
      clearTimeout(timeoutID.current);
      timeoutID.current = null;
    }

    onFilterModelChange(extractFormValues());
  };

  const clearFilters = () => {
    if (timeoutID.current) {
      clearTimeout(timeoutID.current);
      timeoutID.current = null;
    }

    setSearchDraft(initialFilterModel.search);
    onFilterModelChange(initialFilterModel);
  };

  const hasActiveFilters =
    Boolean(searchDraft?.trim()) ||
    Boolean(filterModel.technology) ||
    Boolean(filterModel.location) ||
    Boolean(filterModel.experienceLevel);

  return (
    <section className="jobs-search">
      <h1>Encuentra tu próximo trabajo</h1>
      <p>Explora miles de oportunidades en el sector tecnológico.</p>

      <form ref={formRef} id="empleos-search-form" role="search">
        <div className="search-bar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>

          <input
            id="empleos-search-input"
            type="text"
            name={searchInputName}
            value={searchDraft}
            onChange={handleSearchChange}
            placeholder="Buscar trabajos, empresas o habilidades"
          />
        </div>

        <div className="search-filters">
          <select
            id="filter-technology"
            name={technologySelectorName}
            value={filterModel.technology}
            onChange={handleSelectorChange}
          >
            <option value="">Tecnología</option>
            <optgroup label="Tecnologías populares">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="react">React</option>
              <option value="node">Node.js</option>
            </optgroup>
            <option value="java">Java</option>
            <hr />
            <option value="csharp">C#</option>
            <option value="c">C</option>
            <option value="c++">C++</option>
            <hr />
            <option value="ruby">Ruby</option>
            <option value="php">PHP</option>
          </select>

          <select
            id="filter-location"
            name={locationSelectorName}
            value={filterModel.location}
            onChange={handleSelectorChange}
          >
            <option value="">Ubicación</option>
            <option value="remoto">Remoto</option>
            <option value="cdmx">Ciudad de México</option>
            <option value="guadalajara">Guadalajara</option>
            <option value="monterrey">Monterrey</option>
            <option value="barcelona">Barcelona</option>
          </select>

          <select
            id="filter-experience-level"
            name={experienceLevelSelectorName}
            value={filterModel.experienceLevel}
            onChange={handleSelectorChange}
          >
            <option value="">Nivel de experiencia</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
          {hasActiveFilters ? (
            <button
              type="button"
              className="clear-filters"
              style={{ marginLeft: "auto" }}
              onClick={clearFilters}
            >
              🗑️ Limpiar
            </button>
          ) : null}
        </div>
      </form>

      <span id="filter-selected-value"></span>
    </section>
  );
}
