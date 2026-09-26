import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { getAdminNeeds } from "@/services/api/admin";

export default function AdminNeedsPage() {
  const state = useAsync(() => getAdminNeeds(), []);
  return (
    <>
      <PageMeta title="Needs" description="Community needs posted on Rentoori." path="/admin/needs" />
      <h1 className="text-3xl font-semibold">Needs</h1>
      <p className="mt-1 text-sm text-muted">Requests from people who are looking for something nearby.</p>
      {state.status === "loading" ? <div className="mt-4"><SkeletonTable /></div> : null}
      {state.status === "error" ? <div className="mt-4"><ErrorState body={state.error} onRetry={state.reload} /></div> : null}
      {state.data ? (
        <ul className="mt-4 grid gap-2">
          {state.data.map((need) => (
            <li key={need.id}>
              <Link to="/needs" className="block rounded-3xl border border-line bg-surface px-4 py-3">
                <span className="font-semibold">{need.title}</span>
                <span className="mt-1 block text-sm text-muted">{need.author} · {need.area}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}