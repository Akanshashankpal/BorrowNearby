import { Link } from "react-router-dom";
import type { AppNotification } from "@/types";
import { formatWhen } from "@/utils/format";

export function NotificationCard({ item, onOpen }: { item: AppNotification; onOpen: () => void }) {
  return (
    <Link
      to={item.href}
      onClick={onOpen}
      className={`block rounded-3xl border px-4 py-3 ${item.read ? "border-line bg-surface" : "border-brand/30 bg-brand-soft"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold">{item.title}</p>
        {!item.read ? <span className="rounded-full bg-sand px-2 py-0.5 text-[11px] font-semibold">Unread</span> : null}
      </div>
      <p className="mt-1 text-sm text-muted">{item.body}</p>
      <p className="mt-2 text-xs uppercase tracking-wide text-muted">
        {item.type} · {formatWhen(item.createdAt)}
      </p>
    </Link>
  );
}
