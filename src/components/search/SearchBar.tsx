import { Search } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  onFocus,
  placeholder = "What are you looking for?",
  labelled = true,
}: {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  labelled?: boolean;
}) {
  return (
    <label className="flex h-12 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm">
      <Search size={16} className="text-muted" aria-hidden />
      {labelled ? <span className="sr-only">Search Rentoori</span> : null}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
      />
    </label>
  );
}
