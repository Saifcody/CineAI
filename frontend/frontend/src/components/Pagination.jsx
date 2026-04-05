export default function Pagination({
  loading,
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) {
  return (
    <div className="cineai-pagination">
      <button
        type="button"
        className="cineai-paginationButton"
        onClick={onPrevious}
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
        onClick={onNext}
        disabled={loading || currentPage >= totalPages}
      >
        Next
      </button>
    </div>
  );
}
