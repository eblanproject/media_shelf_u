import ProfileInfoSkeleton from "@/components/profile/ProfileInfoSkeleton";
import { WatchlistSkeleton } from "@/components/movies/WatchlistItemSkeleton";

export default function Loading() {
  return (
    <>
      <ProfileInfoSkeleton />
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <h1 className="text-center text-3xl font-bold">Watchlist</h1>
        <WatchlistSkeleton />
      </div>
    </>
  );
}
