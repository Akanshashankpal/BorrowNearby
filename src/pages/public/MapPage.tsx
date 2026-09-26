import { useState } from "react";
import { Link } from "react-router-dom";
import { DiscoveryMap } from "@/components/maps/DiscoveryMap";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { useAsync } from "@/hooks/useAsync";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getCategories } from "@/services/api/categories";
import { getItems } from "@/services/api/items";
import { usePlace } from "@/store/LocationProvider";

export default function MapPage() {
  const place = usePlace();
  const wide = useMediaQuery("(min-width: 1024px)");
  const tablet = useMediaQuery("(min-width: 768px)");
  const [radius, setRadius] = useState(5);
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<string>();
  const [sheet, setSheet] = useState(true);
  const categories = useAsync(() => getCategories(), []);
  const items = useAsync(
    () => getItems({ category: category || undefined, maxDistance: radius, pageSize: 40, origin: place.coords, sort: "distance" }),
    [category, radius, place.coords.lat, place.coords.lng],
  );
  const list = items.data?.items ?? [];
  const current = list.find((item) => item.id === selected) ?? list[0];

  return (
    <>
      <PageMeta title="Map" description="See approximate pickup points for items near you on Rentoori." path="/map" />
      <div className={tablet ? "mx-auto grid max-w-[1480px] gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-6" : "relative h-[calc(100vh-4rem)]"}>
        <div className={tablet ? "h-[70vh] overflow-hidden rounded-[1.75rem]" : "absolute inset-0"}>
          <DiscoveryMap items={list} center={place.coords} radiusKm={radius} selectedId={current?.id} onSelect={(id) => { setSelected(id); setSheet(true); }} className="h-full" />
        </div>
        <aside className={tablet ? "rounded-[1.75rem] border border-line bg-surface p-4" : `absolute inset-x-0 bottom-0 z-20 max-h-[55%] overflow-auto rounded-t-3xl bg-surface p-4 shadow-card ${sheet ? "" : "hidden"}`}>
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Things near you</h1>
            {!tablet ? <button type="button" className="text-sm font-semibold" onClick={() => setSheet(false)}>Hide</button> : null}
          </div>
          <p className="text-xs text-muted">Pins are approximate public pickup points.</p>
          <label className="mt-3 grid gap-1 text-sm font-semibold">
            Radius {radius} km
            <input type="range" min={1} max={15} value={radius} onChange={(event) => setRadius(Number(event.target.value))} />
          </label>
          <label className="mt-3 grid gap-1 text-sm font-semibold">
            Category
            <select className="rounded-2xl border border-line bg-bg px-3 py-2" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">All</option>
              {categories.data?.map((entry) => <option key={entry.slug} value={entry.slug}>{entry.name}</option>)}
            </select>
          </label>
          <Button className="mt-3 w-full" variant="secondary" onClick={place.requestDevice}>Use my location</Button>
          {place.status === "denied" ? <p className="mt-2 text-xs">Location permission denied. Results stay around {place.label}.</p> : null}
          {current ? (
            <article className="mt-4 grid grid-cols-[96px_1fr] gap-3">
              <Photo src={current.images[0]} alt="" className="h-24 w-full rounded-2xl object-cover" />
              <div>
                <p className="font-semibold">{current.name}</p>
                <PriceDisplay priceType={current.priceType} pricePerDay={current.pricePerDay} />
                <p className="text-xs text-muted">{current.pickupLabel}</p>
                <Link to={`/item/${current.id}`} className="text-sm font-semibold text-brand">View item</Link>
              </div>
            </article>
          ) : <p className="mt-4 text-sm text-muted">Nothing in this radius yet.</p>}
          {wide ? (
            <ul className="mt-4 grid max-h-64 gap-2 overflow-auto">
              {list.map((item) => (
                <li key={item.id}>
                  <button type="button" className="w-full rounded-2xl px-2 py-2 text-left text-sm hover:bg-brand-soft" onClick={() => setSelected(item.id)}>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
        {!tablet && !sheet ? (
          <button type="button" className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white" onClick={() => setSheet(true)}>
            Show items
          </button>
        ) : null}
      </div>
    </>
  );
}
