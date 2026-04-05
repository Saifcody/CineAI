import { useEffect, useState } from "react";
import DesktopLayout from "./layout/DesktopLayout";
import MobileLayout from "./layout/MobileLayout";

const BASE_URL = "https://cineai-backend-08x8.onrender.com";

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

export default function CineAiEditorialApp() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastSearch, setLastSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAllMobileGenres, setShowAllMobileGenres] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 720px)").matches;
  });

  useEffect(() => {
    if (selectedMovie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMovie]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedMovie(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(max-width: 720px)");
    const handleViewportChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  const fetchMovies = async (searchQuery, page = 1) => {
    setError("");
    setSelectedMovie(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${BASE_URL}/recommend?query=${encodeURIComponent(searchQuery)}&page=${page}`
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

  const formatRating = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "N/A";
    }

    return Number(value).toFixed(1);
  };

  const getPosterUrl = (posterPath, size = "w500") => {
    if (!posterPath) return null;
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
  };

  const search = async () => {
    if (!query.trim()) return;
    setActiveCategory("");
    await fetchMovies(query, 1);
  };

  const selectCategory = async (category) => {
    setQuery(category);
    setActiveCategory(category);
    await fetchMovies(category, 1);
  };

  const goToPreviousPage = async () => {
    if (loading || currentPage <= 1) return;
    await fetchMovies(lastSearch || query, currentPage - 1);
  };

  const goToNextPage = async () => {
    if (loading || currentPage >= totalPages) return;
    await fetchMovies(lastSearch || query, currentPage + 1);
  };

  const handleEnterSearch = async (event) => {
    if (event.key === "Enter") {
      await search();
    }
  };

  const sortedMovies = [...movies].sort((a, b) => {
    const left = Number(a.vote_average ?? a.rating ?? 0);
    const right = Number(b.vote_average ?? b.rating ?? 0);
    return sortOrder === "desc" ? right - left : left - right;
  });

  const resultLabel = activeCategory || lastSearch || query || "Curated";
  const resultCount = sortedMovies.length;

  const searchBar = (
    <div className="cineai-searchShell">
      <div className="cineai-searchBar">
        <span className="material-symbols-outlined cineai-searchIcon">auto_awesome</span>
        <input
          className="cineai-searchInput"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleEnterSearch}
          placeholder={isMobile ? "Search films, moods, genres..." : "What do you want to watch?"}
          aria-label="Search movies"
        />
        <button
          type="button"
          className="cineai-searchButton"
          onClick={search}
          disabled={loading}
        >
          {loading ? (
            <span className="cineai-spinner" aria-label="Loading" />
          ) : (
            <>
              <span className="material-symbols-outlined">search</span>
              <span>Curate</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderGenreChips = (items, className = "cineai-chipGrid") => (
    <div className={className} role="list">
      {items.map((category) => {
        const isActive = activeCategory === category;
        return (
          <div key={category} role="listitem">
            <button
              type="button"
              className={`cineai-chip ${isActive ? "is-active" : ""}`}
              onClick={() => selectCategory(category)}
              disabled={loading}
              aria-pressed={isActive}
            >
              {category}
            </button>
          </div>
        );
      })}
    </div>
  );

  const mobileCategories = showAllMobileGenres ? categories : categories.slice(0, 10);
  const desktopGenreChips = renderGenreChips(categories);
  const mobileGenreChips = renderGenreChips(
    mobileCategories,
    `cineai-chipGrid cineai-chipGridMobile ${showAllMobileGenres ? "is-expanded" : ""}`
  );

  const loadingState = (
    <div className="cineai-loadingState" aria-live="polite">
      <div className="cineai-loadingPulse" />
      <div className="cineai-loadingPulse" />
      <div className="cineai-loadingPulse" />
      <div className="cineai-loadingPulse" />
    </div>
  );

  const movieGrid = (
    <div className={`cineai-movieGrid ${isMobile ? "cineai-movieGridMobile" : ""}`}>
      {sortedMovies.map((movie, index) => (
        <button
          key={`${movie.title}-${index}`}
          type="button"
          className={`cineai-movieCard ${isMobile ? "cineai-movieCardMobile" : ""}`}
          onClick={() => setSelectedMovie(movie)}
          aria-label={`View details for ${movie.title}`}
        >
          <div className="cineai-movieVisual">
            {movie.poster_path ? (
              <img
                src={getPosterUrl(movie.poster_path, "w342")}
                srcSet={`${getPosterUrl(movie.poster_path, "w342")} 342w, ${getPosterUrl(movie.poster_path, "w500")} 500w`}
                sizes="(max-width: 420px) 100vw, (max-width: 720px) 50vw, (max-width: 1200px) 33vw, 25vw"
                alt={movie.title || "Movie poster"}
                className="cineai-moviePoster"
                loading="lazy"
              />
            ) : (
              <div className="cineai-moviePoster cineai-moviePosterFallback">
                No poster
              </div>
            )}

            <div className="cineai-ratingBadge">
              <span className="material-symbols-outlined">star</span>
              <span>{formatRating(movie.vote_average ?? movie.rating)}</span>
            </div>

            <div className="cineai-cardOverlay">
              <span className="cineai-trailerButton">
                <span className="material-symbols-outlined">
                  {isMobile ? "touch_app" : "description"}
                </span>
                {isMobile ? "Open" : "Overview"}
              </span>
            </div>
          </div>

          <div className="cineai-movieMeta">
            <h3>{movie.title}</h3>
            <p>{resultLabel} | Page {currentPage}</p>
          </div>
        </button>
      ))}
    </div>
  );

  const pagination =
    !loading && sortedMovies.length > 0 ? (
      <>
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

        {currentPage < totalPages ? (
          <div className="cineai-loadMoreRow">
            <button
              type="button"
              className="cineai-loadMoreButton"
              onClick={goToNextPage}
              disabled={loading}
            >
              Discover more stories
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>
        ) : null}
      </>
    ) : null;

  const desktopView = (
    <>
      <header className="cineai-topbar">
        <div className="cineai-topbarInner">
          <div className="cineai-brand">CineAI</div>
        </div>
      </header>

      <main className="cineai-editorialPage">
        <section className="cineai-hero">
          <h1 className="cineai-heroTitle">
            Find your next <span>obsession.</span>
          </h1>
          {searchBar}
        </section>

        <div className="cineai-editorialGrid">
          <aside className="cineai-sidebar">
            <div className="cineai-sidebarPanel">
              <h2 className="cineai-sidebarTitle">The Curator</h2>
              <nav className="cineai-sidebarNav">
                <button type="button" className="cineai-sidebarLink is-active">
                  <span className="material-symbols-outlined">home</span>
                  <span>Home</span>
                </button>
                <button type="button" className="cineai-sidebarLink">
                  <span className="material-symbols-outlined">movie_filter</span>
                  <span>Trending</span>
                </button>
              </nav>

              <div className="cineai-sortPanel">
                <span className="cineai-sortLabel">Sort by Rating</span>
                <div className="cineai-sortControl">
                  <span className="material-symbols-outlined">sort</span>
                  <div className="cineai-sortOptions" role="group" aria-label="Sort by rating">
                    <button
                      type="button"
                      className={`cineai-sortButton ${sortOrder === "desc" ? "is-active" : ""}`}
                      onClick={() => setSortOrder("desc")}
                    >
                      Highest
                    </button>
                    <button
                      type="button"
                      className={`cineai-sortButton ${sortOrder === "asc" ? "is-active" : ""}`}
                      onClick={() => setSortOrder("asc")}
                    >
                      Lowest
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="cineai-content">
            <div className="cineai-genreSection">
              <h2 className="cineai-sectionTitle">Explore by Genre</h2>
              {desktopGenreChips}
            </div>

            {error ? (
              <p className="cineai-error" role="alert">
                {error}
              </p>
            ) : null}
            {loading ? loadingState : movieGrid}
            {pagination}
          </section>
        </div>
      </main>
    </>
  );

  const mobileHero = (
    <section className="cineai-mobileHero">
      <div className="cineai-topbar cineai-mobileTopbar">
        <div className="cineai-topbarInner">
          <div className="cineai-brand">CineAI</div>
        </div>
      </div>

      <div className="cineai-mobileHeroCard">
        <h1 className="cineai-heroTitle cineai-mobileTitle">
          Find your next <span>obsession.</span>
        </h1>
        {searchBar}
      </div>
    </section>
  );

  const mobileSidebar = (
    <section className="cineai-mobileControls" aria-label="Browse controls">
      <div className="cineai-mobilePanel">
        <div className="cineai-mobilePanelHeader">
          <div>
            <span className="cineai-mobilePanelEyebrow">Browse</span>
            <h2 className="cineai-mobilePanelTitle">Genres</h2>
          </div>
          <span className="cineai-mobileResultPill">{resultCount} titles</span>
        </div>
        {mobileGenreChips}
        {categories.length > 10 ? (
          <button
            type="button"
            className="cineai-mobileExpandButton"
            onClick={() => setShowAllMobileGenres((current) => !current)}
            aria-expanded={showAllMobileGenres}
          >
            <span>{showAllMobileGenres ? "Show fewer genres" : "Show all genres"}</span>
            <span className="material-symbols-outlined">
              {showAllMobileGenres ? "expand_less" : "expand_more"}
            </span>
          </button>
        ) : null}
      </div>

      <div className="cineai-mobilePanel">
        <div className="cineai-mobileSortRow">
          <span className="cineai-sortLabel">Sort by rating</span>
          <div className="cineai-sortOptions" role="group" aria-label="Sort by rating">
            <button
              type="button"
              className={`cineai-sortButton ${sortOrder === "desc" ? "is-active" : ""}`}
              onClick={() => setSortOrder("desc")}
            >
              Highest
            </button>
            <button
              type="button"
              className={`cineai-sortButton ${sortOrder === "asc" ? "is-active" : ""}`}
              onClick={() => setSortOrder("asc")}
            >
              Lowest
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const mobileContent = (
    <section className="cineai-mobileContent">
      <div className="cineai-mobileResultsHeader">
        <div>
          <span className="cineai-mobilePanelEyebrow">Now showing</span>
          <h2 className="cineai-sectionTitle">Results for {resultLabel}</h2>
        </div>
        <span className="cineai-mobilePagePill">Page {currentPage}</span>
      </div>

      {error ? (
        <p className="cineai-error" role="alert">
          {error}
        </p>
      ) : null}
      {loading ? loadingState : movieGrid}
      {pagination}
    </section>
  );

  const footer = (
    <footer className="cineai-footer">
      <p className="cineai-footerText">
        Made with love{" "}
        <a
          className="cineai-footerLink"
          href="https://github.com/saifcody"
          target="_blank"
          rel="noreferrer"
        >
          @saifcody
        </a>{" "}
        &{" "}
        <a
          className="cineai-footerLink"
          href="https://github.com/wizard-dreamer"
          target="_blank"
          rel="noreferrer"
        >
          @wizard-dreamer
        </a>
      </p>
    </footer>
  );

  return (
    <>
      {isMobile ? (
        <MobileLayout
          hero={mobileHero}
          sidebar={mobileSidebar}
          content={
            <>
              {mobileContent}
              {footer}
            </>
          }
        />
      ) : (
        <DesktopLayout selectedMovie={selectedMovie}>
          <>
            {desktopView}
            {footer}
          </>
        </DesktopLayout>
      )}

      {selectedMovie ? (
        <div
          className="cineai-modalOverlay"
          onClick={() => setSelectedMovie(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Details for ${selectedMovie.title}`}
        >
          <div className="cineai-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="cineai-modalClose"
              onClick={() => setSelectedMovie(null)}
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {selectedMovie.poster_path ? (
              <img
                src={getPosterUrl(selectedMovie.poster_path, "w500")}
                srcSet={`${getPosterUrl(selectedMovie.poster_path, "w342")} 342w, ${getPosterUrl(selectedMovie.poster_path, "w500")} 500w, ${getPosterUrl(selectedMovie.poster_path, "w780")} 780w`}
                sizes="(max-width: 720px) 100vw, 40vw"
                alt={selectedMovie.title || "Movie poster"}
                className="cineai-modalPoster"
                loading="lazy"
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
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 16,
                    verticalAlign: "middle",
                    marginRight: 4,
                    color: "#e9c178",
                  }}
                >
                  star
                </span>
                {formatRating(selectedMovie.vote_average ?? selectedMovie.rating)}
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
