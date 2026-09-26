import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonDashboard } from "@/components/ui/Skeleton";
import { TrustScore } from "@/components/ui/TrustScore";
import { useAsync } from "@/hooks/useAsync";
import { getDashboard } from "@/services/api/users";
import { useAuth } from "@/store/AuthProvider";
import { useWishlist } from "@/store/WishlistProvider";
import { formatWhen } from "@/utils/format";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const wishlist = useWishlist();
  const state = useAsync(() => getDashboard(), [user?.id]);
  return (
    <>
      <PageMeta title="Your dashboard" description="Your Rentoori borrowings, saved items, and requests." path="/dashboard" />
      <p className="text-sm font-semibold text-brand">User account</p>
      <h1 className="mt-1 text-3xl font-semibold">Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}</h1>
      <p className="mt-1 text-sm text-muted">Browse the site, send borrow requests, and track what you have out.</p>
      {state.status === "loading" ? <div className="mt-6"><SkeletonDashboard /></div> : null}
      {state.status === "error" ? <div className="mt-6"><ErrorState body={state.error} onRetry={state.reload} /></div> : null}
      {state.data ? (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Tile label="Active borrowings" value={String(state.data.activeBorrowings)} href="/dashboard/borrowings" />
            <Tile label="Requests waiting" value={String(state.data.sentPending)} href="/dashboard/requests" />
            <Tile label="Saved items" value={String(wishlist.entries.length)} href="/dashboard/wishlist" />
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
