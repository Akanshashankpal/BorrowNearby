import { useState } from "react";
import { BorrowRequestCard } from "@/components/items/BorrowRequestCard";
import { PageMeta } from "@/components/layout/PageMeta";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { getMyRequests, setRequestStatus } from "@/services/api/borrow";
import { getItem } from "@/services/api/items";
import { getUser } from "@/services/api/users";
import { useAuth } from "@/store/AuthProvider";
import { useToast } from "@/store/ToastProvider";

export default function RequestsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"received" | "sent">(user?.role === "user" ? "sent" : "received");
  const { push } = useToast();
  const state = useAsync(async () => {
    const requests = await getMyRequests(tab);
    return Promise.all(requests.map(async (request) => ({
      request,
      item: await getItem(request.itemId).catch(() => undefined),
      person: await getUser(tab === "received" ? request.borrowerId : request.ownerId).catch(() => undefined),
    })));
  }, [tab]);

  return (
    <>
      <PageMeta title="Requests" description="Borrow requests you have received and sent." path="/dashboard/requests" />
      <h1 className="text-3xl font-semibold">Requests</h1>
      <div className="mt-4 flex gap-2" role="tablist">
        {(["received", "sent"] as const).map((entry) => (
          <button key={entry} type="button" role="tab" aria-selected={tab === entry} className={`h-10 rounded-full px-4 text-sm font-semibold capitalize ${tab === entry ? "bg-brand text-white" : "bg-surface"}`} onClick={() => setTab(entry)}>
            {entry}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3">
        {state.status === "loading" ? <SkeletonTable /> : null}
        {state.status === "error" ? <ErrorState body={state.error} onRetry={state.reload} /> : null}
        {state.status === "ready" && state.data?.length === 0 ? <EmptyState title="No requests in this list." body="New requests will show up here." /> : null}
        {state.data?.map((row) => (
          <BorrowRequestCard
            key={row.request.id}
            request={row.request}
            item={row.item}
            person={row.person}
            direction={tab}
            onAccept={() => void setRequestStatus(row.request.id, "accepted").then(() => { push({ title: "Request accepted.", tone: "success" }); state.reload(); })}
            onDecline={() => void setRequestStatus(row.request.id, "rejected").then(() => { push({ title: "Request declined.", tone: "info" }); state.reload(); })}
          />
        ))}
      </div>
    </>
  );
}
