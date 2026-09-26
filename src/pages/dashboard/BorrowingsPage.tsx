import { useState } from "react";
import { BorrowRequestCard } from "@/components/items/BorrowRequestCard";
import { PageMeta } from "@/components/layout/PageMeta";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { getMyRequests } from "@/services/api/borrow";
import { getItem } from "@/services/api/items";
import { getUser } from "@/services/api/users";
import type { RequestStatus } from "@/types";

const tabs: { id: string; label: string; match: RequestStatus[] }[] = [
  { id: "upcoming", label: "Upcoming", match: ["pending", "accepted"] },
  { id: "active", label: "Active", match: ["active", "return_pending"] },
  { id: "completed", label: "Completed", match: ["completed"] },
  { id: "cancelled", label: "Cancelled", match: ["cancelled", "rejected"] },
];

export default function BorrowingsPage() {
  const [tab, setTab] = useState(tabs[0].id);
  const state = useAsync(async () => {
    const requests = await getMyRequests("sent");
    const detailed = await Promise.all(requests.map(async (request) => ({
      request,
      item: await getItem(request.itemId).catch(() => undefined),
      person: await getUser(request.ownerId).catch(() => undefined),
    })));
    return detailed;
  }, []);
  const current = tabs.find((entry) => entry.id === tab) ?? tabs[0];
  const rows = (state.data ?? []).filter((row) => current.match.includes(row.request.status));
  return (
    <>
      <PageMeta title="My borrowings" description="Upcoming, active, and completed borrows." path="/dashboard/borrowings" />
      <h1 className="text-3xl font-semibold">My borrowings</h1>
      <div className="mt-4 flex gap-2 overflow-x-auto" role="tablist">
        {tabs.map((entry) => (
          <button key={entry.id} type="button" role="tab" aria-selected={tab === entry.id} onClick={() => setTab(entry.id)} className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold ${tab === entry.id ? "bg-brand text-white" : "bg-surface"}`}>
            {entry.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3">
        {state.status === "loading" ? <SkeletonTable /> : null}
        {state.status === "error" ? <ErrorState body={state.error} onRetry={state.reload} /> : null}
        {state.status === "ready" && rows.length === 0 ? <EmptyState title="You haven't borrowed anything yet." body="Find something nearby and send a request." action={<Button href="/discover">Find something</Button>} /> : null}
        {rows.map((row) => (
          <BorrowRequestCard key={row.request.id} request={row.request} item={row.item} person={row.person} direction="sent" />
        ))}
      </div>
    </>
  );
}
