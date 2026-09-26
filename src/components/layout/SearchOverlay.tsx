import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { askRentoori } from "@/services/ai/askRentoori";
import { suggest } from "@/services/api/search";
import { popularSearches } from "@/constants/brand";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSearchUi } from "./SearchContext";
import { SearchBar } from "@/components/search/SearchBar";
import type { AskResult, SearchSuggestions } from "@/types";

const RECENT = "rentoori_recent";

function readRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT) || "[]") as string[];
  } catch {
    return [];
  }
}

export function SearchOverlay() {
  const { open, setOpen } = useSearchUi();
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 250);
  const [results, setResults] = useState<SearchSuggestions | null>(null);
  const [ask, setAsk] = useState<AskResult | null>(null);
  const [recent, setRecent] = useState<string[]>(readRecent);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    suggest(debounced).then((next) => {
      if (active) setResults(next);
    });
    return () => {
      active = false;
    };
  }, [debounced, open]);

  function remember(value: string) {
    const next = [value, ...recent.filter((item) => item !== value)].slice(0, 5);
    setRecent(next);
    localStorage.setItem(RECENT, JSON.stringify(next));
  }

  function go(value: string) {
    if (value.trim()) remember(value.trim());
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 bg-ink/40 p-0 sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label="Close search" className="absolute inset-0" onClick={() => setOpen(false)} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search Rentoori"
            className="relative mx-auto flex h-full w-full flex-col bg-bg p-4 sm:h-auto sm:max-h-[80vh] sm:max-w-2xl sm:overflow-auto sm:rounded-[1.75rem] sm:p-6"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();
                go(query);
              }}
            >
              <SearchBar value={query} onChange={setQuery} labelled={false} placeholder="What do you need today?" />
            </form>
            <div className="mt-5 grid gap-5 overflow-auto">
              {recent.length ? (
                <SuggestionGroup title="Recent searches">
                  {recent.map((item) => (
                    <button key={item} type="button" className="text-left text-sm font-semibold" onClick={() => go(item)}>
                      {item}
                    </button>
                  ))}
                </SuggestionGroup>
              ) : null}
              <SuggestionGroup title="Popular searches">
                {popularSearches.map((item) => (
                  <button key={item} type="button" className="rounded-full bg-surface px-3 py-2 text-sm font-semibold" onClick={() => go(item)}>
                    {item}
                  </button>
                ))}
              </SuggestionGroup>
              <SuggestionGroup title="Categories">
                {results?.categories.map((category) => (
                  <Link key={category.slug} to={`/category/${category.slug}`} onClick={() => setOpen(false)} className="text-sm font-semibold">
                    {category.name}
                  </Link>
                ))}
              </SuggestionGroup>
              <SuggestionGroup title="Items">
                {results?.items.map((item) => (
                  <Link key={item.id} to={`/item/${item.id}`} onClick={() => setOpen(false)} className="text-sm font-semibold">
                    {item.name}
                  </Link>
                ))}
              </SuggestionGroup>
              <SuggestionGroup title="Needs">
                {results?.needs.map((need) => (
                  <Link key={need.id} to="/needs" onClick={() => setOpen(false)} className="text-sm font-semibold">
                    {need.title}
                  </Link>
                ))}
              </SuggestionGroup>
              <section className="rounded-3xl bg-brand-soft p-4">
                <h2 className="font-semibold">Ask Rentoori</h2>
                <p className="mt-1 text-xs text-muted">Matched from the catalog. This preview does not call an AI service.</p>
                <button
                  type="button"
                  className="mt-3 text-sm font-semibold text-brand"
                  onClick={() => {
                    void askRentoori(query || "movie night").then(setAsk);
                  }}
                >
                  Suggest things for this search
                </button>
                {ask ? (
                  <ul className="mt-3 grid gap-2">
                    {ask.suggestions.map((item) => (
                      <li key={item.id}>
                        <Link to={`/category/${item.categorySlug}`} onClick={() => setOpen(false)} className="text-sm font-semibold">
                          {item.name}
                        </Link>
                        <p className="text-xs text-muted">{item.reason}</p>
                      </li>
                    ))}
                    <li>
                      <button type="button" className="text-sm font-semibold text-brand" onClick={() => go(ask.suggestions.map((item) => item.name).join(" "))}>
                        Find these near me
                      </button>
                    </li>
                  </ul>
                ) : null}
              </section>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function SuggestionGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{title}</h2>
      <div className="flex flex-wrap gap-3">{children}</div>
    </section>
  );
}
