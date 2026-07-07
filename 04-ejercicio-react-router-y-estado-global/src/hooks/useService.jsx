import { useCallback, useEffect, useState } from "react";

/* Excelente! Esto con TypeScript sería poderoso */
export function useService(service) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await service();
      setData(response);

      return response;
    } catch (error) {
      console.error("Error executing service:", error);
      setError(error);
      setData(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}
