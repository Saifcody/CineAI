from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.tmdb import search_movie, get_popular_movies

app = FastAPI()

# ✅ CORS (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "CineAI Backend Running 🚀"}

@app.get("/recommend")
def recommend(query: str = Query(default=""), page: int = 1):
    try:
        if query:
            data = search_movie(query, page)
        else:
            data = get_popular_movies(page)

        return {
            "page": data.get("page", 1),
            "total_pages": data.get("total_pages", 1),
            "results": data.get("results", []),
        }

    except Exception as e:
        return {"error": str(e)}
