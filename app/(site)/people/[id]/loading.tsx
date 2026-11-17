import Skeleton from "@/components/ui/Skeleton";
import MovieCardSkeleton from "@/components/movies/MovieCardSkeleton";

export default function Loading() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10" role="status" aria-label="Loading">
      <article className="flex flex-col gap-8 md:flex-row">
        <Skeleton className="aspect-[2/3] w-full max-w-xs shrink-0" />
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-10 w-72" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
          <div className="flex max-w-3xl flex-col gap-2">
            <Skeleton className="mb-2 h-6 w-28" />
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className={`h-4 ${i === 5 ? "w-1/2" : "w-full"}`} />
            ))}
          </div>
        </div>
      </article>

      <section className="mt-12">
        <Skeleton className="mb-4 h-7 w-32" />
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </section>
  );
}
