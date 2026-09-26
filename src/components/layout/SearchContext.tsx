import { createContext, useContext, useState, type ReactNode } from "react";

const SearchContext = createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <SearchContext.Provider value={{ open, setOpen }}>{children}</SearchContext.Provider>;
}

export function useSearchUi() {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearchUi must be used within SearchProvider");
  return context;
}
