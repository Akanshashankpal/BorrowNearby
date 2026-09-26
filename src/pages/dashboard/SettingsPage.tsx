import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageMeta } from "@/components/layout/PageMeta";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { updateProfile } from "@/services/api/users";
import { useAuth } from "@/store/AuthProvider";
import { useTheme } from "@/store/ThemeProvider";
import { useToast } from "@/store/ToastProvider";
import type { ThemeMode } from "@/types";

const schema = z.object({
  name: z.string().min(2),
  area: z.string().min(2),
  bio: z.string().max(280),
});

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const { mode, setMode } = useTheme();
  const { push } = useToast();
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: user?.name ?? "", area: user?.area ?? "", bio: user?.bio ?? "" } });
  if (!user) return null;
  return (
    <>
      <PageMeta title="Settings" description="Update your Rentoori profile." path="/dashboard/settings" />
      <h1 className="text-3xl font-semibold">Settings</h1>
      <form className="mt-6 grid max-w-xl gap-4" onSubmit={form.handleSubmit(async (values) => {
        const next = await updateProfile(values);
        refreshUser(next);
        push({ title: "Profile updated.", tone: "success" });
      })}>
        <Input label="Name" {...form.register("name")} error={form.formState.errors.name?.message} />
        <Input label="Email" value={user.email} readOnly />
        <Input label="Area" {...form.register("area")} error={form.formState.errors.area?.message} />
        <Textarea label="About" {...form.register("bio")} error={form.formState.errors.bio?.message} />
        <label className="text-sm font-semibold">Theme
          <select className="mt-1 block w-full rounded-2xl border border-line bg-surface px-3 py-3" value={mode} onChange={(event) => setMode(event.target.value as ThemeMode)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </label>
        <Button type="submit" loading={form.formState.isSubmitting}>Save</Button>
      </form>
    </>
  );
}
