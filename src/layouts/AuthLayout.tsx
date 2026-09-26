import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import { PageLoader } from "@/components/layout/PageLoader";
import { brand } from "@/constants/brand";
import { BrandMark } from "@/components/layout/BrandMark";

export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden bg-brand px-12 py-16 text-white lg:flex lg:flex-col lg:justify-between">
        <span className="inline-flex w-fit rounded-3xl bg-white p-3">
          <BrandMark className="h-16 w-16" />
        </span>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sand">{brand.statement}</p>
          <h1 className="mt-4 max-w-md text-5xl font-semibold leading-tight">Borrow what you need from people nearby.</h1>
          <p className="mt-4 max-w-sm text-white/80">{brand.tagline}</p>
        </div>
        <p className="text-sm text-white/70">User, seller, and admin each have their own sign-in.</p>
      </section>
      <section className="flex flex-col px-4 py-8 sm:px-8">
        <Link to="/" className="mb-8 lg:hidden" aria-label="Rentoori home">
          <BrandMark labeled />
        </Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
          <Suspense fallback={<PageLoader />}><Outlet /></Suspense>
        </div>
      </section>
    </div>
  );
}
