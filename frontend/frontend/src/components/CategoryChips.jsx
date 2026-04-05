export default function CategoryChips({
  categories,
  activeCategory,
  loading,
  onSelect,
}) {
  return (
    <div className="cineai-genreSection">
      <h2 className="cineai-sectionTitle">Explore by Genre</h2>
      <div className="cineai-chipGrid">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              className={`cineai-chip ${isActive ? "is-active" : ""}`}
              onClick={() => onSelect(category)}
              disabled={loading}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
