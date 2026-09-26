import type { AskResult, AskSuggestion } from "@/types";

/**
 * Catalog matcher for the Ask Rentoori box.
 * This does not call an AI model. Swap the body for a backend request
 * when a hosted assistant exists.
 */
const plans: Array<{ test: RegExp; suggestions: AskSuggestion[] }> = [
  {
    test: /movie|film|cinema|projector|screen/i,
    suggestions: [
      { id: "projector", name: "Projector", categorySlug: "projectors", reason: "A wall and a dark room are enough." },
      { id: "speaker", name: "Speaker", categorySlug: "party", reason: "Laptop speakers disappear in a group." },
      { id: "seating", name: "Extra seating", categorySlug: "home", reason: "Chairs or cushions for everyone." },
      { id: "decor", name: "Decorations", categorySlug: "party", reason: "Lights if you want it to feel like an occasion." },
    ],
  },
  {
    test: /camp|tent|trek|outdoor/i,
    suggestions: [
      { id: "tent", name: "Tent", categorySlug: "camping", reason: "Sleeping space for a short trip." },
      { id: "stove", name: "Camping stove", categorySlug: "camping", reason: "Cooking without buying a full kit." },
    ],
  },
  {
    test: /study|exam|notes|board/i,
    suggestions: [
      { id: "notes", name: "Study notes", categorySlug: "study", reason: "Borrowed notes for a paper you sit once." },
      { id: "lamp", name: "Study lamp", categorySlug: "study", reason: "A brighter desk for late revisions." },
    ],
  },
  {
    test: /drill|shelf|diy|tool|repair/i,
    suggestions: [
      { id: "drill", name: "Drill kit", categorySlug: "tools", reason: "A tool you may only need this afternoon." },
    ],
  },
  {
    test: /photo|camera|wedding|shoot/i,
    suggestions: [
      { id: "camera", name: "DSLR camera", categorySlug: "cameras", reason: "A body and lens for the day." },
      { id: "tripod", name: "Tripod", categorySlug: "cameras", reason: "Steadier pictures after sunset." },
    ],
  },
  {
    test: /party|birthday|gather/i,
    suggestions: [
      { id: "speaker", name: "Speaker and lights", categorySlug: "party", reason: "Sound for a terrace, not a hall." },
      { id: "games", name: "Board games", categorySlug: "party", reason: "Something to do when the playlist ends." },
    ],
  },
];

export async function askRentoori(query: string): Promise<AskResult> {
  const text = query.trim();
  const match = plans.find((plan) => plan.test.test(text));
  const suggestions = match?.suggestions ?? [
    { id: "tools", name: "Tools", categorySlug: "tools", reason: "Useful for a one-off job around the house." },
    { id: "home", name: "Home equipment", categorySlug: "home", reason: "Things people already own nearby." },
    { id: "free", name: "Free to borrow", categorySlug: "books", reason: "Start with items neighbours share at no charge." },
  ];
  return { source: "catalog-matcher", query: text, suggestions };
}
