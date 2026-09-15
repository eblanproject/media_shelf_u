from fastapi import APIRouter, HTTPException

from app.services.tmdb import (
    get_movies,
    get_movie,
    get_similar_movies,
)

router = APIRouter(
    prefix="/api/movies",
    tags=["Movies"],
)


@router.get("")
def movies(category: str = "popular", count: int = 10):
    try:
        return get_movies(category, count)
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"TMDB error: {str(error)}",
        )


@router.get("/{movie_id}")
def movie(movie_id: int):
    try:
        return get_movie(movie_id)
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"TMDB error: {str(error)}",
        )


@router.get("/{movie_id}/similar")
def similar_movies(movie_id: int, count: int = 10):
    try:
        return get_similar_movies(movie_id, count)
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"TMDB error: {str(error)}",
        )
