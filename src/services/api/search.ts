import type { SearchSuggestions } from "@/types";
import { needs } from "@/services/mock/db";
import { filterItems } from "@/services/mock/query";
import { getCategories } from "./categories";
import { mockMode, wait } from "./client";
import { api } from "./client";

export async function suggest(query: string): Promise<SearchSuggestions> {
  const q = query.trim();
  if (!mockMode) {
    const { data } = await api.get<SearchSuggestions>("/search/suggest", { params: { q } });
    return data;
  }
  await wait(120);
  const categories = await getCategories();
  return {
    items: q ? filterItems({ q, pageSize: 5 }).slice(0, 5) : filterItems({ sort: "rating" }).slice(0, 4),
    categories: categories
      .filter((category) => !q || category.name.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 6),
    needs: needs
      .filter((need) => !q || `${need.title} ${need.description}`.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 3),
  };
}
