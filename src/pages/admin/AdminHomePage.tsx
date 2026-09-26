import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonDashboard } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { getAdminOverview } from "@/services/api/admin";
import { useAuth } from "@/store/AuthProvider";

export default function AdminHomePage() {
  const { user } = useAuth();
  const state = useAsync(() => getAdminOverview(), [user?.id]);
  return (
    <>
      <PageMeta title="Admin" description="Review people, listings, and requests on Rentoori." path="/admin" />
      <p className="text-sm font-semibold text-brand">Admin account</p>
      <h1 className="mt-1 text-3xl font-semibold">Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}</h1>
      <p className="mt-1 text-sm text-muted">See who is on Rentoori, what is listed, and which requests are still open.</p>
      {state.status === "loading" ? <div className="mt-6"><SkeletonDashboard /></div> : null}
      {state.status === "error" ? <div className="mt-6"><ErrorState body={state.error} onRetry={state.reload} /></div> : null}
      {state.data ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Tile label="People" value={String(state.data.people)} href="/admin/users" />
          <Tile label="Listings" value={String(state.data.listings)} href="/admin/listings" />
          <Tile label="Open requests" value={String(state.data.openRequests)} href="/admin/requests" />
          <Tile label="Needs" value={String(state.data.needs)} href="/admin/needs" />
          <Tile label="Disputes" value={String(state.data.disputes)} href="/admin/requests" />
        </div>
      ) : null}
    </>
  );
}

function Tile({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <Link to={href} className="rounded-3xl border border-line bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </Link>
  );
}
