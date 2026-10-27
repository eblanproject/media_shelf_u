from fastapi import APIRouter, HTTPException, Query

from app.services.tmdb import get_tv_series, get_tv_series_details

router = APIRouter(prefix="/api/tv", tags=["TV Series"])


@router.get("")
def list_tv(
    category: str = "popular",
    count: int = Query(default=10, ge=1, le=20),
):
    try:
        return get_tv_series(category, count)
    except Exception as error:
        raise HTTPException(status_code=502, detail=str(error))


@router.get("/{tv_id}")
def tv_details(tv_id: int):
    try:
        return get_tv_series_details(tv_id)
    except Exception as error:
        raise HTTPException(status_code=502, detail=str(error))
