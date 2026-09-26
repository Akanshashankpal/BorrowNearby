import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { ItemWithOwner } from "@/types";
import { Photo } from "@/components/ui/Photo";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Rating } from "@/components/ui/Rating";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { useAuth } from "@/store/AuthProvider";
import { useToast } from "@/store/ToastProvider";
import { useWishlist } from "@/store/WishlistProvider";
import { formatDistance } from "@/utils/format";
import { cn } from "@/utils/cn";

export function ItemCard({ item, layout = "grid" }: { item: ItemWithOwner; layout?: "grid" | "list" }) {
  const { user } = useAuth();
  const wishlist = useWishlist();
  const { push } = useToast();
  const saved = wishlist.has(item.id);

  function onSave() {
    if (!user) {
      push({ title: "Log in to save items.", tone: "info" });
      return;
    }
    wishlist.toggle(item.id);
    push({ title: saved ? "Removed from saved items." : "Item saved.", tone: "success" });
  }

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-sm",
        layout === "list" && "sm:grid sm:grid-cols-[220px_minmax(0,1fr)]",
      )}
    >
      <div
        className={cn(
          "relative aspect-[4/3] shrink-0 overflow-hidden",
          layout === "list" && "sm:aspect-auto sm:h-full sm:min-h-44",
        )}
      >
        <Link to={`/item/${item.id}`} className="absolute inset-0 block" tabIndex={-1} aria-hidden>
          <Photo
            src={item.images[0]}
            alt=""
            className="h-full w-full object-cover transition duration-500 [@media(hover:hover)]:group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-3 top-3">
          {item.priceType === "free" ? <StatusBadge status="free" /> : item.availableToday ? <StatusBadge status="available" /> : <StatusBadge status={item.status} />}
        </div>
        <motion.button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${item.name} from saved items` : `Save ${item.name}`}
          onClick={onSave}
          whileTap={{ scale: 0.9 }}
          className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-surface/95 text-ink shadow-sm"
        >
          <Heart size={18} className={saved ? "fill-brand text-brand" : ""} />
        </motion.button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug">
            <Link to={`/item/${item.id}`} className="hover:text-brand">
              {item.name}
            </Link>
          </h3>
          <PriceDisplay priceType={item.priceType} pricePerDay={item.pricePerDay} />
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <Rating value={item.rating} />
          <span>{formatDistance(item.distanceKm)}</span>
          <span>{item.availableToday ? "Available today" : "Check dates"}</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <p className="flex items-center gap-2 text-sm">
            <Photo src={item.owner.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
            <span>
              <span className="block font-semibold text-ink">{item.owner.name}</span>
              <VerificationBadge verified={item.owner.verified} />
            </span>
          </p>
          <Link
            to={`/item/${item.id}`}
            className="inline-flex h-10 items-center rounded-full bg-brand px-4 text-sm font-semibold text-white transition [@media(hover:hover)]:hover:brightness-110"
          >
            View Item
          </Link>
        </div>
      </div>
    </article>
  );
}
