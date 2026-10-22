import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { formatNewsDate, newsPosts } from "@/content/news";
import { news, seo, site } from "@/content/site";

import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

/**
 * O arquivo completo: as doze notícias, da mais recente para a mais antiga.
 *
 * Página estática, sem paginação e sem filtro. Doze itens cabem numa rolagem;
 * paginar o que cabe na tela só cria um clique a mais. A lista é a mesma fonte
 * que alimenta a home (`src/content/news.ts`), então nunca divergem.
 */
export const metadata: Metadata = {
  title: "Notícias",
  description: news.archiveLead,
  alternates: { canonical: "/noticias" },
  openGraph: {
    type: "website",
    url: "/noticias",
    siteName: site.name,
    title: "Notícias",
    description: news.archiveLead,
    locale: "pt_BR",
    images: [{ url: seo.ogImage, width: 1200, height: 630, alt: site.legalName }],
  },
  robots: { index: true, follow: true },
};

export default function NoticiasPage() {
  return (
    <section className="section">
      <div className="wrap">
        <SectionHeader
          number={news.eyebrow}
          label={news.eyebrowLabel}
          title={news.archiveTitle}
          lead={news.archiveLead}
        />

        <ol className="news-list">
          {newsPosts.map((post, index) => (
            <li key={post.slug}>
              <Reveal delay={index * 30}>
                <article className="news-row">
                  <Link className="news-row__link" href={`/noticias/${post.slug}`}>
                    {post.cover ? (
                      <span className="news-row__media">
                        <Image
                          src={post.cover.src}
                          alt={post.cover.alt}
                          fill
                          sizes="(min-width: 768px) 240px, 30vw"
                          className="news-row__img"
                        />
                      </span>
                    ) : (
                      /* Sem capa publicável, o espaço vira margem — não vira
                         retângulo cinza com ícone de imagem quebrada. */
                      <span className="news-row__media news-row__media--empty" aria-hidden="true" />
                    )}

                    <span className="news-row__body">
                      <time className="t-code c-tertiary" dateTime={post.date}>
                        {formatNewsDate(post.date)}
                      </time>
                      <h2 className="t-subhead news-row__title">{post.title}</h2>
                      <p className="t-small c-muted news-row__excerpt">
                        {post.paragraphs[0]}
                      </p>
                    </span>

                    <span className="news-row__arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
