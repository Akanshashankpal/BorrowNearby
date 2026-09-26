import { useEffect } from "react";
import { Circle, MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoPoint, ItemWithOwner } from "@/types";

function pin(active: boolean) {
  return L.divIcon({
    className: "",
    html: `<span class="${active ? "rentoori-pin-active" : "rentoori-pin"}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function LeafletMap({
  items,
  center,
  radiusKm,
  selectedId,
  onSelect,
}: {
  items: ItemWithOwner[];
  center: GeoPoint;
  radiusKm: number;
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const position: [number, number] = [center.lat, center.lng];
  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={position} />
      <Circle center={position} radius={radiusKm * 1000} pathOptions={{ color: "#4B2E83", weight: 1, fillOpacity: 0.08 }} />
      {items.map((item) => (
        <Marker
          key={item.id}
          position={[item.coords.lat, item.coords.lng]}
          icon={pin(item.id === selectedId)}
          eventHandlers={{ click: () => onSelect(item.id) }}
        />
      ))}
    </MapContainer>
  );
}
