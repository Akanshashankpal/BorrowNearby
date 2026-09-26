import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { brand } from "@/constants/brand";
import { footerCompany, footerExplore, footerLegal, footerSupport, socialLinks } from "@/constants/navigation";
import { categories } from "@/services/mock/db";
import { BrandMark } from "./BrandMark";
import { PageWrap } from "./PageWrap";

const icons = {
  instagram: SocialInstagram,
  linkedin: SocialLinkedin,
  facebook: SocialFacebook,
  youtube: SocialYoutube,
};

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-surface">
      <PageWrap className="py-10">
        <div className="hidden gap-8 md:grid md:grid-cols-3 xl:grid-cols-6">
          <div className="xl:col-span-2">
            <BrandMark labeled />
            <p className="mt-4 max-w-xs text-sm text-muted">{brand.statement}</p>
          </div>
          <FooterColumn title="Explore" links={footerExplore} />
          <div>
            <h2 className="text-sm font-semibold">Categories</h2>
            <ul className="mt-3 grid gap-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.slug}>
                  <Link to={`/category/${category.slug}`} className="text-sm text-muted hover:text-ink">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <FooterColumn title="Community" links={footerCompany} />
          <div>
            <FooterColumn title="Support" links={footerSupport} />
            <div className="mt-6">
              <FooterColumn title="Legal" links={footerLegal} />
            </div>
          </div>
        </div>
        <div className="grid gap-2 md:hidden">
          <BrandMark labeled />
          <p className="text-sm text-muted">{brand.tagline}</p>
          <Accordion title="Explore" links={footerExplore} />
          <Accordion title="Company" links={footerCompany} />
          <Accordion title="Support" links={footerSupport} />
          <Accordion title="Legal" links={footerLegal} />
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">© 2026 Rentoori. All rights reserved.</p>
          <ul className="flex gap-2">
            {socialLinks.map((item) => {
              const Icon = icons[item.icon];
              return (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noreferrer" aria-label={item.label} className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand">
                    <Icon />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </PageWrap>
    </footer>
  );
}

function SocialIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      {children}
    </svg>
  );
}

function SocialInstagram() {
  return (
    <SocialIcon>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </SocialIcon>
  );
}

function SocialLinkedin() {
  return (
    <SocialIcon>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 10v6M8 7.5h.01M12 16v-3.5a2 2 0 0 1 4 0V16" />
    </SocialIcon>
  );
}

function SocialFacebook() {
  return (
    <SocialIcon>
      <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h2.2l.8-3H13V9c0-.6.4-1 1-1z" fill="currentColor" stroke="none" />
    </SocialIcon>
  );
}

function SocialYoutube() {
  return (
    <SocialIcon>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M11 10.5v3l3-1.5-3-1.5z" fill="currentColor" stroke="none" />
    </SocialIcon>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-3 grid gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link to={link.href} className="text-sm text-muted hover:text-ink">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Accordion({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <details className="rounded-2xl border border-line px-4 py-2">
      <summary className="cursor-pointer py-2 text-sm font-semibold">{title}</summary>
      <ul className="grid gap-2 pb-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link to={link.href} className="text-sm text-muted">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
