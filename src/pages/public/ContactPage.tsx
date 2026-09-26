import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageMeta } from "@/components/layout/PageMeta";
import { PageWrap } from "@/components/layout/PageWrap";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { mockMode, wait } from "@/services/api/client";

const schema = z.object({
  name: z.string().min(2, "Add your name"),
  email: z.string().email("Add a valid email"),
  message: z.string().min(12, "Tell us a little more"),
});

type FormValues = z.infer<typeof schema>;

export default function ContactPage() {
  const [done, setDone] = useState("");
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <>
      <PageMeta title="Contact" description="Contact the Rentoori preview team." path="/contact" />
      <PageWrap className="max-w-xl py-12">
        <h1 className="text-4xl font-semibold">Contact</h1>
        <p className="mt-2 text-sm text-muted">This preview stores the message only long enough to confirm the form. It is not emailed.</p>
        {done ? <p className="mt-6 rounded-3xl bg-brand-soft p-4 text-sm font-semibold" role="status">{done}</p> : (
          <form
            className="mt-6 grid gap-4"
            onSubmit={form.handleSubmit(async (values) => {
              if (!mockMode) return;
              await wait(300);
              setDone(`Thanks ${values.name}. Your note was received by the preview service.`);
            })}
          >
            <Input label="Name" {...form.register("name")} error={form.formState.errors.name?.message} />
            <Input label="Email" type="email" {...form.register("email")} error={form.formState.errors.email?.message} />
            <Textarea label="Message" {...form.register("message")} error={form.formState.errors.message?.message} />
            <Button type="submit" loading={form.formState.isSubmitting}>Send</Button>
          </form>
        )}
      </PageWrap>
    </>
  );
}
