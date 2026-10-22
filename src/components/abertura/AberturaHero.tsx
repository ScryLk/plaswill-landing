import { Fragment } from "react";

import { abertura } from "@/content/site";

import { ArrowRight } from "./icons";

/**
 * Abertura de tela cheia: o aviso comercial, o título e a faixa de clientes,
 * sobre a fotografia aérea da planta.
 *
 * Composição herdada do spec de referência — coluna alinhada à esquerda, altura
 * da janela, mídia sangrando de borda a borda, na ordem
 * `aviso → título → clientes`. Sem véu, sem gradiente decorativo, sem cartão.
 *
 * **A altura é dividida em fluxo, não sobreposta.** A seção é uma coluna: o
 * texto ocupa o que precisa e a faixa de mídia recebe o resto. Na referência a
 * mídia é `absolute inset-0` com o texto por cima; num celular em que o texto
 * come quase toda a tela, isso põe palavra em cima de fotografia e derruba o
 * contraste — a medição está em `abertura.css`. Com a faixa em fluxo, o texto
 * está sempre sobre papel limpo, em qualquer altura de janela.
 *
 * O que mais muda em relação à referência, e por quê:
 *
 * · **Mídia.** A referência usa vídeo. Não existe vídeo institucional da
 *   Plaswill — o `/branding` da API publica quatro chaves e nenhuma é vídeo —,
 *   então a faixa recebe a fotografia aérea da planta, com deriva lenta de
 *   câmera. **Sem o arquivo, a faixa não existe:** a abertura fica em papel
 *   limpo. A versão anterior desenhava ali o campo de grânulos do site; ele
 *   saiu a pedido ("vamos deixar limpo por enquanto").
 * · **Voz tipográfica.** O título sai em Source Serif 4 (a voz de display do
 *   site), e não na grotesca leve da referência. Tamanhos e alinhamento são os
 *   do spec.
 * · **Sem botão no corpo.** A referência não quer CTA dentro do hero; a
 *   conversão fica por conta do botão da barra. É a única fraqueza de CRO que
 *   este formato aceita — está anotada no README.
 */
export function AberturaHero({
  photoSrc,
  facadeSrc,
}: {
  photoSrc: string | null;
  facadeSrc: string | null;
}) {
  const lines = abertura.headlineLines;

  /**
   * Efeito 16 — o título, palavra por palavra.
   *
   * A contagem de atraso é **corrida e não por linha**: se cada linha
   * reiniciasse em zero, as três linhas entrariam juntas e o efeito viraria
   * três blocos, não uma frase. O cursor atravessa a frase inteira, então a
   * leitura acompanha a ordem em que se lê.
   *
   * Os 360ms iniciais são o antigo `stagger-4` do título, mantido: o aviso
   * comercial entra antes, o título entra depois, e a ordem continua a mesma
   * de antes desta mudança.
   */
  const HEADLINE_DELAY = 360;
  const HEADLINE_STEP = 55;

  let cursor = 0;
  const headlineWords = lines.map((line) =>
    line.split(" ").map((text) => {
      const delay = HEADLINE_DELAY + cursor * HEADLINE_STEP;
      cursor += 1;
      return { text, delay };
    }),
  );

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-brand-surface">
      {/* A grade só existe a partir de `md`: no celular é uma coluna, e a foto
          desce para baixo do carrossel. `grid-rows-[minmax(0,1fr)]` prende a
          linha à altura da seção, que é o que faz a foto esticar junto com o
          texto sem depender de `height: 100%` em cadeia. */}
      <div className="shell relative z-10 flex h-full flex-col md:grid md:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)]">
        <div className="flex shrink-0 flex-col items-start pt-28 md:pt-36">
          {/* Aviso comercial */}
          <a
            className="mb-5 inline-flex animate-fade-up items-center gap-2 rounded-full border border-solid border-brand-slate/15 bg-white/60 px-4 py-2 stagger-3 backdrop-blur-sm transition-colors hover:bg-white/80 md:mb-6"
            href={abertura.pillHref}
          >
            {/* `whitespace-nowrap`: o aviso é curto de propósito, e quebrar em
                duas linhas dentro de uma cápsula desalinha a seta. */}
            <span className="whitespace-nowrap font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-brand-slate">
              {abertura.pill}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-brand-slate" />
          </a>

          {/* Título — uma frase inteira para o leitor de tela, quebras só visuais.
              O `aria-label` carrega a frase completa; as palavras em spans são
              `aria-hidden`, para o leitor de tela não ouvir onze pedaços soltos.
              O texto também sai inteiro no HTML, que é o que o buscador lê. */}
          <h1
            className="max-w-4xl text-left font-display text-3xl leading-[1.04] tracking-[-0.028em] text-brand-slate sm:text-4xl md:text-5xl lg:text-6xl"
            aria-label={abertura.headline}
          >
            {headlineWords.map((lineWords, lineIndex) => (
              <Fragment key={lines[lineIndex]}>
                {lineIndex > 0 ? " " : null}
                {lineWords.map((word, wordIndex) => (
                  <Fragment key={word.text}>
                    {/* O espaço fica **fora** do span: dentro dele, com
                        `inline-block`, a palavra carregaria o próprio espaço e
                        a linha pararia de quebrar no celular. */}
                    {wordIndex > 0 ? " " : null}
                    <span
                      className="reveal-word"
                      style={{ animationDelay: `${word.delay}ms` }}
                      aria-hidden="true"
                    >
                      {word.text}
                    </span>
                  </Fragment>
                ))}
                {lineIndex < lines.length - 1 ? <br className="hidden sm:block" /> : null}
              </Fragment>
            ))}
          </h1>

          {/* Clientes — carrossel contínuo de nomes.

              **Por que nomes e não logotipos.** A arte das quinze marcas existia
              (os recortes seguem em `public/clients/`), mas a faixa ficou mais
              silenciosa com os nomes em tipografia: um mural de quinze logotipos
              coloridos num fundo creme virava o elemento mais forte da tela e
              disputava com o título, que é o que a abertura precisa vender
              primeiro. Decisão do Lucas em 20/10.

              **Como o laço fecha sem emenda.** O trilho tem duas cópias da lista,
              e a animação o desloca exatamente a largura de uma cópia
              (`-50%`). Cada cópia carrega um `padding-right` igual ao vão entre
              itens, então o vão entre a última marca da primeira cópia e a
              primeira da segunda é o mesmo de todos os outros — sem esse
              preenchimento apareceria um salto visível a cada volta.

              A segunda cópia é `aria-hidden`: para o leitor de tela a lista tem
              quinze nomes, não trinta. */}
          <div className="mt-8 w-full max-w-full animate-fade-up stagger-5 md:mt-10">
            <p className="mb-5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-brand-slate/70 md:mb-7">
              {abertura.clientsLabel}
            </p>

            <div className="marquee">
              <div className="marquee__track">
                <ul role="list" className="marquee__group">
                  {abertura.clients.map((client) => (
                    <li key={client}>{client}</li>
                  ))}
                </ul>
                <ul role="list" aria-hidden="true" className="marquee__group">
                  {abertura.clients.map((client) => (
                    <li key={client}>{client}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Faixa da foto aérea — existe **só** quando há o arquivo, e vive
              dentro desta coluna (a direita é da fachada). Sem ela, nada é
              desenhado: a abertura fica em papel limpo abaixo do texto. Havia
              aqui um fallback com o campo de grânulos (`RawMaterialField`),
              retirado a pedido em 20/10. */}
          {photoSrc ? (
            <div className="reveal-left relative mt-8 min-h-[120px] w-full flex-1 md:mt-12">
              <div className="media-mask absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element -- arquivo oficial enviado pelo cliente, proporção desconhecida */}
                <img
                  src={photoSrc}
                  alt={abertura.mediaAlt}
                  className="media-drift h-full w-full object-cover object-bottom"
                  decoding="async"
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Fachada — a sede, na coluna da direita a partir de `md`.
            No celular ela desce para baixo do carrossel, com altura própria:
            numa tela estreita a foto em altura cheia viraria um recorte
            apertado de parede, e não uma fachada. */}
        {facadeSrc ? (
          <div className="facade reveal-right h-[32vh] min-h-[190px] md:h-auto md:min-h-0">
            <div className="facade__inner">
              {/* eslint-disable-next-line @next/next/no-img-element -- fotografia do cliente, sem versão otimizada; o recorte é feito por object-position, não no arquivo */}
              <img
                src={facadeSrc}
                alt={abertura.facadeAlt}
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
