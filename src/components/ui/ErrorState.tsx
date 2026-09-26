import { Button } from "./Button";

export function ErrorState({
  title = "Something went wrong.",
  body = "Unable to load this section.",
  onRetry,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="grid justify-items-start gap-3 rounded-3xl border border-line bg-surface p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-muted">{body}</p>
      <div className="flex flex-wrap gap-2">
        {onRetry ? (
          <Button type="button" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
        <Button variant="secondary" href="/">
          Home
        </Button>
        <Button variant="ghost" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
    </div>
  );
}
