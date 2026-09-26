import { useParams } from "react-router-dom";
import { ItemGrid } from "@/components/items/ItemGrid";
import { ReviewCard } from "@/components/items/ReviewCard";
import { PageMeta } from "@/components/layout/PageMeta";
import { PageWrap } from "@/components/layout/PageWrap";
import { ErrorState } from "@/components/ui/ErrorState";
import { Photo } from "@/components/ui/Photo";
import { Rating } from "@/components/ui/Rating";
import { SkeletonProfile } from "@/components/ui/Skeleton";
import { TrustScore } from "@/components/ui/TrustScore";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { useAsync } from "@/hooks/useAsync";
import { userById } from "@/services/mock/db";
import { getItems } from "@/services/api/items";
import { getReviews } from "@/services/api/reviews";
import { getUser } from "@/services/api/users";
import { formatDate } from "@/utils/format";
import { usePlace } from "@/store/LocationProvider";

export default function UserProfilePage() {
  const { id = "" } = useParams();
  const place = usePlace();
  const state = useAsync(async () => {
    const user = await getUser(id);
    const [listed, reviews] = await Promise.all([
      getItems({ ownerId: id, status: "any", pageSize: 12, origin: place.coords }),
      getReviews(undefined, id),
    ]);
    return { user, listed: listed.items.filter((item) => item.status !== "draft"), reviews };
  }, [id, place.coords.lat, place.coords.lng]);

  if (state.status === "loading") return <PageWrap className="py-8"><SkeletonProfile /></PageWrap>;
  if (state.status === "error" || !state.data) return <PageWrap className="py-8"><ErrorState body={state.error} onRetry={state.reload} /></PageWrap>;
  const { user, listed, reviews } = state.data;
  return (
    <>
      <PageMeta title={user.name} description={`${user.name} on Rentoori. ${user.area}, ${user.city}.`} path={`/user/${user.id}`} />
      <PageWrap className="py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Photo src={user.avatarUrl} alt="" className="h-24 w-24 rounded-full object-cover" />
          <div>
            <h1 className="text-3xl font-semibold">{user.name}</h1>
            <p className="text-sm text-muted">{user.area}, {user.city} · Member since {formatDate(user.memberSince)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <VerificationBadge verified={user.verified} />
              <Rating value={user.rating} count={user.reviewCount} />
            </div>
          </div>
          <div className="sm:ml-auto"><TrustScore score={user.trust.score} label={user.trust.label} /></div>
        </div>
        <p className="mt-6 max-w-2xl text-muted">{user.bio}</p>
        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Successful borrows" value={String(user.successfulBorrows)} />
          <Stat label="Successful lends" value={String(user.successfulLends)} />
          <Stat label="Phone" value="Hidden" />
          <Stat label="Email" value="Hidden" />
        </dl>
        <h2 className="mt-10 text-2xl font-semibold">Listed items</h2>
        <div className="mt-4"><ItemGrid items={listed} /></div>
        <h2 className="mt-10 text-2xl font-semibold">Reviews</h2>
        <div className="mt-4 grid gap-3">
          {reviews.map((review) => <ReviewCard key={review.id} review={review} author={userById(review.authorId)} />)}
        </div>
      </PageWrap>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-surface p-4">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="text-xl font-semibold">{value}</dd>
    </div>
  );
}
