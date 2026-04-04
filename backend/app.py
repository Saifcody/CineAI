from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .tmdb import TMDBError, discover_movies_by_genre, get_popular_movies, search_movie
from .utils import GENRE_IDS, parse_query

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "CineAI Backend Running 🚀"}

@app.get("/recommend")
def recommend(query: str, page: int = 1):
    page = max(page, 1)
    query_type, value = parse_query(query)

    try:
        if query_type == "popular":
            data = get_popular_movies(page)
        elif query_type == "genre":
            data = discover_movies_by_genre(GENRE_IDS[value], page)
        else:
            data = search_movie(value, page)
    except TMDBError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    results = []

    for movie in data.get("results", [])[:10]:
        poster_path = movie.get("poster_path")
        results.append({
            "title": movie.get("title"),
            "vote_average": movie.get("vote_average"),
            "rating": movie.get("vote_average"),
            "overview": movie.get("overview"),
            "poster_path": poster_path,
            "poster": f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None
        })

    return {
        "page": data.get("page", page),
        "total_pages": data.get("total_pages", 1),
        "results": results,
    }
