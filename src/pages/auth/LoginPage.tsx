import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { portalAccounts } from "@/constants/brand";
import { useAuth } from "@/store/AuthProvider";
import { destinationAfterLogin } from "@/utils/roles";

const schema = z.object({
  email: z.string().email("Enter the email on the account"),
  password: z.string().min(8, "Use at least 8 characters"),
});

type Values = z.infer<typeof schema>;

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const userAccount = portalAccounts[0];
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: userAccount.email, password: userAccount.password },
  });

  return (
    <>
      <PageMeta title="Log in" description="Log in as a user, seller, or admin on Rentoori." path="/login" />
      <h1 className="text-3xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-sm text-muted">Each role opens its own dashboard. Pick an account to fill the form.</p>
      <div className="mt-4 grid gap-2">
        {portalAccounts.map((account) => (
          <button
            key={account.role}
            type="button"
            className="rounded-2xl border border-line bg-surface px-3 py-2 text-left text-sm hover:bg-brand-soft"
            onClick={() => form.reset({ email: account.email, password: account.password })}
          >
            <span className="font-semibold">{account.label}</span>
            <span className="mt-0.5 block text-muted">{account.email} / {account.password}</span>
          </button>
        ))}
      </div>
      <form
        className="mt-6 grid gap-4"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const session = await auth.login(values.email, values.password);
            navigate(destinationAfterLogin(session.user.role, params.get("next")));
          } catch (error) {
            form.setError("root", { message: error instanceof Error ? error.message : "Could not log in." });
          }
        })}
      >
        <Input label="Email" type="email" autoComplete="email" {...form.register("email")} error={form.formState.errors.email?.message} />
        <Input label="Password" type="password" autoComplete="current-password" {...form.register("password")} error={form.formState.errors.password?.message} />
        {form.formState.errors.root ? <p role="alert" className="text-sm text-danger">{form.formState.errors.root.message}</p> : null}
        <Button type="submit" loading={form.formState.isSubmitting}>Log in</Button>
      </form>
      <p className="mt-4 text-sm">New here? <Link to="/signup" className="font-semibold text-brand">Create a user account</Link></p>
      <p className="mt-2 text-sm"><Link to="/forgot-password" className="font-semibold text-brand">Forgot password</Link></p>
      <p className="mt-6 text-xs text-muted">Signup creates a user account. Seller and admin sign-in are the preview accounts above.</p>
    </>
  );
}
