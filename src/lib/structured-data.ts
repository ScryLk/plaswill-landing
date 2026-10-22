import { faq, products, seo, site, structure } from "@/content/site";

/**
 * Dados estruturados da home: organização com endereço e canais verificados,
 * catálogo de oferta e as perguntas frequentes da própria página.
 *
 * Nada aqui é inventado — tudo sai de `src/content/site.ts`, que é o arquivo
 * onde os dados oficiais da empresa ficam registrados. Se um dado não está lá,
 * ele não aparece no JSON-LD.
 *
 * Mora em `lib` desde 21/10, quando a abertura virou a home: as duas páginas
 * (a home nova e a landing anterior, preservada em `/institucional`) descrevem
 * a mesma empresa, e manter duas cópias garantiria que uma ficasse para trás.
 */
export function structuredData() {
  const url = seo.siteUrl;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${url}/#organizacao`,
        name: site.name,
        legalName: site.legalName,
        alternateName: "Plaswill Embalagens",
        slogan: site.tagline,
        url,
        telephone: site.phone.label,
        email: site.emails.commercial,
        foundingDate: "2007-03-07",
        taxID: site.cnpj,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${site.address.street}, ${site.address.district}`,
          addressLocality: site.address.city,
          addressRegion: site.address.state,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: `+55 ${site.whatsapp.label}`,
            email: site.emails.commercial,
            areaServed: ["BR-RS", "BR-SC", "BR-PR"],
            availableLanguage: ["pt-BR"],
          },
        ],
        areaServed: [
          { "@type": "State", name: "Rio Grande do Sul" },
          { "@type": "State", name: "Santa Catarina" },
          { "@type": "State", name: "Paraná" },
        ],
        knowsAbout: [
          "filme stretch",
          "embalagem industrial",
          "plástico bolha",
          "sacaria agrícola",
          "embalagem hospitalar ABNT NBR 9191",
          "polietileno reciclado pós-consumo",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Linhas de produto",
          itemListElement: products.map((product) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: product.name,
              description: product.benefit,
              category: product.short,
            },
          })),
        },
        makesOffer: {
          "@type": "Offer",
          name: "Fornecimento fracionado com pronta-entrega",
          description: structure.lead,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#site`,
        url,
        name: site.name,
        inLanguage: "pt-BR",
        publisher: { "@id": `${url}/#organizacao` },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}/#faq`,
        inLanguage: "pt-BR",
        mainEntity: faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer.join(" "),
          },
        })),
      },
    ],
  };
}
