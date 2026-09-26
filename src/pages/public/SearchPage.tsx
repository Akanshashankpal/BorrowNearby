import { useSearchParams } from "react-router-dom";
import { ItemBrowser } from "@/components/items/ItemBrowser";
import { PageMeta } from "@/components/layout/PageMeta";

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "everything nearby";
  return (
    <>
      <PageMeta title={`Search · ${query}`} description={`Results for ${query} on Rentoori.`} path={`/search?q=${encodeURIComponent(query)}`} />
      <ItemBrowser title={params.get("q") ? `Results for “${params.get("q")}”` : "Search results"} description="Filtered from the preview catalog around your selected area." />
    </>
  );
}
