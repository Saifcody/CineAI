function getPosterUrl(posterPath, size = "w500") {
  if (!posterPath) {
    return null;
  }

  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}

export default function MovieCard({
  movie,
  label,
  page,
  onSelect,
  formatRating,
}) {
  return (
    <button type="button" className="cineai-movieCard" onClick={() => onSelect(movie)}>
      <div className="cineai-movieVisual">
        {movie.poster_path ? (
          <img
            src={getPosterUrl(movie.poster_path, "w342")}
            srcSet={`${getPosterUrl(movie.poster_path, "w342")} 342w, ${getPosterUrl(
              movie.poster_path,
              "w500"
            )} 500w`}
            sizes="(max-width: 420px) 100vw, (max-width: 720px) 50vw, (max-width: 1200px) 33vw, 25vw"
            alt={movie.title || "Movie poster"}
            className="cineai-moviePoster"
            loading="lazy"
          />
        ) : (
          <div className="cineai-moviePoster cineai-moviePosterFallback">No poster</div>
        )}

        <div className="cineai-ratingBadge">
          <span className="material-symbols-outlined">star</span>
          <span>{formatRating(movie.vote_average ?? movie.rating)}</span>
        </div>

        <div className="cineai-cardOverlay">
          <span className="cineai-trailerButton">
            <span className="material-symbols-outlined">description</span>
            Overview
          </span>
        </div>
      </div>

      <div className="cineai-movieMeta">
        <h3>{movie.title}</h3>
        <p>
          {label} • Page {page}
        </p>
      </div>
    </button>
  );
}
