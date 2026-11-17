# Комментарии к фильмам — контракт API для бэкенда

Фронтенд (ветка `frontend`) уже готов и ждёт эти эндпоинты. Стиль — как у `/bookmarks/`.
Пока эндпоинтов нет, на странице фильма в блоке комментариев написано «Comments are coming soon.».

## Правила доступа

- **Читать** комментарии может кто угодно, без токена.
- **Писать** — только вошедший пользователь (`Authorization: Bearer <JWT>`, как в `/bookmarks/`).
- **Удалять** — только автор комментария.

## Модель `comments`

| поле         | тип                         | примечание                                   |
|--------------|-----------------------------|----------------------------------------------|
| `id`         | int, PK                     |                                              |
| `user_id`    | FK → `users.id`, ON DELETE CASCADE |                                       |
| `tmdb_id`    | int, not null, index        | id фильма/сериала в TMDB                     |
| `media_type` | str(10), `"movie"` / `"tv"` | индекс по паре (`tmdb_id`, `media_type`)     |
| `text`       | text, 1–1000 символов       | обрезать пробелы по краям                    |
| `created_at` | datetime(tz), `server_default=now()` |                                     |

## Формат комментария в ответах

```json
{
  "id": 12,
  "tmdb_id": 550,
  "media_type": "movie",
  "text": "Great movie!",
  "created_at": "2026-11-17T12:34:56.000000+00:00",
  "user": { "id": 3, "username": "max" }
}
```

`user` — вложенный объект (нужен `username` автора; email **не** отдавать).
Фронтенд описывает этот тип в `types/comment.ts`.

## Эндпоинты

### `GET /comments/?tmdb_id=550&media_type=movie` — публичный

- `media_type` по умолчанию `movie`.
- Ответ `200`: массив комментариев, **новые сверху** (`ORDER BY created_at DESC`).
- Нет комментариев → `[]`.

### `POST /comments/` — нужен токен

Тело:

```json
{ "tmdb_id": 550, "media_type": "movie", "text": "Great movie!" }
```

- Ответ `200` или `201`: созданный комментарий в формате выше (с `user`).
- `401` — нет токена или он недействителен.
- `422` — пустой текст / длиннее 1000 символов / `tmdb_id <= 0` (обычная валидация Pydantic:
  `text: str = Field(min_length=1, max_length=1000)`, `tmdb_id: int = Field(gt=0)`).

### `DELETE /comments/{comment_id}` — нужен токен

- Ответ `200` `{"message": "Comment deleted"}`.
- `404` — комментария нет **или он чужой** (как в `delete_bookmark`).
- `401` — нет токена.

## Как фронтенд к этому ходит

Браузер → `app/api/comments/route.ts` и `app/api/comments/[id]/route.ts` (Next.js) → бэкенд.
Next.js берёт JWT из httpOnly-cookie и подставляет `Authorization`, поэтому CORS на бэкенде не нужен.
Ошибки бэкенда читаются из `{"detail": "..."}` и показываются пользователю.

---

## Дополнительно: что ещё хотелось бы в `GET /api/movies/{id}`

Сейчас уже есть фото актёров (`cast[].profile`) — фронтенд их показывает.
Чего не хватает для более подробной страницы (всё это есть в ответе TMDB `/movie/{id}`):

- `backdrop` — `backdrop_path` (широкий фон для шапки страницы, лучше в размере `w1280`);
- `tagline`, `original_title`, `status`;
- `vote_count`;
- `budget`, `revenue`;
- `production_countries[].name`, `spoken_languages[].english_name`;
- `directors` — из `credits.crew`, где `job == "Director"`;
- `trailer` — ключ YouTube из `append_to_response=videos` (`site == "YouTube"`, `type == "Trailer"`).

И для сериалов в `GET /api/tv/{id}` — добавить `profile` в `cast`, как уже сделано у фильмов.
