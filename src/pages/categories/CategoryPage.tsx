import { useParams } from "react-router-dom";
import { ItemBrowser } from "@/components/items/ItemBrowser";
import { PageMeta } from "@/components/layout/PageMeta";
import { ErrorState } from "@/components/ui/ErrorState";
import { useAsync } from "@/hooks/useAsync";
import { getCategory } from "@/services/api/categories";

export default function CategoryPage() {
  const { slug = "" } = useParams();
  const state = useAsync(() => getCategory(slug), [slug]);
  if (state.status === "ready" && !state.data) {
    return <ErrorState title="That category wandered off." body="Try another collection from Discover." />;
  }
  const category = state.data;
  return (
    <>
      <PageMeta
        title={category?.name ?? "Category"}
        description={category?.description ?? "Browse a Rentoori category."}
        path={`/category/${slug}`}
      />
      {category ? (
        <ItemBrowser
          title={category.name}
          description={category.description}
          lockedCategory={category.slug}
          image={category.imageUrl}
        />
      ) : null}
      {category ? (
        <p className="mx-auto -mt-4 mb-10 max-w-[1360px] px-4 text-sm text-muted sm:px-6">
          Also in {category.name}: {category.subcategories.join(", ")}
        </p>
      ) : null}
    </>
  );
}
