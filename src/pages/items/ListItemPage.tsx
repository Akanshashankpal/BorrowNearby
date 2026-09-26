import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Photo } from "@/components/ui/Photo";
import { categories } from "@/services/mock/db";
import { createListing, getItem, updateListing } from "@/services/api/items";
import { readSession } from "@/services/api/session";
import { useAuth } from "@/store/AuthProvider";
import { useToast } from "@/store/ToastProvider";
import type { ListingInput } from "@/types";

const schema = z.object({
  images: z.array(z.string()).min(1, "Add at least one photo"),
  name: z.string().min(3, "Add a name"),
  description: z.string().min(20, "Describe the item in a sentence or two"),
  categorySlug: z.string().min(1, "Choose a category"),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  priceType: z.enum(["free", "paid"]),
  pricePerDay: z.coerce.number().min(0),
  deposit: z.coerce.number().min(0),
  availableFrom: z.string().min(1, "Choose a start date"),
  availableTo: z.string().min(1, "Choose an end date"),
  areaLabel: z.string().min(2, "Add an area"),
  pickupInstructions: z.string().min(8, "Describe a public pickup point"),
  deliveryAvailable: z.boolean(),
  included: z.string().min(2, "List what is included"),
  rules: z.string().min(2, "Add a house rule"),
  agree: z.boolean(),
}).superRefine((value, ctx) => {
  if (value.priceType === "paid" && value.pricePerDay < 1) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["pricePerDay"], message: "Add a daily price or mark the item free." });
  }
  if (value.availableTo < value.availableFrom) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["availableTo"], message: "End date must be on or after the start date." });
  }
});

type Values = z.infer<typeof schema>;
const DRAFT = "rentoori_listing_draft";
const steps = ["Photos", "Details", "Category", "Condition", "Free or paid", "Price", "Deposit", "Availability", "Pickup", "Preview", "Publish"];

const stepFields: Array<Array<keyof Values>> = [
  ["images"],
  ["name", "description"],
  ["categorySlug"],
  ["condition"],
  ["priceType"],
  ["pricePerDay"],
  ["deposit"],
  ["availableFrom", "availableTo"],
  ["areaLabel", "pickupInstructions", "deliveryAvailable", "included", "rules"],
  [],
  ["agree"],
];

export default function ListItemPage() {
  const [step, setStep] = useState(0);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { push } = useToast();
  const editId = params.get("edit");
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      images: [],
      name: "",
      description: "",
      categorySlug: "tools",
      condition: "good",
      priceType: "paid",
      pricePerDay: 100,
      deposit: 0,
      availableFrom: "2026-09-27",
      availableTo: "2026-10-05",
      areaLabel: "Civil Lines",
      pickupInstructions: "Public pickup near a park or market",
      deliveryAvailable: false,
      included: "",
      rules: "",
      agree: false,
    },
  });

  useEffect(() => {
    const raw = localStorage.getItem(DRAFT);
    if (raw && !editId) form.reset({ ...form.getValues(), ...JSON.parse(raw) });
    if (!editId) return;
    getItem(editId).then((item) => {
      form.reset({
        images: item.images,
        name: item.name,
        description: item.description,
        categorySlug: item.categorySlug,
        condition: item.condition,
        priceType: item.priceType,
        pricePerDay: item.pricePerDay,
        deposit: item.deposit,
        availableFrom: item.availableDates[0] ?? "2026-09-27",
        availableTo: item.availableDates[item.availableDates.length - 1] ?? "2026-10-05",
        areaLabel: item.areaLabel,
        pickupInstructions: item.pickupLabel,
        deliveryAvailable: item.deliveryAvailable,
        included: item.included.join(", "),
        rules: item.rules.join(". "),
        agree: false,
      });
    }).catch(() => push({ title: "Could not open that listing.", tone: "error" }));
  }, [editId, form, push]);

  const values = form.watch();

  async function next() {
    const fields = stepFields[step];
    if (fields.length) {
      const valid = await form.trigger(fields);
      if (!valid) return;
    }
    if (step === steps.length - 1) {
      const valid = await form.trigger();
      if (!valid || !values.agree) {
        form.setError("agree", { message: "Confirm the listing before publishing." });
        return;
      }
      const payload: ListingInput = {
        ...values,
        included: values.included.split(",").map((part) => part.trim()).filter(Boolean),
        rules: values.rules.split(".").map((part) => part.trim()).filter(Boolean),
      };
      const wasUser = !editId && user?.role === "user";
      const saved = editId ? await updateListing(editId, payload) : await createListing(payload);
      localStorage.removeItem(DRAFT);
      const nextUser = readSession()?.user;
      if (wasUser && nextUser?.role === "seller") {
        refreshUser(nextUser);
        push({ title: "Listing published. This account is now a seller.", tone: "success" });
        navigate("/seller");
        return;
      }
      push({ title: "Listing published.", tone: "success" });
      navigate(`/item/${saved.id}`);
      return;
    }
    setStep((current) => current + 1);
  }

  return (
    <>
      <PageMeta title="List your item" description="List something you can lend or rent on Rentoori." path="/list-item" />
      <PageWrap className="max-w-3xl py-8">
        <p className="text-sm font-semibold text-muted">Step {step + 1} of {steps.length}</p>
        <h1 className="mt-1 text-3xl font-semibold">{steps[step]}</h1>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-line" aria-hidden>
          <div className="h-full bg-brand" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
        <form className="mt-6 grid gap-4" onSubmit={(event) => event.preventDefault()}>
          {step === 0 ? (
            <div>
              <label className="text-sm font-semibold">Photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="mt-2 block w-full text-sm"
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []).slice(0, 6);
                    Promise.all(files.map((file) => readFile(file))).then((images) => form.setValue("images", images, { shouldValidate: true }));
                  }}
                />
              </label>
              <p className="mt-2 text-xs text-muted">Photos stay in this browser until an upload service is connected.</p>
              {form.formState.errors.images ? <p className="text-sm text-danger">{form.formState.errors.images.message}</p> : null}
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {values.images.map((image) => <Photo key={image.slice(0, 32)} src={image} alt="Listing photo" className="h-24 w-24 rounded-2xl object-cover" />)}
              </div>
            </div>
          ) : null}
          {step === 1 ? (
            <>
              <Input label="Item name" {...form.register("name")} error={form.formState.errors.name?.message} />
              <Textarea label="Description" {...form.register("description")} error={form.formState.errors.description?.message} />
            </>
          ) : null}
          {step === 2 ? (
            <Select label="Category" {...form.register("categorySlug")} error={form.formState.errors.categorySlug?.message}>
              {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
            </Select>
          ) : null}
          {step === 3 ? (
            <Select label="Condition" {...form.register("condition")}>
              <option value="new">New</option>
              <option value="like_new">Like new</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </Select>
          ) : null}
          {step === 4 ? (
            <Select label="Price type" {...form.register("priceType")}>
              <option value="free">Free to borrow</option>
              <option value="paid">Paid rental</option>
            </Select>
          ) : null}
          {step === 5 ? (
            <Input label="Price per day (₹)" type="number" min={0} {...form.register("pricePerDay")} error={form.formState.errors.pricePerDay?.message} hint={values.priceType === "free" ? "Free items stay at ₹0." : "The quote service will use this daily rate."} />
          ) : null}
          {step === 6 ? (
            <Input label="Security deposit (₹)" type="number" min={0} {...form.register("deposit")} error={form.formState.errors.deposit?.message} hint="Use 0 if you do not want a deposit." />
          ) : null}
          {step === 7 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <DatePicker label="Available from" {...form.register("availableFrom")} error={form.formState.errors.availableFrom?.message} />
              <DatePicker label="Available to" {...form.register("availableTo")} error={form.formState.errors.availableTo?.message} />
            </div>
          ) : null}
          {step === 8 ? (
            <>
              <Input label="Area" {...form.register("areaLabel")} error={form.formState.errors.areaLabel?.message} />
              <Textarea label="Pickup instructions" {...form.register("pickupInstructions")} error={form.formState.errors.pickupInstructions?.message} hint="Use a public place, not a house number." />
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input type="checkbox" {...form.register("deliveryAvailable")} /> Delivery available
              </label>
              <Input label="Included accessories" {...form.register("included")} error={form.formState.errors.included?.message} hint="Separate with commas" />
              <Textarea label="Rules" {...form.register("rules")} error={form.formState.errors.rules?.message} />
            </>
          ) : null}
          {step === 9 ? (
            <div className="rounded-3xl border border-line p-4">
              <p className="text-xl font-semibold">{values.name || "Untitled item"}</p>
              <p className="mt-2 text-sm text-muted">{values.description}</p>
              <p className="mt-3 text-sm font-semibold">{values.priceType === "free" ? "Free" : `₹${values.pricePerDay}/day`} · Deposit ₹{values.deposit}</p>
              <p className="text-sm text-muted">{values.areaLabel} · {values.pickupInstructions}</p>
            </div>
          ) : null}
          {step === 10 ? (
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" {...form.register("agree")} />
              <span>I have described this item honestly. Publishing only completes after the listing service accepts it.</span>
            </label>
          ) : null}
          {form.formState.errors.agree ? <p className="text-sm text-danger">{form.formState.errors.agree.message}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>Back</Button>
            <Button variant="ghost" onClick={() => { localStorage.setItem(DRAFT, JSON.stringify(values)); push({ title: "Draft saved on this device.", tone: "success" }); }}>Save draft</Button>
            <Button onClick={() => void next()} loading={form.formState.isSubmitting}>{step === steps.length - 1 ? "Publish" : "Next"}</Button>
          </div>
        </form>
      </PageWrap>
    </>
  );
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (file.size > 2_000_000) {
      reject(new Error("Each photo must be under 2MB."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that photo."));
    reader.readAsDataURL(file);
  });
}
