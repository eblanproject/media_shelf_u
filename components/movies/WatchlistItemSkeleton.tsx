import Skeleton from "@/components/ui/Skeleton";

/** Заглушка строки в списке избранного */
export default function WatchlistItemSkeleton() {
  return (
    <div className="flex w-full items-center gap-4" aria-hidden="true">
      <Skeleton className="h-30 w-20 shrink-0 rounded-xl" />
      <div className="flex flex-1 flex-col gap-3">
        <Skeleton className="h-6 w-1/2 max-w-xs" />
        <Skeleton className="h-4 w-1/3 max-w-[12rem]" />
      </div>
      <Skeleton className="h-6 w-8" />
      <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
    </div>
  );
}

/** Рамка списка избранного с несколькими заглушками */
export function WatchlistSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      className="mt-6 flex w-full flex-col gap-4 rounded-lg border border-gray-700 bg-gray-900 p-6"
      role="status"
      aria-label="Loading watchlist"
    >
      {Array.from({ length: count }, (_, i) => (
        <WatchlistItemSkeleton key={i} />
      ))}
    </div>
  );
}
