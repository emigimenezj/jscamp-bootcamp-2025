const API_URL = "https://jscamp-api.vercel.app/api";

async function get(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error("Error al obtener datos de la API");
  }

  return response.json();
}

export const API = {
  get,
};
