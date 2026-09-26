import { Link } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import { PageWrap } from "@/components/layout/PageWrap";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { categoryBySlug, userById } from "@/services/mock/db";
import { getNeeds } from "@/services/api/needs";
import { formatDate, formatInr } from "@/utils/format";

export default function NeedsPage() {
  const state = useAsync(() => getNeeds(), []);
  return (
    <>
      <PageMeta title="Needs nearby" description="See what people nearby are looking to borrow." path="/needs" />
      <PageWrap className="py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-4xl font-semibold">Needs nearby</h1>
            <p className="mt-2 text-muted">Owners can offer something they already have.</p>
          </div>
          <Button href="/needs/create">Post a need</Button>
        </div>
        <div className="mt-6 grid gap-3">
          {state.status === "loading" ? <SkeletonTable /> : null}
          {state.status === "error" ? <ErrorState body={state.error} onRetry={state.reload} /> : null}
          {state.data?.map((need) => (
            <article key={need.id} className="rounded-3xl border border-line bg-surface p-4">
              <h2 className="text-xl font-semibold">{need.title}</h2>
              <p className="mt-1 text-sm text-muted">{need.description}</p>
              <p className="mt-2 text-sm">{formatDate(need.date)} · {need.duration} · {need.distanceKm} km · {need.area}</p>
              <p className="text-sm font-semibold">{need.budget ? `Budget ${formatInr(need.budget)}` : "Free preferred"} · {categoryBySlug(need.categorySlug)?.name}</p>
              <p className="text-xs text-muted">Posted by {userById(need.userId)?.name ?? "A neighbour"}</p>
              <Link to={`/list-item`} className="mt-3 inline-flex text-sm font-semibold text-brand">I can help</Link>
            </article>
          ))}
        </div>
      </PageWrap>
    </>
  );
}
