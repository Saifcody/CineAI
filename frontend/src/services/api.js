const BASE_URL = "https://cineai-backend-08x8.onrender.com";

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
