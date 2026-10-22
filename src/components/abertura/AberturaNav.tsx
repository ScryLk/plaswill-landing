"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Wordmark } from "@/components/Wordmark";
import { abertura, aberturaNav, site } from "@/content/site";
import { glideToTop } from "@/lib/glideToTop";
import { documentProgress, shouldCondense } from "@/lib/scrollHeader";

import { ArrowRight, ChevronDown } from "./icons";
import { ProgressRing } from "./ProgressRing";

/**
 * Cabeçalho da abertura — três pílulas de vidro flutuando sobre o conteúdo.
 *
 * A construção vem da referência (o arquivo salvo em
 * `referencias/antimetal/Antimetal.html`): em vez de uma faixa de ponta a
 * ponta, três cápsulas posicionadas nos cantos da mesma linha — navegação à
 * esquerda, assinatura no eixo da página, contato à direita. Cada uma com a
 * sua própria superfície de vidro.
 *
 * **O que NÃO se aproveita da referência.** A identidade deles — o limão, a
 * serifa licenciada, a marca de pontos — fica onde está. O que se lê do
 * arquivo é a *construção* (três grupos flutuantes, cápsula dentro de cápsula,
 * marcador que desliza) e a *receita do material* (as três camadas de vidro,
 * com a aresta de 0,5px). Regra 9 do projeto: referência, nunca identidade.
 *
 * Fora da referência, por acessibilidade:
 * · o botão do menu diz o que faz (`Abrir menu` / `Fechar menu`), e declara
 *   `aria-expanded`/`aria-controls`;
 * · o painel fechado leva `inert`, então o teclado e o leitor de tela não
 *   alcançam links invisíveis;
 * · Esc fecha o painel e a rolagem do documento é travada enquanto ele está
 *   aberto;
 * · o marcador que desliza é decoração — quem diz onde está o foco é o
 *   `:focus-visible` do próprio link.
 *
 * **Comportamento de rolagem**, também lido do código da referência e não de uma
 * captura (o vídeo mostra o efeito; as constantes estão em `scrollHeader.ts`):
 *
 * · passando de 220px de rolagem, a cápsula central encolhe de
 *   `min(385px, 100vw - 32px)` até 94px — a largura que dá à marca os mesmos 12px
 *   de respiro em cima, embaixo e dos lados. O movimento leva 600ms em
 *   `cubic-bezier(0.65, 0, 0.35, 1)`, como lá;
 * · voltando para antes de 110px, ela cresce de novo. São dois números, e não um,
 *   porque isso é histerese: com um limiar só, parar a rolagem em cima dele faria
 *   a cápsula piscar entre os dois estados;
 * · a menos de 160px do fim do documento ela nunca encolhe — o rodapé tem a
 *   assinatura grande, e encolher a do cabeçalho justo ali seria redundante;
 * · enquanto está encolhida, um anel traça o progresso da página no contorno do
 *   vidro (`ProgressRing`);
 * · o clique na assinatura sobe suavemente, se a página já estiver rolada.
 *
 * **O que a marca não permite copiar.** No Antimetal a cápsula encolhida é um
 * círculo de 56px com o símbolo isolado (`MarkSolo.svg`) e o nome some. O
 * Plaswill não tem símbolo isolado: o logotipo é o lettering dentro do retângulo
 * amarelo, 246×106, com tinta em todas as colunas — não há recorte possível. A
 * marca fica inteira e legível nos dois estados, e o encolhimento é feito só
 * pela cápsula. Ver `public/brand/LEIA-ME.md`.
 */
export function AberturaNav({
  logoSrc,
  symbolSrc,
}: {
  logoSrc: string | null;
  /** Símbolo isolado, **se a marca tiver um**. Hoje não tem — ver `brand.ts`. */
  symbolSrc: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [marker, setMarker] = useState<{ x: number; w: number; h: number } | null>(null);
  const [condensed, setCondensed] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  /** Cancelamento do trajeto de subida em curso, se houver. */
  const cancelGlide = useRef<(() => void) | null>(null);

  /**
   * O progresso de rolagem vive **fora** do estado do React.
   *
   * Ele muda a cada quadro enquanto a página rola, e um `setState` por quadro
   * custaria uma renderização por quadro para mover dois atributos de SVG. O
   * número fica neste `ref` e quem desenha se inscreve — ver `ProgressRing`. O
   * que é estado é só `condensed`, que muda duas vezes por rolagem.
   */
  const progressRef = useRef(0);
  const listenersRef = useRef(new Set<(progress: number) => void>());

  const subscribeProgress = useCallback((listener: (progress: number) => void) => {
    listenersRef.current.add(listener);
    listener(progressRef.current);

    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /* O vigia da rolagem. Um só, para as duas coisas que dependem dela: o estado
     da cápsula e o progresso do anel.

     O trabalho fica dentro de um `requestAnimationFrame`. Ler `scrollY` e
     `scrollHeight` obriga o navegador a resolver o layout, e fazer isso a cada
     evento de rolagem — que dispara mais de uma vez por quadro em trackpad e em
     tela de toque — é a receita clássica de rolagem travada. Com o quadro como
     portão, o custo é no máximo um por quadro.

     `read()` roda uma vez na montagem, e não só na primeira rolagem: é o que
     estabelece o estado certo para quem abre a página já rolada, por restauração
     de posição do navegador. Nesse caso a cápsula aparece cheia e encolhe no
     primeiro quadro — a alternativa seria adivinhar a posição no servidor, e aí
     a marcação do servidor discordaria da do cliente na hidratação. */
  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;

      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      const progress = documentProgress(scrollY, maxScroll);
      progressRef.current = progress;
      for (const listener of listenersRef.current) listener(progress);

      setCondensed((previous) => {
        const next = shouldCondense(previous, scrollY, maxScroll);
        return next === previous ? previous : next;
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    read();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* Desmontar no meio do trajeto de subida devolveria a diretiva de rolagem do
     documento trocada, e a rolagem suave do CSS ficaria desligada pelo resto da
     sessão. */
  useEffect(() => () => cancelGlide.current?.(), []);

  /**
   * Clique na assinatura.
   *
   * Com a página já rolada, sobe e não navega. No topo, deixa o link seguir para
   * `/#topo` — é a única saída de `/abertura` de volta para a landing, e trocá-la
   * por "não fazer nada" deixaria a rota sem volta.
   */
  const handleSignatureClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!(window.scrollY > 0)) return;

    event.preventDefault();
    cancelGlide.current?.();
    cancelGlide.current = glideToTop();
  };

  /**
   * Escreve o ponto do ponteiro no próprio elemento, como variável CSS.
   *
   * **Não passa por estado do React de propósito:** um `setState` por evento
   * de movimento custaria uma renderização por quadro para desenhar um brilho.
   * Escrever a variável direto no nó deixa o trabalho para o compositor.
   */
  const trackPointer = (event: React.PointerEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const box = element.getBoundingClientRect();
    element.style.setProperty("--mx", `${event.clientX - box.left}px`);
    element.style.setProperty("--my", `${event.clientY - box.top}px`);
  };

  /**
   * Move o realce para o item sob o ponteiro ou sob o foco.
   *
   * A posição é medida do próprio item, e não calculada a partir de índices:
   * assim o realce acompanha o texto real de cada rótulo, inclusive quando a
   * largura muda por tradução ou por zoom do navegador.
   */
  const moveMarker = (event: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
    const list = listRef.current;
    if (!list) return;

    const item = event.currentTarget;
    const listBox = list.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();

    setMarker({
      x: itemBox.left - listBox.left,
      w: itemBox.width,
      h: itemBox.height,
    });
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 lg:px-[30px] lg:pt-[30px]">
        {/* A faixa tem a altura da **cápsula mais alta** — a central, que mede 54px
            porque o logotipo tem 30px dentro de um vidro de 6px mais 6px de
            respiro do link. Antes eram 46px, um número escolhido quando a
            altura da cápsula ainda era só uma suposição; com 46 as laterais
            ficavam com 47,1 e 52 e a central com 54, todas encostadas no topo,
            então as três não dividiam eixo nenhum.

            Agora tudo se posiciona com `top-1/2 -translate-y-1/2`, e as três
            cápsulas levam `h-[54px]`: mesma altura, mesmo topo, mesma base e
            mesmo eixo. `relative` é o que dá a referência de posição. */}
        <div className="relative h-[54px]">
          {/* ── esquerda: navegação ─────────────────────────────────────── */}
          {/* `nav-lateral--fora` entra com o estado encolhido: rolada, a barra
              fica só com a marca. Ver o bloco "Estado mínimo" em `abertura.css`
              — a marca é também a volta ao topo, e é o que devolve esta pílula. */}
          <nav
            aria-label="Navegação principal"
            className={`glass nav-lateral nav-lateral--esquerda absolute left-0 top-1/2 hidden h-[54px] -translate-y-1/2 lg:block ${
              condensed ? "nav-lateral--fora" : ""
            }`}
            onPointerMove={trackPointer}
          >
            <GlassLayers />
            <ul
              ref={listRef}
              className="relative flex h-full items-center whitespace-nowrap"
              onMouseLeave={() => setMarker(null)}
            >
              {/* Um realce só, que anda. Ver `.pill-marker` no CSS. */}
              <span
                aria-hidden="true"
                className="pill-marker"
                style={
                  marker
                    ? {
                        transform: `translate(${marker.x}px, -50%)`,
                        width: marker.w,
                        height: marker.h,
                        opacity: 1,
                      }
                    : undefined
                }
              />
              {aberturaNav.map((item) => (
                <li key={item.id} className="relative">
                  <a
                    className="pill-link flex items-center gap-1"
                    href={item.href}
                    onMouseEnter={moveMarker}
                    onFocus={moveMarker}
                  >
                    {item.label}
                    {item.chevron ? <ChevronDown className="h-3.5 w-3.5" /> : null}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── centro: a assinatura, sobre o eixo da página ─────────────── */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              ref={pillRef}
              className={`glass centerpill ${condensed ? "centerpill--compact" : ""}`}
              onPointerMove={trackPointer}
            >
              <GlassLayers />
              <a
                className="centerpill__link relative"
                href="/#topo"
                aria-label="Plaswill — início"
                onClick={handleSignatureClick}
              >
                {symbolSrc ? (
                  /* Caminho literal da referência: símbolo fixo, nome
                     desenrolando ao lado. Só existe se a marca tiver um
                     símbolo isolado — hoje não tem. */
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element -- símbolo do cliente, proporção desconhecida em tempo de build */}
                    <img className="centerpill__symbol" src={symbolSrc} alt="" aria-hidden="true" />
                    <span className="centerpill__reveal centerpill__name">Plaswill</span>
                  </>
                ) : logoSrc ? (
                  <>
                    {/* Sem símbolo: o logotipo oficial inteiro, revelado por uma
                        janela que cresce. Mesmo movimento, conteúdo indivisível. */}
                    <span className="centerpill__reveal centerpill__lockup">
                      {/* eslint-disable-next-line @next/next/no-img-element -- arquivo do cliente, proporção desconhecida em tempo de build */}
                      <img src={logoSrc} alt="Plaswill — indústria de embalagens plásticas" />
                    </span>
                    {/* O nome escrito ao lado da marca — o estado que não existe
                        em repouso: são 157px de vidro vazio de cada lado, e o
                        nome entra nesse vão quando o ponteiro chega. Sem ele o
                        hover só devolvia largura sem mostrar nada de novo.
                        Ver `.centerpill__lockup-name` em `abertura.css`.

                        Desde 21/10 ele **não aparece de imediato**: entra pelo
                        gesto de revelação da biblioteca de componentes
                        (`referencias/antimetal-design-system.md`, §5 e §6.6) —
                        opacidade de 0 a 1 com 12px de deslocamento, 700ms, e os
                        300ms de atraso que fazem o nome começar só depois de a
                        janela de vidro abrir espaço.

                        `aria-hidden` é intenção, não desleixo: o `alt` da marca
                        já nomeia a empresa e o `aria-label` do link fala por
                        cima dos dois — ouvir o nome três vezes não ajuda. */}
                    <span className="centerpill__lockup-name" aria-hidden="true">
                      Plaswill Embalagens
                    </span>
                  </>
                ) : (
                  <span className="centerpill__reveal">
                    <Wordmark src={null} height={30} />
                  </span>
                )}
              </a>

              {/* Por último para pintar por cima do vidro. Fora do fluxo: não
                  entra na conta do flex e não desloca a marca. Quando ele
                  aparece é assunto do CSS — ver `.pill-ring` em `abertura.css`. */}
              <ProgressRing anchorRef={pillRef} subscribe={subscribeProgress} />
            </div>
          </div>

          {/* ── direita: contato ─────────────────────────────────────────── */}
          <ul
            className={`glass nav-lateral nav-lateral--direita absolute right-0 top-1/2 hidden h-[54px] -translate-y-1/2 items-center lg:flex ${
              condensed ? "nav-lateral--fora" : ""
            }`}
            onPointerMove={trackPointer}
          >
            <GlassLayers />
            <li className="relative">
              <a
                className="pill-link block"
                href={abertura.secondaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {abertura.secondaryCta.label}
              </a>
            </li>
            <li className="relative">
              {/* O CTA principal. O hover troca para o amarelo institucional
                  com tinta escura por cima — 13,35:1, o par de maior contraste
                  da paleta. O amarelo nunca aparece como texto sobre claro; aqui
                  ele é preenchimento. */}
              <a
                className="elastic relative flex items-center rounded-full bg-brand-slate px-5 py-2.5 text-sm text-white hover:bg-brand-yellow hover:text-brand-slate"
                href={abertura.cta.href}
              >
                {abertura.cta.label}
              </a>
            </li>
          </ul>

          {/* ── mobile: menu ─────────────────────────────────────────────── */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 lg:hidden">
            <button
              type="button"
              className="glass glass--round relative z-50 flex h-[46px] w-[46px] items-center justify-center"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="menu-abertura"
              onClick={() => setOpen((value) => !value)}
            >
              {/* Os traços têm as medidas do spec (6px e 13px, 2px de espessura).
                  Cada um anda 3,5px até o meio do próprio conjunto: com o
                  deslocamento de 5px do spec, os dois ficavam cruzados 2px fora
                  do eixo. */}
              <span className="relative block h-[15px] w-6" aria-hidden="true">
                <span
                  className={`absolute left-0 top-[6px] block h-[2px] w-6 rounded bg-brand-slate transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                    open ? "translate-y-[3.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[13px] block h-[2px] w-6 rounded bg-brand-slate transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] ${
                    open ? "-translate-y-[3.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* O painel vive fora do <header>: `backdrop-blur` no cabeçalho cria um
          bloco contentor e prenderia este `fixed` dentro da barra. */}
      <div
        id="menu-abertura"
        inert={!open}
        className={`fixed inset-0 z-40 bg-brand-surface transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`flex h-full flex-col items-center justify-center gap-8 transition duration-500 delay-100 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
          }`}
        >
          {aberturaNav.map((item) => (
            <a
              key={item.id}
              className="text-3xl tracking-tight text-brand-slate"
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}

          <a
            className="elastic mt-4 inline-flex items-center gap-2 rounded-full bg-brand-slate px-8 py-3.5 text-lg text-white"
            href={abertura.cta.href}
            onClick={() => setOpen(false)}
          >
            {abertura.cta.label}
            <ArrowRight className="h-5 w-5" />
          </a>

          <a
            className="text-base text-brand-slate/70 underline underline-offset-4"
            href={site.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            {abertura.secondaryCta.label}
          </a>
        </div>
      </div>
    </>
  );
}

/**
 * As três camadas decorativas do vidro, na ordem em que precisam ser pintadas:
 * aresta, brilho, luz do cursor. `aria-hidden` porque não dizem nada a ninguém
 * — são material, não conteúdo.
 */
function GlassLayers() {
  return (
    <>
      <span className="glass__rim" aria-hidden="true" />
      <span className="glass__sheen" aria-hidden="true" />
      <span className="glass__light" aria-hidden="true" />
    </>
  );
}
