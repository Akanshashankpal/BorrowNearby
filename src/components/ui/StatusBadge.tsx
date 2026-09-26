import type { ListingStatus, RequestStatus } from "@/types";
import { statusLabel } from "@/utils/format";

const tones: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  pending: "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  accepted: "bg-brand-soft text-brand",
  active: "bg-brand-soft text-brand",
  reserved: "bg-sand-soft text-ink",
  borrowed: "bg-sand-soft text-ink",
  return_pending: "bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  completed: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  rejected: "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200",
  cancelled: "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200",
  disputed: "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200",
  paused: "bg-line text-ink",
  draft: "bg-line text-ink",
};

export function StatusBadge({ status }: { status: RequestStatus | ListingStatus | "free" }) {
  const label = status === "free" ? "Free" : statusLabel(status);
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tones[status] ?? "bg-brand-soft text-brand"}`}>
      {label}
    </span>
  );
}
