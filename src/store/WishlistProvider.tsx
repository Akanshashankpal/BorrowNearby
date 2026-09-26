import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { WishlistEntry } from "@/types";
import { wishlistSeed } from "@/services/mock/db";
import { useAuth } from "./AuthProvider";

interface WishlistContextValue {
  entries: WishlistEntry[];
  has: (itemId: string) => boolean;
  toggle: (itemId: string) => void;
  remove: (itemId: string) => void;
  setNotify: (itemId: string, notify: boolean) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const KEY = "rentoori_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<WishlistEntry[]>([]);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }
    const raw = localStorage.getItem(`${KEY}:${user.id}`);
    if (raw) {
      setEntries(JSON.parse(raw) as WishlistEntry[]);
      return;
    }
    const seed = user.id === "u-me" ? wishlistSeed : [];
    setEntries(seed);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`${KEY}:${user.id}`, JSON.stringify(entries));
  }, [entries, user]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      entries,
      has: (itemId) => entries.some((entry) => entry.itemId === itemId),
      toggle: (itemId) => {
        setEntries((current) => {
          if (current.some((entry) => entry.itemId === itemId)) {
            return current.filter((entry) => entry.itemId !== itemId);
          }
          return [{ itemId, notify: false, savedAt: new Date().toISOString() }, ...current];
        });
      },
      remove: (itemId) => setEntries((current) => current.filter((entry) => entry.itemId !== itemId)),
      setNotify: (itemId, notify) =>
        setEntries((current) => current.map((entry) => (entry.itemId === itemId ? { ...entry, notify } : entry))),
    }),
    [entries],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
