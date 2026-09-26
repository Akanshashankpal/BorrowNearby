import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import type { ItemWithOwner } from "@/types";

export function MapPreview({ items }: { items: ItemWithOwner[] }) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-soft p-5">
      <div className="absolute inset-0 opacity-70" aria-hidden>
        <div className="absolute left-[18%] top-[30%] h-3 w-3 rounded-full bg-brand" />
        <div className="absolute left-[48%] top-[46%] h-3 w-3 rounded-full bg-sand" />
        <div className="absolute left-[66%] top-[28%] h-3 w-3 rounded-full bg-brand" />
      </div>
      <div className="relative grid min-h-56 content-end gap-3">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
          <MapPin size={16} aria-hidden />
          {items.length} things in this preview area
        </p>
        <p className="max-w-sm text-sm text-muted">Pins show approximate public pickup points, not home addresses.</p>
        <Link to="/map" className="inline-flex h-11 w-fit items-center rounded-full bg-brand px-4 text-sm font-semibold text-white">
          Explore on Map
        </Link>
      </div>
    </div>
  );
}
