from pydantic import BaseModel, ConfigDict, Field
from typing import Literal
from datetime import datetime


class BookmarkCreate(BaseModel):
    tmdb_id: int = Field(gt=0)
    media_type: Literal["movie", "tv"]


class BookmarkResponse(BaseModel):
    id: int
    tmdb_id: int
    media_type: Literal["movie", "tv"]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
