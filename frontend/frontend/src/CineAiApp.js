import { useEffect, useState } from "react";

const categories = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Fantasy",
  "Mystery",
  "Crime",
  "Animation",
  "Documentary",
  "Family",
  "War",
  "Western",
  "Cyberpunk",
  "Psychological",
  "Supernatural",
  "Time Travel",
  "Sports",
  "Musical",
];

export default function CineAiApp() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastSearch, setLastSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedMovie(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchMovies = async (searchQuery, page = 1) => {
    setError("");
    setSelectedMovie(null);
    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/recommend?query=${encodeURIComponent(searchQuery)}&page=${page}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Unable to fetch recommendations.");
      }

      setMovies(Array.isArray(data.results) ? data.results : []);
      setCurrentPage(data.page || page);
      setTotalPages(data.total_pages || 1);
      setLastSearch(searchQuery);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setMovies([]);
      setCurrentPage(1);
      setTotalPages(1);
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const search = async () => {
    setActiveCategory("");
    await fetchMovies(query, 1);
  };

  const selectCategory = async (category) => {
    setQuery(category);
    setActiveCategory(category);
    await fetchMovies(category, 1);
  };

  const goToPreviousPage = async () => {
    if (loading || currentPage <= 1) {
      return;
    }

    await fetchMovies(lastSearch || query, currentPage - 1);
  };

  const goToNextPage = async () => {
    if (loading || currentPage >= totalPages) {
      return;
    }

    await fetchMovies(lastSearch || query, currentPage + 1);
  };

  const formatRating = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "N/A";
    }

    return Number(value).toFixed(1);
  };

  return (
    <>
      <div className={`cineai-shell ${selectedMovie ? "is-blurred" : ""}`}>
        <div className="cineai-page">
          <h1 className="cineai-title">CineAI</h1>

          <div className="cineai-searchRow">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to watch?"
              className="cineai-searchInput"
            />

            <button onClick={search} className="cineai-searchButton" disabled={loading}>
              {loading ? "Loading..." : "Search"}
            </button>
          </div>

          <section className="cineai-genreSection">
            <h2 className="cineai-sectionTitle">Explore by Genre</h2>
            <div className="cineai-chipGrid">
              {categories.map((category) => {
                const isActive = activeCategory === category;

                return (
                  <button
                    key={category}
                    onClick={() => selectCategory(category)}
                    className={`cineai-chip ${isActive ? "is-active" : ""}`}
                    disabled={loading}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </section>

          {error ? <p className="cineai-error">{error}</p> : null}

          {loading ? <p className="cineai-status">Loading movies...</p> : null}

          <div className="cineai-movieGrid">
            {movies.map((movie, index) => (
              <button
                key={`${movie.title}-${index}`}
                type="button"
                className="cineai-movieCard"
                onClick={() => setSelectedMovie(movie)}
              >
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title || "Movie poster"}
                    className="cineai-moviePoster"
                  />
                ) : (
                  <div className="cineai-moviePoster cineai-moviePosterFallback">
                    No poster
                  </div>
                )}
                <div className="cineai-movieMeta">
                  <h3>{movie.title}</h3>
                  <p>Rating: {formatRating(movie.vote_average ?? movie.rating)}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="cineai-pagination">
            <button
              type="button"
              className="cineai-paginationButton"
              onClick={goToPreviousPage}
              disabled={loading || currentPage <= 1}
            >
              Previous
            </button>
            <span className="cineai-pageIndicator">
              Page {currentPage} of {Math.max(totalPages, 1)}
            </span>
            <button
              type="button"
              className="cineai-paginationButton"
              onClick={goToNextPage}
              disabled={loading || currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedMovie ? (
        <div className="cineai-modalOverlay" onClick={() => setSelectedMovie(null)}>
          <div className="cineai-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="cineai-modalClose"
              onClick={() => setSelectedMovie(null)}
            >
              ×
            </button>

            {selectedMovie.poster ? (
              <img
                src={selectedMovie.poster}
                alt={selectedMovie.title || "Movie poster"}
                className="cineai-modalPoster"
              />
            ) : (
              <div className="cineai-modalPoster cineai-moviePosterFallback">
                No poster
              </div>
            )}

            <div className="cineai-modalContent">
              <span className="cineai-modalEyebrow">Featured Pick</span>
              <h2>{selectedMovie.title}</h2>
              <p className="cineai-modalRating">
                Rating: {formatRating(selectedMovie.vote_average ?? selectedMovie.rating)}
              </p>
              <p className="cineai-modalOverview">
                {selectedMovie.overview || "No overview available for this title yet."}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
