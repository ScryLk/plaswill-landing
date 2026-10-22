"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { pillRingPath } from "@/lib/scrollHeader";

/**
 * O anel de progresso de rolagem, traçado no contorno da cápsula central.
 *
 * Enquanto a cápsula está encolhida, o progresso da página inteira vira um arco
 * que percorre a borda do vidro: começa no meio da aresta de cima, corre para a
 * direita, dá a volta e termina onde começou quando a página chega ao fim. Um
 * ponto marca a ponta do arco.
 *
 * **Tradução de cor, e não cópia.** Na referência o arco é branco sobre vidro
 * escuro. Aqui o vidro é claro — branco sobre claro não desenha nada. O arco e o
 * ponto passam a ser o ardósio da marca (`#0f172a`), que sobre o vidro mais
 * escuro possível (a pílula a 84% de opacidade sobre o pixel mais escuro da
 * fachada) mede **mais de 13:1** e por isso carrega o estado sem depender de
 * nada. O halo atrás do ponto é amarelo institucional: lá o brilho é branco
 * porque a superfície é escura; o amarelo é o equivalente aqui. **O halo é
 * decoração** — se ele sumir, o arco continua dizendo a mesma coisa.
 *
 * **`pathLength` fica de fora, de propósito.** A referência normaliza o caminho
 * com `pathLength="1"` e escreve `stroke-dashoffset: 1 - progresso`. Isso apoia-
 * se em `getTotalLength()` ignorar `pathLength`, o que os navegadores fazem mas
 * a especificação deixou ambíguo por anos. Aqui o comprimento real é medido uma
 * vez por quadro e usado tanto no tracejado quanto no ponto: mesmo resultado,
 * sem depender dessa ambiguidade.
 *
 * **O progresso não passa por estado do React.** Ele muda a cada quadro enquanto
 * a página rola, e um `setState` por quadro custaria uma renderização por quadro
 * para mover dois atributos. O número chega por inscrição (`subscribe`) e é
 * escrito direto nos nós de SVG. O que é estado é só a medida da cápsula, que
 * muda quando a cápsula encolhe — e aí uma renderização é o certo.
 */
export function ProgressRing({
  anchorRef,
  subscribe,
}: {
  /** A cápsula que o anel contorna. A medida vem dela, não do anel. */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** Inscrição no progresso de rolagem. Devolve a função para sair. */
  subscribe: (listener: (progress: number) => void) => () => void;
}) {
  const [box, setBox] = useState({ w: 0, h: 0 });

  const glowRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const haloRef = useRef<SVGCircleElement>(null);

  const id = useId();
  const arcGlowId = `${id}-arco`;
  const dotGlowId = `${id}-ponto`;

  /* A medida da cápsula. `ResizeObserver` e não uma leitura só: durante os 600ms
     do encolhimento a largura muda a cada quadro, e o anel precisa acompanhar —
     é justamente enquanto ele aparece que a cápsula está mudando de tamanho. O
     `setState` sai cedo quando nada mudou, senão o observador renderizaria à toa
     em qualquer mudança de layout da página. */
  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const measure = () => {
      const w = anchor.offsetWidth;
      const h = anchor.offsetHeight;
      setBox((current) => (current.w === w && current.h === h ? current : { w, h }));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [anchorRef]);

  const path = pillRingPath(box.w, box.h, RING.radius, RING.inset);
  const progressRef = useRef(0);

  /**
   * Põe o desenho no estado do progresso dado.
   *
   * `stroke-dasharray` igual ao comprimento do caminho e `dashoffset` recuando
   * até zero: com o progresso em 0 o traço inteiro cai no vão e nada aparece;
   * com 1, o traço cobre o caminho todo. O ponto vai na ponta do arco, e não
   * numa posição calculada por trigonometria — quem sabe onde a ponta está,
   * inclusive nos cantos arredondados, é o próprio caminho.
   *
   * Só toca em nós de SVG, então não depende de nada que mude entre
   * renderizações.
   */
  const apply = useCallback((progress: number) => {
    const tip = tipRef.current;
    if (!tip) return;

    const total = tip.getTotalLength();
    if (!(total > 0)) return;

    for (const node of [tip, glowRef.current]) {
      if (!node) continue;
      node.style.strokeDasharray = String(total);
      node.style.strokeDashoffset = String(total * (1 - progress));
    }

    const point = tip.getPointAtLength(total * progress);
    for (const node of [dotRef.current, haloRef.current]) {
      if (!node) continue;
      node.setAttribute("cx", String(point.x));
      node.setAttribute("cy", String(point.y));
    }
  }, []);

  /* Inscrição no progresso. Depende só de `subscribe`, que é estável: o
     callback lê o caminho do `ref` e mede o comprimento na hora, então não
     precisa ser reinscrito quando a geometria muda. */
  useEffect(
    () =>
      subscribe((progress) => {
        progressRef.current = progress;
        apply(progress);
      }),
    [subscribe, apply],
  );

  /* Mas a geometria muda — a cada quadro dos 600ms do encolhimento, e o
     `dashoffset` está em unidades absolutas do caminho. Sem esta segunda
     aplicação, um anel já desenhado ficaria com o traço no lugar errado até a
     próxima rolagem. */
  useEffect(() => {
    apply(progressRef.current);
  }, [apply, path]);

  /* Sem medida ainda não há caminho. Todos os ganchos acima já rodaram. */
  if (!path) return null;

  return (
    <svg
      aria-hidden="true"
      className="pill-ring"
      width={box.w}
      height={box.h}
      viewBox={`${-RING.inset} ${-RING.inset} ${box.w} ${box.h}`}
      overflow="visible"
    >
      <defs>
        <filter id={arcGlowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={RING.arcGlow} />
        </filter>
        <filter id={dotGlowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={RING.dotGlow} />
        </filter>
      </defs>

      {/* O trilho: o contorno inteiro, apagado. Diz onde o arco vai chegar. */}
      <path
        d={path}
        fill="none"
        stroke={RING.ink}
        strokeOpacity={RING.trackOpacity}
        strokeWidth={RING.trackWidth}
      />

      {/* O halo do ponto, atrás de tudo o que se lê. */}
      <circle
        ref={haloRef}
        r={RING.dotRadius * 2}
        fill={RING.halo}
        opacity={0.5}
        filter={`url(#${dotGlowId})`}
      />

      {/* O arco, em duas passadas: a de baixo borrada dá o brilho, a de cima
          desenha a linha. Mesmo caminho, mesmo tracejado — o que muda é o
          filtro. O peso das três camadas é o ardósio cheio: em 21/10 elas foram
          afrouxadas a pedido e voltaram no mesmo dia, porque o desenho perdeu
          presença. Ver o README. */}
      <path
        ref={glowRef}
        d={path}
        fill="none"
        stroke={RING.ink}
        strokeWidth={RING.arcWidth}
        strokeLinecap="round"
        filter={`url(#${arcGlowId})`}
      />
      <path
        ref={tipRef}
        d={path}
        fill="none"
        stroke={RING.ink}
        strokeWidth={RING.arcWidth}
        strokeLinecap="round"
      />

      <circle ref={dotRef} r={RING.dotRadius} fill={RING.ink} />
    </svg>
  );
}

/**
 * As medidas do anel. Os nomes são os da referência, com o valor dela ao lado —
 * o que mudou está dito no comentário do componente.
 */
const RING = {
  /** Raio declarado da cápsula (`.glass`); o efetivo é limitado pela altura. */
  radius: 82,
  /** Encosta no contorno, sem recuo — como na referência (`ringInset: 0`). */
  inset: 0,
  /** Ardósio da marca no lugar do branco da referência. */
  ink: "#0f172a",
  /** Trilho a 6% na referência; 10% aqui, que é o que se enxerga sobre claro. */
  trackOpacity: 0.1,
  trackWidth: 1,
  /** 1,5px na referência; 2px para o arco sobreviver à borda clara do vidro. */
  arcWidth: 2,
  arcGlow: 3,
  dotRadius: 2.75,
  dotGlow: 5,
  /** Amarelo institucional, só no halo. */
  halo: "#ffde00",
} as const;
