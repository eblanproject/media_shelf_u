/** Комментарий — ответ бэкенда GET/POST /comments/ (контракт: docs/backend/comments.md) */
export type Comment = {
  id: number;
  tmdb_id: number;
  media_type: "movie" | "tv";
  text: string;
  created_at: string;
  user: {
    id: number;
    username: string;
  };
};
