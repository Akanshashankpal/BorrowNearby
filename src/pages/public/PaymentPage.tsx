import { useState } from "react";
import { useParams } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import { PageWrap } from "@/components/layout/PageWrap";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonDetails } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { getPaymentIntent, submitPayment } from "@/services/api/payments";
import { formatInr } from "@/utils/format";

export default function PaymentPage() {
  const { id = "" } = useParams();
  const [method, setMethod] = useState<"upi" | "card">("upi");
  const [message, setMessage] = useState("");
  const state = useAsync(() => getPaymentIntent(id), [id]);

  if (state.status === "loading") return <PageWrap className="py-8"><SkeletonDetails /></PageWrap>;
  if (state.status === "error" || !state.data) return <PageWrap className="py-8"><ErrorState body={state.error} onRetry={state.reload} /></PageWrap>;
  const intent = state.data;

  return (
    <>
      <PageMeta title="Payment" description="Review a Rentoori payment quote. Card details are not collected in the browser." path={`/payment/${id}`} />
      <PageWrap className="max-w-xl py-8">
        <h1 className="text-3xl font-semibold">Pay securely</h1>
        <p className="mt-2 text-sm text-muted">The breakdown comes from the payment intent. This page does not calculate the total itself, and it does not store card or UPI secrets.</p>
        <dl className="mt-6 grid gap-2 rounded-3xl bg-brand-soft p-4">
          <Line label="Rental" value={formatInr(intent.rental)} />
          <Line label="Service fee" value={formatInr(intent.serviceFee)} />
          <Line label="Deposit" value={formatInr(intent.deposit)} />
          <Line label="Total" value={formatInr(intent.total)} />
          <Line label="Status" value={intent.status.replaceAll("_", " ")} />
        </dl>
        <fieldset className="mt-4 grid gap-2">
          <legend className="text-sm font-semibold">Payment method</legend>
          <label className="text-sm"><input type="radio" name="method" checked={method === "upi"} onChange={() => setMethod("upi")} /> UPI — confirmed with the provider</label>
          <label className="text-sm"><input type="radio" name="method" checked={method === "card"} onChange={() => setMethod("card")} /> Card — confirmed with the provider</label>
        </fieldset>
        <Button className="mt-4" disabled={intent.status === "confirmed"} onClick={() => void submitPayment(id, method).then((next) => {
          setMessage(next.status === "confirmed" ? "Payment confirmed by the service." : "The service did not confirm this payment.");
          state.reload();
        })}>
          {intent.status === "confirmed" ? "Already confirmed" : "Pay securely"}
        </Button>
        {message ? <p className="mt-3 text-sm font-semibold" role="status">{message}</p> : null}
      </PageWrap>
    </>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-sm"><dt>{label}</dt><dd className="font-semibold capitalize">{value}</dd></div>;
}
