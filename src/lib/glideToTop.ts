/**
 * Subida suave até o topo, com o clique na assinatura do cabeçalho.
 *
 * É a mecânica do Antimetal (`referencias/antimetal/Antimetal_files/
 * 07.q4nszyvlw5.js`, o `onClick` do link da cápsula central): `1100ms` com
 * ease-in-out cúbico, escrevendo a posição a cada quadro.
 *
 * **Por que não `scroll-behavior: smooth`.** A diretiva do CSS não tem duração
 * configurável — o navegador decide, e a distância é a página inteira. A
 * referência quer um trajeto de 1,1s, que é lento o bastante para ser lido como
 * movimento e não como salto. Aqui a curva é nossa.
 *
 * **Por que não rolar até uma âncora.** O topo é uma posição, não um elemento:
 * `scrollTo(0, 0)` não depende de existir — ou não — um `id="topo"` na página.
 * `/abertura` não tem essa âncora.
 *
 * **Interrompível de propósito.** Quem gira a roda, toca na tela ou aperta
 * qualquer tecla durante o trajeto assume o controle na hora. Uma animação que
 * ignora a mão de quem está usando a página é pior do que não ter animação.
 *
 * Devolve a função que cancela — quem chama guarda para poder desmontar no meio
 * do trajeto sem deixar a diretiva de rolagem do documento trocada.
 */

/** Duração do trajeto, a mesma da referência. */
export const GLIDE_MS = 1100;

/**
 * Ease-in-out cúbico. Sai devagar, cruza o meio rápido, chega devagar — é o que
 * faz a página parecer ter peso em vez de ser arrastada.
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function glideToTop(): () => void {
  const start = window.scrollY;
  if (!(start > 0)) return () => {};

  /* Movimento reduzido: o destino é o mesmo, o trajeto é que não existe. Subir
     instantaneamente ainda é subir — nada de informação se perde. */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, 0);
    return () => {};
  }

  /* `html { scroll-behavior: smooth }` está declarado no CSS do projeto e
     brigaria com o passo a passo abaixo: cada `scrollTo` dispararia também a
     animação própria do navegador, e as duas se anulariam. Desligar durante o
     trajeto é o que deixa a curva ser a nossa. */
  const root = document.documentElement;
  const backup = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";

  const startedAt = performance.now();
  let frame = 0;
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;

    if (frame) cancelAnimationFrame(frame);
    root.style.scrollBehavior = backup;

    window.removeEventListener("wheel", finish);
    window.removeEventListener("touchstart", finish);
    window.removeEventListener("keydown", finish);
  };

  window.addEventListener("wheel", finish, { passive: true });
  window.addEventListener("touchstart", finish, { passive: true });
  window.addEventListener("keydown", finish);

  const step = (now: number) => {
    if (done) return;

    const t = Math.min(1, (now - startedAt) / GLIDE_MS);
    window.scrollTo(0, start * (1 - easeInOutCubic(t)));

    if (t < 1) frame = requestAnimationFrame(step);
    else finish();
  };

  frame = requestAnimationFrame(step);

  return finish;
}
