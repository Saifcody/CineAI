import os
from pathlib import Path
from typing import Any

import requests
from dotenv import load_dotenv
from requests import HTTPError
from requests.adapters import HTTPAdapter
from requests.exceptions import ProxyError, RequestException
from urllib3.util.retry import Retry

# Load .env
load_dotenv(Path(__file__).resolve().parent / ".env")

API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"
CONNECT_TIMEOUT_SECONDS = 3
READ_TIMEOUT_SECONDS = 10
PROXY_MODE = os.getenv("TMDB_PROXY_MODE", "auto").strip().lower()
PROXY_ENV_KEYS = ("HTTPS_PROXY", "https_proxy", "HTTP_PROXY", "http_proxy", "ALL_PROXY", "all_proxy")

# ✅ REQUIRED CLASS (this was missing / broken)
class TMDBError(Exception):
    pass


def _has_proxy_env() -> bool:
    return any(os.getenv(key) for key in PROXY_ENV_KEYS)


def _build_session(trust_env: bool) -> requests.Session:
    session = requests.Session()
    session.trust_env = trust_env
    session.headers.update({
        "Accept": "application/json",
        "User-Agent": "CineAI/1.0",
    })
    session.mount(
        "https://",
        HTTPAdapter(
            max_retries=Retry(
                total=1,
                backoff_factor=0.2,
                status_forcelist=[429, 500, 502, 503, 504],
                allowed_methods=["GET"],
            )
        ),
    )
    return session


def _candidate_proxy_modes() -> list[bool]:
    if PROXY_MODE == "env":
        return [True]
    if PROXY_MODE == "direct":
        return [False]
    if _has_proxy_env():
        return [True, False]
    return [False, True]


# Core request function
def _request_tmdb(endpoint: str, params: dict[str, Any]) -> dict[str, Any]:
    if not API_KEY:
        raise TMDBError("TMDB API key is missing.")

    last_exception: Exception | None = None

    for trust_env in _candidate_proxy_modes():
        session = _build_session(trust_env=trust_env)

        try:
            response = session.get(
                f"{BASE_URL}/{endpoint}",
                params={"api_key": API_KEY, **params},
                timeout=(CONNECT_TIMEOUT_SECONDS, READ_TIMEOUT_SECONDS),
            )
            response.raise_for_status()
            return response.json()
        except HTTPError as exc:
            status_code = exc.response.status_code if exc.response is not None else None

            if status_code == 401:
                raise TMDBError("Invalid API key.") from exc

            if status_code == 429:
                raise TMDBError("Rate limit hit.") from exc

            raise TMDBError(f"TMDB error: {status_code}") from exc
        except (ProxyError, RequestException) as exc:
            last_exception = exc
        finally:
            session.close()

    if isinstance(last_exception, ProxyError):
        raise TMDBError(
            "TMDB could not be reached through the configured network proxy. "
            "Try setting TMDB_PROXY_MODE=direct in backend/.env."
        ) from last_exception

    raise TMDBError(
        "Network error / TMDB unreachable. "
        "If your network requires a proxy, set TMDB_PROXY_MODE=env in backend/.env."
    ) from last_exception


# Search
def search_movie(query, page: int = 1):
    return _request_tmdb("search/movie", {"query": query, "page": page})


# Discover by genre
def discover_movies_by_genre(genre_id: int, page: int = 1):
    return _request_tmdb(
        "discover/movie",
        {"with_genres": genre_id, "sort_by": "popularity.desc", "page": page},
    )


# Popular movies
def get_popular_movies(page: int = 1):
    return _request_tmdb("movie/popular", {"page": page})
