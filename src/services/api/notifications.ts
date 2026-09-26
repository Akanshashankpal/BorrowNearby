import type { AppNotification } from "@/types";
import { notifications } from "@/services/mock/db";
import { ApiError, api, mockMode, wait } from "./client";
import { readSession } from "./session";

export async function getNotifications() {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to read notifications.", 401);
  if (!mockMode) {
    const { data } = await api.get<AppNotification[]>("/notifications");
    return data;
  }
  await wait(160);
  return notifications
    .filter((entry) => entry.userId === session.user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function markNotificationRead(id: string) {
  if (!mockMode) {
    await api.post(`/notifications/${id}/read`);
    return;
  }
  const entry = notifications.find((item) => item.id === id);
  if (entry) entry.read = true;
}

export async function markAllNotificationsRead() {
  const session = readSession();
  if (!session) return;
  if (!mockMode) {
    await api.post("/notifications/read-all");
    return;
  }
  notifications.forEach((entry) => {
    if (entry.userId === session.user.id) entry.read = true;
  });
}
