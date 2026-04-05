// 🔥 DIRECT BACKEND URL (NO ENV CONFUSION)
const BASE_URL = "https://cineai-backend-08x8.onrender.com";

// 🎬 Fetch movies
export async function fetchMovies(query, page = 1) {
  try {
    console.log("Calling API:", BASE_URL);

    const response = await fetch(
      `${BASE_URL}/recommend?query=${encodeURIComponent(query)}&page=${page}`
    );

    // Debug status
    console.log("Response status:", response.status);

    // Convert response
    const data = await response.json();

    // Handle backend error
    if (!response.ok) {
      console.error("Backend error:", data);
      throw new Error(data.error || "Failed to fetch movies");
    }

    return data;

  } catch (error) {
    console.error("Fetch failed:", error);
    throw new Error("Failed to fetch");
  }
}
