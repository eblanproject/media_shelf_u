import requests

from app.core.config import (
    TMDB_API_KEY,
    TMDB_BASE_URL,
    TMDB_IMAGE_BASE,
)


def tmdb_get(endpoint: str, params: dict | None = None):
    request_params = {
        **(params or {}),
        "api_key": TMDB_API_KEY,
        "language": "en-US",
    }

    try:
        response = requests.get(
            f"{TMDB_BASE_URL}{endpoint}",
            params=request_params,
            timeout=10,
        )

        response.raise_for_status()
        return response.json()

    except requests.exceptions.Timeout as error:
        raise RuntimeError("TMDB request timed out") from error

    except requests.exceptions.ConnectionError as error:
        raise RuntimeError("Could not connect to TMDB") from error

    except requests.exceptions.HTTPError as error:
        raise RuntimeError(
            f"TMDB returned HTTP {error.response.status_code}"
        ) from error

    except requests.exceptions.RequestException as error:
        raise RuntimeError("TMDB request failed") from error


def get_movies(category: str = "popular", count: int = 20):
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

    for person in movie.get("credits", {}).get("cast", [])[:20]:
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


def get_similar_movies(movie_id: int, count: int = 20):
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

def get_tv_series(category: str = "popular", count: int = 20):
    data = tmdb_get(f"/tv/{category}")

    return [
        {
            "id": tv["id"],
            "title": tv.get("name"),
            "thumbnail": (
                f"{TMDB_IMAGE_BASE}{tv['poster_path']}"
                if tv.get("poster_path")
                else None
            ),
        }
        for tv in data.get("results", [])[:count]
    ]


def get_tv_series_details(tv_id: int):
    tv = tmdb_get(
        f"/tv/{tv_id}",
        {"append_to_response": "credits,content_ratings"},
    )

    cast = [
        {
            "id": person["id"],
            "name": person.get("name"),
            "character": person.get("character"),
        }
        for person in tv.get("credits", {}).get("cast", [])[:20]
    ]

    age_rating = next(
        (
            item.get("rating")
            for item in tv.get("content_ratings", {}).get("results", [])
            if item.get("iso_3166_1") == "KR" and item.get("rating")
        ),
        None,
    )

    return {
        "id": tv.get("id"),
        "title": tv.get("name"),
        "description": tv.get("overview"),
        "thumbnail": (
            f"{TMDB_IMAGE_BASE}{tv['poster_path']}"
            if tv.get("poster_path")
            else None
        ),
        "rating": tv.get("vote_average"),
        "first_air_date": tv.get("first_air_date"),
        "genres": tv.get("genres", []),
        "seasons_count": tv.get("number_of_seasons"),
        "episodes_count": tv.get("number_of_episodes"),
        "cast": cast,
        "age_rating": age_rating,
    }


def search_media(query: str):
    data = tmdb_get("/search/multi", {"query": query})

    results = []

    for item in data.get("results", []):
        media_type = item.get("media_type")

        if media_type not in ("movie", "tv"):
            continue

        results.append(
            {
                "id": item["id"],
                "title": item.get("title") or item.get("name"),
                "thumbnail": (
                    f"{TMDB_IMAGE_BASE}{item['poster_path']}"
                    if item.get("poster_path")
                    else None
                ),
                "type": media_type,
            }
        )

    return results
