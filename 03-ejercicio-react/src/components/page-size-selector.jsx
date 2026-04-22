export function PageSizeSelector({ pageSize, onPageSizeChange }) {
  return (
    <label htmlFor="resultsPerPage" className="results-per-page">
      Resultados por página
      <select
        id="resultsPerPage"
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
      >
        <option value={2}>2</option>
        <option value={5}>5</option>
        <option value={10}>10</option>
      </select>
    </label>
  );
}
