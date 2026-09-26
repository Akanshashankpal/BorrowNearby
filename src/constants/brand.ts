import type { AccountRole, GeoPoint } from "@/types";

export const brand = {
  name: "Rentoori",
  tagline: "Borrow • Rent • Share",
  statement: "Own less. Share more.",
  heroTitle: "Borrow what you need.",
  heroTitleLine: "From people nearby.",
  heroBody:
    "Find useful things around you without buying things you only need temporarily.",
  logo: "/brand/logo.png",
  mark: "/brand/logo-mark.png",
  favicon: "/brand/favicon.png",
} as const;

export const defaultLocation = {
  label: "Burhanpur, MP",
  city: "Burhanpur",
  area: "",
  pincode: "450331",
  coords: { lat: 21.3074, lng: 76.2304 } satisfies GeoPoint,
};

export const portalAccounts: Array<{
  role: AccountRole;
  label: string;
  email: string;
  password: string;
  userId: string;
}> = [
  { role: "user", label: "User", email: "user@rentoori.app", password: "borrow1234", userId: "u-me" },
  { role: "seller", label: "Seller", email: "seller@rentoori.app", password: "owner1234", userId: "u-seller" },
  { role: "admin", label: "Admin", email: "admin@rentoori.app", password: "admin1234", userId: "u-admin" },
];

export const popularSearches = [
  "Projector",
  "Drill",
  "DSLR camera",
  "Camping tent",
  "Board games",
  "Study notes",
];
