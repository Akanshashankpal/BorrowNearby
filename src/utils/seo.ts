export const SITE_NAME = "Rentoori";

export function siteOrigin() {
  if (typeof window === "undefined") return "https://rentoori.com";
  return window.location.origin;
}

export function canonical(path: string) {
  return new URL(path, siteOrigin()).toString();
}
