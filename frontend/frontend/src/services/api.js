const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8001";

export async function fetchMovies(query, page = 1) {
  const res = await fetch(
    `${BASE_URL}/recommend?query=${encodeURIComponent(query)}&page=${page}`
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Failed to fetch recommendations.");
  }
  return data;
}
