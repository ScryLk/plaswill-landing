/**
 * Resolução de arquivos de marca em tempo de build.
 *
 * O projeto não recria nem aproxima o logotipo da Plaswill: enquanto o arquivo
 * oficial não estiver em `public/brand/`, os componentes escrevem o nome em
 * tipografia (ver `Wordmark`). A mesma lógica vale para as fotografias: sem o
 * arquivo, o espaço correspondente simplesmente não é desenhado — nunca é
 * preenchido com um desenho genérico.
 *
 * A lista de candidatos é a única fonte da verdade — para ativar um arquivo,
 * basta copiá-lo com um destes nomes. Nenhuma alteração de código é necessária.
 */

import { existsSync } from "node:fs";
import path from "node:path";

function firstExisting(candidates: readonly string[]): string | null {
  return (
    candidates
      .map((file) => `/${file}`)
      .find((file) => existsSync(path.join(process.cwd(), "public", file))) ?? null
  );
}

/** Logotipo oficial — `public/brand/`. */
export function findBrandLogo(): string | null {
  return firstExisting([
    "brand/plaswill-logo.svg",
    "brand/plaswill-logo.png",
    "brand/plaswill-logotipo.png",
  ]);
}

/**
 * Símbolo isolado — `public/brand/`, **se existir**.
 *
 * Em 21/10 o Lucas enviou o logotipo de novo, esperando destravar o efeito da
 * pílula central. O arquivo era byte a byte idêntico ao que já estava aqui
 * (mesmo md5 `f407a461c4…`, 246×106): um bloco fechado, com "Plaswill" e
 * "Embalagens" dentro do campo amarelo. Não há símbolo separável — a tinta
 * atravessa a forma de ponta a ponta.
 *
 * Esta função existe para o dia em que houver um. Enquanto não houver, a
 * pílula central revela o logotipo inteiro por uma janela que cresce
 * (ver `.centerpill__reveal` em `abertura.css`). **Não** fabrique um símbolo
 * recortando a letra P ou a forma amarela: seria criar uma marca que a
 * identidade não tem, e a regra do projeto proíbe recriar a marca.
 */
export function findBrandSymbol(): string | null {
  return firstExisting([
    "brand/plaswill-simbolo.svg",
    "brand/plaswill-simbolo.png",
    "brand/plaswill-simbolo.webp",
  ]);
}

/**
 * Fotografia aérea da planta — `public/photos/`.
 * É a faixa larga sob o texto da abertura. Sem ela, a faixa não existe.
 */
export function findAerialPhoto(): string | null {
  return firstExisting([
    "photos/plaswill-aerea.jpg",
    "photos/plaswill-aerea.png",
    "photos/plaswill-aerea.webp",
  ]);
}

/**
 * Fotografia da sede — `public/photos/`.
 *
 * Entra na coluna direita da abertura, em altura cheia, como um plano de
 * fachada ao lado do texto. É a mesma foto do prédio que o Lucas enviou em
 * 20/10; a versão do site recebeu só um ajuste leve de contraste para cortar a
 * névoa de contraluz. O arquivo original, sem tratamento, está em
 * `design/originais/fachada-plaswill-original.png`.
 */
export function findFacadePhoto(): string | null {
  return firstExisting([
    "photos/plaswill-fachada.jpg",
    "photos/plaswill-fachada.png",
    "photos/plaswill-fachada.webp",
  ]);
}
