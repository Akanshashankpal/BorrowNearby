import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { BrandMark } from "./BrandMark";
import { NotificationButton, ProfileMenu } from "./ProfileMenu";
import { useSearchUi } from "./SearchContext";
import { primaryNav } from "@/constants/navigation";
import { getNotifications } from "@/services/api/notifications";
import { useAuth } from "@/store/AuthProvider";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [unread, setUnread] = useState(0);
  const { setOpen } = useSearchUi();
  const { user } = useAuth();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }
    getNotifications()
      .then((list) => setUnread(list.filter((item) => !item.read).length))
      .catch(() => setUnread(0));
  }, [user]);

  return (
    <motion.header
      initial={reduce ? false : { y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-40 hidden border-b backdrop-blur-md lg:block ${scrolled ? "border-line bg-surface/90 shadow-card" : "border-transparent bg-bg/75"}`}
    >
      <div className={`mx-auto flex max-w-[1480px] items-center gap-3 px-6 ${scrolled ? "h-16" : "h-[4.75rem]"}`}>
        <Link to="/" aria-label="Rentoori home" className="shrink-0">
          <BrandMark labeled />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-12 min-w-0 flex-1 items-center rounded-full border border-line bg-surface px-4 text-left text-sm text-muted xl:max-w-xl xl:mx-auto"
        >
          What are you looking for?
        </button>
        <nav aria-label="Primary" className="flex shrink-0 items-center">
          {primaryNav.map((item) => (
            <Link key={item.href} to={item.href} className="rounded-full px-2.5 py-2 text-sm font-semibold text-ink hover:bg-brand-soft">
              {item.label}
            </Link>
          ))}
          <Link
            to={user?.role === "admin" ? "/admin" : user ? "/list-item" : "/login?next=/list-item"}
            className="ml-1 rounded-full bg-sand px-3 py-2 text-sm font-semibold text-ink"
          >
            {user?.role === "admin" ? "Admin" : "List Your Item"}
          </Link>
          <NotificationButton count={unread} />
          <ProfileMenu />
        </nav>
      </div>
    </motion.header>
  );
}
