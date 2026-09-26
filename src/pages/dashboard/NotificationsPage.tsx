import { PageMeta } from "@/components/layout/PageMeta";
import { NotificationCard } from "@/components/dashboard/NotificationCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "@/services/api/notifications";

export default function NotificationsPage() {
  const state = useAsync(() => getNotifications(), []);
  const today = "2026-09-26";
  const groups = {
    Today: (state.data ?? []).filter((item) => item.createdAt.slice(0, 10) === today),
    Earlier: (state.data ?? []).filter((item) => item.createdAt.slice(0, 10) !== today),
  };
  return (
    <>
      <PageMeta title="Notifications" description="Requests, messages, and reminders." path="/dashboard/notifications" />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Notifications</h1>
        <Button size="sm" variant="secondary" onClick={() => void markAllNotificationsRead().then(() => state.reload())}>Mark all read</Button>
      </div>
      {state.status === "loading" ? <div className="mt-4"><SkeletonTable /></div> : null}
      {state.status === "error" ? <div className="mt-4"><ErrorState body={state.error} onRetry={state.reload} /></div> : null}
      {state.status === "ready" && state.data?.length === 0 ? <div className="mt-4"><EmptyState title="You're up to date." body="New requests and messages will land here." /></div> : null}
      {Object.entries(groups).map(([label, items]) => items.length ? (
        <section key={label} className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{label}</h2>
          <div className="grid gap-2">
            {items.map((item) => <NotificationCard key={item.id} item={item} onOpen={() => void markNotificationRead(item.id)} />)}
          </div>
        </section>
      ) : null)}
    </>
  );
}
