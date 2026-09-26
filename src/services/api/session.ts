import type { Session } from "@/types";

const KEY = "rentoori_session";
const SELLERS = "rentoori_promoted_sellers";

export function promotedSellerIds() {
  try {
    const raw = localStorage.getItem(SELLERS);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function rememberPromotedSeller(id: string) {
  const ids = new Set(promotedSellerIds());
  ids.add(id);
  localStorage.setItem(SELLERS, JSON.stringify([...ids]));
}

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function writeSession(session: Session | null) {
  if (!session) {
    localStorage.removeItem(KEY);
    return;
  }
  localStorage.setItem(KEY, JSON.stringify(session));
}
