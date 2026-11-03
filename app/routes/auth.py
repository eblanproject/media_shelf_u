from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.services.auth import register_user, login_user

from app.core.dependencies import get_current_user
from app.models.user import User


router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserResponse)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    try:
        user = register_user(db, user_data)
        return user
    except ValueError as error:
        raise HTTPException(
            status_code=409,
            detail=str(error),
        )

@router.post("/login")
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db),
):
    try:
        return login_user(db, user_data)
    except ValueError as error:
        raise HTTPException(
            status_code=401,
            detail=str(error),
        )

@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user
