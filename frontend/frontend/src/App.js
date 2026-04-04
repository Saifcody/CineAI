import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const search = async () => {
    const res = await fetch(`http://127.0.0.1:8000/recommend?query=${query}`);
    const data = await res.json();
    setMovies(data);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>CineAI 🎬</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What do you want to watch?"
      />

      <button onClick={search}>Search</button>

      <div>
        {movies.map((m, i) => (
          <div key={i}>
            <h3>{m.title}</h3>
            <img src={m.poster} width="150" />
            <p>⭐ {m.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;