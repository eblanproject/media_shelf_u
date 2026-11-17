# Режиссёры, актёры и поиск по людям — контракт API для бэкенда

Фронтенд (ветка `frontend`) уже готов и ждёт эти изменения. Типы — в `types/media.ts`
(`CrewMember`, `PersonDetails`, `PersonCredit`, `SearchResult`).
Пока эндпоинта нет, на странице `/people/{id}` написано «Coming soon».

## 1. Режиссёр в `GET /api/movies/{id}`

`credits` уже запрашивается (`append_to_response=credits`), но `credits.crew` выбрасывается.
Добавить в ответ поле `directors` — все из `credits.crew`, у кого `job == "Director"`:

```json
"directors": [
  { "id": 7467, "name": "David Fincher", "profile": "https://image.tmdb.org/t/p/w500/....jpg" }
]
```

`profile` — как у `cast`: `TMDB_IMAGE_BASE + profile_path` или `null`.

(Для `GET /api/tv/{id}` заодно добавить `profile` в `cast`, как у фильмов.)

## 2. Новый эндпоинт `GET /api/people/{person_id}` — публичный

TMDB: `/person/{person_id}?append_to_response=combined_credits`.

```json
{
  "id": 287,
  "name": "Brad Pitt",
  "profile": "https://image.tmdb.org/t/p/w500/....jpg",
  "biography": "William Bradley Pitt is an American actor...",
  "birthday": "1963-12-18",
  "deathday": null,
  "place_of_birth": "Shawnee, Oklahoma, USA",
  "known_for_department": "Acting",
  "credits": {
    "cast": [
      {
        "id": 550, "type": "movie", "title": "Fight Club",
        "thumbnail": "https://image.tmdb.org/t/p/w500/....jpg",
        "year": 1999, "rating": 8.4, "character": "Tyler Durden"
      }
    ],
    "crew": [
      {
        "id": 12345, "type": "movie", "title": "...",
        "thumbnail": null, "year": 2012, "rating": 7.1, "job": "Producer"
      }
    ]
  }
}
```

Откуда брать поля:

| поле                    | TMDB                                                                 |
|-------------------------|----------------------------------------------------------------------|
| `profile`               | `TMDB_IMAGE_BASE + profile_path` или `null`                          |
| `biography`, `birthday`, `deathday`, `place_of_birth`, `known_for_department` | как есть; пустую строку → `null` |
| `credits.cast[]`        | `combined_credits.cast`                                              |
| `credits.crew[]`        | `combined_credits.crew` (режиссёр — `job == "Director"`)             |
| `type`                  | `media_type` (`"movie"` / `"tv"`)                                    |
| `title`                 | `title` у фильмов, `name` у сериалов                                 |
| `thumbnail`             | `TMDB_IMAGE_BASE + poster_path` или `null`                           |
| `year`                  | первые 4 символа `release_date` / `first_air_date` как int, иначе `null` |
| `rating`                | `vote_average` (0 → `null`)                                          |

Фронтенд сам сортирует и группирует (роли / режиссура / остальное), так что порядок не важен.
Если человек не найден в TMDB — `404` (фронтенд покажет заглушку). Ошибка TMDB — `502`, как у фильмов.

## 3. Люди в `GET /api/search`

Сейчас `search_media` пропускает всё, кроме `movie` и `tv`. Нужно оставлять и `person`:

```json
{
  "id": 287,
  "title": "Brad Pitt",
  "thumbnail": "https://image.tmdb.org/t/p/w500/....jpg",
  "type": "person",
  "known_for_department": "Acting"
}
```

- `title` ← `name`, `thumbnail` ← `profile_path` (у людей нет `poster_path`).
- `known_for_department` — только у людей.

Фронтенд показывает людей отдельным блоком «People» на `/search` и в выпадающем поиске.
