import { API } from "./http.js";

const JOBS_ENDPOINT = "/jobs";

export async function fetchJobs(queryParams = "") {
  const endpoint = queryParams ? `${JOBS_ENDPOINT}?${queryParams}` : JOBS_ENDPOINT;
  const response = await API.get(endpoint);
  return response;
}

export async function fetchJob(id) {
  const response = await API.get(`${JOBS_ENDPOINT}/${id}`);
  return response;
}
