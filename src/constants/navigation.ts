export const primaryNav = [
  { label: "Browse", href: "/discover" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Safety", href: "/safety" },
] as const;

export const userNav = [
  { label: "Overview", href: "/dashboard", icon: "layout" },
  { label: "My Borrowings", href: "/dashboard/borrowings", icon: "package" },
  { label: "Requests", href: "/dashboard/requests", icon: "inbox" },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: "heart" },
  { label: "Messages", href: "/dashboard/messages", icon: "message" },
  { label: "Notifications", href: "/dashboard/notifications", icon: "bell" },
  { label: "Post a Need", href: "/needs/create", icon: "megaphone" },
  { label: "Trust & Verification", href: "/dashboard/trust", icon: "shield" },
  { label: "Payments", href: "/dashboard/payments", icon: "wallet" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
] as const;

export const sellerNav = [
  { label: "Overview", href: "/seller", icon: "layout" },
  { label: "My Items", href: "/seller/items", icon: "boxes" },
  { label: "Requests", href: "/seller/requests", icon: "inbox" },
  { label: "Messages", href: "/seller/messages", icon: "message" },
  { label: "Notifications", href: "/seller/notifications", icon: "bell" },
  { label: "List an item", href: "/list-item", icon: "megaphone" },
  { label: "Earnings", href: "/seller/payments", icon: "wallet" },
  { label: "Trust", href: "/seller/trust", icon: "shield" },
  { label: "Settings", href: "/seller/settings", icon: "settings" },
] as const;

export const adminNav = [
  { label: "Overview", href: "/admin", icon: "layout" },
  { label: "People", href: "/admin/users", icon: "users" },
  { label: "Listings", href: "/admin/listings", icon: "boxes" },
  { label: "Requests", href: "/admin/requests", icon: "inbox" },
  { label: "Needs", href: "/admin/needs", icon: "megaphone" },
] as const;

export const footerExplore = [
  { label: "Discover", href: "/discover" },
  { label: "Map", href: "/map" },
  { label: "Free items", href: "/discover?price=free" },
  { label: "Needs nearby", href: "/needs" },
  { label: "List your item", href: "/list-item" },
] as const;

export const footerCompany = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Safety", href: "/safety" },
  { label: "Community needs", href: "/needs" },
  { label: "Ask Rentoori", href: "/#ask-rentoori" },
] as const;

export const footerSupport = [
  { label: "Help Center", href: "/help" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerLegal = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
] as const;

export const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "LinkedIn", href: "https://www.linkedin.com", icon: "linkedin" },
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
] as const;
