import { useEffect } from "react";

function getPosterUrl(posterPath, size = "w500") {
  if (!posterPath) {
    return null;
  }

  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}

export default function MovieModal({ movie, onClose, formatRating }) {
  useEffect(() => {
    if (!movie) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movie, onClose]);

  if (!movie) {
    return null;
  }

  return (
    <div className="cineai-modalOverlay" onClick={onClose}>
      <div className="cineai-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="cineai-modalClose" onClick={onClose} aria-label="Close">
          X
        </button>

        {movie.poster_path ? (
          <img
            src={getPosterUrl(movie.poster_path, "w500")}
            srcSet={`${getPosterUrl(movie.poster_path, "w342")} 342w, ${getPosterUrl(
              movie.poster_path,
              "w500"
            )} 500w, ${getPosterUrl(movie.poster_path, "w780")} 780w`}
            sizes="(max-width: 720px) 100vw, 40vw"
            alt={movie.title || "Movie poster"}
            className="cineai-modalPoster"
            loading="lazy"
          />
        ) : (
          <div className="cineai-modalPoster cineai-moviePosterFallback">No poster</div>
        )}

        <div className="cineai-modalContent">
          <span className="cineai-modalEyebrow">Featured Pick</span>
          <h2>{movie.title}</h2>
          <p className="cineai-modalRating">
            Rating: {formatRating(movie.vote_average ?? movie.rating)}
          </p>
          <p className="cineai-modalOverview">
            {movie.overview || "No overview available for this title yet."}
          </p>
        </div>
      </div>
    </div>
  );
}
