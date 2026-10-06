import { Helmet } from "react-helmet-async";

const SITE_NAME = "Fantome Technologies";
const SITE_URL = "https://fantometechnologies.com";
const DEFAULT_IMAGE = `${SITE_URL}/new-logo.png`;

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  structuredData?: Record<string, unknown>;
}

export default function SEOHead({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  noIndex = false,
  structuredData,
}: SEOHeadProps) {
  const canonicalUrl = new URL(path, SITE_URL).toString();
  const pageTitle = `${title} | ${SITE_NAME}`;
  const robots = noIndex ? "noindex, nofollow" : "index, follow";

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
