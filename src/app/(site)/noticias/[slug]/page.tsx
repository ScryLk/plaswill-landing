import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatNewsDate, newsPosts } from "@/content/news";
import { seo, site } from "@/content/site";

/**
 * Uma notícia.
 *
 * Página gerada em tempo de build para cada slug (`generateStaticParams`), com
 * metadados próprios. Três pontos que valem registro:
 *
 * · **Canonical aponta para cá, não para o WordPress.** Quando o domínio virar,
 *   é esta URL que passa a valer e o mapa de redirecionamentos leva a antiga
 *   até aqui. Enquanto o domínio não vira, o `robots` do site de homologação
 *   mantém a prévia fora do índice — está em `robots.ts`.
 * · **O JSON-LD é `NewsArticle`**, com a data real de publicação. Data de
 *   publicação errada em dado estruturado é pior que não ter dado estruturado.
 * · **Sem foto no corpo.** O texto migrado é só texto; as imagens internas dos
 *   posts ficaram no WordPress e isso está anotado em `src/content/news.ts`.
 */

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return newsPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = newsPosts.find((item) => item.slug === slug);
  if (!post) return {};

  const description = post.paragraphs[0];

  return {
    title: post.title,
    description,
    alternates: { canonical: `/noticias/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/noticias/${post.slug}`,
      siteName: site.name,
      title: post.title,
      description,
      locale: "pt_BR",
      publishedTime: post.date,
      images: post.cover
        ? [
            {
              url: post.cover.src,
              width: post.cover.width,
              height: post.cover.height,
              alt: post.cover.alt,
            },
          ]
        : [{ url: seo.ogImage, width: 1200, height: 630, alt: site.legalName }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function NoticiaPage({ params }: PageProps) {
  const { slug } = await params;
  const post = newsPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "pt-BR",
    mainEntityOfPage: `${seo.siteUrl}/noticias/${post.slug}`,
    author: { "@id": `${seo.siteUrl}/#organizacao` },
    publisher: { "@id": `${seo.siteUrl}/#organizacao` },
    ...(post.cover
      ? {
          image: {
            "@type": "ImageObject",
            url: `${seo.siteUrl}${post.cover.src}`,
            width: post.cover.width,
            height: post.cover.height,
          },
        }
      : {}),
  };

  return (
    <article className="section">
      <script
        type="application/ld+json"
        // Objeto montado a partir do conteúdo do projeto, sem entrada de usuário.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <div className="wrap wrap--narrow">
        <Link className="t-caption c-petrol news-back" href="/#noticias">
          ← Todas as notícias
        </Link>

        <header className="news-article__head">
          <time className="t-code c-tertiary" dateTime={post.date}>
            {formatNewsDate(post.date)}
          </time>
          <h1 className="t-display news-article__title">{post.title}</h1>
        </header>

        {post.cover ? (
          <figure className="news-article__figure">
            <Image
              src={post.cover.src}
              alt={post.cover.alt}
              width={post.cover.width}
              height={post.cover.height}
              sizes="(min-width: 1024px) 900px, 92vw"
              className="news-article__img"
              priority
            />
          </figure>
        ) : null}

        <div className="news-article__body stack">
          {post.paragraphs.map((paragraph, index) => (
            <p className="t-body" key={index}>
              {paragraph}
            </p>
          ))}
        </div>

        {post.note ? (
          /* Nota de migração. Fica visível de propósito: quem revisar o site
             precisa saber o que foi ajustado, em vez de descobrir depois. */
          <p className="news-article__note t-small c-muted">Nota de migração: {post.note}</p>
        ) : null}

        <p className="news-article__back">
          <Link className="t-caption c-petrol" href="/#noticias">
            Ver todas as notícias
          </Link>
        </p>
      </div>
    </article>
  );
}
