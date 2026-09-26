import { forwardRef, type InputHTMLAttributes } from "react";
import { Input } from "./Input";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const DatePicker = forwardRef<HTMLInputElement, Props>(function DatePicker(props, ref) {
  return <Input ref={ref} type="date" {...props} />;
});
