import type { ItemCondition } from "@/types";

export interface BrowseFilters {
  q: string;
  category: string;
  price: "any" | "free" | "paid";
  condition: "any" | ItemCondition;
  availability: "any" | "today";
  handover: "any" | "pickup" | "delivery";
  minRating: number;
  maxDistance: number;
  sort: "distance" | "price_asc" | "price_desc" | "rating" | "newest";
  view: "grid" | "list" | "map";
}

export const defaultFilters: BrowseFilters = {
  q: "",
  category: "",
  price: "any",
  condition: "any",
  availability: "any",
  handover: "any",
  minRating: 0,
  maxDistance: 15,
  sort: "distance",
  view: "grid",
};
