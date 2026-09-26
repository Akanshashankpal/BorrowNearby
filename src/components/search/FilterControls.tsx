import type { Category } from "@/types";
import type { BrowseFilters } from "./filters";

export function FilterFields({
  filters,
  categories,
  onChange,
  lockCategory,
}: {
  filters: BrowseFilters;
  categories: Category[];
  onChange: (next: BrowseFilters) => void;
  lockCategory?: boolean;
}) {
  function set<K extends keyof BrowseFilters>(key: K, value: BrowseFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="grid gap-4">
      <label className="grid gap-1 text-sm font-semibold">
        Distance
        <input
          type="range"
          min={1}
          max={25}
          value={filters.maxDistance}
          onChange={(event) => set("maxDistance", Number(event.target.value))}
          aria-valuetext={`${filters.maxDistance} kilometres`}
        />
        <span className="text-xs font-normal text-muted">Within {filters.maxDistance} km</span>
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Category
        <select
          className="rounded-2xl border border-line bg-surface px-3 py-3 font-normal"
          value={filters.category}
          disabled={lockCategory}
          onChange={(event) => set("category", event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Price
        <select className="rounded-2xl border border-line bg-surface px-3 py-3 font-normal" value={filters.price} onChange={(event) => set("price", event.target.value as BrowseFilters["price"])}>
          <option value="any">Free and paid</option>
          <option value="free">Free</option>
          <option value="paid">Paid</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Condition
        <select className="rounded-2xl border border-line bg-surface px-3 py-3 font-normal" value={filters.condition} onChange={(event) => set("condition", event.target.value as BrowseFilters["condition"])}>
          <option value="any">Any condition</option>
          <option value="new">New</option>
          <option value="like_new">Like new</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Availability
        <select className="rounded-2xl border border-line bg-surface px-3 py-3 font-normal" value={filters.availability} onChange={(event) => set("availability", event.target.value as BrowseFilters["availability"])}>
          <option value="any">Any day</option>
          <option value="today">Available today</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Pickup or delivery
        <select className="rounded-2xl border border-line bg-surface px-3 py-3 font-normal" value={filters.handover} onChange={(event) => set("handover", event.target.value as BrowseFilters["handover"])}>
          <option value="any">Either</option>
          <option value="pickup">Pickup</option>
          <option value="delivery">Delivery</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Rating
        <select className="rounded-2xl border border-line bg-surface px-3 py-3 font-normal" value={filters.minRating} onChange={(event) => set("minRating", Number(event.target.value))}>
          <option value={0}>Any rating</option>
          <option value={4}>4.0 and up</option>
          <option value={4.5}>4.5 and up</option>
        </select>
      </label>
    </div>
  );
}
