import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { usePlace } from "@/store/LocationProvider";

export function LocationSelector({ compact }: { compact?: boolean }) {
  const place = usePlace();
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState(place.city);
  const [area, setArea] = useState(place.area);
  const [pincode, setPincode] = useState(place.pincode);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex w-full items-center gap-2 rounded-2xl text-left ${compact ? "px-1 py-1" : "px-1 py-1"}`}
      >
        <MapPin size={16} className="text-brand" aria-hidden />
        <span>
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">Where</span>
          <span className="block text-sm font-semibold text-ink">{place.label}</span>
        </span>
      </button>
      {open ? (
        <div className="absolute left-0 z-30 mt-2 w-[min(100vw-2rem,22rem)] rounded-3xl border border-line bg-surface p-4 shadow-card">
          <p className="text-sm text-muted">Use your location to discover things available near you.</p>
          <Button
            className="mt-3 w-full"
            type="button"
            loading={place.status === "requesting"}
            onClick={place.requestDevice}
          >
            Use my location
          </Button>
          {place.status === "denied" ? (
            <p className="mt-3 text-sm text-ink" role="status">
              Location permission was denied. Add a city, area, or pincode instead. Browsing stays available either way.
            </p>
          ) : null}
          <form
            className="mt-3 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              place.saveManual({ city, area, pincode });
              setOpen(false);
            }}
          >
            <Input label="City" value={city} onChange={(event) => setCity(event.target.value)} required />
            <Input label="Area" value={area} onChange={(event) => setArea(event.target.value)} />
            <Input label="Pincode" value={pincode} onChange={(event) => setPincode(event.target.value)} inputMode="numeric" />
            <Button type="submit">Save location</Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
