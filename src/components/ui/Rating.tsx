import { Star } from "lucide-react";

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-ink">
      <Star size={14} className="fill-sand text-sand" aria-hidden />
      <span>{value.toFixed(1)}</span>
      {typeof count === "number" ? <span className="font-normal text-muted">({count})</span> : null}
      <span className="sr-only">out of 5</span>
    </span>
  );
}
