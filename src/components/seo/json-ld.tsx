import { site } from "@/content/site";

/** JSON-LD schema.org tipo NGO para la fundación. */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: site.legalName,
    alternateName: site.shortName,
    description: site.description,
    url: site.url,
    inLanguage: "es-PY",
    areaServed: { "@type": "Country", name: "Paraguay" },
    knowsAbout: [
      "Neurodiversidad",
      "Autismo (TEA)",
      "TDAH",
      "Inclusión",
      "Apoyo a familias neurodivergentes",
    ],
    slogan: site.tagline,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: "+595983982188",
      availableLanguage: ["Spanish"],
    },
    sameAs: [site.social.instagram.href, site.social.tiktok.href, site.whatsapp.href],
  };

  return (
    <script
      type="application/ld+json"
      // schema.org JSON-LD estático y confiable
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
