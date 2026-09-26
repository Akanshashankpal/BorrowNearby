import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PageLoader } from "@/components/layout/PageLoader";
import { useAuth } from "@/store/AuthProvider";
import type { AccountRole } from "@/types";
import { homeFor } from "@/utils/roles";

export function RequireRole({ allow }: { allow: AccountRole | AccountRole[] }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <PageLoader label="Checking your session" />;
  if (!user) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }
  const allowed = Array.isArray(allow) ? allow : [allow];
  if (!allowed.includes(user.role)) return <Navigate to={homeFor(user.role)} replace />;
  return <Outlet />;
}
