import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { fieldClass } from "./Input";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { label, error, hint, id, className, ...props },
  ref,
) {
  const areaId = id || props.name;
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-ink" htmlFor={areaId}>
      {label}
      <textarea
        ref={ref}
        id={areaId}
        aria-invalid={error ? true : undefined}
        className={cn(fieldClass, "min-h-28 resize-y font-normal", error && "border-danger", className)}
        {...props}
      />
      {error ? (
        <span role="alert" className="text-xs font-medium text-danger">
          {error}
        </span>
      ) : hint ? (
        <span className="text-xs font-normal text-muted">{hint}</span>
      ) : null}
    </label>
  );
});
