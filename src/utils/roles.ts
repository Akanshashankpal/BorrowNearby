import type { AccountRole } from "@/types";

export function homeFor(role: AccountRole | undefined) {
  if (role === "seller") return "/seller";
  if (role === "admin") return "/admin";
  if (role === "user") return "/dashboard";
  return "/login";
}

export function portalBase(pathname: string) {
  if (pathname.startsWith("/seller")) return "/seller";
  if (pathname.startsWith("/admin")) return "/admin";
  return "/dashboard";
}

function isPublicPath(path: string) {
  return (
    path === "/" ||
    path.startsWith("/discover") ||
    path.startsWith("/search") ||
    path.startsWith("/category/") ||
    path.startsWith("/item/") ||
    path.startsWith("/user/") ||
    path.startsWith("/map") ||
    path.startsWith("/how-it-works") ||
    path.startsWith("/safety") ||
    path === "/needs" ||
    path.startsWith("/help") ||
    path.startsWith("/contact") ||
    path.startsWith("/legal/")
  );
}

export function destinationAfterLogin(role: AccountRole, next: string | null) {
  const fallback = homeFor(role);
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/login")) return fallback;
  const path = next.split("?")[0];
  if (isPublicPath(path)) return next;
  if (role === "user" && (path.startsWith("/dashboard") || path.startsWith("/requests/") || path.startsWith("/payment/") || path === "/needs/create" || path === "/list-item" || path.startsWith("/item/"))) {
    return next;
  }
  if (role === "seller" && (path.startsWith("/seller") || path === "/list-item" || path.startsWith("/requests/"))) {
    return next;
  }
  if (role === "admin" && (path.startsWith("/admin") || path.startsWith("/requests/"))) {
    return next;
  }
  return fallback;
}
