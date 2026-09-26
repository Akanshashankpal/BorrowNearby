import { useParams } from "react-router-dom";
import { PageMeta } from "@/components/layout/PageMeta";
import { PageWrap } from "@/components/layout/PageWrap";
import { legalCopy } from "@/constants/content";
import { ErrorState } from "@/components/ui/ErrorState";

export default function LegalPage() {
  const { slug = "" } = useParams();
  const page = legalCopy[slug as keyof typeof legalCopy];
  if (!page) return <ErrorState title="That page is not available." body="Choose privacy, terms, or cookies from the footer." />;
  return (
    <>
      <PageMeta title={page.title} description={`${page.title} for Rentoori.`} path={`/legal/${slug}`} />
      <PageWrap className="max-w-3xl py-12">
        <h1 className="text-4xl font-semibold">{page.title}</h1>
        <div className="mt-6 grid gap-4 text-muted">
          {page.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </PageWrap>
    </>
  );
}
