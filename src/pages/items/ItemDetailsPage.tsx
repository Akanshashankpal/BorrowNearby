import { Link, useParams } from "react-router-dom";
import { AvailabilityCalendar } from "@/components/items/AvailabilityCalendar";
import { ItemGallery } from "@/components/items/ItemGallery";
import { ItemGrid } from "@/components/items/ItemGrid";
import { OwnerCard } from "@/components/items/OwnerCard";
import { ReviewCard } from "@/components/items/ReviewCard";
import { PageMeta } from "@/components/layout/PageMeta";
import { PageWrap } from "@/components/layout/PageWrap";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Rating } from "@/components/ui/Rating";
import { SkeletonDetails } from "@/components/ui/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { getItem, getRelated } from "@/services/api/items";
import { getReviews } from "@/services/api/reviews";
import { userById } from "@/services/mock/db";
import { conditionLabel, formatDistance, formatInr } from "@/utils/format";
import { useAuth } from "@/store/AuthProvider";
import { usePlace } from "@/store/LocationProvider";

export default function ItemDetailsPage() {
  const { id = "" } = useParams();
  const place = usePlace();
  const state = useAsync(async () => {
    const item = await getItem(id, place.coords);
    const [related, reviews] = await Promise.all([getRelated(id), getReviews(id)]);
    return { item, related, reviews };
  }, [id, place.coords.lat, place.coords.lng]);

  if (state.status === "loading") {
    return <PageWrap className="py-8"><SkeletonDetails /></PageWrap>;
  }
  if (state.status === "error" || !state.data) {
    return <PageWrap className="py-8"><ErrorState title="Unable to load this item." body={state.error} onRetry={state.reload} /></PageWrap>;
  }
  const { item, related, reviews } = state.data;
  return (
    <>
      <PageMeta title={item.name} description={item.description} path={`/item/${item.id}`} jsonLd={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: item.name,
        description: item.description,
        image: item.images,
      }} />
      <PageWrap className="py-6 pb-28 lg:pb-10">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <ItemGallery images={item.images} name={item.name} />
          <div className="grid content-start gap-4">
            <p className="text-sm text-muted">{item.areaLabel} · {formatDistance(item.distanceKm)}</p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{item.name}</h1>
            <Rating value={item.rating} count={item.reviewCount} />
            <PriceDisplay priceType={item.priceType} pricePerDay={item.pricePerDay} />
            <p className="text-sm text-muted">Security deposit {item.deposit ? formatInr(item.deposit) : "none"} · {item.availableToday ? "Available today" : "See the calendar"}</p>
            <OwnerCard owner={item.owner} />
            <div className="hidden lg:block">
              <BorrowActions itemId={item.id} ownerId={item.ownerId} />
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="mt-3 text-muted">{item.description}</p>
            <h2 className="mt-8 text-2xl font-semibold">Condition</h2>
            <p className="mt-2">{conditionLabel(item.condition)}</p>
            <h2 className="mt-8 text-2xl font-semibold">What’s included</h2>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted">{item.included.map((entry) => <li key={entry}>{entry}</li>)}</ul>
            <h2 className="mt-8 text-2xl font-semibold">Rules</h2>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted">{item.rules.map((entry) => <li key={entry}>{entry}</li>)}</ul>
          </section>
          <section className="grid gap-6">
            <div>
              <h2 className="text-2xl font-semibold">Availability</h2>
              <div className="mt-3"><AvailabilityCalendar dates={item.availableDates} /></div>
            </div>
            <div className="rounded-3xl bg-sand-soft p-5">
              <h2 className="text-lg font-semibold">Pickup</h2>
              <p className="mt-2 text-sm">{item.pickupLabel}</p>
              <p className="mt-2 text-sm text-muted">Exact address is shared only after a request is accepted.</p>
              <h2 className="mt-4 text-lg font-semibold">Delivery</h2>
              <p className="mt-2 text-sm">{item.deliveryAvailable ? "The owner may deliver inside the area. Confirm it in the request." : "Pickup only."}</p>
            </div>
          </section>
        </div>
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Reviews</h2>
          <div className="mt-4 grid gap-3">
            {reviews.length === 0 ? <p className="text-sm text-muted">No reviews yet.</p> : reviews.map((review) => (
              <ReviewCard key={review.id} review={review} author={userById(review.authorId)} />
            ))}
          </div>
        </section>
        <section className="mt-10 rounded-3xl border border-line p-5">
          <h2 className="text-xl font-semibold">Safety</h2>
          <p className="mt-2 text-sm text-muted">Meet at the public pickup point, check the condition together, and keep messages on Rentoori. <Link to="/safety" className="font-semibold text-brand">Visit the Safety Center</Link></p>
        </section>
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Related items</h2>
          <div className="mt-4"><ItemGrid items={related} /></div>
        </section>
      </PageWrap>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface p-3 lg:hidden">
        <BorrowActions itemId={item.id} ownerId={item.ownerId} stacked />
      </div>
    </>
  );
}

function BorrowActions({ itemId, ownerId, stacked }: { itemId: string; ownerId: string; stacked?: boolean }) {
  const { user } = useAuth();
  if (user?.role === "seller" && user.id === ownerId) {
    return <Button href="/seller/items" className={stacked ? "w-full" : undefined}>Manage this listing</Button>;
  }
  if (user && user.role !== "user") {
    return <p className="text-sm text-muted">Borrowing is available on a user account.</p>;
  }
  return (
    <div className={stacked ? "grid gap-2" : "grid gap-2"}>
      <Button href={`/item/${itemId}/request`} className={stacked ? "w-full" : undefined}>Request to Borrow</Button>
      {stacked ? null : (
        <Button href={user ? "/dashboard/messages" : "/login?next=/dashboard/messages"} variant="secondary">Message owner</Button>
      )}
    </div>
  );
}
