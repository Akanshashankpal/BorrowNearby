export type ThemeMode = "light" | "dark" | "system";

export type AccountRole = "user" | "seller" | "admin";

export type PriceType = "free" | "paid";

export type ItemCondition = "new" | "like_new" | "good" | "fair";

export type ListingStatus = "available" | "reserved" | "borrowed" | "paused" | "draft";

export type RequestStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "active"
  | "return_pending"
  | "completed"
  | "disputed";

export type ReviewTag =
  | "reliable"
  | "friendly"
  | "on_time"
  | "as_described"
  | "good_communication";

export type NotificationType =
  | "request"
  | "message"
  | "payment"
  | "return"
  | "wishlist"
  | "need"
  | "system";

export type MessageKind = "text" | "image" | "item" | "request";

export type Handover = "pickup" | "delivery";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Verification {
  phone: boolean;
  email: boolean;
  identity: boolean;
}

export interface TrustFactors {
  identity: number;
  returns: number;
  reviews: number;
  history: number;
  cancellations: number;
}

export interface TrustScore {
  score: number;
  label: string;
  factors: TrustFactors;
}

export interface User {
  id: string;
  role: AccountRole;
  name: string;
  email: string;
  avatarUrl: string;
  area: string;
  city: string;
  memberSince: string;
  bio: string;
  verified: boolean;
  verification: Verification;
  trust: TrustScore;
  rating: number;
  reviewCount: number;
  successfulBorrows: number;
  successfulLends: number;
  phoneMasked: string;
}

export interface PublicUser {
  id: string;
  name: string;
  avatarUrl: string;
  verified: boolean;
  trustScore: number;
  trustLabel: string;
  rating: number;
  area: string;
  memberSince: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  imageUrl: string;
  subcategories: string[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  categorySlug: string;
  images: string[];
  priceType: PriceType;
  pricePerDay: number;
  deposit: number;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  areaLabel: string;
  pickupLabel: string;
  availableToday: boolean;
  ownerId: string;
  condition: ItemCondition;
  included: string[];
  rules: string[];
  deliveryAvailable: boolean;
  status: ListingStatus;
  views: number;
  requestCount: number;
  coords: GeoPoint;
  availableDates: string[];
  createdAt: string;
}

export interface ItemWithOwner extends Item {
  owner: PublicUser;
}

export interface Review {
  id: string;
  itemId: string;
  authorId: string;
  rating: number;
  comment: string;
  tags: ReviewTag[];
  createdAt: string;
  role: "borrower" | "lender";
}

export interface TimelineStep {
  key: string;
  label: string;
  at?: string;
  done: boolean;
  current?: boolean;
}

export interface ConditionReport {
  pickupNotes: string;
  returnNotes?: string;
  pickupPhotos: string[];
  returnPhotos: string[];
}

export interface BorrowRequest {
  id: string;
  itemId: string;
  borrowerId: string;
  ownerId: string;
  status: RequestStatus;
  startDate: string;
  endDate: string;
  message: string;
  rental: number;
  serviceFee: number;
  deposit: number;
  total: number;
  currency: "INR";
  createdAt: string;
  timeline: TimelineStep[];
  conditionReport?: ConditionReport;
}

export interface NeedPost {
  id: string;
  userId: string;
  title: string;
  categorySlug: string;
  description: string;
  date: string;
  duration: string;
  area: string;
  radiusKm: number;
  budget: number;
  freePreferred: boolean;
  paidAcceptable: boolean;
  distanceKm: number;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  itemId?: string;
  requestId?: string;
  updatedAt: string;
  peerTyping: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  kind: MessageKind;
  body: string;
  createdAt: string;
  read: boolean;
  itemId?: string;
  requestId?: string;
  imageUrl?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href: string;
}

export interface WishlistEntry {
  itemId: string;
  notify: boolean;
  savedAt: string;
}

export interface PaymentIntent {
  id: string;
  requestId: string;
  rental: number;
  serviceFee: number;
  deposit: number;
  total: number;
  currency: "INR";
  status: "requires_payment" | "confirmed" | "failed";
  method?: "upi" | "card";
}

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  kind: "rental" | "deposit" | "earning" | "fee";
  status: "pending" | "confirmed" | "held";
  createdAt: string;
}

export interface Dispute {
  id: string;
  requestId: string;
  reason: string;
  status: "open" | "resolved";
  createdAt: string;
}

export interface ItemQuery {
  q?: string;
  category?: string;
  price?: "free" | "paid" | "any";
  condition?: ItemCondition | "any";
  availability?: "today" | "any";
  handover?: "pickup" | "delivery" | "any";
  minRating?: number;
  maxDistance?: number;
  sort?: "distance" | "price_asc" | "price_desc" | "rating" | "newest";
  page?: number;
  pageSize?: number;
  origin?: GeoPoint;
  ownerId?: string;
  status?: ListingStatus | "any";
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BorrowQuote {
  rental: number;
  serviceFee: number;
  deposit: number;
  total: number;
  currency: "INR";
  days: number;
}

export interface CommunityStats {
  source: "preview" | "api";
  users: number;
  itemsShared: number;
  successfulBorrows: number;
  rating: number;
}

export interface AskSuggestion {
  id: string;
  name: string;
  categorySlug: string;
  reason: string;
}

export interface AskResult {
  source: "catalog-matcher";
  query: string;
  suggestions: AskSuggestion[];
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface DashboardSummary {
  activeBorrowings: number;
  activeListings: number;
  pendingRequests: number;
  sentPending: number;
  earnings: number;
  trustScore: number;
  trustLabel: string;
  recent: AppNotification[];
}

export interface SearchSuggestions {
  items: ItemWithOwner[];
  categories: Category[];
  needs: NeedPost[];
}

export interface ListingInput {
  name: string;
  description: string;
  categorySlug: string;
  images: string[];
  priceType: PriceType;
  pricePerDay: number;
  deposit: number;
  condition: ItemCondition;
  included: string[];
  rules: string[];
  deliveryAvailable: boolean;
  areaLabel: string;
  pickupInstructions: string;
  availableFrom: string;
  availableTo: string;
  status?: ListingStatus;
}

export interface NeedInput {
  title: string;
  categorySlug: string;
  description: string;
  date: string;
  duration: string;
  area: string;
  radiusKm: number;
  budget: number;
  freePreferred: boolean;
  paidAcceptable: boolean;
}

export interface ReviewInput {
  itemId: string;
  requestId: string;
  rating: number;
  comment: string;
  tags: ReviewTag[];
}

export interface BorrowPlaceInput {
  itemId: string;
  startDate: string;
  endDate: string;
  message: string;
}
