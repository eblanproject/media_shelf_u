type SkeletonProps = {
  className?: string;
};

/** Серый пульсирующий блок-заглушка. Размер и форму задаёт className. */
export default function Skeleton({ className = "" }: SkeletonProps) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-gray-800 ${className}`} />;
}
