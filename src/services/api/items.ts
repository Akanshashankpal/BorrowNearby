import type { ItemQuery, ItemWithOwner, ListingInput, PageResult } from "@/types";
import { items, users } from "@/services/mock/db";
import { filterItems, listingToItem, paginate, withOwner } from "@/services/mock/query";
import { nid } from "@/utils/format";
import { ApiError, api, mockMode, wait } from "./client";
import { readSession, rememberPromotedSeller, writeSession } from "./session";

export async function getItems(query: ItemQuery = {}): Promise<PageResult<ItemWithOwner>> {
  if (!mockMode) {
    const { data } = await api.get<PageResult<ItemWithOwner>>("/items", { params: query });
    return data;
  }
  await wait(220);
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 8;
  return paginate(filterItems(query), page, pageSize);
}

export async function getItem(id: string, origin?: ItemQuery["origin"]): Promise<ItemWithOwner> {
  if (!mockMode) {
    const { data } = await api.get<ItemWithOwner>(`/items/${id}`);
    return data;
  }
  await wait(180);
  const item = items.find((entry) => entry.id === id);
  if (!item) throw new ApiError("This item is no longer listed.", 404, "not_found");
  return withOwner(item, origin);
}

export async function getRelated(id: string): Promise<ItemWithOwner[]> {
  const current = items.find((entry) => entry.id === id);
  if (!current) return [];
  if (!mockMode) {
    const { data } = await api.get<ItemWithOwner[]>(`/items/${id}/related`);
    return data;
  }
  await wait(160);
  return filterItems({ category: current.categorySlug, pageSize: 4 }).filter((item) => item.id !== id).slice(0, 4);
}

export async function createListing(input: ListingInput) {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to publish a listing.", 401);
  if (session.user.role === "admin") throw new ApiError("Admin accounts don't publish listings.", 403);
  if (session.user.role !== "user" && session.user.role !== "seller") {
    throw new ApiError("Sign in with a user account to list an item.", 403);
  }
  if (!mockMode) {
    const { data } = await api.post<ItemWithOwner>("/items", input);
    return data;
  }
  await wait(400);
  const created = listingToItem(input, session.user.id, nid("item"));
  items.unshift(created);
  if (session.user.role === "user") {
    const nextUser = { ...session.user, role: "seller" as const };
    const stored = users.find((entry) => entry.id === session.user.id);
    if (stored) stored.role = "seller";
    rememberPromotedSeller(nextUser.id);
    writeSession({ ...session, user: nextUser });
  }
  return withOwner(created);
}

export async function updateListing(id: string, patch: Partial<ListingInput> & { status?: ItemWithOwner["status"] }) {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to edit a listing.", 401);
  const item = items.find((entry) => entry.id === id);
  if (!item || item.ownerId !== session.user.id) throw new ApiError("You can only edit your own listing.", 403);
  if (!mockMode) {
    const { data } = await api.patch<ItemWithOwner>(`/items/${id}`, patch);
    return data;
  }
  await wait(240);
  Object.assign(item, {
    name: patch.name ?? item.name,
    description: patch.description ?? item.description,
    status: patch.status ?? item.status,
    priceType: patch.priceType ?? item.priceType,
    pricePerDay: patch.pricePerDay ?? item.pricePerDay,
    deposit: patch.deposit ?? item.deposit,
  });
  return withOwner(item);
}

export async function deleteListing(id: string) {
  const session = readSession();
  const index = items.findIndex((entry) => entry.id === id);
  if (!session || index < 0 || items[index].ownerId !== session.user.id) {
    throw new ApiError("You can only remove your own listing.", 403);
  }
  if (!mockMode) {
    await api.delete(`/items/${id}`);
    return;
  }
  await wait(200);
  items.splice(index, 1);
}
