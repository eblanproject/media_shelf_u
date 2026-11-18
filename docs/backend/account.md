# Настройки аккаунта — контракт API для бэкенда

Фронтенд (ветка `frontend`, страница `/settings`) уже готов и ждёт эти эндпоинты.
Пока их нет (бэкенд отвечает `404`/`405`), в соответствующем блоке настроек пишется
«…isn’t available yet — the server doesn’t support it.». Тема сайта хранится только в браузере — бэкенд не нужен.

Все эндпоинты — с токеном: `Authorization: Bearer <JWT>`, текущий пользователь через `get_current_user`.
Ошибки — обычный формат FastAPI `{"detail": "..."}`: фронтенд показывает `detail` пользователю как есть.

## `PATCH /auth/me` — изменить имя и/или почту

Тело (любое из полей, отсутствующее поле не меняется):

```json
{ "username": "new_name", "email": "new@mail.com" }
```

- Ответ `200`: обновлённый пользователь в формате `UserResponse` (`{ id, username, email }`).
- `409` — имя или почта уже заняты другим пользователем (`"Username is already taken"` / `"Email is already in use"`).
- `422` — валидация Pydantic: `username: str | None = Field(None, min_length=3, max_length=50)`, `email: EmailStr | None = None`.
- Токен остаётся валидным: в `sub` лежит `id`, а не имя.

## `POST /auth/change-password` — сменить пароль

```json
{ "current_password": "old-secret", "new_password": "new-secret-123" }
```

- Ответ `200`: `{ "ok": true }` (или `204`).
- `400` — неверный текущий пароль (`"Current password is incorrect"`). **Не `401`** — иначе это выглядит как истёкшая сессия.
- `422` — `new_password: str = Field(min_length=8)`.

## `DELETE /auth/me` — удалить аккаунт

```json
{ "password": "secret" }
```

- Ответ `200` / `204`. Закладки и комментарии пользователя удаляются (`ON DELETE CASCADE`).
- `400` — неверный пароль (`"Password is incorrect"`).

## Пример (FastAPI)

```python
class UserUpdate(BaseModel):
    username: str | None = Field(None, min_length=3, max_length=50)
    email: EmailStr | None = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)

class AccountDelete(BaseModel):
    password: str


@router.patch("/me", response_model=UserResponse)
def update_me(data: UserUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if data.username and data.username != user.username:
        if db.query(User).filter(User.username == data.username, User.id != user.id).first():
            raise HTTPException(409, "Username is already taken")
        user.username = data.username
    if data.email and data.email != user.email:
        if db.query(User).filter(User.email == data.email, User.id != user.id).first():
            raise HTTPException(409, "Email is already in use")
        user.email = data.email
    db.commit()
    db.refresh(user)
    return user


@router.post("/change-password")
def change_password(data: PasswordChange, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not verify_password(data.current_password, user.hashed_password):
        raise HTTPException(400, "Current password is incorrect")
    user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"ok": True}


@router.delete("/me")
def delete_me(data: AccountDelete, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(400, "Password is incorrect")
    db.delete(user)
    db.commit()
    return {"ok": True}
```
