import { PageMeta } from "@/components/layout/PageMeta";
import { PageWrap } from "@/components/layout/PageWrap";
import { helpTopics } from "@/constants/content";

export default function HelpPage() {
  return (
    <>
      <PageMeta title="Help Center" description="Answers about borrowing, lending, trust, and returns on Rentoori." path="/help" />
      <PageWrap className="py-12">
        <h1 className="text-4xl font-semibold tracking-tight">Help Center</h1>
        <div className="mt-8 grid gap-3">
          {helpTopics.map((topic) => (
            <details key={topic.title} className="rounded-3xl border border-line bg-surface px-5 py-4">
              <summary className="cursor-pointer font-semibold">{topic.title}</summary>
              <p className="mt-2 text-sm text-muted">{topic.body}</p>
            </details>
          ))}
        </div>
      </PageWrap>
    </>
  );
}
