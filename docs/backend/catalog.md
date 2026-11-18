# Каталог: подгрузка страниц и фильтр по жанрам — контракт API для бэкенда

Фронтенд (ветка `frontend`) уже готов и сам подхватит эти изменения:

- кнопка «Show more» на `/movies` запрашивает следующие страницы через `?page=`.
  Пока бэкенд игнорирует `page` и отдаёт первую страницу, фронт видит, что новых фильмов нет, и пишет «That's all for now»;
- полоса жанров на `/movies` появляется, как только начнёт отвечать `GET /api/genres/movie`.

Код фронта: `lib/api/movies.ts` (`moviesUrl`, `getMovieGenres`), `app/(site)/movies/page.tsx`, `components/movies/PaginatedMovieGrid.tsx`.

## 1. Параметр `page` в `GET /api/movies`

```
GET /api/movies?category=popular&count=20&page=2
```

- `page: int = Query(default=1, ge=1, le=500)` — передаётся в TMDB как есть: `tmdb_get(f"/movie/{category}", {"page": page})`.
- У TMDB на странице 20 фильмов, поэтому `count ≤ 20` можно оставить; фронт всегда просит `count=20`.
- Формат ответа не меняется (`[{ id, title, thumbnail }]`).
- Последняя страница — просто меньше 20 элементов или пустой массив `[]` (не 404).

## 2. Параметр `genre` в `GET /api/movies`

```
GET /api/movies?category=top_rated&genre=28&page=1
```

`genre` — id жанра TMDB (`int | None`). Если передан, вместо `/movie/{category}` использовать
`/discover/movie` с `with_genres=<genre>` и `page=<page>`, а категорию превратить в сортировку/фильтр:

| category      | параметры `/discover/movie`                                                                   |
| ------------- | --------------------------------------------------------------------------------------------- |
| `popular`     | `sort_by=popularity.desc`                                                                      |
| `top_rated`   | `sort_by=vote_average.desc`, `vote_count.gte=300` (иначе наверху фильмы с одной оценкой 10)    |
| `now_playing` | `sort_by=popularity.desc`, `primary_release_date.gte=<сегодня − 45 дней>`, `primary_release_date.lte=<сегодня>` |
| `upcoming`    | `sort_by=popularity.desc`, `primary_release_date.gte=<завтра>`                                 |

Ответ — тот же список `[{ id, title, thumbnail }]`.

## 3. Новый эндпоинт `GET /api/genres/movie` — публичный

TMDB: `/genre/movie/list`. Отдать массив как есть (TMDB возвращает `{ "genres": [...] }` — нужен только массив):

```json
[
  { "id": 28, "name": "Action" },
  { "id": 12, "name": "Adventure" },
  { "id": 16, "name": "Animation" }
]
```

Тип на фронте — `MediaGenre` в `types/media.ts`. Список меняется редко, его можно кешировать.
Прокси для `/api/genres/*` уже добавлен в `next.config.ts`.
