import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { NotificationButton, ProfileMenu } from "./ProfileMenu";
import { useSearchUi } from "./SearchContext";
import { getNotifications } from "@/services/api/notifications";
import { useAuth } from "@/store/AuthProvider";

export function MobileNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [unread, setUnread] = useState(0);
  const { setOpen } = useSearchUi();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!user) return;
    getNotifications()
      .then((list) => setUnread(list.filter((item) => !item.read).length))
      .catch(() => setUnread(0));
  }, [user]);

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-md lg:hidden ${scrolled ? "border-line bg-surface/95 shadow-card" : "border-transparent bg-bg/90"}`}>
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/" aria-label="Rentoori home">
          <BrandMark className="h-11 w-11" />
        </Link>
        <div className="flex items-center gap-1">
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full" aria-label="Search" onClick={() => setOpen(true)}>
            <Search size={18} />
          </button>
          <NotificationButton count={unread} />
          <ProfileMenu compact />
        </div>
      </div>
    </header>
  );
}
