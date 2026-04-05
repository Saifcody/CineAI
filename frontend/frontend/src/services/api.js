const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://cineai-backend-08x8.onrender.com";

export async function fetchMovies(query, page = 1) {
  try {
    const res = await fetch(
      `${BASE_URL}/recommend?query=${encodeURIComponent(query)}&page=${page}`
    );

    const text = await res.text();

    if (!res.ok) {
      console.error("Server error:", text);
      throw new Error("Backend error");
    }

    const data = JSON.parse(text);

    return data;
  } catch (err) {
    console.error("Fetch failed:", err);
    throw new Error("Failed to fetch");
  }
}
