import type { ItemWithOwner } from "@/types";
import { ItemCard } from "./ItemCard";

export function ItemGrid({ items, layout = "grid" }: { items: ItemWithOwner[]; layout?: "grid" | "list" }) {
  if (layout === "list") {
    return (
      <div className="grid gap-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} layout="list" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
