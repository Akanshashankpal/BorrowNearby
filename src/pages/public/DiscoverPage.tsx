import { ItemBrowser } from "@/components/items/ItemBrowser";
import { PageMeta } from "@/components/layout/PageMeta";

export default function DiscoverPage() {
  return (
    <>
      <PageMeta title="Discover nearby" description="Browse useful things people around Burhanpur are willing to lend or rent." path="/discover" />
      <ItemBrowser title="Discover nearby" description="Search, filter, and switch between a list, a grid, or the map." />
    </>
  );
}
