import { Helmet } from "react-helmet-async";
import { canonical } from "@/utils/seo";

export function PageMeta({
  title,
  description,
  path,
  jsonLd,
}: {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown>;
}) {
  const full = title.includes("Rentoori") ? title : `${title} · Rentoori`;
  return (
    <Helmet>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical(path)} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical(path)} />
      <meta property="og:image" content={canonical("/brand/logo.png")} />
      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </Helmet>
  );
}
