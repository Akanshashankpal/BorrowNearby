import { ItemGrid } from "@/components/items/ItemGrid";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAsync } from "@/hooks/useAsync";
import { getItem } from "@/services/api/items";
import { useToast } from "@/store/ToastProvider";
import { useWishlist } from "@/store/WishlistProvider";

export default function WishlistPage() {
  const wishlist = useWishlist();
  const { push } = useToast();
  const state = useAsync(async () => {
    const items = await Promise.all(wishlist.entries.map((entry) => getItem(entry.itemId).catch(() => null)));
    return items.filter((item) => item !== null);
  }, [wishlist.entries.map((entry) => entry.itemId).join("|")]);
  return (
    <>
      <PageMeta title="Wishlist" description="Items you saved on Rentoori." path="/dashboard/wishlist" />
      <h1 className="text-3xl font-semibold">Wishlist</h1>
      {state.data && state.data.length === 0 ? (
        <div className="mt-4"><EmptyState title="Save things you may want later." body="Tap the heart on an item to keep it here." action={<Button href="/discover">Explore items</Button>} /></div>
      ) : <div className="mt-4"><ItemGrid items={state.data ?? []} /></div>}
      <ul className="mt-4 grid gap-2">
        {wishlist.entries.map((entry) => (
          <li key={entry.itemId} className="flex flex-wrap items-center gap-2 text-sm">
            <Button size="sm" variant="secondary" onClick={() => wishlist.remove(entry.itemId)}>Remove</Button>
            <Button size="sm" href={`/item/${entry.itemId}/request`}>Request</Button>
            <label className="font-semibold">
              <input type="checkbox" className="mr-2" checked={entry.notify} onChange={(event) => { wishlist.setNotify(entry.itemId, event.target.checked); push({ title: event.target.checked ? "We'll notify you when this is available." : "Availability alerts off.", tone: "success" }); }} />
              Notify me when available
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}
