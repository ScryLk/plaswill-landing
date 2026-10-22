import Image from "next/image";
import Link from "next/link";

import { featuredNews, formatNewsDate } from "@/content/news";
import { news } from "@/content/site";

import { PillButton } from "./PillButton";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/**
 * "Nossa história em movimento" — três notícias e o caminho para o arquivo.
 *
 * Três decisões que explicam a forma:
 *
 * · **Sem carrossel.** Rotação automática tira do leitor a decisão de quando
 *   avançar e esconde duas das três notícias dentro de um cronômetro. Três
 *   cartões fixos mostram tudo de uma vez e funcionam sem JavaScript.
 * · **Data visível em cada cartão.** É o que separa arquivo de publicidade.
 *   Uma notícia de 2024 continua sendo de 2024.
 * · **A capa é opcional.** Um dos doze posts não tem imagem aproveitável; o
 *   cartão resolve isso sem buraco, sem imagem quebrada e sem foto de outro
 *   assunto no lugar.
 */
export function News() {
  return (
    <section className="section" id="noticias">
      <div className="wrap">
        <SectionHeader
          number={news.eyebrow}
          label={news.eyebrowLabel}
          title={news.title}
          lead={news.lead}
          action={
            <PillButton href="/noticias" marks={["tl", "br"]}>
              {news.cta}
            </PillButton>
          }
        />

        <div className="news-grid">
          {featuredNews.map((post, index) => (
            <Reveal key={post.slug} delay={index * 60}>
              <article className="news-card">
                <Link className="news-card__link" href={`/noticias/${post.slug}`}>
                  {post.cover ? (
                    <span className="news-card__media">
                      <Image
                        src={post.cover.src}
                        alt={post.cover.alt}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
                        className="news-card__img"
                      />
                    </span>
                  ) : null}

                  <time className="t-code c-tertiary" dateTime={post.date}>
                    {formatNewsDate(post.date)}
                  </time>
                  <h3 className="t-subhead news-card__title">{post.title}</h3>
                  <p className="t-small c-muted news-card__excerpt">
                    {post.paragraphs[0]}
                  </p>
                  <span className="news-card__more t-caption c-petrol">
                    Ler a notícia
                  </span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
