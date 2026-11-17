import Skeleton from "@/components/ui/Skeleton";
import MovieCardSkeleton from "@/components/movies/MovieCardSkeleton";

type MovieDetailsSkeletonProps = {
  /** Показывать ли блок «Similar movies» */
  withSimilar?: boolean;
};

/** Заглушка страницы фильма/сериала — повторяет разметку MovieDetails */
export default function MovieDetailsSkeleton({ withSimilar = true }: MovieDetailsSkeletonProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10" role="status" aria-label="Loading">
      <article className="flex flex-col gap-8 md:flex-row">
        <Skeleton className="aspect-[2/3] w-full max-w-xs shrink-0" />

        <div className="flex w-full flex-col gap-4">
          <Skeleton className="h-9 w-2/3 max-w-md" />

          <div className="flex gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-xl" />
            <Skeleton className="h-6 w-16 rounded-xl" />
            <Skeleton className="h-6 w-24 rounded-xl" />
          </div>

          <div className="flex max-w-2xl flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="h-12 w-28 rounded-xl" />

        </div>
      </article>

      <section className="mt-12">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 mb-4 h-7 w-20" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex w-28 shrink-0 flex-col gap-2">
              <Skeleton className="aspect-[2/3] w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
          ))}
        </div>
      </section>

      {withSimilar && (
        <section className="mt-12">
          <Skeleton className="h-7 w-40" />
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {Array.from({ length: 5 }, (_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
