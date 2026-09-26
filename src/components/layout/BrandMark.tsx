import { brand } from "@/constants/brand";
import { cn } from "@/utils/cn";

export function BrandMark({
  className,
  labeled = false,
}: {
  className?: string;
  labeled?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src={brand.logo}
        alt={labeled ? "" : brand.name}
        className={cn("h-10 w-10 object-contain", className)}
      />
      {labeled ? (
        <span className="leading-tight">
          <span className="block text-base font-semibold tracking-tight text-ink">{brand.name}</span>
          <span className="block text-[11px] font-medium tracking-wide text-muted">{brand.tagline}</span>
        </span>
      ) : null}
    </span>
  );
}
