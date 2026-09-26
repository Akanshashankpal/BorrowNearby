import { PageMeta } from "@/components/layout/PageMeta";
import { PageWrap } from "@/components/layout/PageWrap";
import { Button } from "@/components/ui/Button";
import { safetyCards, trustFactors } from "@/constants/content";

export default function SafetyPage() {
  return (
    <>
      <PageMeta title="Safety" description="How Rentoori handles verification, requests, pickup points, reviews, and disputes." path="/safety" />
      <PageWrap className="py-12">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">Borrow with confidence.</h1>
        <p className="mt-3 max-w-2xl text-muted">Trust on Rentoori is a set of visible signals, not a promise that nothing can go wrong.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {safetyCards.map((card) => (
            <article key={card.title} className="rounded-3xl border border-line bg-surface p-5">
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{card.body}</p>
            </article>
          ))}
        </div>
        <section className="mt-10 rounded-[1.75rem] bg-brand-soft p-6">
          <h2 className="text-2xl font-semibold">Trust Score</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {trustFactors.map((factor) => (
              <li key={factor.key} className="rounded-2xl bg-surface px-4 py-3 text-sm font-semibold">{factor.label}</li>
            ))}
          </ul>
          <Button href="/dashboard/trust" className="mt-5" variant="secondary">See your trust profile</Button>
        </section>
      </PageWrap>
    </>
  );
}
