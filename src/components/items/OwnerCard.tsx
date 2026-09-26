import { Link } from "react-router-dom";
import type { PublicUser } from "@/types";
import { Photo } from "@/components/ui/Photo";
import { TrustScore } from "@/components/ui/TrustScore";
import { VerificationBadge } from "@/components/ui/VerificationBadge";

export function OwnerCard({ owner }: { owner: PublicUser }) {
  return (
    <Link to={`/user/${owner.id}`} className="flex items-center gap-3 rounded-3xl border border-line bg-surface p-4">
      <Photo src={owner.avatarUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{owner.name}</span>
        <span className="mt-1 flex flex-wrap items-center gap-2">
          <VerificationBadge verified={owner.verified} />
          <span className="text-xs text-muted">{owner.area}</span>
        </span>
      </span>
      <TrustScore score={owner.trustScore} label={owner.trustLabel} compact />
    </Link>
  );
}
