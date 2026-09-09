export type Genre =
  | "Action"
  | "Comedy"
  | "Documentary"
  | "Drama"
  | "Fantasy"
  | "Horror"
  | "Romance"
  | "Sci-Fi"
  | "Thriller";

export type Movie = {
  id: string;
  title: string;
  overview: string;
  releaseYear: number;
  runtimeMinutes?: number;
  rating?: number;
  posterUrl?: string;
  backdropUrl?: string;
  genres: Genre[];
};
