import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/store/AuthProvider";
import { homeFor } from "@/utils/roles";

const schema = z.object({
  name: z.string().min(2, "Add your name"),
  email: z.string().email("Add a valid email"),
  area: z.string().min(2, "Add your area"),
  password: z.string().min(8, "Use at least 8 characters"),
});

type Values = z.infer<typeof schema>;

export default function SignupPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const form = useForm<Values>({ resolver: zodResolver(schema) });
  return (
    <>
      <PageMeta title="Create account" description="Create a Rentoori user account to borrow nearby." path="/signup" />
      <h1 className="text-3xl font-semibold">Create your account</h1>
      <p className="mt-2 text-sm text-muted">This creates a user account for browsing and borrowing. Seller and admin accounts use the preview sign-in.</p>
      <form
        className="mt-6 grid gap-4"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const session = await auth.signup(values);
            navigate(homeFor(session.user.role));
          } catch (error) {
            form.setError("root", { message: error instanceof Error ? error.message : "Could not create the account." });
          }
        })}
      >
        <Input label="Name" {...form.register("name")} error={form.formState.errors.name?.message} />
        <Input label="Email" type="email" {...form.register("email")} error={form.formState.errors.email?.message} />
        <Input label="Area" {...form.register("area")} error={form.formState.errors.area?.message} />
        <Input label="Password" type="password" {...form.register("password")} error={form.formState.errors.password?.message} />
        {form.formState.errors.root ? <p role="alert" className="text-sm text-danger">{form.formState.errors.root.message}</p> : null}
        <Button type="submit" loading={form.formState.isSubmitting}>Create account</Button>
      </form>
      <p className="mt-4 text-sm">Already have an account? <Link to="/login" className="font-semibold text-brand">Log in</Link></p>
    </>
  );
}
