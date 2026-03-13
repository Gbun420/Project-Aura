import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  jsonLd?: object;
  noindex?: boolean;
}

const SEO = ({
  title,
  description = "2026 High-performance recruitment platform for Malta. Neural Matching and Compliance Vault integrated.",
  canonical = "https://project-aura-one.vercel.app/",
  ogTitle,
  ogDescription,
  ogImage = "https://project-aura-one.vercel.app/og-image.png",
  twitterTitle,
  twitterDescription,
  twitterImage = "https://project-aura-one.vercel.app/og-image.png",
  jsonLd,
  noindex = false,
}: SEOProps) => {
  const siteName = 'Aura Cloud';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={window.location.href} />

      {/* Twitter */}
      <meta name="twitter:title" content={twitterTitle || fullTitle} />
      <meta name="twitter:description" content={twitterDescription || description} />
      <meta name="twitter:image" content={twitterImage} />

      {/* Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
