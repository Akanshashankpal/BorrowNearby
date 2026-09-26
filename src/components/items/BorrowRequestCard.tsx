import { Link } from "react-router-dom";
import type { BorrowRequest, ItemWithOwner, User } from "@/types";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TrustScore } from "@/components/ui/TrustScore";
import { formatDate, formatInr } from "@/utils/format";

export function BorrowRequestCard({
  request,
  item,
  person,
  direction,
  onAccept,
  onDecline,
}: {
  request: BorrowRequest;
  item?: ItemWithOwner;
  person?: User;
  direction: "sent" | "received";
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  return (
    <article className="grid gap-4 rounded-3xl border border-line bg-surface p-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{item?.name ?? "Item"}</h3>
          <StatusBadge status={request.status} />
        </div>
        <p className="text-sm text-muted">
          {formatDate(request.startDate)} – {formatDate(request.endDate)} · {formatInr(request.total)} quoted
        </p>
        {person ? (
          <p className="text-sm">
            {direction === "received" ? "Borrower" : "Owner"}: <span className="font-semibold">{person.name}</span>
          </p>
        ) : null}
        {direction === "received" && person ? <TrustScore score={person.trust.score} label={person.trust.label} compact /> : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button href={`/requests/${request.id}`} variant="secondary" size="sm">
          View details
        </Button>
        {direction === "received" && request.status === "pending" ? (
          <>
            <Button size="sm" onClick={onAccept}>
              Accept
            </Button>
            <Button size="sm" variant="danger" onClick={onDecline}>
              Decline
            </Button>
            <Link to="/dashboard/messages" className="inline-flex h-10 items-center px-2 text-sm font-semibold text-brand">
              Message
            </Link>
          </>
        ) : null}
      </div>
    </article>
  );
}
