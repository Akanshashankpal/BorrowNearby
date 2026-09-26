import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { GeoPoint } from "@/types";
import { defaultLocation } from "@/constants/brand";

interface Place {
  label: string;
  city: string;
  area: string;
  pincode: string;
  coords: GeoPoint;
  source: "default" | "device" | "manual";
  status: "idle" | "requesting" | "granted" | "denied";
}

interface LocationContextValue extends Place {
  requestDevice: () => void;
  saveManual: (input: { city: string; area: string; pincode: string }) => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);
const KEY = "rentoori_place";

function readPlace(): Place {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) throw new Error("empty");
    return JSON.parse(raw) as Place;
  } catch {
    return { ...defaultLocation, source: "default", status: "idle" };
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [place, setPlace] = useState<Place>(readPlace);

  const value = useMemo<LocationContextValue>(
    () => ({
      ...place,
      requestDevice() {
        if (!navigator.geolocation) {
          setPlace((current) => ({ ...current, status: "denied" }));
          return;
        }
        setPlace((current) => ({ ...current, status: "requesting" }));
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const next: Place = {
              label: "Near you",
              city: place.city || defaultLocation.city,
              area: "Current area",
              pincode: place.pincode,
              coords: { lat: position.coords.latitude, lng: position.coords.longitude },
              source: "device",
              status: "granted",
            };
            localStorage.setItem(KEY, JSON.stringify(next));
            setPlace(next);
          },
          () => setPlace((current) => ({ ...current, status: "denied" })),
          { enableHighAccuracy: false, timeout: 8000 },
        );
      },
      saveManual(input) {
        const next: Place = {
          label: [input.area, input.city].filter(Boolean).join(", ") || input.city,
          city: input.city,
          area: input.area,
          pincode: input.pincode,
          coords: defaultLocation.coords,
          source: "manual",
          status: place.status === "denied" ? "denied" : "idle",
        };
        localStorage.setItem(KEY, JSON.stringify(next));
        setPlace(next);
      },
    }),
    [place],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function usePlace() {
  const context = useContext(LocationContext);
  if (!context) throw new Error("usePlace must be used within LocationProvider");
  return context;
}
