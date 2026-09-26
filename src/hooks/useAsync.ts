import { useEffect, useState } from "react";

export interface AsyncState<T> {
  status: "loading" | "error" | "ready";
  data?: T;
  error?: string;
  reload: () => void;
}

export function useAsync<T>(factory: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<Omit<AsyncState<T>, "reload">>({ status: "loading" });

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    factory()
      .then((data) => {
        if (active) setState({ status: "ready", data });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState({
          status: "error",
          error: error instanceof Error ? error.message : "Something went wrong.",
        });
      });
    return () => {
      active = false;
    };
    // factory is recreated by callers; deps are the explicit contract.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { ...state, reload: () => setTick((value) => value + 1) };
}
