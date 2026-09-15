import requests

from app.core.config import (
    TMDB_API_KEY,
    TMDB_BASE_URL,
    TMDB_IMAGE_BASE,
)


def tmdb_get(endpoint: str, params: dict | None = None):
    if params is None:
        params = {}

    params["api_key"] = TMDB_API_KEY
    params["language"] = "en-US"

    response = requests.get(
        f"{TMDB_BASE_URL}{endpoint}",
        params=params,
        timeout=10,
    )

    response.raise_for_status()

    return response.json()


def get_movies(category: str = "popular", count: int = 10):
    data = tmdb_get(f"/movie/{category}")

    movies = []

    for movie in data.get("results", [])[:count]:
        movies.append(
            {
                "id": movie["id"],
                "title": movie.get("title"),
                "thumbnail": (
                    f"{TMDB_IMAGE_BASE}{movie['poster_path']}"
                    if movie.get("poster_path")
                    else None
                ),
            }
        )

    return movies


def get_movie(movie_id: int):
    movie = tmdb_get(
        f"/movie/{movie_id}",
        {
            "append_to_response": "credits,release_dates",
        },
    )

    cast = []

    for person in movie.get("credits", {}).get("cast", [])[:10]:
        cast.append(
            {
                "id": person.get("id"),
                "name": person.get("name"),
                "character": person.get("character"),
                "profile": (
                    f"{TMDB_IMAGE_BASE}{person['profile_path']}"
                    if person.get("profile_path")
                    else None
                ),
            }
        )

    genres = [
        {
            "id": genre["id"],
            "name": genre["name"],
        }
        for genre in movie.get("genres", [])
    ]

    age_rating = None

    for country in movie.get("release_dates", {}).get("results", []):
        if country.get("iso_3166_1") == "KR":
            for release in country.get("release_dates", []):
                certification = release.get("certification")

                if certification:
                    age_rating = certification
                    break

    return {
        "id": movie.get("id"),
        "title": movie.get("title"),
        "description": movie.get("overview"),
        "thumbnail": (
            f"{TMDB_IMAGE_BASE}{movie['poster_path']}"
            if movie.get("poster_path")
            else None
        ),
        "rating": movie.get("vote_average"),
        "release_date": movie.get("release_date"),
        "genres": genres,
        "runtime": movie.get("runtime"),
        "cast": cast,
        "age_rating": age_rating,
    }


def get_similar_movies(movie_id: int, count: int = 10):
    data = tmdb_get(f"/movie/{movie_id}/similar")

    movies = []

    for movie in data.get("results", [])[:count]:
        movies.append(
            {
                "id": movie["id"],
                "title": movie.get("title"),
                "thumbnail": (
                    f"{TMDB_IMAGE_BASE}{movie['poster_path']}"
                    if movie.get("poster_path")
                    else None
                ),
            }
        )

    return movies
