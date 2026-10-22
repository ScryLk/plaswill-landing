/**
 * Máquina de estado do cabeçalho da abertura.
 *
 * O comportamento vem do cabeçalho do Antimetal, **lido do código deles** e não
 * de uma captura: o componente `Nav` recebe um `condenseOnScroll` e, quando
 * ligado, encolhe a cápsula central de `min(385px, 100vw - 32px)` para 56px
 * assim que a página rola, devolvendo-a ao tamanho cheio quando o visitante
 * volta para perto do topo. Fonte: `referencias/antimetal/Antimetal_files/
 * 07.q4nszyvlw5.js`, módulo `Nav`.
 *
 * As três constantes de rolagem abaixo são **as deles**, não estimativas:
 *
 * ```
 * eT.current = G = 220     // rola acima disto e encolhe
 * l = .5 * eT.current      // 110 — volta a crescer abaixo disto
 * r - t < 160              // a menos de 160px do fim, nunca encolhe
 * ```
 *
 * Os dois limiares diferentes (220 para encolher, 110 para crescer) são
 * **histerese**, e não um detalhe: com um limiar só, qualquer rolagem parada em
 * cima do número faz a cápsula piscar entre os dois estados a cada pixel de
 * tremor de trackpad. A guarda de 160px existe porque o rodapé tem a assinatura
 * grande — encolher a do cabeçalho justo ali seria redundante.
 *
 * Este módulo é **puro de propósito**: sem DOM, sem React, sem `window`. A
 * decisão de encolher e a geometria do anel são as duas partes do comportamento
 * que podem estar erradas sem dar sintoma nenhum na tela — por isso ficam
 * testáveis fora do navegador. Ver `scripts/verificar-cabecalho.mjs`.
 */

/** Rolar além disto encolhe a cápsula central. */
export const CONDENSE_ON = 220;

/** Voltar para antes disto devolve a cápsula ao tamanho cheio. */
export const CONDENSE_OFF = 110;

/** A menos disto do fim do documento, a cápsula nunca encolhe. */
export const BOTTOM_GUARD = 160;

/** Duração da transição de largura, a mesma da referência (`600ms`). */
export const CONDENSE_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

/**
 * Fração rolada do documento, de 0 a 1.
 *
 * Devolve 0 quando não há o que rolar — página mais curta que a janela. Sem
 * essa guarda a divisão daria `NaN` e o anel sumiria com um valor inválido de
 * `stroke-dashoffset`.
 */
export function documentProgress(scrollY: number, maxScroll: number): number {
  if (!(maxScroll > 0)) return 0;
  return Math.min(1, Math.max(0, scrollY / maxScroll));
}

/**
 * O estado de encolhimento depois desta leitura de rolagem.
 *
 * Recebe o estado anterior em vez de decidir só pela posição: é o que permite
 * os dois limiares, e é o que torna a função testável como uma sequência (uma
 * rolagem de ida e volta inteira, e não um instante isolado).
 */
export function shouldCondense(
  previous: boolean,
  scrollY: number,
  maxScroll: number,
): boolean {
  const nearBottom = maxScroll > 0 && maxScroll - scrollY < BOTTOM_GUARD;
  if (nearBottom) return false;
  return previous ? scrollY > CONDENSE_OFF : scrollY > CONDENSE_ON;
}

/**
 * O contorno da cápsula, como caminho de SVG.
 *
 * Traça um retângulo de cantos arredondados começando **no meio da aresta de
 * cima** e seguindo no sentido horário. O ponto de partida é o que faz o
 * progresso nascer no topo e correr para a direita, como na referência, em vez
 * de brotar de um canto.
 *
 * `radius` é o raio declarado da cápsula (`82px` em `.glass`), mas o raio
 * efetivo é limitado por `min(largura, altura) / 2`: quando a cápsula encolhe
 * para ~46px de altura, 82px deixaria de ser um raio e viraria uma curva
 * impossível de desenhar. O limite é o que a transforma numa cápsula de pontas
 * semicirculares, que é o que ela é.
 *
 * Devolve `null` para medidas não positivas: acontece no primeiro quadro, antes
 * de o `ResizeObserver` entregar a caixa, e um caminho com `NaN` derrubaria o
 * `getPointAtLength` logo em seguida.
 */
export function pillRingPath(
  width: number,
  height: number,
  radius: number,
  inset = 0,
): string | null {
  const w = width - 2 * inset;
  const h = height - 2 * inset;
  if (!(w > 0) || !(h > 0)) return null;

  const r = Math.max(0, Math.min(radius - inset, Math.min(w, h) / 2));

  return [
    `M ${w / 2} 0`,
    `L ${w - r} 0`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `L ${w} ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `L ${r} ${h}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    `L ${w / 2} 0`,
  ].join(" ");
}
