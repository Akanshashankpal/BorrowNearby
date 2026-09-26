import { SlidersHorizontal } from "lucide-react";
import type { BrowseFilters } from "./filters";

export function FilterBar({
  filters,
  onSort,
  onView,
  onOpenFilters,
  resultCount,
}: {
  filters: BrowseFilters;
  onSort: (sort: BrowseFilters["sort"]) => void;
  onView: (view: BrowseFilters["view"]) => void;
  onOpenFilters: () => void;
  resultCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={onOpenFilters} className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-semibold lg:hidden">
        <SlidersHorizontal size={16} aria-hidden />
        Filters
      </button>
      <p className="text-sm text-muted">{resultCount} results</p>
      <label className="ml-auto flex items-center gap-2 text-sm font-semibold">
        <span className="sr-only">Sort</span>
        <select className="h-11 rounded-full border border-line bg-surface px-3" value={filters.sort} onChange={(event) => onSort(event.target.value as BrowseFilters["sort"])}>
          <option value="distance">Nearest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest</option>
        </select>
      </label>
      <div className="flex rounded-full border border-line bg-surface p-1" role="group" aria-label="View">
        {(["grid", "list", "map"] as const).map((view) => (
          <button
            key={view}
            type="button"
            aria-pressed={filters.view === view}
            onClick={() => onView(view)}
            className={`h-9 rounded-full px-3 text-sm font-semibold capitalize ${filters.view === view ? "bg-brand text-white" : "text-ink"}`}
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  );
}
