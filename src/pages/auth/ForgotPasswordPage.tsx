import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { requestPasswordReset } from "@/services/api/auth";

const schema = z.object({ email: z.string().email("Add a valid email") });

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const form = useForm<{ email: string }>({ resolver: zodResolver(schema) });
  return (
    <>
      <PageMeta title="Reset password" description="Request a Rentoori password reset." path="/forgot-password" />
      <h1 className="text-3xl font-semibold">Reset your password</h1>
      {message ? <p className="mt-4 text-sm" role="status">{message}</p> : (
        <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => {
          const result = await requestPasswordReset(values.email);
          setMessage(result.message);
        })}>
          <Input label="Email" type="email" {...form.register("email")} error={form.formState.errors.email?.message} />
          <Button type="submit" loading={form.formState.isSubmitting}>Send reset link</Button>
        </form>
      )}
      <p className="mt-4 text-sm"><Link to="/login" className="font-semibold text-brand">Back to log in</Link></p>
    </>
  );
}
