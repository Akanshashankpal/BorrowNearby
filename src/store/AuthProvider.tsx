import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@/types";
import * as authApi from "@/services/api/auth";
import { readSession } from "@/services/api/session";

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<Session>;
  signup: (input: { name: string; email: string; password: string; area: string }) => Promise<Session>;
  logout: () => Promise<void>;
  refreshUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readSession()?.user ?? null;
    if (stored && !stored.role) {
      void authApi.logout();
      setUser(null);
    } else {
      setUser(stored);
    }
    setReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      async login(email, password) {
        const session = await authApi.login(email, password);
        setUser(session.user);
        return session;
      },
      async signup(input) {
        const session = await authApi.signup(input);
        setUser(session.user);
        return session;
      },
      async logout() {
        await authApi.logout();
        setUser(null);
      },
      refreshUser(next) {
        setUser(next);
      },
    }),
    [ready, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
