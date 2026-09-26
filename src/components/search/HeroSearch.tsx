import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { LocationSelector } from "./LocationSelector";
import { usePlace } from "@/store/LocationProvider";

export function HeroSearch() {
  const navigate = useNavigate();
  const place = usePlace();
  const [what, setWhat] = useState("");
  const [when, setWhen] = useState("");

  return (
    <form
      className="grid gap-3 rounded-[1.75rem] border border-line bg-surface p-3 shadow-card md:grid-cols-[1.2fr_1fr_0.8fr_auto] md:items-end md:p-4"
      onSubmit={(event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        if (what.trim()) params.set("q", what.trim());
        if (when) params.set("when", when);
        params.set("where", place.label);
        navigate(`/search?${params.toString()}`);
      }}
    >
      <label className="grid gap-1 px-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">What</span>
        <input
          value={what}
          onChange={(event) => setWhat(event.target.value)}
          placeholder="What do you need?"
          className="bg-transparent text-base font-medium text-ink outline-none placeholder:text-muted"
          aria-label="What do you need?"
        />
      </label>
      <div className="border-t border-line pt-2 md:border-t-0 md:border-l md:pl-3 md:pt-0">
        <LocationSelector />
      </div>
      <label className="grid gap-1 border-t border-line px-2 pt-2 md:border-t-0 md:border-l md:pl-3 md:pt-0">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">When</span>
        <input
          type="date"
          value={when}
          onChange={(event) => setWhen(event.target.value)}
          className="bg-transparent text-sm font-medium text-ink outline-none"
          aria-label="When do you need it?"
        />
      </label>
      <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-5 text-[15px] font-semibold text-white">
        <Search size={18} aria-hidden />
        Search
      </button>
    </form>
  );
}
