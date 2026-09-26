import { cn } from "@/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-line/80", className)} />;
}

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="grid gap-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export function SkeletonDetails() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.8fr]">
      <Skeleton className="aspect-[4/3]" />
      <div className="grid content-start gap-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-10 w-56" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="grid gap-4">
      <div className="flex gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <Skeleton className="h-40" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="grid gap-2">
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-16" />
      ))}
    </div>
  );
}
