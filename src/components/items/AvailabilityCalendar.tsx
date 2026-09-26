export function AvailabilityCalendar({ dates }: { dates: string[] }) {
  const available = new Set(dates);
  const start = new Date("2026-09-01T00:00:00");
  const cells = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const iso = date.toISOString().slice(0, 10);
    return { iso, day: date.getDate(), open: available.has(iso) };
  });

  return (
    <div>
      <p className="mb-3 text-sm text-muted">September 2026 · shaded days are open in this preview.</p>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell) => (
          <div
            key={cell.iso}
            className={`grid h-10 place-items-center rounded-xl text-sm font-semibold ${cell.open ? "bg-brand-soft text-brand" : "bg-line/50 text-muted"}`}
          >
            <span className="sr-only">{cell.open ? "Available" : "Unavailable"} </span>
            {cell.day}
          </div>
        ))}
      </div>
    </div>
  );
}
