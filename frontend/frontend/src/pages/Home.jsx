import { useState } from "react";
import useMovies from "../hooks/useMovies";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const {
    movies,
    searchMovies,
    nextPage,
    prevPage,
    currentPage,
  } = useMovies();

  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="max-w-md md:max-w-6xl mx-auto px-4 py-4">

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-800"
        />
        <button
          onClick={() => searchMovies(query)}
          className="bg-yellow-400 text-black px-6 py-3 rounded-xl"
        >
          Search
        </button>
      </div>

      {/* Movies */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {movies.map((m) => (
          <MovieCard key={m.title} movie={m} onClick={setSelectedMovie} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button onClick={prevPage}>Prev</button>
        <span>{currentPage}</span>
        <button onClick={nextPage}>Next</button>
      </div>

      {/* Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center">
          <div className="bg-gray-900 p-4 rounded-xl max-w-md">
            <h2 className="text-lg font-bold">{selectedMovie.title}</h2>
            <p className="text-sm mt-2">{selectedMovie.overview}</p>
            <button onClick={() => setSelectedMovie(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}