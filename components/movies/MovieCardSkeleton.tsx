import Skeleton from "@/components/ui/Skeleton";

/** Заглушка карточки фильма — те же размеры, что у MovieCard */
export default function MovieCardSkeleton() {
  return (
    <div className="flex w-full max-w-[11rem] flex-col items-center gap-2">
      <Skeleton className="aspect-[2/3] w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
