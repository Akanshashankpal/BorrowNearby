import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAsync } from "@/hooks/useAsync";
import { getAdminRequests } from "@/services/api/admin";

export default function AdminRequestsPage() {
  const state = useAsync(() => getAdminRequests(), []);
  return (
    <>
      <PageMeta title="Requests" description="Borrow requests across Rentoori." path="/admin/requests" />
      <h1 className="text-3xl font-semibold">Requests</h1>
      <p className="mt-1 text-sm text-muted">Open a request to see its timeline. There are no open disputes in this preview.</p>
      {state.status === "loading" ? <div className="mt-4"><SkeletonTable /></div> : null}
      {state.status === "error" ? <div className="mt-4"><ErrorState body={state.error} onRetry={state.reload} /></div> : null}
      {state.data ? (
        <div className="mt-4 overflow-x-auto rounded-3xl border border-line">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-brand-soft text-ink">
              <tr>
                <th className="px-4 py-3 font-semibold">Item</th>
                <th className="px-4 py-3 font-semibold">Borrower</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {state.data.map((request) => (
                <tr key={request.id} className="border-t border-line">
                  <td className="px-4 py-3 font-semibold"><Link to={`/requests/${request.id}`} className="hover:text-brand">{request.itemName}</Link></td>
                  <td className="px-4 py-3">{request.borrower}</td>
                  <td className="px-4 py-3">{request.owner}</td>
                  <td className="px-4 py-3"><StatusBadge status={request.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}
