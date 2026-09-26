import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { fieldClass } from "./Input";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, error, id, className, children, ...props },
  ref,
) {
  const selectId = id || props.name;
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-ink" htmlFor={selectId}>
      {label}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={error ? true : undefined}
        className={cn(fieldClass, "font-normal", error && "border-danger", className)}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <span role="alert" className="text-xs font-medium text-danger">
          {error}
        </span>
      ) : null}
    </label>
  );
});
