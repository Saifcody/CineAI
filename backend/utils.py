GENRE_IDS = {
    "action": 28,
    "adventure": 12,
    "animation": 16,
    "comedy": 35,
    "crime": 80,
    "documentary": 99,
    "drama": 18,
    "family": 10751,
    "fantasy": 14,
    "horror": 27,
    "mystery": 9648,
    "romance": 10749,
    "sci-fi": 878,
    "thriller": 53,
    "war": 10752,
    "western": 37,
    "musical": 10402,
}

KEYWORD_CATEGORIES = {
    "cyberpunk": "cyberpunk",
    "psychological": "psychological",
    "supernatural": "supernatural",
    "time travel": "time travel",
    "sports": "sports",
}

MOOD_MAPPINGS = {
    "romantic": "romance",
    "funny": "comedy",
    "sad": "drama",
}


def parse_query(query: str) -> tuple[str, str]:
    normalized = (query or "").strip().lower()

    if not normalized:
        return ("popular", "")

    if normalized in GENRE_IDS:
        return ("genre", normalized)

    if normalized in KEYWORD_CATEGORIES:
        return ("keyword", KEYWORD_CATEGORIES[normalized])

    for phrase, mapped_genre in MOOD_MAPPINGS.items():
        if phrase in normalized:
            return ("genre", mapped_genre)

    if "popular" in normalized:
        return ("popular", "")

    return ("search", normalized)
