import { BrandMark } from "./BrandMark";

export function PageLoader({ label = "Loading Rentoori" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="grid min-h-[50vh] place-items-center px-6 py-16">
      <div className="grid justify-items-center gap-3 text-center">
        <BrandMark className="h-16 w-16" />
        <p className="text-sm font-semibold text-ink">Rentoori</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}
