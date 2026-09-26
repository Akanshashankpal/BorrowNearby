import { Component, lazy, Suspense, useState, type ReactNode } from "react";
import type { GeoPoint, ItemWithOwner } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";

const LeafletMap = lazy(() => import("./LeafletMap").then((module) => ({ default: module.LeafletMap })));

export function DiscoveryMap(props: {
  items: ItemWithOwner[];
  center: GeoPoint;
  radiusKm: number;
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <div className="grid h-full place-items-center rounded-3xl bg-brand-soft p-6 text-sm">Map tiles could not be loaded.</div>;
  }
  return (
    <div className={props.className}>
      <Suspense fallback={<Skeleton className="h-full min-h-64 w-full" />}>
        <LeafletErrorBoundary onError={() => setFailed(true)}>
          <LeafletMap {...props} />
        </LeafletErrorBoundary>
      </Suspense>
    </div>
  );
}

class LeafletErrorBoundary extends Component<{ children: ReactNode; onError: () => void }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
