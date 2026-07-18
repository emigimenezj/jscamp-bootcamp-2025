const API_URL = "https://jscamp-api.vercel.app/api";

async function get(endpoint) {
  /* Un agregado interesante para este tipo de funciones: */
  /* El endpoint puede ser "/search" o "search", como no sabemos como está diseñada la función, podemos abarcar ambos casos */
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  const response = await fetch(`${API_URL}${normalizedEndpoint}`);

  if (!response.ok) {
    throw new Error("Error al obtener datos de la API");
  }

  return response.json();
}

export const API = {
  get,
};
