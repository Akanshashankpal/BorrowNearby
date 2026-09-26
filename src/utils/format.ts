import type { GeoPoint, ItemCondition, ListingStatus, RequestStatus } from "@/types";

export function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDistance(km: number) {
  if (km < 1) return `${Math.max(1, Math.round(km * 1000))} m away`;
  return `${km.toFixed(km < 10 ? 1 : 0)} km away`;
}

export function formatDate(iso: string) {
  const date = new Date(`${iso.slice(0, 10)}T00:00:00`);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatWhen(iso: string) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function trustLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Fair";
  return "Building";
}

export function conditionLabel(condition: ItemCondition) {
  const labels: Record<ItemCondition, string> = {
    new: "New",
    like_new: "Like new",
    good: "Good",
    fair: "Fair",
  };
  return labels[condition];
}

export function statusLabel(status: RequestStatus | ListingStatus) {
  return status.replaceAll("_", " ");
}

export function distanceKm(a: GeoPoint, b: GeoPoint) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earth = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return earth * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function daysBetween(start: string, end: string) {
  const from = new Date(`${start}T00:00:00`).getTime();
  const to = new Date(`${end}T00:00:00`).getTime();
  const diff = Math.round((to - from) / 86400000);
  return Math.max(1, diff || 1);
}

export function dateRange(from: string, to: string) {
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  const dates: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export function upcomingDates(count: number, skip: number[] = []) {
  const skipped = new Set(skip);
  const dates: string[] = [];
  const base = new Date("2026-09-26T00:00:00");
  for (let index = 0; index < count; index += 1) {
    if (skipped.has(index)) continue;
    const next = new Date(base);
    next.setDate(base.getDate() + index);
    dates.push(next.toISOString().slice(0, 10));
  }
  return dates;
}

export function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}

export function nid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}
