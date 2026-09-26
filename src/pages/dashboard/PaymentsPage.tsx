import { PageMeta } from "@/components/layout/PageMeta";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAsync } from "@/hooks/useAsync";
import { getTransactions } from "@/services/api/payments";
import { useAuth } from "@/store/AuthProvider";
import { formatInr, formatWhen } from "@/utils/format";

export default function PaymentsPage() {
  const { user } = useAuth();
  const title = user?.role === "seller" ? "Earnings" : "Payments";
  const state = useAsync(() => getTransactions(), []);
  return (
    <>
      <PageMeta title={title} description="Payment activity returned by the Rentoori payment service." path={user?.role === "seller" ? "/seller/payments" : "/dashboard/payments"} />
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted">Amounts below come from recorded transactions. Card details are never stored here.</p>
      {state.status === "loading" ? <div className="mt-4"><SkeletonTable /></div> : null}
      {state.status === "error" ? <div className="mt-4"><ErrorState body={state.error} onRetry={state.reload} /></div> : null}
      <ul className="mt-4 grid gap-2">
        {state.data?.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-3xl border border-line bg-surface px-4 py-3">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-xs text-muted">{item.kind} · {formatWhen(item.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatInr(item.amount)}</p>
              <StatusBadge status={item.status === "confirmed" ? "completed" : item.status === "held" ? "reserved" : "pending"} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
