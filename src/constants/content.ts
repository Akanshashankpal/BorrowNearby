export const howSteps = [
  {
    step: "01",
    title: "Search",
    body: "Find something you need nearby.",
  },
  {
    step: "02",
    title: "Request",
    body: "Choose your dates and send a request.",
  },
  {
    step: "03",
    title: "Borrow",
    body: "Connect with the owner and collect the item.",
  },
  {
    step: "04",
    title: "Return",
    body: "Return it safely and leave a review.",
  },
] as const;

export const safetyCards = [
  {
    title: "Verified profiles",
    body: "Phone, email, and identity checks help you see who is on the other side of a request.",
  },
  {
    title: "Secure requests",
    body: "Borrowing stays inside a request. Nothing is treated as accepted until the owner confirms.",
  },
  {
    title: "Condition reports",
    body: "Note the item’s condition at pickup and return so both people share the same record.",
  },
  {
    title: "Transparent reviews",
    body: "Ratings come from completed borrows and lends, with comments you can read before you decide.",
  },
  {
    title: "Safe meeting suggestions",
    body: "Pickup points stay approximate until a request is accepted, then lean toward public places.",
  },
  {
    title: "Report & dispute support",
    body: "If something goes wrong, report it from the request. A dispute stays open until it is resolved.",
  },
] as const;

export const trustFactors = [
  { key: "identity", label: "Verified identity" },
  { key: "returns", label: "Successful returns" },
  { key: "reviews", label: "Reviews" },
  { key: "history", label: "Account history" },
  { key: "cancellations", label: "Low cancellation rate" },
] as const;

export const reviewTagOptions = [
  { id: "reliable", label: "Reliable" },
  { id: "friendly", label: "Friendly" },
  { id: "on_time", label: "On time" },
  { id: "as_described", label: "Item as described" },
  { id: "good_communication", label: "Good communication" },
] as const;

export const testimonials = [
  {
    id: "t1",
    quote:
      "I needed a projector for a family screening and found one two kilometres away. It felt closer to borrowing from a neighbour than renting from a shop.",
    name: "Meera Khan",
    area: "Civil Lines, Burhanpur",
    role: "Lender" as const,
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    id: "t2",
    quote:
      "The drill I borrowed saved me buying a tool I would use twice. Pickup was at the garden gate, not someone’s front door.",
    name: "Rahul Verma",
    area: "Shah Bazaar",
    role: "Borrower" as const,
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    id: "t3",
    quote:
      "I listed a guitar that was sitting in a case. A student nearby borrowed it for a week and brought it back in tune.",
    name: "Sana Iqbal",
    area: "Lal Bagh",
    role: "Lender" as const,
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400&q=80",
  },
] as const;

export const helpTopics = [
  {
    title: "How borrowing works",
    body: "Search, send a request with your dates, and wait for the owner to accept. Pickup details stay approximate until then.",
  },
  {
    title: "Free and paid items",
    body: "Some neighbours share for free. Paid items show a daily price and any security deposit. The payable total comes from the request quote.",
  },
  {
    title: "Trust Score",
    body: "Trust Score summarises verification, completed returns, reviews, account history, and cancellations. It is a guide, not a guarantee.",
  },
  {
    title: "If a return is late",
    body: "Message the other person from the request. If you cannot resolve it, open a dispute from the request page.",
  },
  {
    title: "Listing an item",
    body: "Add photos, describe the condition, choose free or paid, and publish. You can pause a listing whenever you need the item yourself.",
  },
] as const;

export const legalCopy = {
  privacy: {
    title: "Privacy",
    body: [
      "Rentoori is built to show approximate pickup areas, not private home addresses, while you are browsing.",
      "Profile pages show the name, photo, trust information, and reviews a person chooses to share. Phone numbers and email addresses stay off public pages.",
      "This preview stores a session and saved items in your browser so the interface can be tried without a backend. A production service should keep accounts, payments, and private messages on the server.",
    ],
  },
  terms: {
    title: "Terms",
    body: [
      "Rentoori connects people who want to borrow with people willing to share. A request is only accepted when the owner confirms it.",
      "Prices, deposits, and fees shown at checkout come from the quote attached to that request. The website does not decide the final payable amount on its own.",
      "You are responsible for describing your item honestly and for returning borrowed things in the condition you received them, fair wear excepted.",
    ],
  },
  cookies: {
    title: "Cookies",
    body: [
      "This preview uses local storage for your theme, session, wishlist, and listing draft. It does not set advertising cookies.",
      "If a production backend is connected, sign-in may use secure cookies or tokens issued by that service.",
      "You can clear site data in your browser to remove the preview session.",
    ],
  },
} as const;
