from typing import Literal
from fastapi import APIRouter, HTTPException, Query

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
def movies(
    category: Literal[
        "popular",
        "now_playing",
        "top_rated",
        "upcoming",
    ] = "popular",
    count: int = Query(default=10, ge=1, le=20),
):
    try:
        return get_movies(category=category, count=count)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


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
def similar_movies(
    movie_id: int,
    count: int = Query(default=10, ge=1, le=20),
):
    try:
        return get_similar_movies(movie_id, count)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
