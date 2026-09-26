import type {
  GeoPoint,
  Item,
  ItemQuery,
  ItemWithOwner,
  ListingInput,
  PublicUser,
  User,
} from "@/types";
import { dateRange, distanceKm } from "@/utils/format";
import { defaultLocation } from "@/constants/brand";
import { categoryBySlug, items, userById } from "./db";

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    verified: user.verified,
    trustScore: user.trust.score,
    trustLabel: user.trust.label,
    rating: user.rating,
    area: user.area,
    memberSince: user.memberSince,
  };
}

export function withOwner(item: Item, origin?: GeoPoint): ItemWithOwner {
  const owner = userById(item.ownerId);
  const point = origin ?? defaultLocation.coords;
  const km = distanceKm(point, item.coords);
  return {
    ...item,
    distanceKm: Math.round(km * 10) / 10,
    owner: owner
      ? toPublicUser(owner)
      : {
          id: item.ownerId,
          name: "Neighbour",
          avatarUrl: "",
          verified: false,
          trustScore: 0,
          trustLabel: "Building",
          rating: 0,
          area: item.areaLabel,
          memberSince: "",
        },
  };
}

export function filterItems(query: ItemQuery = {}): ItemWithOwner[] {
  const origin = query.origin ?? defaultLocation.coords;
  let list = items.map((item) => withOwner(item, origin));
  const text = query.q?.trim().toLowerCase();

  if (text) {
    list = list.filter((item) => {
      const category = categoryBySlug(item.categorySlug);
      return [item.name, item.description, item.areaLabel, category?.name ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(text);
    });
  }
  if (query.category) list = list.filter((item) => item.categorySlug === query.category);
  if (query.ownerId) list = list.filter((item) => item.ownerId === query.ownerId);
  if (query.price === "free") list = list.filter((item) => item.priceType === "free");
  if (query.price === "paid") list = list.filter((item) => item.priceType === "paid");
  if (query.condition && query.condition !== "any") {
    list = list.filter((item) => item.condition === query.condition);
  }
  if (query.availability === "today") list = list.filter((item) => item.availableToday);
  if (query.handover === "delivery") list = list.filter((item) => item.deliveryAvailable);
  if (query.handover === "pickup") list = list.filter((item) => Boolean(item.pickupLabel));
  if (query.minRating) list = list.filter((item) => item.rating >= query.minRating!);
  if (typeof query.maxDistance === "number") {
    list = list.filter((item) => item.distanceKm <= query.maxDistance!);
  }
  if (query.status && query.status !== "any") {
    list = list.filter((item) => item.status === query.status);
  } else if (!query.ownerId) {
    list = list.filter((item) => item.status === "available" || item.status === "reserved");
  }

  const sort = query.sort ?? "distance";
  list.sort((a, b) => {
    if (sort === "price_asc") return a.pricePerDay - b.pricePerDay;
    if (sort === "price_desc") return b.pricePerDay - a.pricePerDay;
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "newest") return b.createdAt.localeCompare(a.createdAt);
    return a.distanceKm - b.distanceKm;
  });

  return list;
}

export function paginate<T>(list: T[], page = 1, pageSize = 8) {
  const start = (page - 1) * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    total: list.length,
    page,
    pageSize,
  };
}

export function listingToItem(input: ListingInput, ownerId: string, id: string): Item {
  const dates = dateRange(input.availableFrom, input.availableTo);
  return {
    id,
    name: input.name,
    description: input.description,
    categorySlug: input.categorySlug,
    images: input.images,
    priceType: input.priceType,
    pricePerDay: input.priceType === "free" ? 0 : input.pricePerDay,
    deposit: input.deposit,
    rating: 0,
    reviewCount: 0,
    distanceKm: 0.4,
    areaLabel: input.areaLabel,
    pickupLabel: input.pickupInstructions,
    availableToday: dates.includes("2026-09-26"),
    ownerId,
    condition: input.condition,
    included: input.included,
    rules: input.rules,
    deliveryAvailable: input.deliveryAvailable,
    status: input.status ?? "available",
    views: 0,
    requestCount: 0,
    coords: {
      lat: defaultLocation.coords.lat + (Math.random() - 0.5) * 0.01,
      lng: defaultLocation.coords.lng + (Math.random() - 0.5) * 0.01,
    },
    availableDates: dates,
    createdAt: new Date().toISOString(),
  };
}
