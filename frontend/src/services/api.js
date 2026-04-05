const BASE_URL = "https://cineai-backend-08x8.onrender.com";

export async function fetchMovies(query, page = 1) {
  try {
    const res = await fetch(
      `${BASE_URL}/recommend?query=${encodeURIComponent(query)}&page=${page}`
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch");
    }

    return data;

  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
}
