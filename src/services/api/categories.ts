import type { Category } from "@/types";
import { categories, items } from "@/services/mock/db";
import { api, mockMode, wait } from "./client";

export async function getCategories(): Promise<Array<Category & { count: number }>> {
  if (!mockMode) {
    const { data } = await api.get<Array<Category & { count: number }>>("/categories");
    return data;
  }
  await wait(160);
  return categories.map((category) => ({
    ...category,
    count: items.filter((item) => item.categorySlug === category.slug && item.status !== "draft").length,
  }));
}

export async function getCategory(slug: string) {
  const list = await getCategories();
  return list.find((category) => category.slug === slug) ?? null;
}
