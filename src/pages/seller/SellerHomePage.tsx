import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonDashboard } from "@/components/ui/Skeleton";
import { TrustScore } from "@/components/ui/TrustScore";
import { Button } from "@/components/ui/Button";
import { useAsync } from "@/hooks/useAsync";
import { getDashboard } from "@/services/api/users";
import { useAuth } from "@/store/AuthProvider";
import { formatInr, formatWhen } from "@/utils/format";

export default function SellerHomePage() {
  const { user } = useAuth();
  const state = useAsync(() => getDashboard(), [user?.id]);
  return (
    <>
      <PageMeta title="Seller dashboard" description="Manage your Rentoori listings, requests, and earnings." path="/seller" />
      <p className="text-sm font-semibold text-brand">Seller account</p>
      <h1 className="mt-1 text-3xl font-semibold">Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}</h1>
      <p className="mt-1 text-sm text-muted">Manage the things you share, the requests that come in, and what you have earned.</p>
      <div className="mt-4">
        <Button href="/list-item">List an item</Button>
      </div>
      {state.status === "loading" ? <div className="mt-6"><SkeletonDashboard /></div> : null}
      {state.status === "error" ? <div className="mt-6"><ErrorState body={state.error} onRetry={state.reload} /></div> : null}
      {state.data ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Tile label="Active listings" value={String(state.data.activeListings)} href="/seller/items" />
            <Tile label="Requests to answer" value={String(state.data.pendingRequests)} href="/seller/requests" />
            <Tile label="Confirmed earnings" value={formatInr(state.data.earnings)} href="/seller/payments" />
          </div>
          <div className="mt-6"><TrustScore score={state.data.trustScore} label={state.data.trustLabel} /></div>
          <h2 className="mt-8 text-xl font-semibold">Recent activity</h2>
          <ul className="mt-3 grid gap-2">
            {state.data.recent.map((item) => (
              <li key={item.id}>
                <Link to={item.href} className="block rounded-2xl border border-line bg-surface px-4 py-3">
                  <span className="font-semibold">{item.title}</span>
                  <span className="mt-1 block text-sm text-muted">{item.body} · {formatWhen(item.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
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
