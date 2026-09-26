import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { useAuth } from "@/store/AuthProvider";
import { useTheme } from "@/store/ThemeProvider";
import { Photo } from "@/components/ui/Photo";
import type { ThemeMode } from "@/types";
import { homeFor } from "@/utils/roles";

export function ProfileMenu({ compact }: { compact?: boolean }) {
  const { user, logout } = useAuth();
  const { mode, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-2"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        {compact ? <Menu size={16} aria-hidden /> : null}
        {user?.avatarUrl ? (
          <Photo src={user.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <BrandMark className="h-8 w-8" />
        )}
        <span className="sr-only">Account menu</span>
        {!compact ? <span className="pr-2 text-sm font-semibold">{user ? user.name.split(" ")[0] : "Profile"}</span> : null}
      </button>
      {open ? (
        <div role="menu" className="absolute right-0 z-40 mt-2 w-64 rounded-3xl border border-line bg-surface p-2 shadow-card">
          <MenuLink to="/discover" onClick={() => setOpen(false)}>Browse</MenuLink>
          <MenuLink to="/how-it-works" onClick={() => setOpen(false)}>How it works</MenuLink>
          <MenuLink to="/safety" onClick={() => setOpen(false)}>Safety</MenuLink>
          {user?.role !== "admin" ? <MenuLink to="/list-item" onClick={() => setOpen(false)}>List your item</MenuLink> : null}
          <MenuLink to="/needs" onClick={() => setOpen(false)}>Needs nearby</MenuLink>
          {user ? <MenuLink to={homeFor(user.role)} onClick={() => setOpen(false)}>{user.role === "admin" ? "Admin" : user.role === "seller" ? "Seller dashboard" : "My dashboard"}</MenuLink> : null}
          <label className="mt-1 grid gap-1 px-3 py-2 text-sm font-semibold">
            Theme
            <select
              className="rounded-xl border border-line bg-bg px-2 py-2 font-normal"
              value={mode}
              onChange={(event) => setMode(event.target.value as ThemeMode)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </label>
          {user ? (
            <button
              type="button"
              className="w-full rounded-2xl px-3 py-2 text-left text-sm font-semibold hover:bg-brand-soft"
              onClick={() => {
                setOpen(false);
                void logout().then(() => navigate("/"));
              }}
            >
              Log out
            </button>
          ) : (
            <MenuLink to="/login" onClick={() => setOpen(false)}>Log in</MenuLink>
          )}
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({ to, children, onClick }: { to: string; children: string; onClick: () => void }) {
  return (
    <Link to={to} role="menuitem" onClick={onClick} className="block rounded-2xl px-3 py-2 text-sm font-semibold hover:bg-brand-soft">
      {children}
    </Link>
  );
}

export function NotificationButton({ count }: { count: number }) {
  const { user } = useAuth();
  return (
    <Link
      to={user ? (user.role === "admin" ? "/admin" : `${homeFor(user.role)}/notifications`) : "/login?next=/dashboard/notifications"}
      className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-brand-soft"
      aria-label={count ? `Notifications, ${count} unread` : "Notifications"}
    >
      <Bell size={18} />
      {count > 0 ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sand" /> : null}
    </Link>
  );
}
