import type { Review, User } from "@/types";
import { reviewTagOptions } from "@/constants/content";
import { Photo } from "@/components/ui/Photo";
import { Rating } from "@/components/ui/Rating";
import { formatDate } from "@/utils/format";

export function ReviewCard({ review, author }: { review: Review; author?: User }) {
  return (
    <article className="rounded-3xl border border-line bg-surface p-4">
      <div className="flex items-center gap-3">
        <Photo src={author?.avatarUrl} alt="" className="h-11 w-11 rounded-full object-cover" />
        <div>
          <p className="font-semibold">{author?.name ?? "Neighbour"}</p>
          <p className="text-xs text-muted">
            {review.role === "borrower" ? "Borrower" : "Lender"} · {formatDate(review.createdAt)}
          </p>
        </div>
        <div className="ml-auto">
          <Rating value={review.rating} />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink">{review.comment}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {review.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-sand-soft px-2.5 py-1 text-xs font-semibold text-ink">
            {reviewTagOptions.find((option) => option.id === tag)?.label ?? tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
