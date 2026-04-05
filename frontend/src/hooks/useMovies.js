import { useState } from "react";
import { fetchMovies } from "../services/api";

export default function useMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");

  const searchMovies = async (q, page = 1) => {
    setLoading(true);
    setError("");
    setQuery(q);

    try {
      const data = await fetchMovies(q, page);
      setMovies(Array.isArray(data.results) ? data.results : []);
      setCurrentPage(data.page || page);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      setMovies([]);
      setCurrentPage(1);
      setTotalPages(1);
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (!loading && currentPage < totalPages) {
      searchMovies(query, currentPage + 1);
    }
  };

  const prevPage = () => {
    if (!loading && currentPage > 1) {
      searchMovies(query, currentPage - 1);
    }
  };

  return {
    movies,
    loading,
    error,
    currentPage,
    totalPages,
    searchMovies,
    nextPage,
    prevPage,
  };
}
