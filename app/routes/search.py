from fastapi import APIRouter, HTTPException, Query

from app.services.tmdb import search_media

router = APIRouter(prefix="/api/search", tags=["Search"])


@router.get("")
def search(
    query: str = Query(min_length=1, max_length=200),
):
    try:
        return search_media(query)
    except Exception as error:
        raise HTTPException(status_code=502, detail=str(error))
