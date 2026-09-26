import { Link } from "react-router-dom";
import { categoryIcons } from "./categoryIcons";
import { plural } from "@/utils/format";

export function CategoryCard({
  slug,
  name,
  count,
}: {
  slug: string;
  name: string;
  count: number;
}) {
  const Icon = categoryIcons[slug] ?? categoryIcons.home;
  return (
    <Link
      to={`/category/${slug}`}
      className="group flex w-[9.25rem] shrink-0 snap-start flex-col gap-3 rounded-3xl border border-line bg-surface p-4 transition duration-200 [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-card md:w-auto"
    >
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand">
        <Icon size={20} aria-hidden />
      </span>
      <span>
        <span className="block font-semibold text-ink">{name}</span>
        <span className="block text-xs text-muted">{plural(count, "item")}</span>
      </span>
    </Link>
  );
}
