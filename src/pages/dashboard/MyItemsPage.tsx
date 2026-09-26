import { useState } from "react";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Modal } from "@/components/ui/Modal";
import { Photo } from "@/components/ui/Photo";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { deleteListing, getItems, updateListing } from "@/services/api/items";
import { useAuth } from "@/store/AuthProvider";
import { useToast } from "@/store/ToastProvider";
import type { ListingStatus } from "@/types";

const groups: ListingStatus[] = ["available", "reserved", "borrowed", "paused", "draft"];

export default function MyItemsPage() {
  const { user } = useAuth();
  const { push } = useToast();
  const [removeId, setRemoveId] = useState<string | null>(null);
  const state = useAsync(() => getItems({ ownerId: user?.id, status: "any", pageSize: 40 }), [user?.id]);
  return (
    <>
      <PageMeta title="My items" description="Manage the things you share on Rentoori." path="/dashboard/items" />
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">My items</h1>
        <Button href="/list-item" size="sm">List an item</Button>
      </div>
      {state.status === "loading" ? <div className="mt-4"><SkeletonTable /></div> : null}
      {state.status === "error" ? <div className="mt-4"><ErrorState body={state.error} onRetry={state.reload} /></div> : null}
      {state.status === "ready" && state.data?.items.length === 0 ? <div className="mt-4"><EmptyState title="No listings yet." body="Share something that is sitting unused." action={<Button href="/list-item">List your item</Button>} /></div> : null}
      <div className="mt-4 grid gap-6">
        {groups.map((status) => {
          const rows = state.data?.items.filter((item) => item.status === status) ?? [];
          if (!rows.length) return null;
          return (
            <section key={status}>
              <h2 className="mb-3 text-lg font-semibold capitalize">{status}</h2>
              <div className="grid gap-3">
                {rows.map((item) => (
                  <article key={item.id} className="grid gap-3 rounded-3xl border border-line bg-surface p-3 sm:grid-cols-[96px_1fr_auto] sm:items-center">
                    <Photo src={item.images[0]} alt="" className="h-24 w-full rounded-2xl object-cover sm:w-24" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <StatusBadge status={item.status} />
                      </div>
                      <PriceDisplay priceType={item.priceType} pricePerDay={item.pricePerDay} />
                      <p className="text-xs text-muted">{item.views} views · {item.requestCount} requests</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button href={`/item/${item.id}`} size="sm" variant="secondary">View</Button>
                      <Button href={`/list-item?edit=${item.id}`} size="sm" variant="ghost">Edit</Button>
                      <Button size="sm" variant="secondary" onClick={() => void updateListing(item.id, { status: item.status === "paused" ? "available" : "paused" }).then(() => { push({ title: item.status === "paused" ? "Listing resumed." : "Listing paused.", tone: "success" }); state.reload(); })}>
                        {item.status === "paused" ? "Resume" : "Pause"}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setRemoveId(item.id)}>Delete</Button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <Modal open={Boolean(removeId)} title="Delete listing" onClose={() => setRemoveId(null)}>
        <p className="text-sm text-muted">This removes the listing from the preview catalog.</p>
        <div className="mt-4 flex gap-2">
          <Button variant="danger" onClick={() => {
            if (!removeId) return;
            void deleteListing(removeId).then(() => {
              push({ title: "Listing deleted.", tone: "success" });
              setRemoveId(null);
              state.reload();
            });
          }}>Delete</Button>
          <Button variant="secondary" onClick={() => setRemoveId(null)}>Cancel</Button>
        </div>
      </Modal>
    </>
  );
}
