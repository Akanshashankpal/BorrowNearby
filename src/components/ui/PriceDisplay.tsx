import { formatInr } from "@/utils/format";

export function PriceDisplay({ priceType, pricePerDay }: { priceType: "free" | "paid"; pricePerDay: number }) {
  if (priceType === "free" || pricePerDay === 0) {
    return <span className="text-base font-semibold text-success">Free</span>;
  }
  return (
    <span className="text-base font-semibold text-ink">
      {formatInr(pricePerDay)}
      <span className="text-sm font-medium text-muted">/day</span>
    </span>
  );
}
