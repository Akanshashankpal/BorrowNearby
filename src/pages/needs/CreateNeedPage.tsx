import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageMeta } from "@/components/layout/PageMeta";
import { PageWrap } from "@/components/layout/PageWrap";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { categories } from "@/services/mock/db";
import { createNeed } from "@/services/api/needs";
import { useToast } from "@/store/ToastProvider";

const schema = z.object({
  title: z.string().min(4, "Say what you need"),
  categorySlug: z.string().min(1),
  description: z.string().min(8, "Add a short description"),
  date: z.string().min(1, "Choose a date"),
  duration: z.string().min(1, "Add a duration"),
  area: z.string().min(2, "Add an area"),
  radiusKm: z.coerce.number().min(1).max(25),
  budget: z.coerce.number().min(0),
  freePreferred: z.boolean(),
  paidAcceptable: z.boolean(),
});

type Values = z.infer<typeof schema>;

export default function CreateNeedPage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", categorySlug: "projectors", description: "", date: "2026-09-27", duration: "5 hours", area: "Burhanpur", radiusKm: 3, budget: 300, freePreferred: true, paidAcceptable: true },
  });
  return (
    <>
      <PageMeta title="Post a need" description="Tell nearby owners what you are looking for." path="/needs/create" />
      <PageWrap className="max-w-2xl py-8">
        <h1 className="text-3xl font-semibold">Post a need</h1>
        <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => {
          await createNeed(values);
          push({ title: "Need posted.", tone: "success" });
          navigate("/needs");
        })}>
          <Input label="What do you need?" {...form.register("title")} error={form.formState.errors.title?.message} />
          <Select label="Category" {...form.register("categorySlug")}>
            {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
          </Select>
          <Textarea label="Description" {...form.register("description")} error={form.formState.errors.description?.message} />
          <DatePicker label="Date" {...form.register("date")} error={form.formState.errors.date?.message} />
          <Input label="Duration" {...form.register("duration")} error={form.formState.errors.duration?.message} />
          <Input label="Location" {...form.register("area")} error={form.formState.errors.area?.message} />
          <Input label="Radius (km)" type="number" {...form.register("radiusKm")} error={form.formState.errors.radiusKm?.message} />
          <Input label="Budget (₹)" type="number" {...form.register("budget")} error={form.formState.errors.budget?.message} />
          <label className="text-sm font-semibold"><input type="checkbox" className="mr-2" {...form.register("freePreferred")} />Free preferred</label>
          <label className="text-sm font-semibold"><input type="checkbox" className="mr-2" {...form.register("paidAcceptable")} />Paid acceptable</label>
          <Button type="submit" loading={form.formState.isSubmitting}>Submit</Button>
        </form>
      </PageWrap>
    </>
  );
}
