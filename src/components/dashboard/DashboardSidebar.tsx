import { NavLink } from "react-router-dom";
import {
  Bell,
  Boxes,
  Heart,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  Package,
  Settings,
  Shield,
  Users,
  Wallet,
} from "lucide-react";

const icons = {
  layout: LayoutDashboard,
  package: Package,
  boxes: Boxes,
  inbox: Inbox,
  heart: Heart,
  message: MessageCircle,
  bell: Bell,
  megaphone: Megaphone,
  shield: Shield,
  wallet: Wallet,
  settings: Settings,
  users: Users,
};

export type DashboardLink = {
  label: string;
  href: string;
  icon: keyof typeof icons;
};

export function DashboardSidebar({
  items,
  onNavigate,
  collapsed,
}: {
  items: readonly DashboardLink[];
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const root = items[0]?.href;
  return (
    <nav aria-label="Dashboard" className="grid gap-1">
      {items.map((item) => {
        const Icon = icons[item.icon];
        return (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === root}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold ${isActive ? "bg-brand text-white" : "text-ink hover:bg-brand-soft"}`
            }
          >
            <Icon size={18} aria-hidden />
            {collapsed ? <span className="sr-only">{item.label}</span> : item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
