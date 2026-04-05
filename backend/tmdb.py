import os
from pathlib import Path
import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"

def _request(endpoint, params):
    if not API_KEY:
        raise Exception("Missing TMDB API key")

    url = f"{BASE_URL}/{endpoint}"

    res = requests.get(
        url,
        params={"api_key": API_KEY, **params},
        timeout=5
    )

    res.raise_for_status()
    return res.json()

def search_movie(query, page=1):
    return _request("search/movie", {"query": query, "page": page})

def get_popular_movies(page=1):
    return _request("movie/popular", {"page": page})
