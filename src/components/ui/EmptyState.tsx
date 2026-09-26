import type { ReactNode } from "react";
import { BrandMark } from "@/components/layout/BrandMark";
import { Button } from "./Button";

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid justify-items-center gap-3 rounded-3xl border border-dashed border-line bg-surface px-6 py-12 text-center">
      <BrandMark className="h-12 w-12" />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="max-w-md text-sm text-muted">{body}</p>
      {action ?? <Button href="/discover">Explore items</Button>}
    </div>
  );
}
