"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { formatNewsDate, type NewsPost } from "@/content/news";

import { Reveal } from "./Reveal";

/**
 * Carrossel de notícias — trilho nativo, setas como aprimoramento.
 *
 * Quatro decisões que explicam a forma:
 *
 * · **O trilho é a fonte da verdade.** As setas chamam `scrollBy` no elemento
 *   que rola; não existe um índice em estado do React dizendo qual cartão está
 *   na frente. Isso mantém swipe, roda do trackpad, teclado e barra de rolagem
 *   funcionando sem código extra — e evita dois modelos de estado divergindo,
 *   que é o defeito clássico de carrossel feito à mão.
 * · **Sem autoplay e sem laço.** Nada avança sozinho e o fim é o fim: a seta
 *   desabilita em vez de voltar ao começo. Quem lê decide quando seguir.
 * · **Sem JavaScript o conteúdo continua inteiro.** Os doze cartões estão no
 *   HTML e a rolagem horizontal é CSS nativo; as setas apenas acrescentam um
 *   jeito de avançar. Nenhum cartão depende de estado para existir.
 * · **O estado das setas vem do evento `scroll`.** Quem arrasta com o dedo
 *   move o trilho sem tocar nos botões; ouvir a rolagem é o que mantém as
 *   setas honestas em relação à posição real, com `requestAnimationFrame`
 *   para não recalcular a cada pixel.
 */
export function NewsCarousel({ posts }: { posts: NewsPost[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    // 1px de tolerância: a posição de rolagem vem arredondada do navegador.
    setCanPrev(track.scrollLeft > 1);
    setCanNext(track.scrollLeft < max - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    update();

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });

    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(track);
    window.addEventListener("resize", update);

    return () => {
      track.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      window.removeEventListener("resize", update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [update]);

  /** Quanto andar: a largura de um cartão mais o vão entre ele e o próximo. */
  const step = (track: HTMLDivElement) => {
    const card = track.querySelector<HTMLElement>(".news-card");
    if (!card) return track.clientWidth;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.offsetWidth + gap;
  };

  const go = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    // Sem `behavior` explícito: quem manda no movimento é o CSS, que já
    // desliga a suavização em `prefers-reduced-motion`.
    track.scrollBy({ left: direction * step(track) });
  };

  return (
    <div className="news-carousel">
      <div className="news-carousel__controls">
        <button
          type="button"
          className="news-nav"
          aria-label="Notícias anteriores"
          aria-disabled={!canPrev}
          tabIndex={canPrev ? 0 : -1}
          onClick={() => {
            if (canPrev) go(-1);
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path
              d="M15 5 8 12l7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="square"
            />
          </svg>
        </button>

        <button
          type="button"
          className="news-nav"
          aria-label="Próximas notícias"
          aria-disabled={!canNext}
          tabIndex={canNext ? 0 : -1}
          onClick={() => {
            if (canNext) go(1);
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path
              d="M9 5l7 7-7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </div>

      <div
        className="news-track"
        role="group"
        aria-label="Notícias"
        tabIndex={0}
        ref={trackRef}
      >
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={index < 3 ? index * 60 : 0}>
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
  );
}
