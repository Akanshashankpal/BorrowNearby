import { BadgeCheck } from "lucide-react";

export function VerificationBadge({ verified = true }: { verified?: boolean }) {
  if (!verified) return <span className="text-xs font-medium text-muted">Unverified</span>;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
      <BadgeCheck size={14} aria-hidden />
      Verified
    </span>
  );
}
