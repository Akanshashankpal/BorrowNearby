export function TrustScore({ score, label, compact }: { score: number; label: string; compact?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-3 ${compact ? "" : "rounded-3xl bg-brand-soft px-4 py-3"}`}>
      <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-sm font-semibold text-white">{score}</span>
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-muted">Trust Score</span>
      </span>
    </div>
  );
}
