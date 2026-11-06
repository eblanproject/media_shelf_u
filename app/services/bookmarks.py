from sqlalchemy.orm import Session

from app.models.bookmark import Bookmark
from app.schemas.bookmark import BookmarkCreate


def add_bookmark(
    db: Session,
    user_id: int,
    bookmark_data: BookmarkCreate,
):
    existing = db.query(Bookmark).filter(
        Bookmark.user_id == user_id,
        Bookmark.tmdb_id == bookmark_data.tmdb_id,
        Bookmark.media_type == bookmark_data.media_type,
    ).first()

    if existing:
        raise ValueError("Bookmark already exists")

    bookmark = Bookmark(
        user_id=user_id,
        tmdb_id=bookmark_data.tmdb_id,
        media_type=bookmark_data.media_type,
    )

    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)

    return bookmark


def get_user_bookmarks(db: Session, user_id: int):
    return db.query(Bookmark).filter(
        Bookmark.user_id == user_id
    ).order_by(Bookmark.created_at.desc()).all()


def delete_bookmark(db: Session, user_id: int, bookmark_id: int):
    bookmark = db.query(Bookmark).filter(
        Bookmark.id == bookmark_id,
        Bookmark.user_id == user_id,
    ).first()

    if not bookmark:
        raise ValueError("Bookmark not found")

    db.delete(bookmark)
    db.commit()
