import type { MetadataRoute } from "next";

import { newsPosts } from "@/content/news";
import { seo } from "@/content/site";

/**
 * Mapa do site.
 *
 * As páginas de notícia entram uma a uma, com a data real de publicação em
 * `lastModified` — é a única data que temos e ela é verdadeira. Usar
 * `new Date()` para todo mundo, como estava antes, diz ao buscador que todas
 * as páginas mudaram hoje, todo dia; quando isso não é verdade o sinal perde
 * valor e o rastreador aprende a ignorá-lo.
 *
 * A home e a política continuam com a data do build, porque são páginas vivas
 * que mudam sem um registro de data próprio.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: seo.siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${seo.siteUrl}/noticias`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...newsPosts.map((post) => ({
      url: `${seo.siteUrl}/noticias/${post.slug}`,
      lastModified: new Date(`${post.date}T12:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
    {
      url: `${seo.siteUrl}/politica-de-privacidade`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
