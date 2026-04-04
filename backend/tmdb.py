import os
from pathlib import Path
from typing import Any

import requests
from dotenv import load_dotenv
from requests import HTTPError, RequestException
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

load_dotenv(Path(__file__).resolve().parent / ".env")

API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"
TIMEOUT_SECONDS = 10

session = requests.Session()
session.headers.update(
    {
        "Accept": "application/json",
        "User-Agent": "CineAI/1.0",
    }
)
session.mount(
    "https://",
    HTTPAdapter(
        max_retries=Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET"],
        )
    ),
)


class TMDBError(Exception):
    pass


def _request_tmdb(endpoint: str, params: dict[str, Any]) -> dict[str, Any]:
    if not API_KEY:
        raise TMDBError("TMDB API key is missing.")

    try:
        response = session.get(
            f"{BASE_URL}/{endpoint}",
            params={"api_key": API_KEY, **params},
            timeout=TIMEOUT_SECONDS,
        )
        response.raise_for_status()
        return response.json()
    except HTTPError as exc:
        status_code = exc.response.status_code if exc.response is not None else None
        if status_code == 401:
            raise TMDBError("TMDB rejected the API key. Check backend/.env.") from exc
        if status_code == 429:
            raise TMDBError("TMDB rate limit reached. Please try again in a moment.") from exc
        raise TMDBError(f"TMDB returned an error ({status_code}).") from exc
    except RequestException as exc:
        raise TMDBError("Unable to reach TMDB right now. Check your internet connection or firewall.") from exc

def search_movie(query, page: int = 1):
    return _request_tmdb("search/movie", {"query": query, "page": page})


def discover_movies_by_genre(genre_id: int, page: int = 1):
    return _request_tmdb(
        "discover/movie",
        {"with_genres": genre_id, "sort_by": "popularity.desc", "page": page},
    )


def get_popular_movies(page: int = 1):
    return _request_tmdb("movie/popular", {"page": page})
