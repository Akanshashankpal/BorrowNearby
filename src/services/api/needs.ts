import type { NeedInput, NeedPost } from "@/types";
import { needs } from "@/services/mock/db";
import { nid } from "@/utils/format";
import { ApiError, api, mockMode, wait } from "./client";
import { readSession } from "./session";
import { defaultLocation } from "@/constants/brand";
import { distanceKm } from "@/utils/format";

export async function getNeeds() {
  if (!mockMode) {
    const { data } = await api.get<NeedPost[]>("/needs");
    return data;
  }
  await wait(180);
  return [...needs].sort((a, b) => a.distanceKm - b.distanceKm);
}

export async function createNeed(input: NeedInput) {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to post a need.", 401);
  if (session.user.role !== "user") throw new ApiError("Needs are posted from a user account.", 403);
  if (!mockMode) {
    const { data } = await api.post<NeedPost>("/needs", input);
    return data;
  }
  await wait(280);
  const need: NeedPost = {
    id: nid("need"),
    userId: session.user.id,
    title: input.title,
    categorySlug: input.categorySlug,
    description: input.description,
    date: input.date,
    duration: input.duration,
    area: input.area,
    radiusKm: input.radiusKm,
    budget: input.budget,
    freePreferred: input.freePreferred,
    paidAcceptable: input.paidAcceptable,
    distanceKm: Math.round(distanceKm(defaultLocation.coords, defaultLocation.coords) * 10) / 10,
    createdAt: new Date().toISOString(),
  };
  needs.unshift(need);
  return need;
}
