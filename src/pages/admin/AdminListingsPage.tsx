import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAsync } from "@/hooks/useAsync";
import { getAdminListings, moderateListing } from "@/services/api/admin";
import { useToast } from "@/store/ToastProvider";

export default function AdminListingsPage() {
  const { push } = useToast();
  const state = useAsync(() => getAdminListings(), []);
  return (
    <>
      <PageMeta title="Listings" description="Pause or restore listings on Rentoori." path="/admin/listings" />
      <h1 className="text-3xl font-semibold">Listings</h1>
      <p className="mt-1 text-sm text-muted">Pause a listing to hide it from new requests, or restore it when it can be shared again.</p>
      {state.status === "loading" ? <div className="mt-4"><SkeletonTable /></div> : null}
      {state.status === "error" ? <div className="mt-4"><ErrorState body={state.error} onRetry={state.reload} /></div> : null}
      {state.data ? (
        <div className="mt-4 overflow-x-auto rounded-3xl border border-line">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-brand-soft text-ink">
              <tr>
                <th className="px-4 py-3 font-semibold">Item</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Area</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {state.data.map((item) => (
                <tr key={item.id} className="border-t border-line">
                  <td className="px-4 py-3 font-semibold"><Link to={`/item/${item.id}`} className="hover:text-brand">{item.name}</Link></td>
                  <td className="px-4 py-3">{item.ownerName}</td>
                  <td className="px-4 py-3">{item.areaLabel}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3">
                    {item.status === "paused" ? (
                      <Button size="sm" variant="secondary" onClick={() => void moderateListing(item.id, "available").then(() => { push({ title: "Listing restored.", tone: "success" }); state.reload(); })}>Restore</Button>
                    ) : (
                      <Button size="sm" variant="secondary" onClick={() => void moderateListing(item.id, "paused").then(() => { push({ title: "Listing paused.", tone: "info" }); state.reload(); })}>Pause</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}
