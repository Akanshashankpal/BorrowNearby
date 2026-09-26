import { PageMeta } from "@/components/layout/PageMeta";
import { PageWrap } from "@/components/layout/PageWrap";
import { BrandMark } from "@/components/layout/BrandMark";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  return (
    <>
      <PageMeta title="Page not found" description="This Rentoori page is not available." path="/404" />
      <PageWrap className="grid justify-items-start gap-4 py-20">
        <BrandMark className="h-16 w-16" />
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight">Looks like this item wandered off.</h1>
        <p className="text-muted">The link may be old, or the listing is no longer public.</p>
        <div className="flex flex-wrap gap-3">
          <Button href="/">Back to Rentoori</Button>
          <Button href="/discover" variant="secondary">Browse items</Button>
        </div>
      </PageWrap>
    </>
  );
}
