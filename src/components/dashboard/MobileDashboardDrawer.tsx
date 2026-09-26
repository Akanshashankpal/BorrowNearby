import { Menu } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { DashboardSidebar, type DashboardLink } from "./DashboardSidebar";

export function MobileDashboardDrawer({ items }: { items: readonly DashboardLink[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4 lg:hidden">
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-semibold">
        <Menu size={16} aria-hidden />
        Dashboard menu
      </button>
      <Modal open={open} title="Dashboard" onClose={() => setOpen(false)}>
        <DashboardSidebar items={items} onNavigate={() => setOpen(false)} />
      </Modal>
    </div>
  );
}
