import type { AccountRole, ListingStatus, RequestStatus } from "@/types";
import { disputes, items, needs, requests, users } from "@/services/mock/db";
import { ApiError, mockMode, wait } from "./client";
import { readSession } from "./session";

function assertAdmin() {
  const session = readSession();
  if (!session) throw new ApiError("Sign in as an admin.", 401);
  if (session.user.role !== "admin") throw new ApiError("This area is for admins.", 403);
  return session;
}

export async function getAdminOverview() {
  assertAdmin();
  if (!mockMode) {
    throw new ApiError("Admin tools are available in the preview.", 501);
  }
  await wait(180);
  return {
    people: users.length,
    listings: items.length,
    openRequests: requests.filter((entry) => ["pending", "accepted", "active", "return_pending"].includes(entry.status)).length,
    needs: needs.length,
    disputes: disputes.length,
  };
}

export async function getAdminPeople() {
  assertAdmin();
  await wait(160);
  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    area: user.area,
    verified: user.verified,
  })) satisfies Array<{ id: string; name: string; email: string; role: AccountRole; area: string; verified: boolean }>;
}

export async function getAdminListings() {
  assertAdmin();
  await wait(160);
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    areaLabel: item.areaLabel,
    status: item.status,
    ownerName: users.find((user) => user.id === item.ownerId)?.name ?? "Unknown",
  }));
}

export async function moderateListing(id: string, status: Extract<ListingStatus, "available" | "paused">) {
  assertAdmin();
  const item = items.find((entry) => entry.id === id);
  if (!item) throw new ApiError("That listing is not available.", 404);
  if (!mockMode) throw new ApiError("Admin tools are available in the preview.", 501);
  await wait(200);
  item.status = status;
  return item.status;
}

export async function getAdminRequests() {
  assertAdmin();
  await wait(160);
  return requests.map((request) => ({
    id: request.id,
    itemName: items.find((item) => item.id === request.itemId)?.name ?? "Item",
    borrower: users.find((user) => user.id === request.borrowerId)?.name ?? "Unknown",
    owner: users.find((user) => user.id === request.ownerId)?.name ?? "Unknown",
    status: request.status as RequestStatus,
  }));
}

export async function getAdminNeeds() {
  assertAdmin();
  await wait(160);
  return needs.map((need) => ({
    id: need.id,
    title: need.title,
    area: need.area,
    author: users.find((user) => user.id === need.userId)?.name ?? "Unknown",
  }));
}
