import type { DashboardSummary, User } from "@/types";
import { notifications, requests, transactions, userById, users } from "@/services/mock/db";
import { items } from "@/services/mock/db";
import { ApiError, api, mockMode, wait } from "./client";
import { readSession, writeSession } from "./session";

export async function getUser(id: string): Promise<User> {
  if (!mockMode) {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  }
  await wait(180);
  const session = readSession();
  if (session?.user.id === id) return session.user;
  const user = userById(id);
  if (!user) throw new ApiError("That profile is not available.", 404);
  return user;
}

export async function getDashboard(): Promise<DashboardSummary> {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to open your dashboard.", 401);
  if (!mockMode) {
    const { data } = await api.get<DashboardSummary>("/me/dashboard");
    return data;
  }
  await wait(200);
  const id = session.user.id;
  const earnings = transactions
    .filter((entry) => entry.userId === id && entry.kind === "earning" && entry.status === "confirmed")
    .reduce((sum, entry) => sum + entry.amount, 0);
  return {
    activeBorrowings: requests.filter(
      (entry) => entry.borrowerId === id && ["accepted", "active", "return_pending"].includes(entry.status),
    ).length,
    activeListings: items.filter((entry) => entry.ownerId === id && entry.status === "available").length,
    pendingRequests: requests.filter((entry) => entry.ownerId === id && entry.status === "pending").length,
    sentPending: requests.filter((entry) => entry.borrowerId === id && entry.status === "pending").length,
    earnings,
    trustScore: session.user.trust.score,
    trustLabel: session.user.trust.label,
    recent: notifications.filter((entry) => entry.userId === id).slice(0, 4),
  };
}

export async function updateProfile(patch: Partial<Pick<User, "name" | "area" | "bio">>) {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to update your profile.", 401);
  if (!mockMode) {
    const { data } = await api.patch<User>("/me", patch);
    writeSession({ ...session, user: data });
    return data;
  }
  await wait(240);
  const stored = users.find((entry) => entry.id === session.user.id);
  const next = { ...session.user, ...patch };
  if (stored) Object.assign(stored, patch);
  writeSession({ ...session, user: next });
  return next;
}

export async function getCommunityStats() {
  if (!mockMode) {
    const { data } = await api.get("/community");
    return data as {
      source: "api";
      users: number;
      itemsShared: number;
      successfulBorrows: number;
      rating: number;
    };
  }
  await wait(120);
  return {
    source: "preview" as const,
    users: 12450,
    itemsShared: 8900,
    successfulBorrows: 3200,
    rating: 4.8,
  };
}
