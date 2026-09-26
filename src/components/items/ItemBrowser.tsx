import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DiscoveryMap } from "@/components/maps/DiscoveryMap";
import { FilterBar } from "@/components/search/FilterBar";
import { FilterDrawer } from "@/components/search/FilterDrawer";
import { FilterFields } from "@/components/search/FilterControls";
import { defaultFilters, type BrowseFilters } from "@/components/search/filters";
import { SearchBar } from "@/components/search/SearchBar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Photo } from "@/components/ui/Photo";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { getCategories } from "@/services/api/categories";
import { getItems } from "@/services/api/items";
import { usePlace } from "@/store/LocationProvider";
import type { Category, ItemWithOwner } from "@/types";
import { ItemGrid } from "./ItemGrid";
import { PageWrap } from "@/components/layout/PageWrap";

export function ItemBrowser({
  title,
  description,
  lockedCategory,
  image,
}: {
  title: string;
  description?: string;
  lockedCategory?: string;
  image?: string;
}) {
  const place = usePlace();
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => readFilters(params, lockedCategory), [params, lockedCategory]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<ItemWithOwner[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    getItems({
      q: filters.q,
      category: filters.category || undefined,
      price: filters.price,
      condition: filters.condition,
      availability: filters.availability,
      handover: filters.handover,
      minRating: filters.minRating,
      maxDistance: filters.maxDistance,
      sort: filters.sort,
      page,
      pageSize: filters.view === "map" ? 40 : 8,
      origin: place.coords,
    })
      .then((result) => {
        if (!active) return;
        setItems((current) => (page === 1 ? result.items : [...current, ...result.items]));
        setTotal(result.total);
        setSelected(result.items[0]?.id);
        setStatus("ready");
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setStatus("error");
        setError(reason instanceof Error ? reason.message : "Unable to load nearby items.");
      });
    return () => {
      active = false;
    };
  }, [filters, page, place.coords]);

  function update(next: Partial<BrowseFilters>) {
    const merged = { ...filters, ...next };
    if (lockedCategory) merged.category = lockedCategory;
    const query = new URLSearchParams();
    Object.entries(merged).forEach(([key, value]) => {
      if (value !== "" && value !== "any" && value !== 0 && !(key === "maxDistance" && value === 15) && !(key === "sort" && value === "distance") && !(key === "view" && value === "grid")) {
        query.set(key, String(value));
      }
    });
    setPage(1);
    setParams(query);
  }

  return (
    <PageWrap className="py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-line bg-surface p-4">
            <h2 className="mb-4 font-semibold">Filters</h2>
            <FilterFields filters={filters} categories={categories} lockCategory={Boolean(lockedCategory)} onChange={(next) => update(next)} />
          </div>
        </aside>
        <div className="min-w-0">
          {image ? <Photo src={image} alt="" className="mb-5 h-44 w-full rounded-[1.75rem] object-cover" /> : null}
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
          {description ? <p className="mt-2 max-w-2xl text-muted">{description}</p> : null}
          <p className="mt-2 text-sm text-muted">Around {place.label}</p>
          <div className="mt-4">
            <SearchBar value={filters.q} onChange={(q) => update({ q })} labelled={false} placeholder="Search this collection" />
          </div>
          <div className="mt-4">
            <FilterBar
              filters={filters}
              resultCount={total}
              onOpenFilters={() => setDrawer(true)}
              onSort={(sort) => update({ sort })}
              onView={(view) => update({ view })}
            />
          </div>
          <div className="mt-5">
            {status === "error" ? <ErrorState title="Unable to load nearby items." body={error} onRetry={() => setPage(1)} /> : null}
            {status === "loading" && page === 1 ? <SkeletonGrid /> : null}
            {status !== "error" && items.length === 0 && status === "ready" ? (
              <EmptyState title="Nothing nearby yet." body="Try a wider distance or another category." action={<Button onClick={() => update({ maxDistance: 25, category: lockedCategory ?? "" })}>Expand search radius</Button>} />
            ) : null}
            {filters.view === "map" ? (
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <DiscoveryMap items={items} center={place.coords} radiusKm={filters.maxDistance} selectedId={selected} onSelect={setSelected} className="h-[460px] overflow-hidden rounded-[1.75rem]" />
                <ItemGrid items={items.filter((item) => !selected || item.id === selected).slice(0, 4)} />
              </div>
            ) : (
              <ItemGrid items={items} layout={filters.view === "list" ? "list" : "grid"} />
            )}
            {items.length < total && status === "ready" ? (
              <Button className="mt-6" variant="secondary" onClick={() => setPage((value) => value + 1)}>
                Load more
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <FilterDrawer open={drawer} filters={filters} categories={categories} lockCategory={Boolean(lockedCategory)} onClose={() => setDrawer(false)} onApply={(next) => update(next)} />
    </PageWrap>
  );
}

function readFilters(params: URLSearchParams, lockedCategory?: string): BrowseFilters {
  return {
    ...defaultFilters,
    q: params.get("q") ?? "",
    category: lockedCategory || params.get("category") || "",
    price: (params.get("price") as BrowseFilters["price"]) || "any",
    condition: (params.get("condition") as BrowseFilters["condition"]) || "any",
    availability: (params.get("availability") as BrowseFilters["availability"]) || "any",
    handover: (params.get("handover") as BrowseFilters["handover"]) || "any",
    minRating: Number(params.get("minRating") || params.get("rating") || 0),
    maxDistance: Number(params.get("maxDistance") || params.get("distance") || 15),
    sort: (params.get("sort") as BrowseFilters["sort"]) || "distance",
    view: (params.get("view") as BrowseFilters["view"]) || "grid",
  };
}
