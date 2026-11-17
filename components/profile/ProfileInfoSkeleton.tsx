import Skeleton from "@/components/ui/Skeleton";

/** Заглушка шапки профиля — повторяет разметку ProfileInfo */
export default function ProfileInfoSkeleton() {
  return (
    <section role="status" aria-label="Loading profile">
      <div className="mx-auto flex min-h-[32dvh] w-full items-end bg-gray-900 lg:max-w-[80vw]">
        <div className="flex h-30 w-full flex-row bg-black/60">
          <div className="flex flex-3 flex-row items-center">
            <Skeleton className="ml-10 h-15 w-15 shrink-0 rounded-full" />
            <div className="ml-3 flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-44" />
            </div>
          </div>

          <div className="flex w-full items-center justify-end gap-4 pr-4">
            <Skeleton className="h-10 w-24 rounded" />
            <Skeleton className="h-10 w-24 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}
