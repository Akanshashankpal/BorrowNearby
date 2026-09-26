import { PageMeta } from "@/components/layout/PageMeta";
import { TrustScore } from "@/components/ui/TrustScore";
import { trustFactors } from "@/constants/content";
import { useAuth } from "@/store/AuthProvider";

export default function TrustPage() {
  const { user } = useAuth();
  if (!user) return null;
  const factors = user.trust.factors;
  return (
    <>
      <PageMeta title="Trust and verification" description="Your Rentoori Trust Score and verification status." path="/dashboard/trust" />
      <h1 className="text-3xl font-semibold">Trust & verification</h1>
      <div className="mt-6"><TrustScore score={user.trust.score} label={user.trust.label} /></div>
      <ul className="mt-6 grid gap-3">
        {trustFactors.map((factor) => (
          <li key={factor.key} className="rounded-3xl border border-line bg-surface p-4">
            <div className="flex justify-between text-sm font-semibold">
              <span>{factor.label}</span>
              <span>{factors[factor.key]}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-line"><div className="h-full rounded-full bg-brand" style={{ width: `${factors[factor.key]}%` }} /></div>
          </li>
        ))}
      </ul>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <Info label="Phone" value={user.verification.phone ? user.phoneMasked : "Not verified"} />
        <Info label="Email" value={user.verification.email ? "Verified" : "Not verified"} />
        <Info label="Identity" value={user.verification.identity ? "Verified" : "Not verified"} />
        <Info label="Borrow history" value={`${user.successfulBorrows} completed`} />
        <Info label="Lending history" value={`${user.successfulLends} completed`} />
        <Info label="Reviews" value={`${user.reviewCount} received`} />
      </dl>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-3xl bg-brand-soft p-4"><dt className="text-xs text-muted">{label}</dt><dd className="font-semibold">{value}</dd></div>;
}
