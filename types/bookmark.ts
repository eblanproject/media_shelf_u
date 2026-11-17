/** Закладка — ответ бэкенда GET/POST /bookmarks/ */
export type Bookmark = {
  id: number;
  tmdb_id: number;
  media_type: "movie" | "tv";
  created_at: string;
};
