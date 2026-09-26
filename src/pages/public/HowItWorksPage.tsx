import { PageMeta } from "@/components/layout/PageMeta";
import { PageWrap } from "@/components/layout/PageWrap";
import { Button } from "@/components/ui/Button";
import { howSteps } from "@/constants/content";

export default function HowItWorksPage() {
  return (
    <>
      <PageMeta title="How it works" description="Search, request, borrow, and return. The same Rentoori account works for borrowing and lending." path="/how-it-works" />
      <PageWrap className="py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">Borrow • Rent • Share</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">One place for people who need something and people who already have it.</h1>
        <ol className="mt-10 grid gap-4 md:grid-cols-2">
          {howSteps.map((step) => (
            <li key={step.step} className="rounded-3xl border border-line bg-surface p-6">
              <p className="text-sm font-semibold text-sand">{step.step}</p>
              <h2 className="mt-2 text-2xl font-semibold">{step.title}</h2>
              <p className="mt-2 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl bg-brand-soft p-6">
            <h2 className="text-xl font-semibold">If you need something</h2>
            <p className="mt-2 text-sm text-muted">Search, send a request, and wait for the owner to accept before you treat the item as yours.</p>
          </article>
          <article className="rounded-3xl bg-sand-soft p-6">
            <h2 className="text-xl font-semibold">If you already own it</h2>
            <p className="mt-2 text-sm text-muted">List it, choose free or paid, and accept the requests that fit your week.</p>
          </article>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/discover">Find something</Button>
          <Button href="/list-item" variant="secondary">List your item</Button>
        </div>
      </PageWrap>
    </>
  );
}
