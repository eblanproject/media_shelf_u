import type { Genre } from "@/types/movie";

type GenreBadgeProps = {
  genre: Genre;
};

export default function GenreBadge({ genre }: GenreBadgeProps) {
  return <span>{genre}</span>;
}
