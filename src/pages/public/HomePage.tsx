import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { CategoryCard } from "@/components/items/CategoryCard";
import { ItemCard } from "@/components/items/ItemCard";
import { HeroSearch } from "@/components/search/HeroSearch";
import { PageMeta } from "@/components/layout/PageMeta";
import { PageWrap } from "@/components/layout/PageWrap";
import { DiscoveryMap } from "@/components/maps/DiscoveryMap";
import { MapPreview } from "@/components/maps/MapPreview";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Photo } from "@/components/ui/Photo";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { TrustScore } from "@/components/ui/TrustScore";
import { howSteps, safetyCards, testimonials, trustFactors } from "@/constants/content";
import { brand } from "@/constants/brand";
import { useAsync } from "@/hooks/useAsync";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { askRentoori } from "@/services/ai/askRentoori";
import { getCategories } from "@/services/api/categories";
import { getItems } from "@/services/api/items";
import { getCommunityStats } from "@/services/api/users";
import { usePlace } from "@/store/LocationProvider";
import type { AskResult, ItemWithOwner } from "@/types";

export default function HomePage() {
  const place = usePlace();
  const state = useAsync(
    () =>
      Promise.all([
        getCategories(),
        getItems({ sort: "rating", pageSize: 4, origin: place.coords }),
        getItems({ price: "free", pageSize: 4, origin: place.coords }),
        getItems({ sort: "distance", pageSize: 3, maxDistance: 8, origin: place.coords }),
        getCommunityStats(),
      ]),
    [place.coords.lat, place.coords.lng],
  );

  return (
    <>
      <PageMeta
        title="Rentoori — Borrow • Rent • Share"
        description="Find useful things around you and share what you already own. Own less. Share more."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Rentoori",
          description: brand.heroBody,
          url: "/",
        }}
      />
      <section className="overflow-hidden">
        <PageWrap className="grid items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-16 xl:max-w-[1480px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sand">{brand.statement}</p>
            <h1 className="mt-4 max-w-xl text-[2rem] font-semibold leading-[1.08] tracking-tight min-[480px]:text-[2.35rem] md:text-[2.75rem] lg:text-6xl xl:text-[4.25rem]">
              Borrow what you need.
              <span className="block text-brand">From people nearby.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted md:text-[17px]">{brand.heroBody}</p>
            <div className="mt-6">
              <HeroSearch />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button href="/discover" size="lg">Find Something</Button>
              <Button href="/list-item" variant="secondary" size="lg">List Your Item</Button>
            </div>
          </div>
          <div className="relative">
            <Photo
              src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1600&q=80"
              alt="A camera on a wooden table, the kind of thing a neighbour might lend for a weekend"
              priority
              className="aspect-[4/5] w-full rounded-[2rem] object-cover sm:aspect-[5/4]"
            />
          </div>
        </PageWrap>
      </section>

      <PageWrap>
        <ul className="grid gap-3 border-y border-line py-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Verified users", BadgeCheck],
            ["Local discovery", MapPinned],
            ["Secure requests", ShieldCheck],
            ["Free & paid borrowing", Sparkles],
          ].map(([label, Icon]) => (
            <li key={String(label)} className="flex items-center gap-2 text-sm font-semibold">
              <Icon size={16} className="text-brand" aria-hidden />
              {label as string}
            </li>
          ))}
        </ul>
      </PageWrap>

      {state.status === "error" ? (
        <PageWrap className="py-10">
          <ErrorState title="Unable to load nearby items." body={state.error ?? "Connection lost."} onRetry={state.reload} />
        </PageWrap>
      ) : null}

      <Section title="Explore what you can borrow" eyebrow="Categories">
        {state.status === "loading" ? (
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-28 w-36" />)}
          </div>
        ) : (
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar snap-x md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-7">
            {state.data?.[0].map((category) => (
              <CategoryCard key={category.slug} slug={category.slug} name={category.name} count={category.count} />
            ))}
          </div>
        )}
      </Section>

      <Section title="Popular near you" eyebrow="Right now" body="Things people around you are borrowing right now.">
        {state.status === "loading" ? <CardRow /> : <CardRow items={state.data?.[1].items} />}
      </Section>

      <section className="bg-sand-soft">
        <Section title="Good things don't always need a price." eyebrow="Free to borrow" body="Books, notes, games, and tools neighbours are happy to pass along.">
          {state.status === "loading" ? <CardRow /> : <CardRow items={state.data?.[2].items} />}
          <Button href="/discover?price=free" className="mt-6" variant="sand">Explore Free Items</Button>
        </Section>
      </section>

      <Section title="Things near you" eyebrow="Map" body="Pickup points are approximate public spots. Exact addresses stay private until a request is accepted.">
        <Nearby items={state.data?.[3].items ?? []} center={place.coords} />
      </Section>

      <Section title="How borrowing works" eyebrow="Four steps">
        <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {howSteps.map((step) => (
            <li key={step.step} className="rounded-3xl border border-line bg-surface p-5">
              <p className="text-sm font-semibold text-sand">{step.step}</p>
              <h3 className="mt-3 text-2xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Can't find what you need?" eyebrow="Post a need" body="Post what you're looking for and let nearby owners come to you.">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <p className="text-lg text-ink">“I need a projector for tomorrow evening.”</p>
            <Button href="/needs/create" className="mt-5">Post a Need</Button>
          </div>
          <article className="rounded-[1.75rem] border border-line bg-surface p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Nearby request</p>
            <h3 className="mt-2 text-2xl font-semibold">Projector</h3>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-muted">Date</dt><dd className="font-semibold">Tomorrow</dd></div>
              <div><dt className="text-muted">Duration</dt><dd className="font-semibold">5 hours</dd></div>
              <div><dt className="text-muted">Radius</dt><dd className="font-semibold">3 km</dd></div>
              <div><dt className="text-muted">Budget</dt><dd className="font-semibold">₹300</dd></div>
            </dl>
            <Button href="/needs" variant="secondary" className="mt-5">Offer Your Item</Button>
          </article>
        </div>
      </Section>

      <Section title="Have something sitting unused?" eyebrow="Lend and share" body="Turn unused things into value by sharing them with people nearby.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80", "Camera"],
            ["https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80", "Drill"],
            ["https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80", "Projector"],
            ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80", "Camping kit"],
          ].map(([src, alt]) => (
            <Photo key={alt} src={src} alt={alt} className="aspect-[4/3] rounded-3xl object-cover" />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/list-item">List Your Item</Button>
          <Button href="/how-it-works" variant="secondary">See How It Works</Button>
        </div>
      </Section>

      <Community stats={state.data?.[4]} />

      <Section title="Know who you're borrowing from." eyebrow="Trust Score">
        <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr]">
          <TrustScore score={92} label="Excellent" />
          <ul className="grid min-w-0 gap-3 sm:grid-cols-2">
            {trustFactors.map((factor) => (
              <li key={factor.key} className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-semibold">
                {factor.label}
              </li>
            ))}
          </ul>
        </div>
        <Button href="/safety" variant="outline" className="mt-6">Learn About Trust & Safety</Button>
      </Section>

      <section className="bg-surface">
        <Section title="Borrow with confidence." eyebrow="Safety">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {safetyCards.map((card) => (
              <article key={card.title} className="rounded-3xl border border-line p-5">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{card.body}</p>
              </article>
            ))}
          </div>
          <Button href="/safety" className="mt-6">Visit Safety Center</Button>
        </Section>
      </section>

      <Section title="Stories from the preview" eyebrow="Community" body="Sample stories for layout. They will be replaced by reviews from the API.">
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <article className="rounded-[1.75rem] bg-brand p-6 text-white md:p-8">
            <p className="text-2xl font-semibold leading-snug md:text-3xl">“{testimonials[0].quote}”</p>
            <div className="mt-6 flex items-center gap-3">
              <Photo src={testimonials[0].avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold">{testimonials[0].name}</p>
                <p className="text-sm text-white/75">{testimonials[0].area} · {testimonials[0].role} · {testimonials[0].rating}/5</p>
              </div>
            </div>
          </article>
          <div className="grid gap-4">
            {testimonials.slice(1).map((item) => (
              <article key={item.id} className="rounded-3xl border border-line bg-surface p-5">
                <p className="text-sm leading-6">“{item.quote}”</p>
                <p className="mt-3 text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted">{item.area} · {item.role} · {item.rating}/5</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <AskBlock />

      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-[1360px] rounded-[2rem] bg-brand px-6 py-12 text-white md:px-12">
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight md:text-5xl">Have something useful?</h2>
          <p className="mt-3 max-w-lg text-white/80">Someone nearby might need exactly what you already own.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/list-item" variant="sand">List Your Item</Button>
            <Link to="/discover" className="inline-flex h-11 items-center rounded-full border border-white/30 px-4 text-sm font-semibold">
              Find Something
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({
  title,
  eyebrow,
  body,
  children,
}: {
  title: string;
  eyebrow?: string;
  body?: string;
  children: ReactNode;
}) {
  return (
    <section className="py-12 md:py-20">
      <PageWrap>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">{eyebrow}</p> : null}
        <h2 className="mt-2 max-w-2xl text-[1.6rem] font-semibold tracking-tight md:text-[1.85rem] lg:text-[2.35rem]">{title}</h2>
        {body ? <p className="mt-3 max-w-2xl text-muted">{body}</p> : null}
        <div className="mt-6">{children}</div>
      </PageWrap>
    </section>
  );
}

function CardRow({ items }: { items?: ItemWithOwner[] }) {
  if (!items) {
    return (
      <div className="grid gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <SkeletonCard key={index} />)}
      </div>
    );
  }
  return (
    <div className="grid gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function Nearby({ items, center }: { items: ItemWithOwner[]; center: { lat: number; lng: number } }) {
  const showMap = useMediaQuery("(min-width: 768px)");
  const [selected, setSelected] = useState(items[0]?.id);
  if (!showMap) return <MapPreview items={items} />;
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <DiscoveryMap
        items={items}
        center={center}
        radiusKm={5}
        selectedId={selected}
        onSelect={setSelected}
        className="h-[420px] overflow-hidden rounded-[1.75rem]"
      />
      <div className="grid gap-3">
        {items.map((item) => (
          <Link key={item.id} to={`/item/${item.id}`} className="rounded-3xl border border-line bg-surface p-4">
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-muted">{item.areaLabel} · {item.distanceKm} km</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Community({
  stats,
}: {
  stats?: { source: "preview" | "api"; users: number; itemsShared: number; successfulBorrows: number; rating: number };
}) {
  const [active, setActive] = useState(false);
  if (!stats) return null;
  return (
    <section id="community" className="py-12 md:py-20">
      <PageWrap>
        <motion.div onViewportEnter={() => setActive(true)} viewport={{ once: true, amount: 0.4 }}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">Sharing is happening around you</p>
          <h2 className="mt-2 text-[1.6rem] font-semibold tracking-tight md:text-4xl">A local habit, not a warehouse.</h2>
          {stats.source === "preview" ? (
            <p className="mt-2 text-sm text-muted">Sample preview figures. Live totals will come from the API.</p>
          ) : null}
          <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="Users" value={stats.users} active={active} />
            <Stat label="Items shared" value={stats.itemsShared} active={active} />
            <Stat label="Successful borrows" value={stats.successfulBorrows} active={active} />
            <div className="rounded-3xl bg-brand-soft p-5">
              <dt className="text-sm text-muted">Community rating</dt>
              <dd className="mt-2 text-3xl font-semibold">{stats.rating}/5</dd>
            </div>
          </dl>
        </motion.div>
      </PageWrap>
    </section>
  );
}

function Stat({ label, value, active }: { label: string; value: number; active: boolean }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!active || reduce) {
      setShown(active ? value : 0);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 900);
      setShown(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduce, value]);
  return (
    <div className="rounded-3xl bg-surface p-5 shadow-sm">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-2 text-3xl font-semibold">{shown.toLocaleString("en-IN")}+</dd>
    </div>
  );
}

function AskBlock() {
  const [query, setQuery] = useState("I need something for a movie night for 8 people.");
  const [result, setResult] = useState<AskResult | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <section id="ask-rentoori" className="py-12 md:py-20">
      <PageWrap>
        <div className="rounded-[1.75rem] border border-line bg-surface p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand">Ask Rentoori</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Tell us the plan. We’ll point at things nearby.</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Suggestions come from a catalog matcher in this preview. A hosted assistant can replace that service later. Nothing here pretends to be a live model.
          </p>
          <form
            className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              setBusy(true);
              void askRentoori(query).then((next) => {
                setResult(next);
                setBusy(false);
              });
            }}
          >
            <label className="sr-only" htmlFor="ask-query">What do you need?</label>
            <input id="ask-query" value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 rounded-full border border-line bg-bg px-4" />
            <Button type="submit" loading={busy}>Suggest</Button>
          </form>
          {result ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {result.suggestions.map((item) => (
                <Link key={item.id} to={`/category/${item.categorySlug}`} className="rounded-3xl bg-brand-soft p-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted">{item.reason}</p>
                </Link>
              ))}
              <Button href={`/search?q=${encodeURIComponent(result.suggestions.map((item) => item.name).join(" "))}`}>Find these near me</Button>
            </div>
          ) : null}
        </div>
      </PageWrap>
    </section>
  );
}
