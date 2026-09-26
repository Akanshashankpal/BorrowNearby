import type { Review, ReviewInput } from "@/types";
import { items, reviews } from "@/services/mock/db";
import { nid } from "@/utils/format";
import { ApiError, api, mockMode, wait } from "./client";
import { readSession } from "./session";

export async function getReviews(itemId?: string, authorOrOwnerId?: string) {
  if (!mockMode) {
    const { data } = await api.get<Review[]>("/reviews", { params: { itemId, userId: authorOrOwnerId } });
    return data;
  }
  await wait(140);
  return reviews.filter((review) => {
    if (itemId && review.itemId !== itemId) return false;
    if (authorOrOwnerId) {
      const item = items.find((entry) => entry.id === review.itemId);
      const involved = review.authorId === authorOrOwnerId || item?.ownerId === authorOrOwnerId;
      if (!involved) return false;
    }
    return true;
  });
}

export async function createReview(input: ReviewInput) {
  const session = readSession();
  if (!session) throw new ApiError("Sign in to leave a review.", 401);
  if (!mockMode) {
    const { data } = await api.post<Review>("/reviews", input);
    return data;
  }
  await wait(240);
  const review: Review = {
    id: nid("rev"),
    itemId: input.itemId,
    authorId: session.user.id,
    rating: input.rating,
    comment: input.comment,
    tags: input.tags,
    createdAt: new Date().toISOString(),
    role: "borrower",
  };
  reviews.unshift(review);
  const item = items.find((entry) => entry.id === input.itemId);
  if (item) {
    const relevant = reviews.filter((entry) => entry.itemId === item.id);
    item.reviewCount = relevant.length;
    item.rating = Math.round((relevant.reduce((sum, entry) => sum + entry.rating, 0) / relevant.length) * 10) / 10;
  }
  return review;
}
