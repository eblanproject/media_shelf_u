import Skeleton from "@/components/ui/Skeleton";
import MovieCardSkeleton from "@/components/movies/MovieCardSkeleton";

/** Заглушка всей страницы профиля — повторяет разметку ProfileView */
export default function ProfileInfoSkeleton() {
  return (
    <div role="status" aria-label="Loading profile">
      <section className="flex min-h-[320px] w-full bg-linear-to-t from-black to-gray-900">
        <div className="mx-auto mt-auto flex w-full max-w-7xl flex-col gap-6 px-6 pb-8 sm:flex-row sm:items-end">
          <Skeleton className="h-24 w-24 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-56" />
            <Skeleton className="h-4 w-44" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-11 w-24 rounded-xl" />
            <Skeleton className="h-11 w-24 rounded-xl" />
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="mb-4 h-12 w-48" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
