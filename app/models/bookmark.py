from sqlalchemy import Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.database import Base


class Bookmark(Base):
    __tablename__ = "bookmarks"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "tmdb_id",
            "media_type",
            name="unique_user_bookmark",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    tmdb_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    media_type: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
