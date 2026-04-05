export default function SearchBar({
  query,
  loading,
  onChange,
  onSearch,
  onKeyDown,
}) {
  return (
    <div className="cineai-searchShell">
      <div className="cineai-searchBar">
        <span className="material-symbols-outlined cineai-searchIcon">auto_awesome</span>
        <input
          className="cineai-searchInput"
          value={query}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="What do you want to watch?"
        />
        <button
          type="button"
          className="cineai-searchButton"
          onClick={onSearch}
          disabled={loading}
        >
          {loading ? "Loading..." : "Curate"}
        </button>
      </div>
    </div>
  );
}
