import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { PanelLeft } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MobileDashboardDrawer } from "@/components/dashboard/MobileDashboardDrawer";
import { PageWrap } from "@/components/layout/PageWrap";
import { adminNav, sellerNav, userNav } from "@/constants/navigation";

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const items = pathname.startsWith("/admin") ? adminNav : pathname.startsWith("/seller") ? sellerNav : userNav;
  return (
    <PageWrap className="py-6 lg:py-8">
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
        <aside className={`sticky top-24 hidden h-fit rounded-3xl border border-line bg-surface p-3 lg:block ${collapsed ? "w-16" : ""}`}>
          <button type="button" className="mb-2 hidden h-10 w-full items-center gap-2 rounded-2xl px-3 text-sm font-semibold hover:bg-brand-soft xl:flex" onClick={() => setCollapsed((value) => !value)}>
            <PanelLeft size={16} aria-hidden />
            {collapsed ? <span className="sr-only">Expand sidebar</span> : "Collapse"}
          </button>
          <DashboardSidebar items={items} collapsed={collapsed} />
        </aside>
        <div className="min-w-0">
          <MobileDashboardDrawer items={items} />
          <Outlet />
        </div>
      </div>
    </PageWrap>
  );
}
