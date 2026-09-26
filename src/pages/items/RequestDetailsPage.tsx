import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import { PageWrap } from "@/components/layout/PageWrap";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Textarea } from "@/components/ui/Textarea";
import { SkeletonDetails } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { getRequest, saveConditionReport, setRequestStatus } from "@/services/api/borrow";
import { getItem } from "@/services/api/items";
import { useAuth } from "@/store/AuthProvider";
import { useToast } from "@/store/ToastProvider";
import { homeFor } from "@/utils/roles";
import { formatDate, formatInr } from "@/utils/format";
import { reviewTagOptions } from "@/constants/content";
import { createReview } from "@/services/api/reviews";
import type { ReviewTag } from "@/types";

export default function RequestDetailsPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const { push } = useToast();
  const state = useAsync(async () => {
    const request = await getRequest(id);
    const item = await getItem(request.itemId);
    return { request, item };
  }, [id]);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState<ReviewTag[]>([]);

  if (state.status === "loading") return <PageWrap className="py-8"><SkeletonDetails /></PageWrap>;
  if (state.status === "error" || !state.data) return <PageWrap className="py-8"><ErrorState body={state.error} onRetry={state.reload} /></PageWrap>;
  const { request, item } = state.data;

  return (
    <>
      <PageMeta title={`Request · ${item.name}`} description="Borrow request status and timeline." path={`/requests/${request.id}`} />
      <PageWrap className="max-w-3xl py-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold">{item.name}</h1>
          <StatusBadge status={request.status} />
        </div>
        <p className="mt-2 text-sm text-muted">{formatDate(request.startDate)} – {formatDate(request.endDate)} · Quoted total {formatInr(request.total)}</p>
        <p className="mt-2 text-sm">This total was returned with the request. It is not recalculated on this page.</p>
        <ol className="mt-6 grid gap-3">
          {request.timeline.map((step) => (
            <li key={step.key} className="flex items-center gap-3 text-sm">
              <span className={`h-3 w-3 rounded-full ${step.done ? "bg-brand" : "bg-line"}`} aria-hidden />
              <span className="font-semibold">{step.label}</span>
              <span className="text-muted">{step.done ? "Done" : "Waiting"}{step.current ? " · current" : ""}</span>
            </li>
          ))}
        </ol>
        {request.conditionReport ? (
          <section className="mt-6 rounded-3xl bg-sand-soft p-4">
            <h2 className="font-semibold">Condition report</h2>
            <p className="mt-2 text-sm">Pickup: {request.conditionReport.pickupNotes}</p>
            {request.conditionReport.returnNotes ? <p className="text-sm">Return: {request.conditionReport.returnNotes}</p> : null}
          </section>
        ) : null}
        {request.status === "active" || request.status === "return_pending" ? (
          <form className="mt-6 grid gap-3" onSubmit={async (event) => {
            event.preventDefault();
            await saveConditionReport(request.id, {
              pickupNotes: request.conditionReport?.pickupNotes ?? "Recorded at pickup.",
              returnNotes: notes,
              pickupPhotos: request.conditionReport?.pickupPhotos ?? [],
              returnPhotos: [],
            });
            await setRequestStatus(request.id, "completed");
            push({ title: "Return recorded.", tone: "success" });
            state.reload();
          }}>
            <Textarea label="Return condition" value={notes} onChange={(event) => setNotes(event.target.value)} />
            <Button type="submit">Mark returned</Button>
          </form>
        ) : null}
        {request.status === "completed" ? (
          <form className="mt-6 grid gap-3" onSubmit={async (event) => {
            event.preventDefault();
            await createReview({ itemId: item.id, requestId: request.id, rating, comment, tags });
            push({ title: "Review saved.", tone: "success" });
          }}>
            <label className="text-sm font-semibold">Rating
              <input className="mt-1 block" type="number" min={1} max={5} value={rating} onChange={(event) => setRating(Number(event.target.value))} />
            </label>
            <Textarea label="Comment" value={comment} onChange={(event) => setComment(event.target.value)} />
            <div className="flex flex-wrap gap-2">
              {reviewTagOptions.map((tag) => (
                <label key={tag.id} className="rounded-full bg-brand-soft px-3 py-2 text-sm">
                  <input type="checkbox" className="mr-2" checked={tags.includes(tag.id)} onChange={() => setTags((current) => current.includes(tag.id) ? current.filter((itemTag) => itemTag !== tag.id) : [...current, tag.id])} />
                  {tag.label}
                </label>
              ))}
            </div>
            <Button type="submit">Leave review</Button>
          </form>
        ) : null}
        {user?.role === "user" && request.total > 0 && request.status !== "cancelled" && request.status !== "rejected" ? (
          <Button href={`/payment/${request.id}`} className="mt-6">Review payment</Button>
        ) : null}
        <p className="mt-4 text-sm"><Link to={user?.role === "admin" ? "/admin/requests" : `${homeFor(user?.role)}/requests`} className="font-semibold text-brand">All requests</Link></p>
      </PageWrap>
    </>
  );
}
