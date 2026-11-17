import Skeleton from "@/components/ui/Skeleton";

/** Заглушка баннера «Popular now» на главной */
export default function TeaserMovieSkeleton() {
    return (
        <div className="relative flex min-h-[480px] w-screen bg-gray-900" role="status" aria-label="Loading featured movie">
            <Skeleton className="absolute top-7 right-7 hidden aspect-[2/3] w-48 rounded-xl lg:block xl:w-56" />

            <div className="flex w-full flex-col gap-5 p-7">
                <h6 className="text-xs font-bold text-yellow-200">Popular now</h6>
                <Skeleton className="mb-3 h-10 w-2/3 max-w-lg" />
                <Skeleton className="h-4 w-64" />
                <div className="flex max-w-xl flex-col gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="mt-10 flex gap-3">
                    <Skeleton className="h-13 w-32 rounded-xl" />
                    <Skeleton className="h-13 w-24 rounded-xl" />
                </div>
                <div className="mt-auto flex gap-2">
                    {Array.from({ length: 6 }, (_, i) => (
                        <Skeleton key={i} className="h-8 w-16" />
                    ))}
                </div>
            </div>
        </div>
    );
}
