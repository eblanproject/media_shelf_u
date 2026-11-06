from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_user
from app.schemas.bookmark import BookmarkCreate, BookmarkResponse
from app.services.bookmarks import (
    add_bookmark,
    get_user_bookmarks,
    delete_bookmark,
)


router = APIRouter(prefix="/bookmarks", tags=["Bookmarks"])


@router.post("/", response_model=BookmarkResponse)
def create_bookmark(
    bookmark_data: BookmarkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return add_bookmark(db, current_user.id, bookmark_data)
    except ValueError as error:
        raise HTTPException(status_code=409, detail=str(error))


@router.get("/", response_model=list[BookmarkResponse])
def read_bookmarks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_bookmarks(db, current_user.id)


@router.delete("/{bookmark_id}")
def remove_bookmark(
    bookmark_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        delete_bookmark(db, current_user.id, bookmark_id)
        return {"message": "Bookmark deleted"}
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))
