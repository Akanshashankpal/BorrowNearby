import axios from "axios";
import type { Session, User } from "@/types";
import { portalAccounts } from "@/constants/brand";
import { trustLabel } from "@/utils/format";
import { users } from "@/services/mock/db";
import { ApiError, api, mockMode, setRefreshHandler, wait } from "./client";
import { promotedSellerIds, readSession, writeSession } from "./session";

function sessionFor(user: User): Session {
  return {
    accessToken: `preview.${user.id}.${Date.now()}`,
    refreshToken: `preview-refresh.${user.id}`,
    user,
  };
}

export async function login(email: string, password: string): Promise<Session> {
  if (!mockMode) {
    const { data } = await api.post<Session>("/auth/login", { email, password });
    writeSession(data);
    return data;
  }
  await wait();
  const normalised = email.trim().toLowerCase();
  const account = portalAccounts.find((entry) => entry.email === normalised && entry.password === password);
  if (account) {
    const stored = users.find((entry) => entry.id === account.userId);
    if (!stored) throw new ApiError("That account is unavailable.", 500);
    const user = stored.role === "user" && promotedSellerIds().includes(stored.id) ? { ...stored, role: "seller" as const } : stored;
    if (user.role === "seller" && stored.role !== "seller") stored.role = "seller";
    const session = sessionFor(user);
    writeSession(session);
    return session;
  }
  throw new ApiError("Those details don't match a user, seller, or admin account.", 401, "invalid_login");
}

export async function signup(input: {
  name: string;
  email: string;
  password: string;
  area: string;
}): Promise<Session> {
  if (!mockMode) {
    const { data } = await api.post<Session>("/auth/signup", input);
    writeSession(data);
    return data;
  }
  await wait();
  if (input.password.length < 8) {
    throw new ApiError("Use at least 8 characters.", 422, "weak_password");
  }
  const email = input.email.trim().toLowerCase();
  if (users.some((entry) => entry.email === email) || portalAccounts.some((entry) => entry.email === email)) {
    throw new ApiError("That email is already registered.", 409, "email_taken");
  }
  const user: User = {
    id: `u-${Date.now()}`,
    role: "user",
    name: input.name.trim(),
    email,
    avatarUrl: "",
    area: input.area.trim(),
    city: "Burhanpur",
    memberSince: new Date().toISOString().slice(0, 10),
    bio: "",
    verified: false,
    verification: { phone: false, email: true, identity: false },
    trust: {
      score: 40,
      label: trustLabel(40),
      factors: { identity: 10, returns: 0, reviews: 0, history: 20, cancellations: 50 },
    },
    rating: 0,
    reviewCount: 0,
    successfulBorrows: 0,
    successfulLends: 0,
    phoneMasked: "Not added",
  };
  const session = sessionFor(user);
  writeSession(session);
  return session;
}

export async function requestPasswordReset(email: string) {
  if (!mockMode) {
    const { data } = await api.post<{ message: string }>("/auth/forgot", { email });
    return data;
  }
  await wait();
  return {
    message: "If this email is registered, you'll receive reset instructions.",
  };
}

export async function logout() {
  if (!mockMode) {
    await api.post("/auth/logout").catch(() => undefined);
  }
  writeSession(null);
}

setRefreshHandler(async () => {
  const current = readSession();
  if (!current) return null;
  if (mockMode) {
    const next = { ...current, accessToken: `preview.${current.user.id}.${Date.now()}` };
    writeSession(next);
    return next.accessToken;
  }
  const { data } = await axios.post<Session>(
    `${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/auth/refresh`,
    { refreshToken: current.refreshToken },
  );
  writeSession(data);
  return data.accessToken;
});
