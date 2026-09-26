import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageMeta } from "@/components/layout/PageMeta";
import { PageWrap } from "@/components/layout/PageWrap";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Textarea } from "@/components/ui/Textarea";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonDetails } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { getBorrowQuote, placeBorrowRequest } from "@/services/api/borrow";
import { getItem } from "@/services/api/items";
import { useToast } from "@/store/ToastProvider";
import type { BorrowQuote } from "@/types";
import { formatInr } from "@/utils/format";

const schema = z.object({
  startDate: z.string().min(1, "Choose a start date"),
  endDate: z.string().min(1, "Choose an end date"),
  message: z.string().min(8, "Add a short note for the owner"),
});

export default function BorrowRequestPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const itemState = useAsync(() => getItem(id), [id]);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { startDate: "2026-09-27", endDate: "2026-09-28", message: "" },
  });
  const [quote, setQuote] = useState<BorrowQuote | null>(null);
  const [quoteError, setQuoteError] = useState("");

  async function loadQuote() {
    const valid = await form.trigger(["startDate", "endDate"]);
    if (!valid) return;
    const values = form.getValues();
    try {
      setQuote(await getBorrowQuote(id, values.startDate, values.endDate));
      setQuoteError("");
    } catch (error) {
      setQuote(null);
      setQuoteError(error instanceof Error ? error.message : "Could not prepare a quote.");
    }
  }

  if (itemState.status === "loading") return <PageWrap className="py-8"><SkeletonDetails /></PageWrap>;
  if (itemState.status === "error" || !itemState.data) return <PageWrap className="py-8"><ErrorState body={itemState.error} onRetry={itemState.reload} /></PageWrap>;
  const item = itemState.data;

  return (
    <>
      <PageMeta title={`Request ${item.name}`} description={`Send a borrow request for ${item.name}.`} path={`/item/${item.id}/request`} />
      <PageWrap className="grid max-w-3xl gap-6 py-8">
        <h1 className="text-3xl font-semibold">Request to borrow</h1>
        <p className="text-muted">{item.name} · {item.owner.name}</p>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit(async (values) => {
            const request = await placeBorrowRequest({ itemId: item.id, ...values });
            push({ title: "Borrow request sent.", tone: "success" });
            navigate(`/requests/${request.id}`);
          })}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <DatePicker label="Start" {...form.register("startDate")} error={form.formState.errors.startDate?.message} />
            <DatePicker label="End" {...form.register("endDate")} error={form.formState.errors.endDate?.message} />
          </div>
          <Button type="button" variant="secondary" onClick={() => void loadQuote()}>Update quote</Button>
          {quoteError ? <p role="alert" className="text-sm text-danger">{quoteError}</p> : null}
          {quote ? (
            <dl className="grid gap-2 rounded-3xl bg-brand-soft p-4 text-sm">
              <Row label="Duration" value={`${quote.days} day${quote.days === 1 ? "" : "s"}`} />
              <Row label="Rental" value={formatInr(quote.rental)} />
              <Row label="Service fee" value={formatInr(quote.serviceFee)} />
              <Row label="Security deposit" value={formatInr(quote.deposit)} />
              <Row label="Total from quote" value={formatInr(quote.total)} />
            </dl>
          ) : <p className="text-sm text-muted">The total appears only after the quote service responds.</p>}
          <Textarea label="Message" {...form.register("message")} error={form.formState.errors.message?.message} />
          <Button type="submit" loading={form.formState.isSubmitting} disabled={!quote}>Send borrow request</Button>
        </form>
      </PageWrap>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4"><dt>{label}</dt><dd className="font-semibold">{value}</dd></div>;
}
